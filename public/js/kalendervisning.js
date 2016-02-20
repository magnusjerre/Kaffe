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
				navClone.insertBefore(bryggnav);
				navClone.click(function(){
					var pos = parseInt($(this).attr('bind-pos'));
                    $(this).siblings().removeClass('valgtKaffe').addClass('ikkevalgtKaffe');
                    $(this).addClass('valgtKaffe');
					fyllBrygghistorikkMedBrygg(clone, selectedDagsbrygg[pos], brygghistorikkmal);
				});
			}
		}
		bryggnav.remove();
        clone.find('div[name="bryggNav"]').children().first().addClass('valgtKaffe');
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
		brygginfoDiv.find('p[name="skjeer"]').text(brygg.skjeer);
		var snittkarakter = 0;
		for (var i = 0; i < brygg.karakterer.length; i++) {
			snittkarakter += parseInt(brygg.karakterer[i].karakter);
		}
		console.log("snittkaraktersum: " + snittkarakter + ", antallKarakterer: " + brygg.karakterer.length);
		snittkarakter /= brygg.karakterer.length;
		console.log("snittkarakter: " + snittkarakter);
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
				clone.find('span[name="kommentar"]').parent().remove();
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