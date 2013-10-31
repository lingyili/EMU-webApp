'use strict';

angular.module('emulvcApp')
	.directive('drawcrosshairs', function() {
		return {
			restrict: 'A',
			link: function postLink(scope, element) {
				var canvas = element[0];

				// on mouse move
				element.bind('mousemove', function(event) {
					drawCrossHairs(scope.vs, canvas, scope.config, scope.dhs, event);
				});

				function drawCrossHairs(viewState, canvas, config, dhs, mouseEvt) {
					var ctx = canvas.getContext('2d');
					ctx.clearRect(0, 0, canvas.width, canvas.height);
					ctx.strokeStyle = config.vals.colors.crossHairsColor;
					ctx.fillStyle = config.vals.colors.crossHairsColor;

					// draw lines
					var mouseX = dhs.getX(mouseEvt);
					var mouseY = dhs.getY(mouseEvt);

					ctx.beginPath();
					ctx.moveTo(0, mouseY);
					ctx.lineTo(5, mouseY + 5);
					ctx.moveTo(0, mouseY);
					ctx.lineTo(canvas.width, mouseY);
					ctx.lineTo(canvas.width - 5, mouseY + 5);
					ctx.moveTo(mouseX, 0);
					ctx.lineTo(mouseX, canvas.height);
					ctx.stroke();
					// draw frequency / sample / time
					ctx.font = (config.vals.colors.fontPxSize + 'px' + ' ' + config.vals.colors.fontType);

					var mouseFreq = viewState.round(viewState.spectroSettings.rangeTo - mouseY / canvas.height * viewState.spectroSettings.rangeTo, 2);

					var tW = ctx.measureText(mouseFreq + ' Hz').width;

					ctx.fillText(mouseFreq + ' Hz', 5, mouseY + config.vals.colors.fontPxSize);
					ctx.fillText(mouseFreq + ' Hz', canvas.width - 5 - tW, mouseY + config.vals.colors.fontPxSize);

					ctx.fillText('Sample', mouseX + 5, config.vals.colors.fontPxSize);
					ctx.fillText('secs', mouseX + 5, config.vals.colors.fontPxSize * 2);
				}

			}
		};
	});