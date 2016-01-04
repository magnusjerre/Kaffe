$(document).ready(function(){
	
	var karakter = 0, tempKarakter = 0;
	var clickedKarakter = false;
	var submitKaffe = false;
	
	var resKaffenavn = $('#resultatKaffenavn').text()
	var resBrygger = $('#resultatBrygger').text();
	var resLiter = $('#resultatLiter').text();
	var resSkjeer = $('#resultatSkjeer').text();
	
	hideResultat();
	
	var skjult = true;
	
	$('#gjetteboks').find('#gjettekarakterskala #karakterSkala').each(function(){
		console.log(this);
		fillKarakter(parseFloat($('#gjettekarakter').text()), $(this));
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
	
	$('.beanHalf').hover(
		function() {
			var decimal = ($(this).index() + 1) / 2;
			var n = $(this).parent().index();
			tempKarakter = n + decimal;
			fillKarakter(tempKarakter, $('#karakterSkalaInput'));
		},
		function() {
			if (!clickedKarakter) {
				$(this).parent().parent().children().each(function(){
					$(this).children().removeClass('beanSelected');
				});
				tempKarakter = 0;
			} else {
				fillKarakter(karakter, $('#karakterSkalaInput'));
			}
		}
	);
	
	$('.beanHalf').click(function(){
		clickedKarakter = true;
		karakter = tempKarakter;
		$('#karakter').val(karakter);
	});
	
	$('#submit').click(function(){
		if (submitKaffe) {
			var label = $('#nyDagenskaffeForm #kaffeId option:selected').text();
			$('#nyDagenskaffeForm > #kaffeNavn').val(label);
			$('#submitNyDagenskaffe').trigger("click");
		} else {
			var label = $('#nyKarakterForm #kaffeId option:selected').text();
			$('#nyKarakterForm > #kaffeNavn').val(label);
			$('#submitKarakter').trigger("click");
		}
	});
	
	$('#brygger').keyup(function(){
		submitKaffe = true;
	});
	
	$('#bruker_navn').keyup(function(){
		submitKaffe = false;
	});
	
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

function fillKarakter(karakterVerdi, karakterSkala) {
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
		halfBeanAtKarakter(karakterVerdi, karakterSkala).addClass('beanSelected');
	}
}

function halfBeanAtKarakter(karakter, karakterSkala) {
	var temp = 0.5;
	var halfBean = null;
	karakterSkala.children().each(function(){
	// $('#karakterSkalaInput').children().each(function(){
		$(this).children().each(function(){
			if (karakter == temp) {
				halfBean = $(this);
			}
			temp += 0.5;
		});
	});
	
	return halfBean;
}

function hidePopup() {
	$('#gjetteboks').hide();
}
