var kaffedb = null;
exports.setKaffedb = function(db) {
	kaffedb = db;
}

exports.kalenderElementer = function(req, res){
	var date = new Date();
	kaffedb.listDagensKaffeForMonth(date.getFullYear(), date.getMonth(), function(error, docs){
		var model = { "dagensbrygg" : convertToCalendar(docs) }
		res.json(model);	
	});
}

exports.kalendervisning = function(req, res){
	var date = new Date();
	kaffedb.listDagensKaffeForMonth(date.getFullYear(), date.getMonth(), function(error, docs){
		var arr = convertToCalendar(docs);
		var model = {
			"dager" : getDays(date.getFullYear(), date.getMonth()),
			"dagensbrygg" : arr
		}
		res.render('kalendervisning.jade', model);
	});
}

function convertToCalendar(dagenskaffer) {
	var array = new Array(42);
	var firstDay = new Date();
	firstDay = new Date(firstDay.getFullYear(), firstDay.getMonth(), 1);
	var posInArray = firstDay.getDay() - 1;
	if (posInArray == -1) {	// 0 == søndag, kalenderen starter på mandag
		posInArray = 6; 
	}
	
	for (var i = 0; i < dagenskaffer.length; i++) {
		var dagens = dagenskaffer[i];
		var dag = dagens._id.getDate();
		var pos = posInArray + dag - 1;	//trekker fra 1 for å satt til riktig posisjon i kalender tabellen, hvis dag 1 er på mandag, må pos være 0
		array[pos] = dagens;
	}
	
	return array;
}

var getDays = function(year, month) {
	var firstDay = new Date(year, month, 1);
	var posInArray = firstDay.getDay() - 1;
	if (posInArray == -1) {	// 0 == søndag, kalenderen starter på mandag
		posInArray = 6; 
	}
	
	var lastDay = new Date(year, month + 1, 0).getDate();
	
	var array = new Array(42);
	var dayCounter = 1;
	for (var i = 0; i < 42; i++) {
		if (i >= posInArray && dayCounter <= lastDay) {
			array[i] = dayCounter++;
		}
	}
	
	return array;
}