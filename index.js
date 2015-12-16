var path = require('path');
var kaffedb = require(path.join(__dirname, 'kaffedb.js'));
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
var fs = require('fs');
var jade = require('jade');

kaffedb.connect();

app.get('/kaffeKartJson', function(req, res){
	res.writeHead(200, { 'Content-Type' : 'application/json'});
	kaffedb.listKaffeLand(function(err, result){
		res.write(JSON.stringify(result, null, 2));
		res.end();	
	});
});

app.get('/kaffeKart', function(req, res){
	var fn = jadeCompile('kaffeKart.jade');
	res.writeHead(200, { 'Content-Type' : 'text/html'});
	res.write(fn());
	res.end();
});

app.get('/', function(req, res){
	var fn = jadeCompile('index.jade');
	kaffedb.list	
	res.writeHead(200, { 'Content-Type' : 'text/html'});
	
	kaffedb.getDagensKaffe(function(error, result){
		if (result) {
			console.log("Found today's coffe");
			kaffedb.getKaffeMedNavn(result.kaffe_navn, function(err, doc){
				kaffedb.listKaffer(function(err, docs) {
					var obj = {
						hardagenskaffe : true,
						model : result,
						dagensKaffe : doc,
						kaffer : docs
					}
					res.write(fn(obj));
					res.end();
				});	
			});
		} else {
			console.log("Did not find today's coffe");
			kaffedb.listKaffer(function(error, docs){
				var obj = {
					hardagenskaffe : false,
					kaffer : docs
				}
				res.write(fn(obj));
				res.end();	
			});
			
		}
		
	});
});

app.get('/about', function(req, res){
	var fn = jadeCompile('about.jade');
	res.writeHead(200, { 'Content-Type' : 'text/html' });
	res.write(fn());
	res.end();
});

app.get('/kaffe.css', function(req, res){
	var readStream = fs.createReadStream(path.join(__dirname, 'src/', 'kaffe.css'));
	readStream.pipe(res);
});

app.get('/listDagensKaffe', function(req, res){
	var fn = jadeCompile('listDagensKaffe.jade');
	res.writeHead(200, { 'Content-Type' : 'text/html' });
	kaffedb.listDagensKaffe(function(error, docs){
		var html = fn({ model : docs});
		res.write(html);
		res.end();
	});
	
});

app.get('/nyKaffe', function(req, res){
	var fn = jadeCompile('nykaffe.jade');
	res.writeHead(200, {'Content-Type' : 'text/html'});
	res.write(fn());
	res.end();
});

app.post('/giKarakter', function(req, res){
	var doc = {
		bruker_navn : req.body.bruker_navn,
		karakter : req.body.karakter,
		gjetting : req.body.gjetting
	}
	kaffedb.insertDagensKarakter(doc, function(){
		
	});
	
	res.redirect('/');
});

app.post('/registrerNyKaffeSort', function(req, res){
	var doc = {
		"navn": req.body.kaffe_navn,
		"type": req.body.kaffe_type,
		"land": req.body.land,
		"produsent": req.body.produsent,
		"kaffeurl": req.body.url,
		"lat": req.body.lat,
		"lgt": req.body.lgt
	}
	kaffedb.insertNyKaffe(doc, function(error, result){
		if (!error) {
			console.log("inserted new kaffe");
		}
	});
	res.redirect('/');
});

function jadeCompile(filename) {
	var filename = path.join(__dirname, 'src/', filename);
	return jade.compile(fs.readFileSync(filename), { filename : filename, pretty : true });	
}

app.post('/registrerNyDagensKaffe', function(req, res){
	var doc = {
		"_id" : new Date(),
		kaffe_navn : req.body.kaffe_navn,
		brygger : req.body.kaffe_maker,
		liter : req.body.liter,
		skjeer : req.body.skjeer,
		karakterer : []
	}
	
	kaffedb.getDagensKaffe(function(error, result){
		if (result) {
			console.log("Found today's coffe, can't insert another until tomorrow");
		} else {
			console.log("Did not find today's coffe, can insert now");
			kaffedb.dagensKaffe().insertOne(doc, {}, function(error, result) {
				if (error) {
					console.log("failed to insert...");
					console.log(doc);
				} else {
					console.log("successfully insterted!");
					console.log(doc);
				}
			});
		}
		res.redirect('/');
	});
});

app.get('/*', function(req, res){
	var end = req.originalUrl.substring(1, req.originalUrl.length);
	if (isFile(end)) {
		var readStream = fs.createReadStream(path.join(__dirname, 'src/', end));
		readStream.pipe(res);
	} else {
		res.redirect('/');	
	}
});

function isFile(str) {
	if (str.match(/.png/)) {
		return true;
	} else if (str.match(/.css/)) {
		return true;
	} else if (str.match(/.jpg/)) {
		return true;
	} else if (str.match(/.js/)) {
		return true;
	}
	return false;
}

var port = process.env.PORT || 8080;
app.listen(port, function(){
	console.log("Running on port: " + port);
});