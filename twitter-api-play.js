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

//only allow local host (for now, until NGINX is in place)
app.use(function(req, res, next){
    res.header("Access-Control-Allow-Origin", "http://localhost");
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
        } else {
            _requestSecret = requestSecret;

            // pop open twitter in another window instead of a redirect.
            res.redirect("https://api.twitter.com/oauth/authenticate?oauth_token=" + requestToken);
        }
    });

    // // TODO: promisify return
    // promRes.getRandomPromiseData(3000).then(function(result){
    //     console.log(chalk.green(result.payload.message));
    //     res.json(result);
    // }).catch(function(reason){
    //     console.log(chalk.red(reason.payload.message));
    //     res.json(reason);
    // });

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