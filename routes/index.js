var kaffedb = null;
exports.setKaffedb = function(db) {
	kaffedb = db;
}

exports.index = function(req, res){
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
            
            if (req.query.brukernavn && req.query.karakter && req.query.kaffeNavn && req.query.kaffeId) {
				console.log("gjetteid: " + req.query.kaffeId.valueOf());
				console.log("dagensId: " + model.dagensbrygg.kaffeId.valueOf());
				var korrektSvar = req.query.kaffeId.valueOf() == model.dagensbrygg.kaffeId.valueOf();
				console.log("korrektSvar: " + korrektSvar);
                model.gjetting = {
                    "brukernavn" : req.query.brukernavn,
                    "karakter" : req.query.karakter,
                    "kaffeSammendrag" : req.query.kaffeNavn,
					"kaffeId" : req.query.kaffeId,
					"korrektSvar" : korrektSvar
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
            
			res.render('index', model);
        });
    });    
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