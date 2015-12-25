var kaffedb = null;
exports.setKaffedb = function(db) {
	kaffedb = db;
}

exports.allKaffe = function(req, res){
	kaffedb.listKafferPaProdusenter(function(error, docs){
		res.render('kaffeliste', { produsenter: docs });
	});
}

exports.visSkjulKaffe = function(req, res) {
	var data = req.body;	//example: { id : '566a8327b2446e033056f20b' }
	kaffedb.endreVisVerdiForKaffe(data.id, function(error, result){
		res.redirect('/kaffeliste');
	});
}