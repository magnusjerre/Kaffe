var mongo = require('mongodb');
var mongoClient = mongo.MongoClient;

exports.connect = function() {
	if (mongo.DB) {
		return mongo.DB;
	}
	var url = 'mongodb://localhost:27017/kaffedb';
	
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

exports.getDagensKaffe = function(callback) {
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

exports.listDagensKaffe = function(callback) {
	dagensKaffe().find({}).sort({ "_id" : -1 }).toArray(function(error, docs){
		callback(error, docs);	
	});
}

exports.insertDagensKarakter = function(args, cb) {
	var collection = dagensKaffe();
	
	var idagstart = iDagStart();
	
	var idagslutt = iDagSlutt();
	
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
		});
}

exports.insertDagenskaffe = function(args, cb) {
	var collection = dagensKaffe();
	collection.insertOne(args, {}, function(error, result) {
		if (!error) {
			cb(result);
		}
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

var kaffer = function() {
	return mongo.DB.collection('kaffe');
}

var dagensKaffe = function () {
	return mongo.DB.collection('dagenskaffe');
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