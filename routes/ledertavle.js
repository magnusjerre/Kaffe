var kaffedb = null;
exports.setKaffedb = function(db) {
	kaffedb = db;
}

var ledertavle = function(req, res) {
	var periodeEvighet = getEvigheten();
	var periodeManed = getDenneManeden();
	var periodeUke = getDenneUken();

	var nFinishedLedertavler = 0;
	var model = {
		"ledertavleUke": [],
		"ledertableManed": [],
		"ledertavleEvigheten": []
	}

	kaffedb.getDagsbryggForPeriode(periodeUke.startDato, periodeUke.sluttDato, function(error, bryggArray) {
		leggTilLedertavle("ledertavleUke", bryggArray, model);
		nFinishedLedertavler++;
		tryRendering(nFinishedLedertavler, model, res);
	});

 	kaffedb.getDagsbryggForPeriode(periodeManed.startDato, periodeManed.sluttDato, function(error, bryggArray) {
		leggTilLedertavle("ledertavleManed", bryggArray, model);
		nFinishedLedertavler++;
		tryRendering(nFinishedLedertavler, model, res);
	});

	kaffedb.getDagsbryggForPeriode(periodeEvighet.startDato, periodeEvighet.sluttDato, function(error, bryggArray) {
		leggTilLedertavle("ledertavleEvigheten", bryggArray, model);
		nFinishedLedertavler++;
		tryRendering(nFinishedLedertavler, model, res);
	});
}
exports.ledertavle = ledertavle;

function tryRendering(nFinishedLedertavler, model, res) {
	if (nFinishedLedertavler == 3) {
		res.render('ledertavle', model);
	}
}

function leggTilLedertavle(ledertavlenavn, bryggArray, model) {
	var ledertavle = mapTilArray(mapBryggPaaBrukernavn(bryggArray)).sort(sorterPaaAntallRiktige);
	model[ledertavlenavn] = ledertavle;
}

function filterByDate(bryggArray, startDato, sluttDato) {
	var output = [];
	for (var i = 0; i < bryggArray.length; i++) {
		var brygg = bryggArray[i];
	}
	return output;
}

function getEvigheten() {
	var today = new Date();
	today = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 99);
	var epoc = new Date(2015, 10, 1);
	return { startDato : epoc, sluttDato : today };
}

function getDenneManeden() {
	var today = new Date();
	var firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
	var lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
	return { startDato : firstDayOfMonth, sluttDato : lastDayOfMonth };
}

function getDenneUken() {
	var today = new Date();
	var weekDay = today.getDay();
	var diff = 0;
	if (weekDay == 0) {
		diff = -6;
	} else if (weekDay != 1) {
		diff = weekDay - 1;
	}
	var firstDayOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - diff);
	return {
		startDato : firstDayOfWeek, 
		sluttDato : new Date(firstDayOfWeek.getFullYear(), firstDayOfWeek.getMonth(), firstDayOfWeek.getDate() + 6) 
		}; 
}

function mapTilArray(map) {
	var array = [];
	for (var k in map) {
		array.push(map[k]);
	}
	return array;
}

function mapBryggPaaBrukernavn(bryggArray) {
	var map = {};
	for (var i = 0; i < bryggArray.length; i++) {
		var brygg = bryggArray[i];
		addBrygg(brygg, map);
		// for (var j = 0; j < brygg.karakterer.length; j++) {
		// 	addPair(map, brygg, brygg.karakterer[j]);
		// }
	}
	return map;
}

function mapifyBrukernavn(brukernavn) {
	return brukernavn.trim().toLowerCase();
}

function addBrygg(brygg, map) {
	var mapifiedBrukernavn = mapifyBrukernavn(brygg.brygger);
	var statistikk = getGjettestatistikk(mapifiedBrukernavn, map);
	statistikk.brukernavn = brygg.brygger;

	map[mapifiedBrukernavn].addBrygg(brygg.karakterer);
	for (var i = 0; i < brygg.karakterer.length; i++) {
		var karakter = brygg.karakterer[i];
		var gjetterBrukernavn = mapifyBrukernavn(karakter.bruker);
		if (gjetterBrukernavn != mapifiedBrukernavn) {
			var erSvarKorrekt = karakter.kaffeid.valueOf() == brygg.kaffeid.valueOf();
			var statistikk2 = getGjettestatistikk(gjetterBrukernavn, map);
			statistikk2.brukernavn = karakter.bruker;
			statistikk2.addSvar(erSvarKorrekt);
			statistikk2.addKarakter(karakter.karakter)
		}
	}

}

function getGjettestatistikk(name, map) {
	if (map[name] == undefined) {
		map[name] = new GjetteStatistikk();
	}
	return map[name];
}

var addPair = function(map, dagensBrygg, karakter) {
	var brukernavn = karakter.bruker;
	if (map[brukernavn] == undefined) {
		map[brukernavn] = new GjetteStatistikk();
		map[brukernavn].setBrukernavn(brukernavn);	
	}
	if (erBrygger(dagensBrygg.brygger, karakter.bruker)) {
		map[brukernavn].addBrygg(dagensBrygg.karakterer);
	} else {
		var korrekt = false;
		if (karakter.kaffeid != null && dagensBrygg.kaffeid != null) {
			korrekt = karakter.kaffeid.valueOf() == dagensBrygg.kaffeid.valueOf();
		}
		map[brukernavn].addSvar(korrekt);
		map[brukernavn].addKarakter(karakter.karakter);
	}
}

function erBrygger(kaffeBrygger, karakterBrygger) {
	if (kaffeBrygger == null || karakterBrygger == null) {
		return false;
	}
	return kaffeBrygger.valueOf() == karakterBrygger.valueOf();
}

var GjetteStatistikk = function() {
	this.brukernavn = null;
	this.antallRiktige = 0;
	this.antallTotalt = 0;
	this.karakterer = [];	//karakterer som man gir
	this.antallBrygg = 0;
	this.bryggKarakterer = [];	//karakterer man får
	this.addBrygg = function(karakterArray) {
		this.antallBrygg++;
		for (var i = 0; i < karakterArray.length; i++) {
			this.bryggKarakterer.push(karakterArray[i].karakter);
		}
	}
	this.addSvar = function(korrekt) {
		if (korrekt) {
			this.antallRiktige++;
		}
		this.antallTotalt++;
	}
	this.addKarakter = function(karakterVerdi) {
		this.karakterer.push(karakterVerdi);
	}
	this.calcAverageKarakter = function() {
		var sum = 0;
		for (var i = 0; i < this.karakterer.length; i++) {
			sum += parseInt(this.karakterer[i]);
		}
		var average = sum / this.karakterer.length;
		return Math.round(average * 100) / 100;
	}
	this.calcProsent = function() {
		return Math.round((this.antallRiktige / this.antallTotalt) * 100);
	}
	this.print = function() {
		console.log('antallRiktige: ' + this.antallRiktige + ', antallTotalt: ' + this.antallTotalt + ', karakterer: ' + this.karakterer);
	}
	this.calcAverageBryggKarakter = function() {
		var sum = 0;
		for (var i = 0; i < this.bryggKarakterer.length; i++) {
			sum += parseInt(this.bryggKarakterer[i]);
		}
		var average = sum / this.bryggKarakterer.length;
		return Math.round(average * 100) / 100;
	}
}

function sorterPaaAntallRiktige(a, b) {
	return b.antallRiktige - a.antallRiktige;
}