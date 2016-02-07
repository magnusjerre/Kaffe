var path = require('path');
var kaffedb = require(path.join(__dirname, 'kaffedb.js'));
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
var fs = require('fs');
var favicon = require('serve-favicon');

//Setup express app
app.use(favicon(path.join(__dirname + '/public/images/favicon.ico'))); 
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
var rDagenskaffeKalenderVisning = require(path.join(__dirname, 'routes/dagenskaffeKalenderVisning.js'));
var rAllKaffe = require(path.join(__dirname, 'routes/allKaffe.js'));
var rNyKaffe = require(path.join(__dirname, 'routes/nyKaffe.js'));
var rKaffeKart = require(path.join(__dirname, 'routes/kaffeKart.js'));
var rLedertavle = require(path.join(__dirname, 'routes/ledertavle.js'));

rIndex.setKaffedb(kaffedb);
app.get('/', rIndex.index);
app.get('/cake', function(req, res){
	var b = {
			"dato" : new Date(),
			"kaffeid" : "566a8327b2446e033056f20b",
			"sammendrag" : "Friele - Barista Ipanema Bourbon (Malt)",
			"bryggnavn" : "Gang of Four",
			"brygger" : "Jokko",
			"liter" : 1,
			"skjeer" : 4,
			"maskin" : true,
			"lukket" : false,
			"karakterer" : []
		}; 
	var karakter = {
		"bruker" : "Jerre",
		"kaffeid" : "566a8327b2446e033056f20b",
		"sammendrag" : "Friele - Chocolate Flavour (Malt)",
		"karakter" : 3,
		"kommentar" : "WWW.heihei"
	}
	kaffedb.registrerNyttBrygg(b, "56b621bae765feb2d8fb9539", function(err, res){});
	// kaffedb.registrerKarakter(karakter, null, function(err, res){
	// 	console.log("heisann sveisann");
	// 	console.log(err);
	// 	console.log(res);
	// });
	res.json(karakter);
});

app.post('/registrerKarakter', rIndex.registrerKarakter);
app.post('/registrerNyttBrygg', rIndex.registrerNyttBrygg);
app.get('/hentMuligeKaffer', rIndex.hentMuligeKaffer);
app.get('/hentDagsbrygg', rIndex.hentDagsbrygg);

// app.get('/about', rAbout.about);

// rDagenskaffeKalenderVisning.setKaffedb(kaffedb);
// app.get('/kalendervisning', rDagenskaffeKalenderVisning.kalendervisning);
// app.get('/kalenderelement', rDagenskaffeKalenderVisning.kalenderElementer);

// rAllKaffe.setKaffedb(kaffedb);
// app.get('/kaffeliste', rAllKaffe.allKaffe);
// app.post('/visskjulkaffe', rAllKaffe.visSkjulKaffe);

// rNyKaffe.setKaffedb(kaffedb);
// app.get('/nyKaffe', rNyKaffe.nyKaffe);
// app.post('/registrerNyKaffeSort', rNyKaffe.registrerNyKaffe);

// rKaffeKart.setKaffedb(kaffedb);
// app.get('/kaffeKart', rKaffeKart.kaffeKart);
// app.get('/kaffeKartJson', rKaffeKart.kaffeKartJSON);

// rLedertavle.setKaffedb(kaffedb);
// app.get('/ledertavle', rLedertavle.ledertavle);