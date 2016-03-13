/* Pirca Plugin
 * @author: Pablo Cazorla
 * @e-mail: pablo.cazorla@huddle.com.ar
 * @date: 22/08/2012
 */
var Pirca = (function($) {
	"use strict";
	return function(selection, options) {
		var config = $.extend({
				classElements: 'box',
				width: 100
			}, options),
			$grid = (function() {
				var g = $(selection).eq(0);
				if (g.css('position') === 'static') {
					g.css('position', 'relative');
				}
				return g;
			})(),
			$boxes = $grid.find('>.' + config.classElements).css('position', 'absolute'),
			len = 0,
			segments,
			gridHeight = 0,

			getOrderedSegments = function() {
				var arr = segments.slice(0);
				arr.sort(function(a, b) {
					if (a[1] < b[1]) {
						return -1;
					} else if (a[1] > b[1]) {
						return 1;
					} else {
						if (a[0] < b[0]) {
							return -1;
						} else if (a[0] > b[0]) {
							return 1;
						}
					}
				});
				return arr;
			},
			setBoxPosition = function($this) {
				var segs = Math.ceil($this.width() / config.width),
					h = $this.outerHeight();

				var segmentsOrdered = getOrderedSegments();

				for (var i = 0; i < len; i++) {
					var current = segmentsOrdered[i];
					var index = current[0];
					var x = current[0] * config.width;
					var y = current[1];
					//
					var success = true,
						segmentsToUpdate = [];
					segmentsToUpdate.push(current);
					var parar = 2;

					for (var j = 1; j < segs; j++) {
						if ((index + j) < len) {
							var next = segments[index + j];
							if (next[1] <= y) {
								segmentsToUpdate.push(next);
							} else {
								success = false;
							}
						} else {
							success = false;
						}
					}

					if(!success){
						

						var left = segs - segmentsToUpdate.length;

						for(var m = 1;m<=left;m++){
							var busco = 'yes';							
							if ((index - m) >= 0) {
								var next = segments[index - m];
								if (next[1] <= y) {
									segmentsToUpdate.push(next);
									var x = next[0] * config.width;
								}
							}
						}
						if(segmentsToUpdate.length>=segs){
							success = true;
						}




						
					}






					var parar = 2;
					if (success) {
						
						$this.css({
							'top': y + 'px',
							'left': x + 'px'
						});

						var lastY = y + h;

						if (lastY > gridHeight) {
							gridHeight = lastY;
							$grid.height(gridHeight);
						}

						var lenToUpdate = segmentsToUpdate.length;
						for (var k = 0; k < lenToUpdate; k++) {
							var indexToUpdate = segmentsToUpdate[k][0];
							segments[indexToUpdate][1] = lastY;
						}
						i = 9999999;
					}
				}
			},
			render = function() {
				
				segments = (function() {
					var arr = [];
					len = Math.floor($grid.width() / config.width);
					for (var i = 0; i < len; i++) {
						arr.push([i, 0]);
					}
					return arr;
				})();

				


				$boxes.each(function() {
					setBoxPosition($(this));
				});

				



			};
		//
		render();
		//

		var timer = null

		$(window).resize(function() {
			if (timer != null) {
				clearTimeout(timer);
			}
			timer = setTimeout(function() {
				render();
			}, 300);
		});



		return {
			render: render,
			append:function($box){
				$grid.append($box.css('position', 'absolute'));
				$boxes = $grid.find('>.' + config.classElements);
				setBoxPosition($box);
			},
			prepend:function($box){
				$grid.prepend($box.css('position', 'absolute'));
				$boxes = $grid.find('>.' + config.classElements);
				render();
			},
			quit:function($box){
				$grid.find($box).remove();
				$boxes = $grid.find('>.' + config.classElements);
				render();
			}
		};
	};
})(jQuery);