var kaffedb = null;
exports.setKaffedb = function(db) {
	kaffedb = db;
}

exports.index = function(req, res){
    kaffedb.getBryggForDag(new Date(), function(dkError, dkResult){
        kaffedb.listKafferDropdown(function(kdErr, kdRes){
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
                "gjetting" : { "visGjetteBoks" : false }
            }
			if (model.dagensbrygg == null) {
				model.dagensbrygg = [];
			}
            
            if (req.query.bryggid) {
				var visGjetteBoks = false, korrektSvar = false;
				var brygg = getBrygg(dkResult, req.query.bryggid);
				if (bryggRegistrert(brygg)) {
					visGjetteBoks = true;
					korrektSvar = req.query.kaffeid.valueOf() == brygg.kaffeid.valueOf();
				}
				
                model.gjetting = {
					"bryggid" : req.query.bryggid,
					"visGjetteBoks" : visGjetteBoks,
					"korrektSvar" : korrektSvar,
                    "bruker" : req.query.bruker,
                    "karakter" : req.query.karakter,
                    "sammendrag" : req.query.sammendrag,
					"kaffeid" : req.query.kaffeid
                }
            }
            
			res.render('index', model);
        });
    });
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

exports.registrerKarakter = function(req, res){
	var karakter = {
		"bryggid" : req.query.bryggid,
		"bruker" : req.query.bruker,
		"kaffeid" : req.query.kaffeid,
		"sammendrag" : req.query.sammendrag,
		"karakter" : req.query.karakter,
		"kommentar" : req.query.kommentar
	}
	kaffedb.insertNyKarakter(new Date(), karakter.bryggid, karakter, function(error, result){
		var query = 
		'/?bryggid=' + encodeURIComponent(karakter.bryggid) + 
		'&bruker=' + encodeURIComponent(karakter.bruker) + 
		'&kaffeid=' + encodeURIComponent(karakter.kaffeid) + 
		'&sammendrag=' + encodeURIComponent(karakter.sammendrag) + 
		'&karakter=' + encodeURIComponent(karakter.karakter);
		
		res.redirect(query);
	});
}

exports.registrerNyttBrygg = function(req, res){
	var brygg = {
		"dato" : new Date(),
		"kaffeid" : req.body.kaffeid,
		"sammendrag" : req.body.sammendrag,
		"bryggnavn" : req.body.bryggnavn,
		"brygger" : req.body.brygger,
		"liter" : req.body.liter,
		"skjeer" : req.body.skjeer,
		"maskin" : req.body.maskin,
		"lukket" : req.body.lukket,
		"karakterer" : []
	}
	kaffedb.insertNyttBrygg(brygg, function(error, result){
		console.log("redirecting to main page");
		res.redirect('/');
	});
}