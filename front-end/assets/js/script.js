requirejs.config({
	baseUrl: 'assets/js',
	paths: {
		jquery: 'jquery',
		mmenu: 'jquery.mmenu.min',
		//slick: 'slick',
		//mousewheel: 'jquery.mousewheel',
		//jscrollpane: 'jquery.jscrollpane.min',
		//list: 'list.min',
		//ripple: 'ripple.min',
	},
	shim: {
		"mmenu": ['jquery'],
		//"slick": ['jquery'],
		//"ripple": ['jquery'],
		//"jscrollpane": ['jquery', 'mousewheel'],
	},
	waitSeconds: 5
});
define(["jquery","mmenu"], function ($) {
	$(document).ready(function ($) {
		/*-------------------------------------
		 </> @author Mehdi Rezaei
		 </> MTabs
		 </> @version 1.0.0
		 </> @version 1.0.1 add defult tab 1
		 </> @version 1.0.2 add defult tab by class
		/*------------------------------------*/
		$('[data-tabindex]').each(function () {
			var index = $(this).attr('data-tabindex');
			$('[data-tabindex="' + index + '"] [data-tabc]').hide();
			$('[data-tabindex="' + index + '"] .tab-title > div').each(function () {
				if ($(this).hasClass('active')) {
					var i = $(this).attr('data-tab');
					$('[data-tabindex="' + index + '"] [data-tabc="' + i + '"]').fadeIn();
					return false;
				} else {
					var i = 1;
					$('[data-tabindex="' + index + '"] [data-tabc="' + i + '"]').fadeIn();
					$('[data-tabindex="' + index + '"] [data-tab="' + i + '"]').addClass('active');
					return false;
				}
			});
			$('[data-tabindex="' + index + '"] > .tab-title > div').click(function () {
				var t = $(this).attr('data-tab');
				$('[data-tabindex="' + index + '"] .tab-title > div').removeClass('active');
				$(this).addClass('active');
				$('[data-tabindex="' + index + '"] [data-tabc]').hide();
				$('[data-tabindex="' + index + '"] [data-tabc="' + t + '"]').fadeIn();
			});
		});
		/*-------------------------------------
		 </> @author http://mmenu.frebsite.nl
		 </> Mmenu
		 </> @version 1.0.0
		/*------------------------------------*/
		$("#menures").mmenu({
			"offCanvas": {
				"position": "right"
			},
			"extensions": [
				"pagedim-black",
				"effect-menu-slide",
				"effect-panels-slide-100",
				"effect-listitems-slide",
				"border-full"
		 ]
		}, {
			offCanvas: {
				pageNodetype: "#main-page",
			}
		});
		/*-------------------------------------
		 </> @author http://Css-tricks.com
		 </> Image to Svg
		 </> @version 1.0.0
		/*------------------------------------*/
		$('img.svg').each(function () {
			var $img = $(this);
			var imgID = $img.attr('id');
			var imgClass = $img.attr('class');
			var imgURL = $img.attr('src');
			$.get(imgURL, function (data) {
				var $svg = $(data).find('svg');
				if (typeof imgID !== 'undefined') {
					$svg = $svg.attr('id', imgID);
				}
				if (typeof imgClass !== 'undefined') {
					$svg = $svg.attr('class', imgClass + ' replaced-svg');
				}
				$svg = $svg.removeAttr('xmlns:a');
				$img.replaceWith($svg);
			}, 'xml');
		});
		/*-------------------------------------
		 </> @author https://github.com/jakiestfu/Ripple.js
		 </> Ripple
		 </> @version 1.0.0
		/*------------------------------------
		$.ripple(".btn", {
			debug: false,
			on: 'mousedown',
			opacity: 0.4,
			color: "auto",
			multi: false,
			duration: 0.7,
			rate: function (pxPerSecond) {
				return pxPerSecond;
			},
			easing: 'linear'
		});
		*/
		/*-------------------------------------
		 </> @author http://jscrollpane.kelvinluck.com/
		 </> ScrollPane
		 </> @version 1.0.0
		/*------------------------------------
		$('.scroll-arrow').jScrollPane({
			showArrows: true
		});
		$('.scroll-bar').jScrollPane();
		*/
		/*-------------------------------------
		 </> @author http://listjs.com
		 </> List - Qiuck Search
		 </> @version 1.0.0
		/*------------------------------------
		var options = {
			valueNames: ['name', 'enname']
		};
		var list = new List('list', options);
		*/
	});
});