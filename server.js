var path = require('path');
var kaffedb = require(path.join(__dirname, 'kaffedb.js'));
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
var fs = require('fs');
var jade = require('jade');
var favicon = require('serve-favicon');

//Setup express app
app.use(favicon(__dirname + '/favicon.ico')); 
app.use(express.static('public'));

app.set('view engine', 'jade');
app.set('views', __dirname + '/views');

var port = process.env.PORT || 8080;
app.listen(port, function(){
	console.log("Running on port: " + port);
});

//Setup database
kaffedb.connect();

//Routes
var rIndex = require(path.join(__dirname, 'routes/index.js'));
var rAbout = require(path.join(__dirname, 'routes/about.js'));
var rDagenskaffeHistorikk = require(path.join(__dirname, 'routes/dagenskaffeHistorikk.js'));
var rDagenskaffeKalenderVisning = require(path.join(__dirname, 'routes/dagenskaffeKalenderVisning.js'));
var rAllKaffe = require(path.join(__dirname, 'routes/allKaffe.js'));
var rNyKaffe = require(path.join(__dirname, 'routes/nyKaffe.js'));
var rKaffeKart = require(path.join(__dirname, 'routes/kaffeKart.js'));

rIndex.setKaffedb(kaffedb);
app.get('/', rIndex.index);
app.post('/giKarakter', rIndex.giKarakter);
app.post('/registrerNyDagensKaffe', rIndex.registrerNyDagensKaffe);

app.get('/about', rAbout.about);

rDagenskaffeHistorikk.setKaffedb(kaffedb);
app.get('/listDagensKaffe', rDagenskaffeHistorikk.dagenskaffeHistorikk);

rDagenskaffeKalenderVisning.setKaffedb(kaffedb);
app.get('/kalendervisning', rDagenskaffeKalenderVisning.kalendervisning);
app.get('/kalenderelement', rDagenskaffeKalenderVisning.kalenderElementer);

rAllKaffe.setKaffedb(kaffedb);
app.get('/kaffeliste', rAllKaffe.allKaffe);
app.post('/visskjulkaffe', rAllKaffe.visSkjulKaffe);

rNyKaffe.setKaffedb(kaffedb);
app.get('/nyKaffe', rNyKaffe.nyKaffe);
app.post('/registrerNyKaffeSort', rNyKaffe.registrerNyKaffe);

rKaffeKart.setKaffedb(kaffedb);
app.get('/kaffeKart', rKaffeKart.kaffeKart);
app.get('/kaffeKartJson', rKaffeKart.kaffeKartJSON);