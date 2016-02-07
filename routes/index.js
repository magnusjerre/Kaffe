var kaffedb = null;
exports.setKaffedb = function(db) {
	kaffedb = db;
}

exports.index = function(req, res){
	res.render('index');
    // kaffedb.getBryggForDag(new Date(), function(dkError, dkResult){
    //     kaffedb.listKafferDropdown(function(kdErr, kdRes){
    //         if (dkError) {
    //             console.log("ERROR: There was a problem retrieving 'dagenskaffe': " + dkError);
    //             return;
    //         }
    //         if (kdErr) {
    //             console.log("ERROR: There was a problem retrieving the list of possible coffes: " + kdErr);
    //             return;
    //         }
            
    //         var model = {
    //             "dagensbrygg" : dkResult,
    //             "dropdownkaffer" : kdRes,
    //             "gjetting" : { "visGjetteBoks" : false }
    //         }
	// 		if (model.dagensbrygg == null) {
	// 			model.dagensbrygg = [];
	// 		}
            
    //         if (req.query.bryggid) {
	// 			var visGjetteBoks = false, korrektSvar = false;
	// 			var brygg = getBrygg(dkResult, req.query.bryggid);
	// 			if (bryggRegistrert(brygg)) {
	// 				visGjetteBoks = true;
	// 				korrektSvar = req.query.kaffeid.valueOf() == brygg.kaffeid.valueOf();
	// 			}
				
    //             model.gjetting = {
	// 				"bryggid" : req.query.bryggid,
	// 				"visGjetteBoks" : visGjetteBoks,
	// 				"korrektSvar" : korrektSvar,
    //                 "bruker" : req.query.bruker,
    //                 "karakter" : req.query.karakter,
    //                 "sammendrag" : req.query.sammendrag,
	// 				"kaffeid" : req.query.kaffeid
    //             }
    //         }
            
	// 		res.render('index', model);
    //     });
    // });
}

function getBrygg(dagensbrygg, bryggid) {
	if (dagensbrygg == null || dagensbrygg.length == 0) {
		return null;
	}
	
	for (var i = 0; i < dagensbrygg.length; i++) {
		if (dagensbrygg[i].bryggid === bryggid) {
			return dagensbrygg[i];
		}
	}
	
	return null;
}

function bryggRegistrert(brygg){
	if (brygg == null || brygg.kaffeid === "Ukjent") {
		return false;
	}
	return true;
}
//data: { "gjetting" : <karakter>, "brygg" : <brygg>}
exports.registrerKarakter = function(req, res){
	var karakter = {
		"bruker" : req.body.bruker,
		"kaffeid" : req.body.kaffeid,
		"sammendrag" : req.body.sammendrag,
		"karakter" : req.body.karakter,
		"kommentar" : req.body.kommentar
	}
	kaffedb.registrerKarakter(karakter, req.body.bryggid, 
		function(error, rKarakter, rBrygg){
			if (error) {
				console.log("Feil ved registrering av karakter:" + error);
				return;
			}
			res.json({"gjetting" : rKarakter, "brygg" : rBrygg}); 
	});
}

exports.hentMuligeKaffer = function(req, res) {
	kaffedb.listKafferDropdown(function(error, result){
		res.json({ "kaffer" : result});
	});
}

exports.registrerNyttBrygg = function(req, res){
	var brygg = {
		"dato" : new Date(),
		"sammendrag" : req.body.sammendrag,
		"bryggnavn" : req.body.bryggnavn,
		"brygger" : req.body.brygger,
		"kaffeid" : req.body.kaffeid,
		"liter" : req.body.liter,
		"skjeer" : req.body.skjeer,
		"maskin" : req.body.maskin,
		"karakterer" : []
	}
	console.log("har opprettet brygg variabel");
	kaffedb.registrerNyttBrygg(brygg, req.body.bryggid, function(error, rBrygg){
		res.json(rBrygg);
	});
}

exports.hentDagsbrygg = function(req, res) {
	kaffedb.hentBryggForDag(new Date(), function(err, dagsbrygg){
		res.json({ "dagsbrygg" : dagsbrygg});
	});
}