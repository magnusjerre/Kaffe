$(document).ready(function(){
	
	$('.karakterer').slideUp();
	$('.karakterikon').rotate(90);
	
	$('.karakterikon').on('click', function(){
		if ($(this).getRotateAngle() == 90) {
			$(this).rotate(
				{
					angle: 90,
					animateTo: 0			
			});
			$(this).siblings('.karakterer').slideDown();
		} else {
			$(this).rotate(
				{
					angle: 0,
					animateTo: 90			
			});
			$(this).siblings('.karakterer').slideUp();
		}
	});
});