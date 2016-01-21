$(document).ready(function(){
	
	$('#navLedertavle').css('background-color', 'saddlebrown');
	$('#navLedertavle').css('color', 'sandybrown');
	
	if ($('#tittel').text().valueOf() == 'Denne uken'.valueOf()) {
		$('#navUke').css('background-color', 'saddlebrown');
		$('#navUke').css('color', 'sandybrown');
	} else if ($('#tittel').text().valueOf() == 'Denne måneden'.valueOf()) {
		$('#navManed').css('background-color', 'saddlebrown');
		$('#navManed').css('color', 'sandybrown');
	} else if ($('#tittel').text().valueOf() == 'Evigheten'.valueOf()) {
		$('#navEvigheten').css('background-color', 'saddlebrown');
		$('#navEvigheten').css('color', 'sandybrown');
	} else {
		$('#navBrygg').css('background-color', 'saddlebrown');
		$('#navBrygg').css('color', 'sandybrown');
	}
	
});