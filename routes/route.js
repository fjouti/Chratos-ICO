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
        res.render('signup', {title: 'Sign Up'});
    }
};

var signUpPost = function (req, res, next) {
    var user = req.body;

    if (!user.full_name || !user.username || !user.email || !user.password) {
        res.render('signup', {title: 'signup', errorMessage: 'Please, fill in all fields'});
        return;
    } else if (!validator.isEmail(user.email)) {
        res.render('signup', {title: 'signup', errorMessage: 'Please, enter a valid E-Mail address'});
        return;
    }

    new Model.User({username: user.username})
        .fetch()
        .then(function(model) {
            if (model) {
                res.render('signup', {title: 'signup', errorMessage: 'Username already exists'});
            } else {
                var password = user.password;
                var hash = bcrypt.hashSync(password);

                var signUpUser = new Model.User({
                    username    : user.username,
                    password    : hash,
                    full_name   : user.full_name,
                    email       : user.email
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

var googleAuth = function(req, res, next){
    passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login', 'https://www.googleapis.com/auth/userinfo.email'] })(req, res, next);
};

var googleCallback = function (req, res, next) {
    passport.authenticate('google', { failureRedirect: '/siginin' })(req, res, function(err, user){
        console.log(err);
        console.log(user);
        res.redirect('/');
    });
};

var facebookAuth = function(req, res, next){
    passport.authenticate('facebook', { scope: ['public_profile', 'email', 'user_friends'] })(req, res, next);
};

var facebookCallback = function (req, res, next) {
    passport.authenticate('facebook', {
        successRedirect: '/',
        failureRedirect: '/signin' })(req, res, function(err, user){
            console.log(err);
            console.log(user);
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
module.exports.indexPost = indexPost;

module.exports.signIn = signIn;
module.exports.signInPost = signInPost;

module.exports.signUp = signUp;
module.exports.signUpPost = signUpPost;

module.exports.profile = profile;

module.exports.signOut = signOut;

module.exports.googleAuth = googleAuth;
module.exports.googleCallback = googleCallback;

module.exports.facebookAuth = facebookAuth;
module.exports.facebookCallback = facebookCallback;

module.exports.notFound404 = notFound404;