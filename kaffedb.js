var mongo = require('mongodb');
var mongoClient = mongo.MongoClient;
var ObjectId = mongo.ObjectId;

exports.connect = function() {
	if (mongo.DB) {
		return mongo.DB;
	}
	
	var url = process.env.connectionString;
	
	module.exports.connect = mongoClient.connect(url, function(err, db){
		if (err) {
			console.log("Ballz, can't get mongo...");
			process.exit(1);
		} else {
			console.log("Yay, got mongo!");
			mongo.DB = db;
		}
	});
}

exports.close = function() {
	if (mongo.DB) {
		mongo.DB.close();
	}
}

exports.getKaffeMedNavn = function(navn, cb) {
	kaffer().findOne(
		{"navn" : navn},
		{},
		function(err, res){
			cb(err, res);			
		}
	);
}

var getDagensKafferForPeriode = function(startDato, sluttDato, callback) {
	dagensKaffe().find({ '_id' : { $gte : startDato, $lte : sluttDato }}).toArray(function(error, docs) {
		callback(error, docs);
	});
}
exports.getDagensKafferForPeriode = getDagensKafferForPeriode;

var getDagensKaffe = function(callback) {
	var idagstart = iDagStart();
	var idagslutt = iDagSlutt();
	dagensKaffe().findOne(
		{
			'_id' : { $gte : idagstart, $lte : idagslutt}
		}, 
		{
		},
		function(error, result) {callback(error, result)}
	);
}
exports.getDagensKaffe = getDagensKaffe;

var listDagensKaffeForMonth = function(year, month, callback){
	var first = new Date(year, month	,	1, 	0, 	0, 	0, 	0);
	var last = 	new Date(year, month + 1,	0,  23, 59, 59, 99);
	
	dagensKaffe().find({ '_id' : { $gte : first, $lte : last} }).toArray(function(error, docs) {
		callback(error, docs);	
	});
}
exports.listDagensKaffeForMonth = listDagensKaffeForMonth;

exports.listDagensKaffe = function(callback) {
	dagensKaffe().find().sort({ "_id" : -1 }).toArray(function(error, docs){
		callback(error, docs);	
	});
}

exports.listKafferPaProdusenter = function(cb) {
	kaffer().aggregate(
		[
			{ $group : {"_id" : "$produsent",	"kaffe" : {$push : "$$ROOT"}}},
			{ $sort : { "_id" : 1} }
		],
		function(error, result){
			cb(error, result);
	});
}

exports.listKafferDropdown = function(cb) {
	kaffer().find({ vis : true}).sort({produsent : 1, navn : 1}).toArray(function(err, res) {
		cb(err, res);
	});
}

exports.listKaffer = function(cb) {
	kaffer().find({}).sort({produsent : 1, navn : 1}).toArray(function(err, res) {
		cb(err, res);
	});
}

exports.listKaffeNavn = function(cb) {
	kaffer().aggregate(
		[
			{ $project : { navn : 1, "_id" : 0 } },
			{ $sort : { navn : 1 } }
		], 
		{}, 
		function(err, result) {
			cb(err, result); 
		}
	);
}

exports.listKaffeLand = function(cb) {
	kaffer().aggregate(
		[
			{ $group : { "_id" : { land : "$land", "lat" : "$lat", "lgt" : "$lgt"}}}
		],
		function(err, result){
			var output =[];
			for (var i = 0; i < result.length; i++) {
				output.push({
					"land" : result[i]["_id"]["land"],
					"position" : {
						"lat" : result[i]["_id"]["lat"],
						"lng" : result[i]["_id"]["lgt"]
					}
				});
			}
			
			cb(err, output);
		}
	);
}

exports.insertNyKaffe = function(doc, cb){
	kaffer().insertOne(doc, {}, function(error, result) {
		cb(error, result);
	});
}

var finnKaffe = function(query, callback) {
	kaffer().findOne(query, function(error, result){	//returnerer det ene kaffe.json objektet
		if (error) {
			console.log("ERROR: Couldn't find a doument for method finnKaffe for query: " + jsonStrOneline(query));
		} else {
			console.log("Foud a document for method finnKaffe for query: " + jsonStrOneline(query));
		}
		callback(error, result);
	});
}
exports.finnKaffe = finnKaffe;

var finnKaffeMedId = function(idString, callback) {
	var query = { "_id" : ObjectId(idString) }	//må omringe id-strengen med ObjectId
	finnKaffe(query, function(error, result){
		callback(error, result);
	});
}
exports.finnKaffeMedId = finnKaffe;

var endreVerdiForKaffe = function(query, update, options, callback){
	kaffer().findOneAndUpdate(query, update, options, function(error, result){
		if (error) {
			console.log("ERROR: Couldn't find a document to update for method endreVerdiForKaffe for query: " + jsonStrOneline(query));
		} else {
			console.log("Found a document with to update for method endreVerdiForKaffe for query: " + jsonStrOneline(query));
		}
		callback(error, result);
	});
}
exports.endreVerdiForKaffe = endreVerdiForKaffe;

var endreVisVerdiForKaffe = function(idString, callback) {
	finnKaffeMedId(idString, function(error, result){	//result skal være en kaffe.json json
		endreVerdiForKaffe(
			{ "_id" : ObjectId(idString) }, 
			{ $set : { "vis" : !result.vis}}, 
			{}, 
			function(error, result){
				callback(error, result);
			}
		);
	});
}
exports.endreVisVerdiForKaffe = endreVisVerdiForKaffe;

var kaffer = function() {
	return mongo.DB.collection('kaffe');
}

var dagensKaffe = function () {
	return mongo.DB.collection('brygg');
}

exports.dagensKaffe = dagensKaffe;

function iDagStart() {
	var now = new Date();
	
	var iDagStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
	return iDagStart;
}

function iDagSlutt() {
	var now = new Date();
	var iDagSlutt = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
	return iDagSlutt;
}

function printJSON(obj) {
	console.log(JSON.stringify(obj, null, 2));
}
function printProps(obj) {
	for (var k in obj) {
		console.log(k + " : " + obj[k]);
	}
}

function jsonStrOneline(obj) {
	var str = "";
	for (var k in obj) {
		strtemp = k + " : " + obj[k] + ", ";
		str += strtemp;
	}
	return str;
}

var bryggColl = function () {
	return mongo.DB.collection('brygg');
}

var dagsbryggColl = function () {
	return mongo.DB.collection('dagsbrygg');
}


//----- registrering -----
//callback: error, brygg
var registrerNyttBrygg = function(brygg, bryggid, callback) {
	if (bryggid && bryggid.length > 0) {
		bryggColl().findOneAndUpdate(
			{ "_id" : ObjectId(bryggid)}, 
			{
				$set : {
					"dato" : brygg.dato,
					"kaffeid" : brygg.kaffeid,
					"sammendrag" : brygg.sammendrag,
					"bryggnavn" : brygg.bryggnavn,
					"brygger" : brygg.brygger,
					"liter" : brygg.liter,
					"skjeer" : brygg.skjeer,
					"maskin" : brygg.maskin,
					"lukket" : brygg.lukket
				}
			}, 
			{}, function(err, res){
				callback(err, brygg);
			});
	} else {
		bryggColl().insert(brygg, function(err, res){
			if (err) {
				callback(err, brygg);
				return;
			}
			//brygg vil få _id satt av db, dette synes her inni callbackfunksjonen
			console.log("Opprettet brygg med id: " + brygg["_id"]);
			callback(err, brygg);//res: {"ops": [<brygg>]}	id finnes nå i res
		});
	}
}
exports.registrerNyttBrygg = registrerNyttBrygg;

//Callback: error, <karakter>, <brygg>
var registrerKarakter = function(karakter, bryggid, callback) {
	if (bryggid && bryggid !== "ingen") {	//Betyr at brygget finnes fra før
		bryggColl().findOne(
			{ 
				"_id" : ObjectId(bryggid)
			},
			{},
			function(err, brygg){
				if (err || brygg == null) {
					callback(err, karakter, brygg);
					return;
				}

				var karakterAlleredeRegistrert = false;
				for (var i = 0; i < brygg.karakterer.length; i++) {
					if (karakter.bruker.toLowerCase() === brygg.karakterer[i].bruker.toLowerCase()) {
						karakterAlleredeRegistrert = true;
						bryggColl().findOneAndUpdate(
							{
								"_id" : ObjectId(bryggid),
								"karakterer" : { $elemMatch : { "bruker" : karakter.bruker } }
							},
							{
								$set : { "karakterer.$.karakter" : karakter.karakter }
							},
							{}, 
							function(uErr, uRes){
								callback(uErr, karakter, brygg);
							}
						);
					}
				}
				
				if (!karakterAlleredeRegistrert) {
					pushKarakterToBrygg(karakter, bryggid, callback);
				}
			}
		);
	} else {	//karakter.kaffeid er nå null
		var ukjentBrygg = makeDefaultBrygg();
		registrerNyttBrygg(ukjentBrygg, null, function(error, result){
			if (error) {
				callback(error, result);
				return;
			}
			pushKarakterToBrygg(karakter, ukjentBrygg["_id"].toHexString(), callback);
		});
	}
}
exports.registrerKarakter = registrerKarakter;

//Callback: error, <karakter>, <brygg>
function pushKarakterToBrygg(karakter, bryggid, callback) {
	bryggColl().findOneAndUpdate(
		{
			"_id" : ObjectId(bryggid)
		},
		{
			$push : { "karakterer" : karakter }
		},
		{
		},
		function(error, result){
			callback(error, karakter, result.value);	//result: { "value" : <brygg>}
		}
	);
}
//----- registrering slutt -----

//----- uthenting ------
//callback: error, result
var hentBryggForDag = function(dato, callback) {
	bryggColl().find({ "dato" : { $gte : getStartTid(dato), $lte : getSluttTid(dato) } }).toArray(function(error, docs) {
		callback(error, docs);
	});
}
exports.hentBryggForDag = hentBryggForDag;
//callback: error, result
var hentBryggMedId = function(bryggid, callback) {
	bryggColl().findOne({ "_id" : bryggid }, {}, function(error, result){
		callback(error, result);
	});
}

//----- Hjelpemetoder -----
function generateObjectId() {
	var now = new Date();
	var seconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
	return ObjectId.generate(seconds);
}

function getStartTid(dato) {
	return new Date(dato.getFullYear(), dato.getMonth(), dato.getDate());
}

function getSluttTid(dato) {
	return new Date(dato.getFullYear(), dato.getMonth(), dato.getDate(), 23, 59, 59, 999);
}

//klassebyggere
function makeDagsbrygg(dato, liste) {
	if (arguments.length != 2) {
		throw "Feil antall argumenter. Har " + arguments.length + ", men skal ha 2";
	}
	return {
		"dato" : dato,
		"dagensbrygg" : liste
	}
}

function makeDefaultBrygg() {
	return makeBrygg(new Date(), "Ukjent", "Ukjent", "Ukjent", "Ukjent", 0, 0, true, false);
}

function makeBrygg(dato, kaffeid, sammendrag, bryggnavn, brygger, liter, skjeer, maskin, lukket) {
	if (arguments.length != 9) {
		throw "Feil antall argumenter. Har " + arguments.length + ", men skal ha 9";
	}
	return {
		"dato" : dato,
		"kaffeid" : kaffeid,
		"sammendrag" : sammendrag,
		"bryggnavn" : bryggnavn,
		"brygger" : brygger,
		"liter" : liter,
		"skjeer" : skjeer,
		"maskin" : maskin,
		"lukket" : lukket,
		"karakterer" : []
	}
}

function makeKarakter(bryggid, bruker, kaffeid, sammendrag, karakter, kommentar) {
	if (arguments.length != 6) {
		throw "Feil antall argumenter" + arguments.length + ", men skal ha 6";
	}
	return {
		"bruker" : bruker,
		"kaffeid" : kaffeid,
		"sammendrag" : sammendrag,
		"karakter" : karakter,
		"kommentar" : kommentar
	}
}