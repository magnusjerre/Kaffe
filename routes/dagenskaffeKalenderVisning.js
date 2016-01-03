var kaffedb = null;
exports.setKaffedb = function(db) {
	kaffedb = db;
}

exports.kalenderElementer = function(req, res){
	var date = new Date();
	if (req.query.month && req.query.year) {
		date = new Date(parseInt(req.query.year), parseInt(req.query.month));
	}
	kaffedb.listDagensKaffeForMonth(date.getFullYear(), date.getMonth(), function(error, docs){
		var calendar = getCalendar(date.getFullYear(), date.getMonth());
		var model = { "dagensbrygg" : convertToCalendar2(docs, calendar) }
		res.json(model);	
	});
}

exports.kalendervisning = function(req, res){
	var date = new Date();
	if (req.query.month && req.query.year) {
		date = new Date(parseInt(req.query.year), parseInt(req.query.month));
	}
	kaffedb.listDagensKaffeForMonth(date.getFullYear(), date.getMonth(), function(error, docs){
		var calendar = getCalendar(date.getFullYear(), date.getMonth());
		var arr2 = convertToCalendar2(docs, calendar);
		var model2 = {
			"dager" : calendar,
			"dagensbrygg" : arr2,
			"month" : getMonthNorwegian(date),
			"fullYear" : date.getFullYear(),
			"fullMonth" : date.getMonth()
		}
		res.render('kalendervisning.jade', model2);
	});
}

function getMonthNorwegian(date) {
	if (date.getMonth() == 0) {
		return "Januar";
	} else if (date.getMonth() == 1) {
		return "Februar";
	} else if (date.getMonth() == 2) {
		return "Mars";
	} else if (date.getMonth() == 3) {
		return "April";
	} else if (date.getMonth() == 4) {
		return "Mai";
	} else if (date.getMonth() == 5) {
		return "Juni";
	} else if (date.getMonth() == 6) {
		return "Juli";
	} else if (date.getMonth() == 7) {
		return "August";
	} else if (date.getMonth() == 8) {
		return "September";
	} else if (date.getMonth() == 9) {
		return "Okotber";
	} else if (date.getMonth() == 10) {
		return "November";
	} else {
		return "Desember";
	}
}

function convertToCalendar2(kafferdocs, calendar) {
	var array = new Array(42);
	for (var i = 0; i < kafferdocs.length; i++) {
		insertKaffeInCalendar(kafferdocs[i], calendar, array);
	}
	return array;
}

function insertKaffeInCalendar(kaffe, calendar, array) {
	var month = kaffe._id.getMonth();
	var date = kaffe._id.getDate();
	for (var i = 0; i < calendar.length; i++) {
		if (calendar[i].date.getMonth() == month &&
			calendar[i].date.getDate() == date) {
			array[i] = kaffe;
			break;	
		}
	}
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

var getCalendar = function(year, month) {
	var calArray = new Array(42);
	
	var dayOneOfMonth = new Date(year, month, 1);
	var lastDayOfMonth = new Date(year, month + 1, 0);
	var lastDayOfPrevMonth = new Date(year, month, 0);
	var firstOfNextMonth = new Date(year, month + 1, 1);
	
	var posOfFirstDayInCalArray = dayOneOfMonth.getDay() - 1;
	if (posOfFirstDayInCalArray == -1) {
		posOfFirstDayInCalArray = 6;
	}
	
	//Populate prev month if this month starts any other day than monday 
	if (posOfFirstDayInCalArray > 0) {
		var counter = 0;
		for (var i = posOfFirstDayInCalArray - 1; i >= 0; i--) {
			var d = new Date(year, month, 0 - counter);
			calArray[i] = {date : d, dayOfWeek : d.getDate(), isThisMonth : false};
			counter++;
		}
	}
	
	//Populate current month
	var counter = 1;
	var daysInMonth = lastDayOfMonth.getDate();
	for (var i = posOfFirstDayInCalArray; i < posOfFirstDayInCalArray + daysInMonth; i++) {
		var d = new Date(year, month, counter);
		calArray[i] = {date : d, dayOfWeek : d.getDate(), isThisMonth : true};
		counter++;
	}
	
	//Populate next month
	counter = 1;
	for (var i = 0; i < calArray.length; i++) {
		if (calArray[i] == null) {
			var d = new Date(year, month + 1, counter++);
			calArray[i] = { date : d, dayOfWeek : d.getDate(), isThisMonth : false};
		}
	}
	
	return calArray;	
}