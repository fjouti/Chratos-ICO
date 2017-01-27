var passport = require('passport');
var bcrypt = require('bcrypt-nodejs');
var config = require('config');
var debug = require('debug')('route');
var Model = require('../models/model');

var index = function (req, res, next) {
    res.render('index', {title: 'Homepage'})
};

var indexPost = function (req, res, next) {

};

var notFound404 = function (req, res, next) {
    res.status(404);
    res.render('404', {title: '404 Not Found'});
};

module.exports.index = index;
module.exports.indexPost = indexPost;

module.exports.notFound404 = notFound404;