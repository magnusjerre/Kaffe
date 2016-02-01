var karakterskalaElementer = [];

// Helper methods for karakterskala array
function getKSElementForKarakterskala(karakterskalaDiv) {
	for (var i = 0; i < karakterskalaElementer.length; i++) {
		console.log(karakterskalaElementer[i].signatur == createIdentifier(karakterskalaDiv));
		console.log(karakterskalaElementer[i].signatur);
		console.log(createIdentifier(karakterskalaDiv))
		if (karakterskalaElementer[i].signatur === createIdentifier(karakterskalaDiv)) {
			return karakterskalaElementer[i];
		}
	}
	return undefined;
}

function addKSElement(karakterskalaDiv) {
	var existingKSElement = getKSElementForKarakterskala(karakterskalaDiv);
	if (existingKSElement == undefined) {
		var ksElement = createKSElement(karakterskalaDiv);
		karakterskalaElementer.push(ksElement);
	}
}

function createKSElement(karakterskalaDiv) {
	return {
		karakterskala : karakterskalaDiv,
		signatur : createIdentifier(karakterskalaDiv),
		karakter : 0,
		clicked : false
	};
}


function createIdentifier(karakterskalaDiv) {
	var identifier = "";
	var current = karakterskalaDiv;
	while (current.parent().prop("tagName") != "HTML") {
		identifier += current.parent().index();
		current = current.parent();
	}
	return identifier;
}

// End of helper methods

function bindClick(halfBean) {
	addKSElement(halfBean.parent());
	halfBean.click(karakterskalaClick);
}

function karakterskalaClick() {
	var clickedKarakter = calcKarakterFromHalfBean($(this));
	var ksElement = getKSElementForKarakterskala($(this).parent());
	ksElement.karakter = clickedKarakter;
	ksElement.clicked = true;
	fillKarakterskalaMedKarakter(clickedKarakter, $(this).parent());
}

function calcKarakterFromHalfBean(halfBean) {
	return (halfBean.index() + 1) * (5 / 10);
}

function bindHover(halfBean) {
	addKSElement(halfBean.parent());
	halfBean.hover(karakterskalaHoverIn, karakterskalaHoverOut);
}

function karakterskalaHoverIn() {
	var hoverKarakter = calcKarakterFromHalfBean($(this));
	fillKarakterskalaMedKarakter(hoverKarakter, $(this).parent()); 
}
	
function karakterskalaHoverOut() {
	var karakterskalaDiv = $(this).parent();
	var ksElement = getKSElementForKarakterskala($(this).parent());
	if (ksElement.clicked) {
		fillKarakterskalaMedKarakter(ksElement.karakter, karakterskalaDiv);
	} else {
		clearKarakterskala(karakterskalaDiv);
	}
}
	
function fillKarakterskalaMedKarakter(karakter, karakterskalaDiv) {
	clearKarakterskala(karakterskalaDiv);
	
	var temp = 0.5;
	karakterskalaDiv.find('.beanHalf').each(function(){
		if (temp <= karakter) {
			$(this).addClass('beanSelected');
		}
		temp += 0.5;
	});
}

function clearKarakterskala(karakterskalaDiv) {
	karakterskalaDiv.find('.beanHalf').each(function(){
		$(this).removeClass('beanSelected');
	});
}