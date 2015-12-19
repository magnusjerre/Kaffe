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

kaffedb.connect();

app.use(favicon(__dirname + '/favicon.ico'));

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

app.get('/kaffeliste', function(req, res){
	var fn = jadeCompile('kaffeliste.jade');
	kaffedb.listKafferPaProdusenter(function(error, docs){
		res.writeHead(200, { 'Content-Type' : 'text/html'});
		res.write(fn({produsenter : docs}));
		res.end();
		
	});
});

app.get('/', function(req, res){
	var fn = jadeCompile('index.jade');
    kaffedb.getDagensKaffe(function(dkError, dkResult){ //dk = dagenskaffe
        console.log("getDagensKAffe");
        kaffedb.listKafferDropdown(function(kdErr, kdRes){
            console.log("listKafferDropdown");
            if (dkError) {
                console.log("ERROR: There was a problem retrieving 'dagenskaffe': " + dkError);
                return;
            }
            if (kdErr) {
                console.log("ERROR: There was a problem retrieving the list of possible coffes: " + kdErr);
                return;
            }
            
            var model = {
                "dagensbrygg" : dkResult,
                "dropdownkaffer" : kdRes,
                "gjetting" : null
            }
            
            if (req.query.brukernavn && req.query.karakter && req.query.kaffe) {
                model.gjetting = {
                    "brukernavn" : req.query.brukernavn,
                    "karakter" : req.query.karakter,
                    "kaffe" : req.query.kaffe
                }
            }
            
            if (model.dagensbrygg == null) {
                console.log("har ikke registrert noen kaffe for i dag og det er heller ikke registrert noen karakterer");
            } else {
                if (model.dagensbrygg.kaffe_navn == "Ukjent") {
                    console.log("Ingen kaffe har blitt registrert i dag, men en eller flere karakterer har det");
                } else {
                    console.log("Dagens kaffe har blitt registrert i dag");
                }
            }
            
            res.writeHead(200, { 'Content-Type' : 'text/html'});
            res.write(fn(model));
            res.end();
        });
    });    
});

app.get('/about', function(req, res){
	var fn = jadeCompile('about.jade');
	res.writeHead(200, { 'Content-Type' : 'text/html' });
	res.write(fn());
	res.end();
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
        res.redirect('/?brukernavn=' + doc.bruker_navn + '&karakter=' + doc.karakter + '&kaffe=' + doc.gjetting);
	});
});

app.post('/visskjulkaffe', function(req, res){
	var data = req.body;	//example: { id : '566a8327b2446e033056f20b' }
	kaffedb.endreVisVerdiForKaffe(data.id, function(error, result){
		res.redirect('/kaffeliste');
	});
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
	kaffedb.insertDagenskaffe(doc, function(error, result){
		console.log("redirecting to main page");
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