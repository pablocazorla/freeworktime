var FWT = (function($) {
	"use strict";
	var fwt = {};

	fwt.init = function() {
		for (var a in fwt) {
			if (typeof fwt[a].init !== 'undefined') {
				fwt[a].init();
			}
		}
	};

	fwt.get = function(key, callback) {
		$.ajax({
			type: 'GET',
			url: 'mocks/' + key + '.json',
			dataType: 'json',
			success: callback
		});
	};
	fwt.post = function(parameters, callback) {
		var cbk = callback || function(){};
		$.ajax({
			type: 'POST',
			url: 'mocks/post.json',
			dataType: 'json',
			success: function(){
				console.log(parameters);
				cbk();
			}
		});
	};



	return fwt;
})(jQuery);