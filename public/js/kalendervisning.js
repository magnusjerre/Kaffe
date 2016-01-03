$(document).ready(function(){
	
	$('#navkalendervisning').css('background-color', 'saddlebrown');
	$('#navkalendervisning').css('color', 'sandybrown');
	
	var array = null;
	
	$.get('/kalenderelement', function(data, textStatus, jqXHR){
		array = data.dagensbrygg;
	});
			
	$('p').click(function(){
		console.log("clicked p#" + $(this).attr("id"));
		var clicked = $(this).attr("id");
		if (array) {
			setBrygg(array[clicked]);
			setKarakterer(array[clicked].karakterer);
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
	$('#karakterelement').remove();
	for (var i = 0; i < karakterer.length; i++) {
		var karakter = karakterer[i];
		var copy = $('#karakterermal').clone();
		copy.attr('id', 'karakterelement');
		copy.removeClass('hidden');
		copy.find('p').each(function(){
			var id = $(this).attr('id');
			if (id == 'kaffe') {
				$(this).text(karakter.gjetting);
			} else if (id == 'bruker') {
				$(this).text(karakter.bruker_navn);
			} else if (id == 'karakter') {
				$(this).text(karakter.karakter);
			}
		});
		copy.appendTo($('#karakterer'));
	}
}