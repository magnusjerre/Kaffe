$(document).ready(function(){
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
});

function setBrygg(brygg) {
	$('#kaffenavn').html(brygg.kaffe_navn);
	$('#kaffeliter').html(brygg.liter);
	$('#kaffeskjeer').html(brygg.skjeer);
	$('#kaffemaker').html(brygg.brygger);
}

function setKarakterer(karakterer) {
	$('tr#data').remove();
	for (var i = 0; i < karakterer.length; i++) {
			var karakter = karakterer[i];
			var tr = $('<tr id="data"></tr>');
			var tdkarakter = '<td>' + karakter.karakter + '</td>';
			var tdbrukernavn = '<td>' + karakter.bruker_navn + '</td>';
			var tdgjetting = '<td>' + karakter.gjetting + '</td>';
			tr.append(tdkarakter);
			tr.append(tdbrukernavn);
			tr.append(tdgjetting);
			$('#karakterer').append(tr); 
	}
}