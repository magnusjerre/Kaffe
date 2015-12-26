$(document).ready(function(){
    $('#lukkgjettriktig').click(function(){
        console.log("hallo");
        $('#gjetteresultat').hide();
    });
	
	$('#submitNyDagenskaffe').click(function(){
		var label = $('#nyDagenskaffeForm > #kaffeId option:selected').text();
		$('#nyDagenskaffeForm > #kaffeNavn').val(label);
	});
	
	$('#submitNyKarakter').click(function(){
		var label = $('#nyKarakterForm > #kaffeId option:selected').text();
		$('#nyKarakterForm > #kaffeNavn').val(label);
	});
});