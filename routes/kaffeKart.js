var kaffedb = null;
exports.setKaffedb = function(db) {
	kaffedb = db;
}

exports.kaffeKart = function(req, res){
	res.render('kaffeKart');
}

exports.kaffeKartJSON = function(req, res){
	kaffedb.listKaffeLand(function(error, result){
		res.json(result);
	});
}
