var passport    = require('passport');
var bcrypt      = require('bcrypt-nodejs');
var md5         = require('md5');
var config      = require('config');
var validator   = require('validator');
var debug       = require('debug')('route');
var Model       = require('../models/model');

var index = function (req, res, next) {
    if (!req.isAuthenticated()) {
        res.redirect('/signin');
    } else {

        var user = req.user;

        if (user !== undefined) {
            user = user.toJSON();
        }

        res.render('index', {title: 'Homepage', user: user})
    }

};

var indexPost = function (req, res, next) {
    if (!req.isAuthenticated()) {
        res.json({"status":"ERROR", "msg":"You are not authorized."});
    } else {

        var user = req.user;

        if (user !== undefined) {
            user = user.toJSON();
        }
    }
};

var signIn = function (req, res, next) {
    if (req.isAuthenticated())
        res.redirect('/');

    console.log(req.headers);
    res.render('signin', {title: 'Sign In'});
};

var signInPost = function (req, res, next) {
    passport.authenticate('local', {successRedirect: '/', failureRedirect: '/signin'}, function (err, user, info) {
        if (err) {
            return res.render('signin', {title: 'Sign In', errorMessage: err.message});
        }
        if (!user) {
            return res.render('signin', {title: 'Sign In', errorMessage: info.message});
        }
        return req.logIn(user, function (err) {
            if (err) {
                return res.render('signin', {title: 'Sign In', errorMessage: err.message});
            } else {
                return res.redirect('/');
            }
        });
    })(req, res, next);
};

var signUp = function (req, res, next) {
    if (req.isAuthenticated()) {
        res.redirect('/');
    } else {
        if (req.query.ref !== undefined) {
            res.render('signup', {title: 'Sign Up', ref: req.query.ref});
        } else {
            res.render('signup', {title: 'Sign Up', errorMessage: 'Referral ID is missing'});
        }
    }
};

var signUpPost = function (req, res, next) {
    var user = req.body;
    console.log(user);

    if (!user.full_name || !user.username || !user.email || !user.password) {
        res.render('signup', {title: 'signup', errorMessage: 'Please, fill in all fields'});
        return;
    } else if (!validator.isEmail(user.email)) {
        res.render('signup', {title: 'signup', errorMessage: 'Please, enter a valid E-Mail address'});
        return;
    }

    var usernamePromise = new Model.User({username: user.username}).fetch();
    return usernamePromise.then(function(model) {
        if (model) {
            res.render('signup', {title: 'signup', errorMessage: 'Username already exists'});
        } else {
            var password = user.password;
            var hash = bcrypt.hashSync(password);

            var signUpUser = new Model.User({
                username    : user.username,
                password    : hash,
                full_name   : user.full_name,
                email       : user.email,
                referral    : md5( new Date().getTime() ),
                referred    : user.referred
            });
            signUpUser.save().then(function(model) {
                signInPost(req, res, next);
            });
        }
    });
};

var profile = function (req, res, next) {
    if (!req.isAuthenticated()) {
        res.redirect('/signin');
    } else {
        var user = req.user;

        if (user !== undefined) {
            user = user.toJSON();
            user.referralUrl = 'http://' + req.headers.host + '/signup?ref=' + user.referral;
        }

        res.render('profile', {title: 'Profile', user: user});
    }
};

var signOut = function (req, res, next) {
    if (req.isAuthenticated()) {
        req.logout();
    }

    res.redirect('/signin');
};

var notFound404 = function (req, res, next) {
    res.status(404);
    res.render('404', {title: '404 Not Found'});
};

module.exports.index = index;
module.exports.indexPost = indexPost;

module.exports.signIn = signIn;
module.exports.signInPost = signInPost;

module.exports.signUp = signUp;
module.exports.signUpPost = signUpPost;

module.exports.profile = profile;

module.exports.signOut = signOut;

module.exports.notFound404 = notFound404;