$(document).ready(function(){
	
	$('input[type="checkbox"]').change(function(){
		var id = $(this).attr('id');
		$.post('/visskjulkaffe', { 'id' : id }, function(data, textStatus, jqXHR){}, 'json');
	});
});