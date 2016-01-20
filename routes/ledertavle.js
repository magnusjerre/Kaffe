var kaffedb = null;
exports.setKaffedb = function(db) {
	kaffedb = db;
}

var ledertavle = function(req, res) {
	getLedertavleForPeriode(new Date(2016, 0, 1), new Date(2016, 0, 20));
	res.render('ledertavle');
}

exports.ledertavle = ledertavle;

function getLedertavleForPeriode(startDato, sluttDato) {
	console.log("hallo");
	kaffedb.getDagensKafferForPeriode(startDato, sluttDato, function(error, docs){
		if (error) {
			console.log(error);
			return null;
		}
		console.log("ledertavle");
		var ledertavle = mapDagensKaffePaaNavn(docs);
		var a = "hei";
	});
}

function mapDagensKaffePaaNavn(docs) {
	var map = {};
	
	for (var i = 0; i < docs.length; i++) {
		var dagensKaffe = docs[i];
		for (var j = 0; j < dagensKaffe.karkaterer.length; j++) {
			console.log("dagensKaffe: " + dagensKaffe);
			console.log("karakterer: " + dagensKaffe.karakterer);
			addPair(map, dagensKaffe.kaffeId, dagensKaffe.karakterer[j]);
		}
	}
	return map;
}

var addPair = function(map, korrektSvar, karakter) {
	console.log("addPair: map[" + (karakter.brukernavn) + "]");
	if (map[karakter.brukernavn] == undefined) {
		map[karakter.brukernavn] = new GjetteStatistikk();	
	}
	var korrektSvar = false;
	if (karakter.kaffeId != null && korrektSvar != null) {
		korrektSvar = karakter.kafffeId.valueOf() == korrektSvar.valueOf();
	}
	map[karakter.brukernavn].addSvar(korrektSvar);
	map[karakter.brukernavn].addKarakter(karakter.karakter);
	map[karkater.brukernavn].print();
}

var GjetteStatistikk = function() {
	this.antallRiktige = 0;
	this.antallTotalt = 0;
	this.karakterer = [];
	this.addSvar = function(korrekt) {
		if (korrekt) {
			this.antallRiktige++;
		}
		this.antallTotalt++;
	}
	this.addKarakter = function(karakterVerdi) {
		this.karakterer.push(karakterVerdi);
	}
	this.print = function() {
		console.log('antallRiktige: ' + this.antallRiktige + ', antallTotalt: ' + this.antallTotalt + ', karakterer: ' + this.karakterer);
	}
}