$(document).ready(function(){
	
	$('#navkalendervisning').css('background-color', 'saddlebrown');
	$('#navkalendervisning').css('color', 'sandybrown');
	
	var array = null;
	hidePopup();
	
	$('#closepopup').click(function(){
		hidePopup();
	});
	
	$.get('/kalenderelement', {year : parseInt($('#yearP').text()), month : parseInt($('#monthP').text())}, function(data, textStatus, jqXHR){
		var year = parseInt($('#yearP').text());
		var month = parseInt($('#monthP').text());
		console.log('year: ' + year);
		console.log('month: ' + month);
		array = data.dagensbrygg;
	});
			
	$('p').click(function(){
		console.log("clicked p#" + $(this).attr("id"));
		var clicked = $(this).attr("id");
		if (array) {
			setBrygg(array[clicked]);
			setKarakterer(array[clicked].karakterer);
			showPopup();
		}
	});
	
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

function setBrygg(brygg) {
	$('#kaffenavn').html(brygg.kaffe_navn);
	$('#kaffeliter').html(brygg.liter);
	$('#kaffeskjeer').html(brygg.skjeer);
	$('#kaffemaker').html(brygg.brygger);
}

function setKarakterer(karakterer) {
	console.log("karakterer");
	console.log($('#karakterer').children('#karakterelement'));
	$('#karakterer').children('#karakterelement').remove();
	for (var i = 0; i < karakterer.length; i++) {
		var karakter = karakterer[i];
		var copy = $('#karakterermal').clone();
		copy.attr('id', 'karakterelement');
		copy.removeClass('hidden');
		copy.find('p').each(function(){
			var id = $(this).attr('id');
			console.log('id: ' + id);
			if (id == 'kaffe') {
				$(this).text(karakter.gjetting);
			} else if (id == 'bruker') {
				$(this).text(karakter.bruker_navn);
			// } else if (id == 'karakterSkala') {
			// 	// $(this).text(karakter.karakter);
			// 	console.log("heheh");
			// 	fillKarakterKalender(karakter.karakter, $(this));
			}
		});
		copy.find('#karakterSkala').each(function(){
			console.log("heheh");
			fillKarakterKalender(karakter.karakter, $(this));
		});
		$('#karakterer').append(copy);
	}
}

function hidePopup() {
	$('#dagenskaffeboks').hide();
}

function showPopup() {
	$('#dagenskaffeboks').show();
}

function fillKarakterKalender(karakterVerdi, karakterSkala) {
	// var karakterSkala = $('#karakterSkala');
	karakterSkala.children().each(function(){
		$(this).children().removeClass('beanSelected');
	});
	
	var numberOfBeans = Math.floor(karakterVerdi);
	var beans = karakterSkala.children(':lt(' + numberOfBeans + ')');
	beans.each(function(){
		$(this).children().each(function(){
			$(this).addClass('beanSelected');
		});
	});
	if (numberOfBeans <= karakterVerdi) {	//Legge til den siste halve bønnen
		halfBeanAtKarakterKalender(karakterVerdi, karakterSkala).addClass('beanSelected');
	}
}

function halfBeanAtKarakterKalender(karakter, karakterSkala) {
	var temp = 0.5;
	var halfBean = null;
	karakterSkala.children().each(function(){
		$(this).children().each(function(){
			if (karakter == temp) {
				halfBean = $(this);
			}
			temp += 0.5;
		});
	});
	
	return halfBean;
}