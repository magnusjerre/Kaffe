$(document).ready(function(){
	
	// var resKaffenavn = $('#resultatKaffenavn').text()
	// var resBrygger = $('#resultatBrygger').text();
	// var resLiter = $('#resultatLiter').text();
	// var resSkjeer = $('#resultatSkjeer').text();
	var kafferDropdown = [];
	$.get('/hentMuligeKaffer', function(data, textStatus, jqXHR){
		kafferDropdown = data.kaffer;
		var kaffeSelect = $('select');
		for (var i = 0; i < kafferDropdown.length; i++) {
			var kaffe = kafferDropdown[i];
			var visningsNavn = kaffe.produsent + " - " + kaffe.navn + " (" + kaffe.type + ")";
			var option = $('<option></option>').attr("value", kaffe["_id"]).text(visningsNavn);
			kaffeSelect.append(option);
		}
	}, 'json');
	
	var models = [];
	
	function populerNyttDagsBrygg(brygg) {
		var mal = $('div[name=bryggcontainermal]').children().first();
		var nyContainer = mal.clone();
		nyContainer.hide();
		nyContainer.appendTo($('div[name=bryggliste]'));
		console.log(nyContainer);
		populerDagsBrygg(brygg, nyContainer);
		nyContainer.slideDown();
		bindToBryggContainer(nyContainer);
	}
	
	function visDagsbrygg(bryggid, eksisterendeBryggContainer) {
		var brygg = hentBrygg(models, bryggid);
		if (brygg != null) {
			eksisterendeBryggContainer.find('p[name="bryggid"]').text(brygg["_id"]);
			eksisterendeBryggContainer.find('p[name="kaffeid"]').text(brygg.kaffeid);
			eksisterendeBryggContainer.find('p[name="bryggnavn"]').text(brygg.bryggnavn);
			eksisterendeBryggContainer.find('p[name="brygger"]').text(brygg.brygger);
			eksisterendeBryggContainer.find('p[name="sammendrag"]').text(brygg.sammendrag);
			eksisterendeBryggContainer.find('p[name="liter"]').text(brygg.liter);
			eksisterendeBryggContainer.find('p[name="skjeer"]').text(brygg.skjeer);
			eksisterendeBryggContainer.find('p[name="maskin"]').text(brygg.maskin);
		}
	}
	
	function skjulDagsbrygg(bryggid, eksisterendeBryggContainer) {
		var brygg = hentBrygg(models, bryggid);
		eksisterendeBryggContainer.find('p[name="bryggid"]').text(brygg["_id"]);
		eksisterendeBryggContainer.find('p[name="kaffeid"]').text(brygg.kaffeid);
		eksisterendeBryggContainer.find('p[name="bryggnavn"]').text("Skjult");
		eksisterendeBryggContainer.find('p[name="brygger"]').text("Skjult");
		eksisterendeBryggContainer.find('p[name="sammendrag"]').text("Skjult");
		eksisterendeBryggContainer.find('p[name="liter"]').text("Skjult");
		eksisterendeBryggContainer.find('p[name="skjeer"]').text("Skjult");
		eksisterendeBryggContainer.find('p[name="maskin"]').text("Skjult");
	}
	
	function hentBrygg(array, bryggid) {
		for (var i = 0; i < array.length; i++) {
			var brygg = array[i];
			console.log("brygg.bryggid: " + brygg["_id"]);
			console.log("bryggid: " + bryggid);
			if (brygg["_id"] === bryggid) {
				return brygg;
			}
		}
		return null;
	}
	
	function populerDagsBrygg(brygg, bryggcontainer) {		
		var nyttBryggcontainer = bryggcontainer.find('div[name="NyttBrygg"]');
		var eksisterendeBryggContainer = bryggcontainer.find('div[name="EksisterendeBrygg"]');
		
		eksisterendeBryggContainer.find('p[name="bryggnavn"]').click(function(){
			console.log("trykket");
				var bryggid = $(this).parent().siblings('p[name="bryggid"]').text();
				console.log("bryggid: " + bryggid);
				if ($(this).text() === "Skjult") {
					console.log("skjult");
					visDagsbrygg(bryggid, eksisterendeBryggContainer)
				} else {
					console.log("ikke skult");
					skjulDagsbrygg(bryggid, eksisterendeBryggContainer);
				}
			});
		eksisterendeBryggContainer.find('p[name="brygger"]').click(function(){skjulDagsbrygg()});
		eksisterendeBryggContainer.find('p[name="sammendrag"]').click(function(){skjulDagsbrygg()});
		eksisterendeBryggContainer.find('p[name="liter"]').click(function(){skjulDagsbrygg()});
		eksisterendeBryggContainer.find('p[name="skjeer"]').click(function(){skjulDagsbrygg()});
		eksisterendeBryggContainer.find('p[name="maskin"]').click(function(){skjulDagsbrygg()});
		
		eksisterendeBryggContainer.find('p[name="bryggid"]').text(brygg["_id"]);
		eksisterendeBryggContainer.find('p[name="kaffeid"]').text(brygg.kaffeid);
		eksisterendeBryggContainer.find('p[name="bryggnavn"]').text("Skjult");
		eksisterendeBryggContainer.find('p[name="brygger"]').text("Skjult");
		eksisterendeBryggContainer.find('p[name="sammendrag"]').text("Skjult");
		eksisterendeBryggContainer.find('p[name="liter"]').text("Skjult");
		eksisterendeBryggContainer.find('p[name="skjeer"]').text("Skjult");
		eksisterendeBryggContainer.find('p[name="maskin"]').text("Skjult");
		
		
		// eksisterendeBryggContainer.find('p[name="bryggid"]').text(brygg["_id"]);
		// eksisterendeBryggContainer.find('p[name="kaffeid"]').text(brygg.kaffeid);
		// eksisterendeBryggContainer.find('p[name="bryggnavn"]').text(brygg.bryggnavn);
		// eksisterendeBryggContainer.find('p[name="brygger"]').text(brygg.brygger);
		// eksisterendeBryggContainer.find('p[name="sammendrag"]').text(brygg.sammendrag);
		// eksisterendeBryggContainer.find('p[name="liter"]').text(brygg.liter);
		// eksisterendeBryggContainer.find('p[name="skjeer"]').text(brygg.skjeer);
		// eksisterendeBryggContainer.find('p[name="maskin"]').text(brygg.maskin);
		if (brygg.bryggnavn !== 'Ukjent') {
			bryggcontainer.find('p[name="erRegistrert"]').text("true");
			nyttBryggcontainer.slideUp(function(){
				eksisterendeBryggContainer.slideDown();
			});
		} else {
			eksisterendeBryggContainer.slideUp(function(){
				nyttBryggcontainer.slideDown();
			});
		}
	}
	
	$.get('/hentDagsbrygg', function(data, textStatus, jqXHR){
		console.log("data.dagsbrygg.length: " + data.dagsbrygg.length);
		console.log(data);
		for (var i = 0; i < data.dagsbrygg.length; i++) {
			populerNyttDagsBrygg(data.dagsbrygg[i]);
			models.push(data.dagsbrygg[i]);
		}
	}, 'json');
	
	$('div[name=bryggliste]').children().each(function(){
		bindToBryggContainer($(this));
	});
	//Funker nå
	function bindToBryggContainer(container) {
		var registrerNyttBryggForm = container.find('form[action="registrerNyttBrygg"]');
		var registrerKarakterForm = container.find('form[action="registrerKarakter"]');
		
		container.find('a.v2registrerNavElement').click(function(){clickNavElement($(this));});
		container.find('div.karakterSkala').children().each(function(){
			bindHover($(this));
			bindClick($(this));
		});
		registrerNyttBryggForm.find('button').click(registrerBryggClick);
		registrerKarakterForm.find('button').click(registrerKarakterClick);
		var kaffeSelect = container.find('select');
		if (kaffeSelect.children().length == 1) {
			for (var i = 0; i < kafferDropdown.length; i++) {
				var kaffe = kafferDropdown[i];
				var visningsNavn = kaffe.produsent + " - " + kaffe.navn + " (" + kaffe.type + ")";
				var option = $('<option></option>').attr("value", kaffe["_id"]).text(visningsNavn);
				kaffeSelect.append(option);
			}
		}
		registrerNyttBryggForm.find('select').change(function(){
			$(this).addClass('black');
			registrerNyttBryggForm.find('input[name="sammendrag"]').val($(this).children('option:selected').text());
		});
		registrerKarakterForm.find('select').change(function(){
			$(this).addClass('black');
			registrerKarakterForm.find('input[name="sammendrag"]').val($(this).children('option:selected').text());
		});
		container.find('input').each(function(){
			var input = $(this);
			input.on('input', function(){
				validateInput(input);
			});
		});
		container.find('select').each(function(){
			var select = $(this);
			select.on('change', function(){
				validateSelect(select);
			});
		});
	}
	//Funker nå
	$('#ekstrabrygg').click(function(){
		var mal = $('div[name=bryggcontainermal]').children().first();
		var nyContainer = mal.clone();
		nyContainer.hide();
		nyContainer.appendTo($('div[name=bryggliste]'));
		nyContainer.slideDown();
		bindToBryggContainer(nyContainer);
		nyContainer.find('div[name="NyttBrygg"]').show();
	});
	//Funker nå
	function clickNavElement(clicked) {
		clicked.removeClass('v2registrerNavValgt v2registrerNavIkkeValgt');
		clicked.addClass('v2registrerNavValgt');
		var otherNavElement = clicked.siblings().first();
		otherNavElement.removeClass('v2registrerNavValgt v2registrerNavIkkeValgt');
		otherNavElement.addClass('v2registrerNavIkkeValgt');
		var clickedName = clicked.text();
		var bryggcontainer = clicked.parent().parent();
		var eksBryggDiv = bryggcontainer.find('div[name="EksisterendeBrygg"]');
		var nyttBryggDiv = bryggcontainer.find('div[name="NyttBrygg"]');
		var karakterDiv = clicked.parent().siblings('div[name="Karakter"]').first();
		var erRegistrertText = bryggcontainer.find('p[name="erRegistrert"]').text();
		if (clickedName === 'Karakter') {
			if (erRegistrertText === 'true') {
				nyttBryggDiv.hide();
				eksBryggDiv.slideUp(function(){
					karakterDiv.slideDown();
				});
			} else {
				eksBryggDiv.hide();
				nyttBryggDiv.slideUp(function(){
					karakterDiv.slideDown();
				});
			}
		} else {
			if (erRegistrertText === "true") {
				nyttBryggDiv.hide();
				karakterDiv.slideUp(function(){
					eksBryggDiv.slideDown();
				});
			} else {
				eksBryggDiv.hide();
				karakterDiv.slideUp(function(){
					nyttBryggDiv.slideDown();
				});
			}
			
		}
	}
	
	function registrerBryggClick() {
		if (validateForm($(this).parent())) {
			var serializedForm = serializeNyttBrygg($(this).parent());
			
			var container = $(this).parent().parent().parent();
			$.post('/registrerNyttBrygg', serializedForm, function(bryggdata, textStatus, jqXHR){
				populerDagsBrygg(bryggdata, container);
				models.push(bryggdata);
			}, 'json');
		} else {
			alert("Mangler input på felter");
		}
	}
	
	function registrerKarakterClick() {
		if (validateForm($(this).parent())) {
			var serializedForm = serializeKarakter($(this).parent());
			var karakterForm = $(this).parent();
			var bryggcontainer = karakterForm.parent().parent();
			$.post('/registrerKarakter', serializedForm, function(data, textStatus, jqXHR){
				karakterForm.find('input[name="sammendrag"]').val("");
				clearSelect(karakterForm.find('select'));
				karakterForm.find('input[name="bruker"]').val("");
				clearKarakterskalaOgVerdi(karakterForm.find('div.karakterSkala'))
				karakterForm.find('input[name="kommentar"]').val("");
				validateForm(karakterForm);
				if (serializedForm.bryggid === 'ingen') {
					var nyttBryggcontainer = bryggcontainer.find('div[name="NyttBrygg"]');
					var eksisterendeBryggContainer = bryggcontainer.find('div[name="EksisterendeBrygg"]');
					nyttBryggcontainer.find('input[name="bryggid"]').val(data.brygg["_id"]);
					eksisterendeBryggContainer.find('p[name="bryggid"]').text(data.brygg["_id"]);
				} else if (bryggcontainer.find('p[name="erRegistrert"]').text() === 'true') {
					fillGjetteboks(data.gjetting, data.brygg);
				}
			}, 'json');
		} else {
			alert("Mangler input på felter");
		}
	}
	
	function clearSelect(select) {
		select.find('option:selected').attr("selected", false);
		select.children().first().attr("selected", true);
		select.removeClass('black');
	}
	
	function fillGjetteboks(gjetting, brygg) {
		
		var gjetteboksDiv = $('div#gjetteboks');
		var korrektDiv = gjetteboksDiv.find('div#korrektSvar');
		var feilDiv = gjetteboksDiv.find('div#feilSvar');
		if (gjetting.kaffeid === brygg.kaffeid) {
			korrektDiv.find('p[name="korrekt_sammendrag"]').text(brygg.sammendrag);
			korrektDiv.show();
		} else {
			feilDiv.find('p[name="feil_korrekt_sammendrag"]').text(brygg.sammendrag);
			feilDiv.find('p[name="gjettet_sammendrag"]').text(gjetting.sammendrag);
			fillKarakterskalaMedKarakter(gjetting.karakter, feilDiv.find('div.karakterSkala'));
			feilDiv.show();
		}
		gjetteboksDiv.show();
		
		$('#closepopup').click(function(){
			console.log("jfjfj");
			var gjetteboksDiv = $('div#gjetteboks');
			var korrektDiv = gjetteboksDiv.find('div#korrektSvar');
			var feilDiv = gjetteboksDiv.find('div#feilSvar');
			gjetteboksDiv.hide();
			korrektDiv.hide();
			feilDiv.hide();
		});
	}
	
	// $('#resultatKaffenavn, #resultatBrygger, #resultatLiter, #resultatSkjeer').click(function(){
	// 	if (skjult) {
	// 		skjult = false;
	// 		showResultat();
	// 	} else {
	// 		skjult = true;
	// 		hideResultat();
	// 	}
	// });
	
	$('#navhome').css('background-color', 'saddlebrown');
	$('#navhome').css('color', 'sandybrown');
	
	// function showResultat() {
	// 	$('#resultatKaffenavn').text(resKaffenavn);
	// 	$('#resultatBrygger').text(resBrygger);
	// 	$('#resultatLiter').text(resLiter);
	// 	$('#resultatSkjeer').text(resSkjeer);
	// }
	
	// function hideResultat() {
	// 	$('#resultatKaffenavn').text('Skjult');
	// 	$('#resultatBrygger').text('Skjult');
	// 	$('#resultatLiter').text('Skjult');
	// 	$('#resultatSkjeer').text('Skjult');
	// }
	
});

// function hidePopup() {
// 	$('#gjetteboks').hide();
// }

function serializeNyttBrygg(form) {
	return {
		"bryggid" : form.find('input[name="bryggid"]').val(),
		"sammendrag" : form.find('input[name="sammendrag"]').val(),
		"bryggnavn" : form.find('input[name="bryggnavn"]').val(),
		"brygger" : form.find('input[name="brygger"]').val(),
		"kaffeid" : form.find('select option:selected').val(),
		"liter" : form.find('input[name="liter"]').val(),
		"skjeer" : form.find('input[name="skjeer"]').val(),
		"maskin" : form.find('input[name="maskin"]').val()
	}
}

function serializeKarakter(form) {
	return {
		"bryggid" : form.parent().siblings('div[name="EksisterendeBrygg"]').find('p[name="bryggid"]').text(),
		"bruker" : form.find('input[name="bruker"]').val(),
		"kaffeid" : form.find('select option:selected').val(),
		"sammendrag" : form.find('input[name="sammendrag"]').val(),
		"karakter" : form.find('input[name="karakterInput"]').val(),
		"kommentar" : form.find('input[name="kommentar"]').val()
	}
}

function validateForm(form) {
	var isValid = true;
	form.find('input').each(function(){
		if (!validateInput($(this))) {
			isValid = false;
		}	
	});
	form.find('select').each(function(){
		if (!validateSelect($(this))) {
			isValid = false;
		}
	});
	form.find('div.karakterSkala').each(function(){
		if (!validerHarInput($(this))) {
			isValid = false;
		}
	});
	console.log("isValid: " + isValid);
	return isValid;
}

function validateInput(input) {
	if (input.attr('required') === "required") {
		if (input.val() === "") {
			input.siblings('span').removeClass('requiredOkay');
			input.siblings('span').addClass('requiredNotOkay');
			return false;
		} else {
			
			if (input.attr('type') === 'number') {
				var maxN = parseFloat(input.attr('max'));
				var minN = parseFloat(input.attr('min'));
			
				var numberVal = parseFloat(input.val());
				if (numberVal < minN || maxN < numberVal) {
					input.siblings('span').removeClass('requiredOkay');
					input.siblings('span').addClass('requiredNotOkay');
					return false;
				} else {
					input.siblings('span').removeClass('requiredNotOkay');
					input.siblings('span').addClass('requiredOkay');
					return true;
				}
			}
			
			input.siblings('span').removeClass('requiredNotOkay');
			input.siblings('span').addClass('requiredOkay');
			return true;
		}
	}
	return true;
}

function validateSelect(select) {
	var selected = select.find('option:selected').first();
	if (selected.attr('disabled') === 'disabled') {
		select.siblings('span').removeClass('requiredOkay');
		select.siblings('span').addClass('requiredNotOkay');
		return false;
	} else {
		select.siblings('span').removeClass('requiredNotOkay');
		select.siblings('span').addClass('requiredOkay');
		return true;
	}
}
