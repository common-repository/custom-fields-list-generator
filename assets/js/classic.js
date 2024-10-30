(function($) {
	$(function() {
		// Judge lang attribute
		const lang = $('html').attr('lang');
		const langsEn = lang.match(/^en/gi);
		let topOfPageText = '';

		if (lang === 'ja') {
			topOfPageText = 'ページの先頭に戻る';
		} else if ((lang === 'en') || ((langsEn !== null) && (langsEn.indexOf('en') >= 0))) {
			topOfPageText = 'Back to Top';
		} else {
			topOfPageText = 'Back to Top';
		}

		// Add menu switch
		$('body').append('<div id="cflg-classic"><div class="cflg-switch"><svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" class="open"><path fill="#fff" d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.68-1.5 1.5s.68 1.5 1.5 1.5 1.5-.68 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z"/><path fill="none" d="M0 0h24v24H0V0z"/></svg><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" class="close"><path fill="#fff" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/><path d="M0 0h24v24H0z" fill="none"/></svg></div><div class="cflg-menu"><ul></ul></div><div class="cflg-triangle"></div></div>');

		$('#cflg-classic .cflg-switch').on('click', function() {
			$(this).toggleClass('active');
		});

		// $('#normal-sortables').sortable({
		// 	stop: function(event, ui) {
		// 		initFlg();
		// 	}
		// });

		function initFlg() {
			$('#cflg-classic .cflg-menu ul').empty();
			$('#cflg-classic .cflg-menu ul').append('<li id="cflg-top"><a href="#wpcontent" class="cflg-top-anchor"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0V0z"/><path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z"/></svg>' + topOfPageText + '</a></li>');
			$('.ui-sortable:not(#side-sortables) .postbox .hndle').each(function(i) {
				if ($(this).parents('.postbox').css('display') == 'none') {
					return;
				}
				if ($(this).css('display') == 'none') {
					$(this).next('.inside').find('label').attr('id', 'cflg' + i);
					$('#cflg-classic .cflg-menu ul').append('<li>- <a href="#cflg' + i + '">' + $(this).next('.inside').find('label').text() + '</a></li>');
				} else {
					$(this).attr('id', 'cflg' + i);
					$('#cflg-classic .cflg-menu ul').append('<li>- <a href="#cflg' + i + '">' + $(this).text() + '</a></li>');
				}
			});
		}
		initFlg();

		$(document).on('click', '#cflg-classic li a', function() {
			$($(this).attr('href')).not('#wpcontent').addClass('cflg-highlight');
			setTimeout(function() {
				$($(this).attr('href')).removeClass('cflg-highlight');
			}.bind($(this)), 2400);
			if ($($(this).attr('href')).prev('button').attr('aria-expanded') === 'false') {
				$($(this).attr('href')).prev('button').attr('aria-expanded', true);
				$($(this).attr('href')).parents('.postbox').removeClass('closed');
			}
			var speed = 400;
			var href = $(this).attr("href");
			var target = $(href == "#" || href == "" ? 'html' : href);
			var position = target.offset().top;
			$('body,html').animate({scrollTop: position - $('#wpadminbar').height()}, speed, 'swing');
			return false;
		});
	});
})(jQuery);
