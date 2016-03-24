jQuery('document').ready(function() {
	var $ = jQuery;
	FWT.init();
	var $body = $('body');
	$('.toggle-menu-trigger').click(function(e) {
		e.preventDefault();
		$body.toggleClass('hidden-sidebar');
	});
	$('.scroller').niceScroll({
		cursorcolor: "#BBB", // change cursor color in hex
		cursoropacitymin: 0,
		cursoropacitymax: .8,
		cursorborder: "",
		zindex: 300,
		//autohidemode:'leave',
		cursorfixedheight: 80,
		background: "rgba(255,255,255,.5)",
		horizrailenabled: false
	});
	$('body').niceScroll({
		cursorcolor: "rgba(255,255,255,.5)", // change cursor color in hex
		cursoropacitymin: 0,
		cursoropacitymax: .8,
		cursorborder: "",
		zindex: 300,
		//autohidemode:'leave',
		cursorfixedheight: 80,
		background: "rgba(0,0,0,.5)",
		horizrailenabled: false
	});
});