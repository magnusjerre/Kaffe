var kaffedb = null;
exports.setKaffedb = function(db) {
	kaffedb = db;
}

exports.dagenskaffeHistorikk = function(req, res) {
	kaffedb.listDagensKaffe(function(error, docs){
		res.render('listDagensKaffe', { model : docs });
	});
}