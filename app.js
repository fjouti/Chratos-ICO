var config              = require('config');
var express             = require('express');
var bodyParser          = require('body-parser');
var cookieParser        = require('cookie-parser');
var session             = require('express-session');
var bcrypt              = require('bcrypt-nodejs');
var ejs                 = require('ejs');
var logger              = require('morgan');
var path                = require('path');
var passport            = require('passport');
var LocalStrategy       = require('passport-local').Strategy;
var GoogleStrategy      = require('passport-google-oauth').OAuth2Strategy;
var FacebookStrategy    = require('passport-facebook').Strategy;
var debug               = require('debug')('app');


var route = require('./routes/route');
var Model = require('./models/model');

var app = express();

passport.use(new LocalStrategy(
    function (username, password, done) {
        new Model.User({username: username})
            .fetch()
            .then(function (data) {
                var user = data;
                if (user === null) {
                    return done(null, false, {message: 'Invalid username or password'});
                } else {
                    user = data.toJSON();
                    if (!bcrypt.compareSync(password, user.password)) {
                        return done(null, false, {message: 'Invalid username or password'});
                    } else {
                        return done(null, user);
                    }
                }
            });
    }
));

passport.use(new GoogleStrategy( config.get('googleStrategy'),
    function(accessToken, refreshToken, profile, done) {

        console.log(profile._json);

        new Model.User({google_id: profile.id})
            .fetch()
            .then(function (data) {
                var user = data;

                if (user === null) {
                    new Model.User({
                        google_id : profile.id,
                        email       : profile._json.emails[0].value,
                        full_name   : profile._json.displayName,
                        username    : 'g_' + profile.id
                    })
                        .save()
                        .then(function(data){
                            user = data.toJSON();
                            return done(null, user);
                        });
                } else {
                    user = data.toJSON();
                    return done(null, user);
                }
            });
    }
));

passport.use(new FacebookStrategy( config.get('facebookStrategy'),
    function(accessToken, refreshToken, profile, done) {
        new Model.User({facebook_id: profile.id})
            .fetch()
            .then(function (data) {
                var user = data;

                if (user === null) {
                    new Model.User({
                        facebook_id : profile._json.id,
                        email       : profile._json.email,
                        full_name   : profile._json.first_name + ' ' + profile._json.last_name,
                        username    : 'fb_' + profile.id
                    })
                        .save()
                        .then(function(data){
                            user = data.toJSON();
                            return done(null, user);
                        });
                } else {
                    user = data.toJSON();
                    return done(null, user);
                }
            });
    }
));

passport.serializeUser(function (user, done) {
    done(null, user.username);
});

passport.deserializeUser(function (username, done) {
    new Model.User({username: username})
        .fetch()
        .then(function (user) {
            done(null, user);
        });
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({
    secret: 'thisissecretkey',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));


//Routes

app.get('/', route.index);
app.post('/', route.indexPost);

app.get('/signin', route.signIn);
app.post('/signin', route.signInPost);

app.get('/signup', route.signUp);
app.post('/signup', route.signUpPost);

app.get('/profile', route.profile);

app.get('/signout', route.signOut);

app.get('/auth/google', route.googleAuth);
app.get('/auth/google/callback', route.googleCallback);

app.get('/auth/facebook', route.facebookAuth);
app.get('/auth/facebook/callback', route.facebookCallback);

app.use(route.notFound404);

module.exports = app;