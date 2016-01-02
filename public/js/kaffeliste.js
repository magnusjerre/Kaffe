$(document).ready(function(){
	
	$('#navkaffeliste').css('background-color', 'saddlebrown');
	$('#navkaffeliste').css('color', 'sandybrown');
	
	$('input[type="checkbox"]').change(function(){
		var id = $(this).attr('id');
		$.post('/visskjulkaffe', { 'id' : id }, function(data, textStatus, jqXHR){}, 'json');
	});
});