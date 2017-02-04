/**
 * Twitter API Play
 * Created by jefferson.wu on 02/02/2017.
 */

// ========================
// MODULES ================
// ========================
const express           = require('express');
const app               = express();
const http              = require('http').Server(app);
const chalk             = require('chalk');
const clear             = require('clear');


// =========================
// CONFIGURATION ===========
// =========================

const port              = process.env.PORT || 3000;



// ====================
// MIDDLEWARE =========
// ====================


// --- basic logger ---
// TODO: switch to Morgan, or encapsulate into module
app.use(function(req,res,next){
    console.log(new Date() + ' ' + req.method + ' ' + req.url + ' ');
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
    console.log('token request made...');

    // TODO: promisify return
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