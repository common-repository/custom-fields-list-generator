import domReady from '@wordpress/dom-ready';

const { Fragment } = wp.element;
const registerPlugin = wp.plugins.registerPlugin;
const { PluginSidebar, PluginSidebarMoreMenuItem } = wp.editPost;
const { __ } = wp.i18n;

let texts = [];

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

domReady( function() {
	$('.editor-post-title').attr('id', 'editor-post-title');
	$('.hndle').each(function(i) {
		if ($(this).css('display') == 'none') {
			$(this).next('.inside').find('label').attr('id', 'cflg' + i);
			let text = $(this).next('.inside').find('label').text();
			texts.push(text);
		} else {
			if ($(this).parents('.postbox').css('display') == 'none') {
				texts.push('');
			} else {
				$(this).attr('id', 'cflg' + i);
				let text = $(this).text();
				texts.push(text);
			}
		}
	});

	registerPlugin( 'my-plugin', {
		render: () => {
			return (
				<Fragment>
					<PluginSidebarMoreMenuItem
						target='cflg'
						icon='editor-ul'
					>
						{ __( 'Custom Fields List Generator' ) }
					</PluginSidebarMoreMenuItem>
					<PluginSidebar
						name='cflg'
						icon='editor-ul'
						title='Custom Fields List Generator'
					>
						<div id="cflg">
							<ul>
								<li id="cflg-top"><a href="#editor-post-title" className="cflg-top-anchor"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0V0z"/><path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z"/></svg>{topOfPageText}</a></li>
								{texts.map((text, index) => {
									if (text !== '') {
										return (
											<li>
												- <a href={'#cflg' + index}>{text}</a>
											</li>
										)
									}
								})}
							</ul>
						</div>
					</PluginSidebar>
				</Fragment>
			);
		},
	});
	$(document).on('click', '#cflg ul li:not(#cflg-top) a', function() {
		$($(this).attr('href')).not('#editor-post-title').addClass('cflg-highlight');
		setTimeout(function() {
			$($(this).attr('href')).removeClass('cflg-highlight');
		}.bind($(this)), 2400);
		if ($($(this).attr('href')).prev('button').attr('aria-expanded') === 'false') {
			$($(this).attr('href')).prev('button').attr('aria-expanded', true);
			$($(this).attr('href')).parents('.postbox').removeClass('closed');
		}
	});
});
