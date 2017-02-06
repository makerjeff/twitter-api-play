/**
 * Twitter API Play
 * Created by jefferson.wu on 02/02/2017.
 */

"use strict"
// ========================
// MODULES ================
// ========================
const express           = require('express');
const app               = express();
const http              = require('http').Server(app);
const chalk             = require('chalk');
const clear             = require('clear');
const Twitter           = require('node-twitter-api');

// =========================
// custom ==================
const promRes           = require('./modules/PromiseResponder');
const secret            = require('./models/secret');
// const secret            = include('secret');


// =========================
// CONFIGURATION ===========
// =========================

const port              = process.env.PORT || 3000;

//Twitter config object


var _requestSecret;

// ========================
// initialization =========
// ========================
// var twitter = new Twitter({
//     consumerKey: secret.consumerKey,
//     consumerSecret: secret.consumerSecret,
//     callback: secret.callback
// });

var twitter = new Twitter({
    consumerKey: secret.consumerKey,
    consumerSecret: secret.consumerSecret,
    callback: secret.callback
});


// ====================
// MIDDLEWARE =========
// ====================


// --- basic logger ---
// TODO: switch to Morgan, or encapsulate into module
app.use(function(req,res,next){
    console.log(new Date() + ' ' + req.method + ' ' + req.url + ' ');
    next();
});

// //only allow local host (for now, until NGINX is in place)
// app.use(function(req, res, next){
//     res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
//     next();
// });

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.header('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.header('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});


// --- header information ---
app.use(function(req,res,next){
    res.setHeader('X-Powered-By', 'Super Power Engine v0.0.1. ');
    next();
});

// ==================
// ROUTES ===========
// ==================



// TEMP ROUTES
app.get('/', function(req, res){
res.send('<b>You\'re on an active server.  Find the right page.</b>');
});

app.get('/request-token', function(req, res){
    console.log(chalk.yellow('token request made...'));

    twitter.getRequestToken(function(err, requestToken, requestSecret, results){
        if(err) {
            res.status(500).send(err);
            console.log(err);
        } else {
            _requestSecret = requestSecret;
            console.log('request token: ' + requestToken);
            console.log('request secret: ' + requestSecret);

            // pop open twitter in another window instead of a redirect.
            res.redirect("https://api.twitter.com/oauth/authenticate?oauth_token=" + requestToken);
        }
    });



});

app.get('/access-token', function(req, res){
    var requestToken = req.query.oauth_token;    //TODO: query string not being parsed.
    var verifier = req.query.oauth_verifier;     //TODO: querys tring not being parsed.

    // HARD CODED tokens work.
    // var requestToken = 'Q3KqaQAAAAAAzC8VAAABWhUrKSk';
    // var verifier = 'YHtPF5t18H6jdk1Htr581LwffuA4Mvyl';

    console.log(req.query);

    console.log('attempted request token: ' + requestToken);
    console.log('attempted verifier: ' + verifier);

    //TODO: Get Access Token
    twitter.getAccessToken(requestToken, _requestSecret, verifier, function(err, accessToken, accessSecret){
        if(err){
            res.status(500).send(err);
            console.log(err);
        } else {
            console.log('accessToken (keep secret): ' + accessToken);
            console.log('accessSecret (keep secret): ' + accessToken);

            //TODO: Verify Credentials
            twitter.verifyCredentials(accessToken, accessSecret, function(err, user){
                if(err) {
                    res.status(500).send(err);
                    console.log(err)
                } else {
                    res.send(user);
                }
            });
        }
    });
});

app.get('/share', function(req, res){

});

app.get('/querystring', function(req,res){

    res.json(req.query);
});

app.get('/:page', function(req, res){
    res.sendFile(process.cwd() + '/public/' + req.params.page + '.html');
});



// ========================
// CATCH ALL MIDDLEWARE ===
// ========================
//static files
app.use(express.static('public/'));

// 404
app.use(function(req,res,next){
    res.status(404);
    res.send('404: Page not found!');
});

// 500
app.use(function(req,res,next){
    res.status(500);
    res.render('500: Server error!');
});

// ========================
// ===== START SERVER =====
// ========================

http.listen(port, function(err){
    if(err) {
        console.log(Error('Error: ' + err));
    } else {
        clear();
        console.log(chalk.blue('Twitter-API-play server started on port ' + port));
    }
});