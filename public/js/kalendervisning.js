$(document).ready(function(){
	
	$('#navkalendervisning').css('background-color', 'saddlebrown');
	$('#navkalendervisning').css('color', 'sandybrown');
	
	var array = null;
	var selectedDagsbrygg = null;
	
	$.get('/kalenderelement', {year : parseInt($('#yearP').text()), month : parseInt($('#monthP').text())}, function(data, textStatus, jqXHR){
		var year = parseInt($('#yearP').text());
		var month = parseInt($('#monthP').text());
		console.log('year: ' + year);
		console.log('month: ' + month);
		array = data.dagensbrygg;
	});
	
	$('div.calendarElement').on('click', function(){
		var clicked = $(this).children('p[name="id"]').attr('id');
		if (array && clicked) {
			lagBrygghistorikk(array[clicked].dagsbrygg);
		}
	});
	
	function lagBrygghistorikk(dagsbrygg) {
		var brygghistorikkmal = $('div[name="brygghistorikkmal"]');
		var clone = brygghistorikkmal.children().first().clone();
		clone.hide();
		clone.find('img[name="closepopup"]').click(function(){
			clone.slideUp(function(){
				clone.remove();
				selectedDagsbrygg = null;
			});
		});
		var bryggnav = clone.find('span[name="selectableBrygg"]').first();
		console.log("length: " + dagsbrygg.length);
		if (dagsbrygg.length > 1) {
			selectedDagsbrygg = dagsbrygg;
			for (var i = 0; i < dagsbrygg.length; i++) {
				var navClone = bryggnav.clone();
				navClone.text(dagsbrygg[i].bryggnavn);
				navClone.attr('bind-pos', i);
				navClone.insertAfter(bryggnav);
				navClone.click(function(){
					var pos = parseInt($(this).attr('bind-pos'));
					fyllBrygghistorikkMedBrygg(clone, selectedDagsbrygg[pos], brygghistorikkmal);
				});
			}
		}
		bryggnav.remove();
		fyllBrygghistorikkMedBrygg(clone, dagsbrygg[0], brygghistorikkmal);
		clone.insertAfter(brygghistorikkmal);
		clone.slideDown();
	}
	
	function fyllBrygghistorikkMedBrygg(brygghistorikk, brygg, brygghistorikkmal) {
		var brygginfoDiv = brygghistorikk.find('div[name="brygginfo"]');
		var karaktererDiv = brygghistorikk.find('div[name="karakterer"]');
		karaktererDiv.children().each(function(){
			$(this).remove();	//Fjern de gamle karakterene
		});
		brygginfoDiv.find('p[name="bryggnavn"]').text(brygg.bryggnavn);
		brygginfoDiv.find('span[name="kaffe"]').text(brygg.sammendrag);
		brygginfoDiv.find('p[name="brygger"]').text(brygg.brygger);
		brygginfoDiv.find('p[name="liter"]').text(brygg.liter);
		brygginfoDiv.find('p[name="skjeer"]').text(brygg.liter);
		var snittkarakter = 0;
		for (var i = 0; i < brygg.karakterer.length; i++) {
			snittkarakter += brygg.karakterer[i].karakter;
		}
		snittkarakter /= brygg.karakterer.length;
		fillKarakterskalaMedKarakter(snittkarakter, brygginfoDiv.find('div.karakterSkala'));
		
		var karakterDiv = brygghistorikkmal.find('div[name="karakter"]');
		for (var i = 0; i < brygg.karakterer.length; i++) {
			var karakter = brygg.karakterer[i];
			var clone = karakterDiv.clone();
			clone.find('p[name="kaffe"]').text(karakter.sammendrag);
			clone.find('span[name="bruker"]').text(karakter.bruker);
			fillKarakterskalaMedKarakter(karakter.karakter, clone.find('div.karakterSkala'));
			if (karakter.kommentar && karakter.kommentar.length > 0) {
				clone.find('span[name="kommentar"]').text(karakter.kommentar);
			} else {
				clone.find('span[name="kommentar"]').remove();
			}
			clone.appendTo(karaktererDiv);
		}
	}
	
	$('#prevMonth').click(function(){
		var year = parseInt($('#yearP').text());
		var month = parseInt($('#monthP').text());
		var newDate = new Date(year, month, 0);
		$('#year').val(newDate.getFullYear());
		$('#month').val(newDate.getMonth());
		console.log($('#year').val());
		console.log($('#month').val());
		$('#submitMonth').trigger('click');
	});
	
	$('#nextMonth').click(function(){
		var year = parseInt($('#yearP').text());
		var month = parseInt($('#monthP').text());
		var newDate = new Date(year, month + 1);
		$('#year').val(newDate.getFullYear());
		$('#month').val(newDate.getMonth());
		$('#submitMonth').trigger('click');
	});
});

// function setBrygg(brygg) {
// 	$('#kaffenavn').html(brygg.kaffe_navn);
// 	$('#kaffeliter').html(brygg.liter);
// 	$('#kaffeskjeer').html(brygg.skjeer);
// 	$('#kaffemaker').html(brygg.brygger);
// }

// function setKarakterer(karakterer) {
// 	console.log("karakterer");
// 	console.log($('#karakterer').children('#karakterelement'));
// 	$('#karakterer').children('#karakterelement').remove();
// 	for (var i = 0; i < karakterer.length; i++) {
// 		var karakter = karakterer[i];
// 		var copy = $('#karakterermal').clone();
// 		copy.attr('id', 'karakterelement');
// 		copy.removeClass('hidden');
// 		copy.find('p').each(function(){
// 			var id = $(this).attr('id');
// 			console.log('id: ' + id);
// 			if (id == 'kaffe') {
// 				$(this).text(karakter.gjetting);
// 			} else if (id == 'bruker') {
// 				$(this).text(karakter.bruker_navn);
// 			// } else if (id == 'karakterSkala') {
// 			// 	// $(this).text(karakter.karakter);
// 			// 	console.log("heheh");
// 			// 	fillKarakterKalender(karakter.karakter, $(this));
// 			}
// 		});
// 		copy.find('#karakterSkala').each(function(){
// 			console.log("heheh");
// 			fillKarakterKalender(karakter.karakter, $(this));
// 		});
// 		$('#karakterer').append(copy);
// 	}
// }

// function hidePopup() {
// 	$('#dagenskaffeboks').hide();
// }

// function showPopup() {
// 	// $('#dagenskaffeboks').show();
// 	$('#bryggHistorikkboks').show();
// }

// function fillKarakterKalender(karakterVerdi, karakterSkala) {
// 	// var karakterSkala = $('#karakterSkala');
// 	karakterSkala.children().each(function(){
// 		$(this).children().removeClass('beanSelected');
// 	});
	
// 	var numberOfBeans = Math.floor(karakterVerdi);
// 	var beans = karakterSkala.children(':lt(' + numberOfBeans + ')');
// 	beans.each(function(){
// 		$(this).children().each(function(){
// 			$(this).addClass('beanSelected');
// 		});
// 	});
// 	if (numberOfBeans <= karakterVerdi) {	//Legge til den siste halve bønnen
// 		halfBeanAtKarakterKalender(karakterVerdi, karakterSkala).addClass('beanSelected');
// 	}
// }

// function halfBeanAtKarakterKalender(karakter, karakterSkala) {
// 	var temp = 0.5;
// 	var halfBean = null;
// 	karakterSkala.children().each(function(){
// 		$(this).children().each(function(){
// 			if (karakter == temp) {
// 				halfBean = $(this);
// 			}
// 			temp += 0.5;
// 		});
// 	});
	
// 	return halfBean;
// }