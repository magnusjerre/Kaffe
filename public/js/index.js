$(document).ready(function(){
	
	var resKaffenavn = $('#resultatKaffenavn').text()
	var resBrygger = $('#resultatBrygger').text();
	var resLiter = $('#resultatLiter').text();
	var resSkjeer = $('#resultatSkjeer').text();
	
	hideResultat();
	
	var skjult = true;
	
	
	$('div[name=bryggliste]').children().each(function(){
		bindToBryggContainer($(this));
	});
	
	function bindToBryggContainer(container) {
		container.find('a.v2registrerNavElement').click(function(){clickNavElement($(this));});
		container.find('div.karakterSkala').children().each(function(){
			bindHover($(this));
			bindClick($(this));
		});
	}
	
	$('#ekstrabrygg').click(function(){
		var mal = $('div[name=bryggcontainermal]').children().first();
		var nyContainer = mal.clone();
		nyContainer.addClass('hidden');
		nyContainer.appendTo($('div[name=bryggliste]'));
		nyContainer.slideDown();
		bindToBryggContainer(nyContainer);
	});
	
	function clickNavElement(clicked) {
		clicked.removeClass('v2registrerNavValgt v2registrerNavIkkeValgt');
		clicked.addClass('v2registrerNavValgt');
		var otherNavElement = clicked.siblings().first();
		otherNavElement.removeClass('v2registrerNavValgt v2registrerNavIkkeValgt');
		otherNavElement.addClass('v2registrerNavIkkeValgt');
		var clickedName = clicked.text();
		var otherNavElementName = otherNavElement.text();
		clicked.parent().siblings('div[name="' + otherNavElementName + '"]').slideUp(function(){
			clicked.parent().siblings('div[name="' + clickedName + '"]').slideDown();
		});
	}
	
	$('form#nyDagenskaffeForm > select#kaffeId').change(function(){
		$(this).addClass('black');
	});
	
	$('form#nyKarakterForm > select#kaffeId').change(function(){
		$(this).addClass('black');
	});
	
	$('#gjetteboks').find('#gjettekarakterskala #karakterSkala').each(function(){
		fillKarakterskalaMedKarakter(parseFloat($('#gjettekarakter').text()), $(this));
	});
	
	$('#closepopup').click(function(){
		hidePopup();
	});
	
	$('#resultatKaffenavn, #resultatBrygger, #resultatLiter, #resultatSkjeer').click(function(){
		if (skjult) {
			skjult = false;
			showResultat();
		} else {
			skjult = true;
			hideResultat();
		}
	});
	
	$('#navhome').css('background-color', 'saddlebrown');
	$('#navhome').css('color', 'sandybrown');
	
	function showResultat() {
		$('#resultatKaffenavn').text(resKaffenavn);
		$('#resultatBrygger').text(resBrygger);
		$('#resultatLiter').text(resLiter);
		$('#resultatSkjeer').text(resSkjeer);
	}
	
	function hideResultat() {
		$('#resultatKaffenavn').text('Skjult');
		$('#resultatBrygger').text('Skjult');
		$('#resultatLiter').text('Skjult');
		$('#resultatSkjeer').text('Skjult');
	}
	
});

function hidePopup() {
	$('#gjetteboks').hide();
}
