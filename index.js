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

app.get('/', function(req, res){
	var fn = jadeCompile('index.jade');
	kaffedb.list	
	res.writeHead(200, { 'Content-Type' : 'text/html'});
	
	kaffedb.getDagensKaffe(function(error, result){
		if (result) {
			console.log("Found today's coffe");
			res.write(fn({ model : { hardagenskaffe : true }}));
		} else {
			console.log("Did not find today's coffe");
			res.write(fn({ model : { hardagenskaffe : false}}));
		}
		res.end();
	});
});



app.get('/kaffe.css', function(req, res){
	var readStream = fs.createReadStream(path.join(__dirname, 'src/', 'kaffe.css'));
	readStream.pipe(res);
});

app.get('/listDagensKaffe', function(req, res){
	var fn = jadeCompile('listDagensKaffe.jade');
	res.writeHead(200, { 'Content-Type' : 'text/html' });
	kaffedb.listDagensKaffe(function(error, docs){
		/*if (error) {
			console.log("---error---");
			console.log(error);
		}
		console.log("---docs---");
		console.log(docs);
		console.log("---stringify---");
		console.log(JSON.stringify(m, null, 2));*/
		/*var m = { model : docs };
		console.log("m.model.length: " + m.model.length);
		console.log("docs.length: " + docs.length);
		console.log("m.model: " + m.model);*/
		var html = fn({ model : docs});
		res.write(html);
		res.end();
	});
	
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

function jadeCompile(filename) {
	return jade.compile(fs.readFileSync(path.join(__dirname, 'src/', filename)), { pretty: true });	
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

app.listen(3000);