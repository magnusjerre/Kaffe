$(document).ready(function(){
	
	//var karakter = 0, tempKarakter = 0;
	//var clickedKarakter = false;
	var submitKaffe = false;
	var clickedKarakterskala = [];
	
	var resKaffenavn = $('#resultatKaffenavn').text()
	var resBrygger = $('#resultatBrygger').text();
	var resLiter = $('#resultatLiter').text();
	var resSkjeer = $('#resultatSkjeer').text();
	
	hideResultat();
	
	var skjult = true;
	
	
	$('div[name=bryggliste]').children().each(function(){
		console.log($(this));
		bindToBryggContainer($(this).index(), $(this));
	});
	
	function bindToBryggContainer(index, container) {
		container.find('a.v2registrerNavElement').click(function(){clickNavElement($(this));});
		clickedKarakterskala.push({
			clicked: false,
			karakter: 0,
			tempKarakter: 0
		});
		console.log("index: " + index + ", clicked..length: " + clickedKarakterskala.length);
		bindKarakterSkalaHover(container.find('div.karakterSkala'));
		bindKarakterClick(index, container.find('div.karakterSkala'));

	}
	
	$('#ekstrabrygg').click(function(){
		var mal = $('div[name=bryggcontainermal]').children().first();
		console.log(mal);
		var nyContainer = mal.clone();
		nyContainer.appendTo($('div[name=bryggliste]'));
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
	/*
	$('a.v2registrerNavElement').click(function(){
		var clicked = $(this);
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
	});*/
	
	$('form#nyDagenskaffeForm > select#kaffeId').change(function(){
		$(this).addClass('black');
	});
	
	$('form#nyKarakterForm > select#kaffeId').change(function(){
		$(this).addClass('black');
	});
	
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
	
	function bindKarakterSkalaHover(karakterDiv) {
		var beanHalfs = karakterDiv.find('.beanHalf');
		var ksElement = clickedKarakterskala[karakterDiv.parent().parent().parent().index()];
		beanHalfs.hover(
			function() {
				var decimal = ($(this).index() + 1) / 2;
				var n = $(this).parent().index();
				ksElement.tempKarakter = n + decimal;
				var rootDiv = $(this).parent().parent();
				fillKarakter(ksElement.tempKarakter, karakterDiv);
			},
			function() {
				if (!ksElement.clicked) {
					$(this).parent().parent().children().each(function(){
						$(this).children().removeClass('beanSelected');
					});
					ksElement.tempKarakter = 0;
				} else {
					var rootDiv = $(this).parent().parent();
					fillKarakter(ksElement.karakter, karakterDiv);
				}
			}
		);
	}
	/*
	$('.beanHalf').hover(
		function() {
			var decimal = ($(this).index() + 1) / 2;
			var n = $(this).parent().index();
			tempKarakter = n + decimal;
			var rootDiv = $(this).parent().parent();
			fillKarakter(tempKarakter, rootDiv);
		},
		function() {
			if (!clickedKarakter) {
				$(this).parent().parent().children().each(function(){
					$(this).children().removeClass('beanSelected');
				});
				tempKarakter = 0;
			} else {
				var rootDiv = $(this).parent().parent();
				fillKarakter(karakter, rootDiv);
			}
		}
	);*/
	
	function bindKarakterClick(childNumber, karakterSkala) {
		var beanHalfs = karakterSkala.find('.beanHalf');
		console.log("karakterSkala");
		console.log(karakterSkala.parent().parent().parent());
		var ksElement = clickedKarakterskala[karakterSkala.parent().parent().parent().index()];
		ksElement.clicked = true;
		$('#karakter').val(ksElement.karakter);
	}
	/*
	$('.beanHalf').click(function(){
		clickedKarakter = true;
		karakter = tempKarakter;
		$('#karakter').val(karakter);
	});*/
	/*
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
	});*/
	/*
	$('#brygger').keyup(function(){
		submitKaffe = true;
	});
	
	$('#bruker_navn').keyup(function(){
		submitKaffe = false;
	});*/
	
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
