var kaffedb = null;
exports.setKaffedb = function(db) {
	kaffedb = db;
}

exports.nyKaffe = function(req, res){
	res.render('nykaffe');
}

exports.registrerNyKaffe = function(req, res){
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
}