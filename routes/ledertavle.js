var kaffedb = null;
exports.setKaffedb = function(db) {
	kaffedb = db;
}

var ledertavle = function(req, res) {
	var dager = getDenneUken();
	var tittel = 'Denne uken';
	if (req.query.periode) {
		if (req.query.periode.valueOf() == 'måned'.valueOf()) {
			dager = getDenneManeden();
			tittel = 'Denne måneden';
		} else if (req.query.periode.valueOf() == 'evigheten'.valueOf()) {
			dager = getEvigheten();
			tittel = 'Evigheten';
		}
	}
	
	getLedertavleForPeriode(dager.startDato, dager.sluttDato, function(ledertavle) {
		var model = { 'tittel' : tittel, 'ledertavle' : ledertavle };
		res.render('ledertavle', model);
	});
}

exports.ledertavle = ledertavle;

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

function getLedertavleForPeriode(startDato, sluttDato, callback) {
	kaffedb.getDagensKafferForPeriode(startDato, sluttDato, function(error, docs){
		if (error) {
			console.log(error);
			return null;
		}
		
		var ledertavle = mapTilArray(mapDagensKaffePaaBrukernavn(docs)).sort(sorterPaaAntallRiktige);
		callback(ledertavle);
	});
}

function mapTilArray(map) {
	var array = [];
	for (var k in map) {
		array.push(map[k]);
	}
	return array;
}

function mapDagensKaffePaaBrukernavn(docs) {
	var map = {};
	
	for (var i = 0; i < docs.length; i++) {
		var dagensKaffe = docs[i];
		for (var j = 0; j < dagensKaffe.karakterer.length; j++) {
			addPair(map, dagensKaffe.kaffeId, dagensKaffe.karakterer[j]);
		}
	}
	return map;
}

var addPair = function(map, korrektSvar, karakter) {
	var brukernavn = karakter.bruker_navn;
	if (map[brukernavn] == undefined) {
		map[brukernavn] = new GjetteStatistikk();	
	}
	var korrekt = false;
	if (karakter.kaffeId != null && korrektSvar != null) {
		korrekt = karakter.kaffeId.valueOf() == korrektSvar.valueOf();
	}
	map[brukernavn].setBrukernavn(brukernavn);
	map[brukernavn].addSvar(korrekt);
	map[brukernavn].addKarakter(karakter.karakter);
}

var GjetteStatistikk = function() {
	this.brukernavn = null;
	this.antallRiktige = 0;
	this.antallTotalt = 0;
	this.karakterer = [];
	this.setBrukernavn = function(brukernavn) {
		this.brukernavn = brukernavn;
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
		return Math.round((this.antallRiktige / this.antallTotalt) * 100) / 100;
	}
	this.print = function() {
		console.log('antallRiktige: ' + this.antallRiktige + ', antallTotalt: ' + this.antallTotalt + ', karakterer: ' + this.karakterer);
	}
}

function sorterPaaAntallRiktige(a, b) {
	return b.antallRiktige - a.antallRiktige;
}