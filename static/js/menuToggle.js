$(document).ready(function(){
	if ($('.nav').css('flex-direction')=='column'){
			$('.nav').hide();

	} else if ($('.nav').css('flex-direction')=='row'){
			$('.nav').show();

	}
})

$(window).on('resize',function(){
	if ($('.nav').css('flex-direction')=='column'){
			$('.nav').hide();

	} else if ($('.nav').css('flex-direction')=='row'){
			$('.nav').show();

	}
	console.log($('.nav').css('flex-direction'));
	
});
$('.toggle-button').on('click',function(){
		$('.nav').slideToggle(300);
});
