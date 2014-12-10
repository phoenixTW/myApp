var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var passportLocal = require('passport-local');
var expressSession = require('express-session');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(expressSession({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

//Passport Authentication
app.get('/', function (req, res) {
    res.render('index', {
        isAuthenticated: req.isAuthenticated(),
        user: req.user
    });
});

var isAuthenticated = function (req, res, next) {
    return req.isAuthenticated() ? next() : res.redirect('/');
};

app.get('/hello', isAuthenticated, function (req, res) {
    // console.log(req.isAuthenticated());
    // if(req.isAuthenticated()){
        res.render('hello', {
            isAuthenticated: req.isAuthenticated(),
            user: req.user
        });

    //     return;
    // }

    // res.redirect('/');
});

app.post('/login', passport.authenticate('local'), function (req, res) {
    res.redirect('hello');
});

passport.use(new passportLocal.Strategy(function (username, password, done) {
    //Pretend this is use a real database
    if(username == password) {
        done(null, {id: username, name: username});
    }
    else{
        done(null, false);
    }
}));

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    //Query Database or cache here
    done(null, {id: id, name: id});    
});


// app.get('/login', function(req, res, next) {
//   passport.authenticate('local', function(err, user, info) {
//     console.log()
//     if (err) { return next(err); }
//     if (!user) { return res.redirect('/'); }
//     req.logIn(user, function(err) {
//       if (err) { return next(err); }
//       return res.redirect('/users/' + user.username);
//     });
//   })(req, res, next);
// });
app.get('/login', function (req, res) {
    res.render('login');
});


app.get('/logout', function (req, res) {
    req.logout();
    console.log(req.isAuthenticated());
    res.redirect('/');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
// if (app.get('env') === 'development') {
//     app.use(function(err, req, res, next) {
//         res.status(err.status || 500);
//         res.render('error', {
//             message: err.message,
//             error: err
//         });
//     });
// }

// // production error handler
// // no stacktraces leaked to user
// app.use(function(err, req, res, next) {
//     res.status(err.status || 500);
//     res.render('error', {
//         message: err.message,
//         error: {}
//     });
// });


module.exports = app;
