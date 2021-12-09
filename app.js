// --- LOADING MODULES
const express = require('express');
const body_parser = require('body-parser');
const fetch = require("node-fetch");
const { response } = require('express');
//    mongoose = require('mongoose');
const Dropbox = require("dropbox").Dropbox;


// --- INSTANTIATE THE APP
var app = express();
const subjects = {};
const starttime = Date.now();

// --- Database SETUP
const dbx = new Dropbox({
    accessToken: 'J2slkmJogRYAAAAAAAAAATyjswOL8WGp4mEVoPuRZuWIKYG5dj8mRrO4r7fkzn0m',
    fetch
});

saveDropbox = function (content, filename) {
    return dbx.filesUpload({
        path: "/" + filename,
        contents: content,
        autorename: false,
        mode:  'overwrite'
   });
};

// --- STATIC MIDDLEWARE 
app.use(express.static(__dirname + '/public'));
app.use('/jsPsych', express.static(__dirname + "/jsPsych"));

// --- BODY PARSING MIDDLEWARE
app.use(body_parser.json()); // to support JSON-encoded bodies

// --- VIEW LOCATION, SET UP SERVING STATIC HTML
app.set('views', __dirname + '/public/views');
app.set('stimuli', __dirname + '/public/stimuli');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// --- ROUTING
app.get('/', function(request, response) {
    response.render('index.html');
});

app.get('/baseRate', function(request, response) {
    response.render('baseRate.html');
});

app.get('/submitHit', function(request, response) {
    response.render('submitHit.html');
})

app.get('/finish', function(request, response) {
    response.render('finish.html');
})

app.post("/experiment-data", function (request, response) {
    data = request.body;
    subject_id = data[0].subject;
    subject_id = subject_id.replace(/'/g, "");
    saveDropbox(JSON.stringify(data), `baseRatePilot_subject_data_${subject_id}.json`).catch(err => console.log(err));
});

// --- START THE SERVER 
var server = app.listen(process.env.PORT || 3033, function(){
    console.log("Listening on port %d", server.address().port);
});
