var passport = require('passport');
var bcrypt = require('bcrypt-nodejs');
var config = require('config');
var validator = require('validator');
var debug = require('debug')('route');

var Model = require('../models/model');
var func = require('../functions');

var index = function (req, res, next) {
    if (!req.isAuthenticated()) {

        if (req.query.ref !== undefined) {
            req.session.ref = req.query.ref ? req.query.ref : config.get('rootReferred').ref;
            new Model.User({referral: req.query.ref})
                .fetch()
                .then(function (data) {
                    if (data) {
                        res.render('index', {title: 'Sign Up', ref: req.query.ref});
                    } else {
                        res.render('index', {title: 'Sign Up', errorMessage: 'Incorrect Referral.'});
                    }
                })
        } else {
            res.render('index', {title: 'Home'});
        }

    } else {
        var user = req.user;

        if (user !== undefined) {
            user = user.toJSON();
        }

        res.render('index', {title: 'Homepage', user: user});
    }
};

var signInPost = function (req, res, next) {
    passport.authenticate('local', {successRedirect: '/profile', failureRedirect: '/'}, function (err, user, info) {
        if (err) {
            return res.render('index', {title: 'Home', errorMessage: err.message});
        }
        if (!user) {
            return res.render('index', {title: 'Home', errorMessage: info.message});
        }
        return req.logIn(user, function (err) {
            if (err) {
                return res.render('index', {title: 'Home', errorMessage: err.message});
            } else {
                return res.redirect('/');
            }
        });
    })(req, res, next);
};

var signUpPost = function (req, res, next) {
    var user = req.body;
    if (!user.full_name || !user.username || !user.email || !user.password) {
        res.render('index', {title: 'Home', errorMessage: 'Please, fill in all fields'});
        return;
    } else if (!validator.isEmail(user.email)) {
        res.render('index', {title: 'Home', errorMessage: 'Please, enter a valid E-Mail address'});
        return;
    }

    new Model.User({username: user.username})
        .fetch()
        .then(function (model) {
            if (model) {
                res.render('index', {title: 'Home', errorMessage: 'Username already exists'});
            } else {
                var password = user.password;
                var hash = bcrypt.hashSync(password);

                var signUpUser = new Model.User({
                    username: user.username,
                    password: hash,
                    full_name: user.full_name,
                    email: user.email,
                    referral: func.generateRefHash(),
                    referred: user.referred ? user.referred : config.get('rootReferred').ref
                });
                signUpUser.save().then(function (model) {
                    signInPost(req, res, next);
                });
            }
        });
};

var profile = function (req, res, next) {
    if (!req.isAuthenticated()) {
        res.redirect('/');
    } else {
        var user = req.user;

        if (user !== undefined) {
            user = user.toJSON();
            user.referralUrl = 'http://' + req.headers.host + '/?ref=' + user.referral;
        }

        res.render('profile', {title: 'Profile', user: user});
    }
};

var getBalance = function (req, res, next) {
    if (!req.isAuthenticated()) {
        res.send({status: 'err', statusMsg: 'access denied'});
    } else {
        var user = req.user;

        if (user !== undefined) {
            user = user.toJSON();

            new Model.User({ID: user.ID})
                .fetch()
                .then(function(data) {
                    if(data) {
                        data = data.toJSON();

                        console.log(data.wallet);

                        if(data.wallet != null) {
                            req.bitcoin.getBalance(data.wallet, function (err, balance) {
                                console.log(err);
                                console.log(balance);
                                res.send({status: 'success', statusMsg: balance});
                            })
                        }

                    }
                });
        }
    }
};

var createWallet = function (req, res, next) {
    if (!req.isAuthenticated()) {
        res.send('access denied');
    } else {
        var user = req.user;

        if (user !== undefined) {
            user = user.toJSON();

            req.bitcoin.createWallet(function (err, wallet) {
                console.log(err);
                console.log(wallet);

                if (!err) {
                    new Model.User({ID: user.ID})
                        .save({
                            wallet: wallet
                        }, {patch: true})
                        .then(function (data) {
                            if (data) {
                                res.send({status: 'success', statusMsg: wallet});
                            }
                        });
                } else {
                    res.send(err);
                }
            })

        }
    }
};

var signOut = function (req, res, next) {
    if (req.isAuthenticated()) {
        req.logout();
    }

    res.redirect('/');
};

var googleAuth = function (req, res, next) {
    passport.authenticate('google', {scope: ['https://www.googleapis.com/auth/plus.login', 'https://www.googleapis.com/auth/userinfo.email']})(req, res, next);
};

var googleCallback = function (req, res, next) {
    passport.authenticate('google', {failureRedirect: '/'})(req, res, function (err, user) {
        //console.log(err);
        res.redirect('/profile');
    });
};

var facebookAuth = function (req, res, next) {
    passport.authenticate('facebook', {scope: ['public_profile', 'email', 'user_friends']})(req, res, next);
};

var facebookCallback = function (req, res, next) {
    passport.authenticate('facebook', {
        successRedirect: '/profile',
        failureRedirect: '/'
    })(req, res, function (err, user) {
        //console.log(err);
    })
};

var notFound404 = function (req, res, next) {
    var user = req.user;

    if (user !== undefined) {
        user = user.toJSON();
    }

    res.status(404);
    res.render('404', {title: '404 Not Found', user: user});
};

module.exports.index = index;

module.exports.signInPost = signInPost;

module.exports.signUpPost = signUpPost;

module.exports.profile = profile;

module.exports.getBalance = getBalance;
module.exports.createWallet = createWallet;

module.exports.signOut = signOut;

module.exports.googleAuth = googleAuth;
module.exports.googleCallback = googleCallback;

module.exports.facebookAuth = facebookAuth;
module.exports.facebookCallback = facebookCallback;

module.exports.notFound404 = notFound404;