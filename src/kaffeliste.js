$(document).ready(function(){
	$('#viskaffe').change(function(){
		var id = $(this).closest('table').prev().html();
		$.post('/visskjulkaffe', { 'id' : id}, function(data, textStatus, jqXHR){}, 'json');
	});
});