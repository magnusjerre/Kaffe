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

var insertNyKarakter = function(dato, bryggid, karakter, callback) {
	getBryggForDag(dato, function(error, result){
		if (error) {
			callback(error, result);
		} else {
			if (result == null) {
				insertNyttBrygg(
					{
						"dato" : new Date(),
						"kaffeid" : "Ukjent",
						"sammendrag" : "Ukjent",
						"bryggnavn" : "Ukjent",
						"brygger" : "Ukjent",
						"liter" : 0,
						"skjeer" : 0,
						"karakterer" : [
							karakter
						]
					}, function(rnError, rnResult) {
						callback(rnError, rnResult);
					}
				);
			} else {
				var eksisterendeBrygg = null;
				for (var i = 0; i < result.length; i++) {
					if (result[i]["_id"] === bryggid) {
						eksisterendeBrygg = result[i];
						break;
					}
				}
				
				if (eksisterendeBrygg) {
					dagensKaffe().updateOne(
						{
							"_id" : result["_id"],
							"dagensbrygg" : { $elemMatch : { "_id" : eksisterendeBrygg["_id"]} }
						},
						{
							$push : { "dagensbrygg.$.karakterer" : karakter }
						}
					);
				} else {
					insertNyttBrygg(
					{
						"dato" : new Date(),
						"kaffeid" : "Ukjent",
						"sammendrag" : "Ukjent",
						"bryggnavn" : "Ukjent",
						"brygger" : "Ukjent",
						"liter" : 0,
						"skjeer" : 0,
						"karakterer" : [
							karakter
						]
					}, function(rnError, rnResult) {
						callback(rnError, rnResult);
					}
				);
				}
			}
		}
	});
}

function generateObjectId() {
	var now = new Date();
	var seconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
	return ObjectId.generate(seconds);
}

var insertNyttBrygg = function(brygg, callback) {
	brygg["_id"] = generateObjectId();
	getBryggForDag(brygg.dato, function(error, result){
		if (error) {
			callback(error, result);
		} else {
			if (result == null) {
				dagensKaffe().insert(createDagensBryggListe(), {}, function(iError, iResult){
					callback(iError, iResult);
				});
			} else {
				dagensKaffe().updateOne({ "_id" : result._id }, { $push : { dagensbrygg : brygg } }, {}, function(uError, uResult){
					callback(uError, uResult);
				});
			}
		}
	});
}

function createDagensBryggListe(brygg) {
	var dagensBryggListe = {
		"dato" : getStartTid(brygg.dato),
		"dagensbrygg" : [
			brygg
		]
	}
	return dagensBryggListe;
}

var getBryggForDag = function(dato, callback) {
	dagensKaffe().findOne({"dato" : { $gte : getStartTid(dato), $lte : getSluttTid(dato)}}, function(error, result){
		callback(error, result);
	});
}
exports.getBryggForDag = getBryggForDag;

function getStartTid(dato) {
	return new Dato(dato.getFullYear(), dato.getMonth(), dato.getDato());
}

function getSluttTid(dato) {
	return new Dato(dato.getFullYear(), dato.getMonth(), dato.getDato(), 23, 59, 59, 999);
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

exports.insertDagensKarakter = function(args, cb) {
	var collection = dagensKaffe();
	
	var idagstart = iDagStart();
	
	var idagslutt = iDagSlutt();
	
	getDagensKaffe(function(error, result){
		if (error) {
			
		} else if (result == null) {
			doc = {
				"_id" : new Date(),
				kaffeId : "Ukjent",
				kaffe_navn : "Ukjent",
				brygger : "Ukjent",
				liter : 0,
				skjeer : 0,
				karakterer : [args]
			}
			collection.insertOne(doc, {}, function(error2, result2){
                cb(error, result);
			});
		} else {
			collection.findOneAndUpdate(
				{
					"_id" : { $gte : idagstart, $lte : idagslutt}
				}, 
				{
					$push : { karakterer : args}
				}, 
				{}, 
				function(error, result){
					if (error) {
						console.log("error in inserting dagens karakter. ");
						console.log("error: " + error);
					} else {
						console.log("successfully inserted new karakter");
						printJSON(result);
					}
                    cb(error, result);
				}
			);		
		}
	});
	
	
	
}

exports.insertDagenskaffe = function(args, cb) {
	var collection = dagensKaffe();
	
	getDagensKaffe(function(error, result){
		if (error) {
			cb(error, result);
		} else if (result == null) {
			console.log("Ingen kaffe er registrert, dette gjelder for 'Ukjent' også.");
			console.log("Registrerer kaffe med id: " + args.kaffeId + ", og navn: " + args.kaffe_navn);
			collection.insertOne(args, {}, function(error2, result2){
				if (!error) {
					cb(result2);
				}
			});
		} else {
			console.log("Karakter er allerede registrert, finner derfor 'Ukjent' kaffe");
			var idagstart = iDagStart();
	
			var idagslutt = iDagSlutt();
			collection.findOneAndUpdate(
				{
					"_id" : { $gte : idagstart, $lte : idagslutt}
				}, 
				{
					$set : {
						"kaffeId" : args.kaffeId,
						"kaffe_navn" : args.kaffe_navn,
						"brygger" : args.brygger,
						"liter" : args.liter,
						"skjeer" : args.skjeer
					}
				},
				{
					"returnOriginal" : false
				}, 
				function(error2, result2){
					console.log("'Ukjent' endret til kaffe med id: " + result2.value.kaffeId + ", og navn: " + result2.value.kaffe_navn);
					cb(error2, result2);
			});
		}
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