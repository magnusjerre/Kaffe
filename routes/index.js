var kaffedb = null;
exports.setKaffedb = function(db) {
	kaffedb = db;
}

exports.index = function(req, res){
    kaffedb.getDagensKaffe(function(dkError, dkResult){ //dk = dagenskaffe
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
                "gjetting" : {
					"visGjetteBoks" : false,
					"korrektSvar" : false,
                    "brukernavn" : null,
                    "karakter" : null,
                    "kaffeSammendrag" : null,
					"kaffeId" : null
                }
            }
			
			if (dagenskaffeErRegistrert(model)) {
				console.log("Dagens registrerte kaffeid: " + dkResult.kaffeId);
			} else {
				console.log("Dagenskaffe er ikke registrert.");
			}
            
            if (req.query.brukernavn && req.query.karakter && req.query.kaffeNavn && req.query.kaffeId) {
				var visGjetteBoks = false, korrektSvar = false;
				if (dagenskaffeErRegistrert(model)) {
					visGjetteBoks = true;
					korrektSvar = req.query.kaffeId.valueOf() == model.dagensbrygg.kaffeId.valueOf();
				}
				
                model.gjetting = {
					"visGjetteBoks" : visGjetteBoks,
					"korrektSvar" : korrektSvar,
                    "brukernavn" : req.query.brukernavn,
                    "karakter" : req.query.karakter,
                    "kaffeSammendrag" : req.query.kaffeNavn,
					"kaffeId" : req.query.kaffeId
                }
				
				console.log("Gjettet kaffe med kaffeId:  " + model.gjetting.kaffeId);
				console.log("Bruker med navn '" + model.gjetting.brukernavn + "' gjettet på dagenskaffe.");
				console.log("visGjetteBoks: " + model.gjetting.visGjetteBoks + ", korrektSvar: " + model.gjetting.korrektSvar);
            }
            
			res.render('index', model);
        });
    });    
}

function dagenskaffeErRegistrert(model) {
	if (model.dagensbrygg == null) {
		return false;
	}
	if (model.dagensbrygg.kaffe_navn != null 
		&& model.dagensbrygg.kaffe_navn.valueOf() == 'Ukjent') {
		return false;
	}
	return typeof model.dagensbrygg.kaffeId != 'undefined' &&  model.dagensbrygg.kaffeId != null;
}

exports.giKarakter = function(req, res){
	var doc = {
		bruker_navn : req.body.bruker_navn,
		karakter : req.body.karakter,
		gjetting : req.body.kaffeNavn,
		kaffeId : req.body.kaffeId
	}
	kaffedb.insertDagensKarakter(doc, function(){     
        res.redirect('/?brukernavn=' + doc.bruker_navn + '&karakter=' + doc.karakter + '&kaffeNavn=' + doc.gjetting + '&kaffeId=' + doc.kaffeId);
	});
}

exports.registrerNyDagensKaffe = function(req, res){
	var doc = {
		"_id" : new Date(),
		kaffeId : req.body.kaffeId,
		kaffe_navn : req.body.kaffeNavn,
		brygger : req.body.brygger,
		liter : req.body.liter,
		skjeer : req.body.skjeer,
		karakterer : []
	}
	kaffedb.insertDagenskaffe(doc, function(error, result){
		console.log("redirecting to main page");
		res.redirect('/');
	});
}