<?php
/**
 * Plugin Name: Custom Fields List Generator
 * Plugin URI:
 * Description: Generate a fields list from the field labels on the posts of any type.
 * Version: 0.0.0
 * Text Domain: cflg
 * Domain Path: /languages/
 * Author:add more Corp,Inc.
 * Author URI: https://www.add-more.co.jp
 * License: GPL2
 */
/**
 * Copyright 2019 add more Corp,Inc. (email : info@add-more.co.jp)

 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License, version 2, as
 * published by the Free Software Foundation.
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
 */

/**
 * Add translation file
 */
load_plugin_textdomain(
	'cflg',
	false,
	plugin_basename( dirname( __FILE__ ) ) . '/languages' );

/**
 * Add setting page url
 */
add_filter('plugin_action_links', 'cflg_plugin_action_links', 10, 2);
function cflg_plugin_action_links($links, $file) {
	static $this_plugin;

	if (!$this_plugin) {
		$this_plugin = plugin_basename(__FILE__);
	}

	if ($file == $this_plugin) {
		$settings_link = '<a href="' . get_bloginfo('wpurl') . '/wp-admin/admin.php?page=cflg_setting">' . esc_attr__('Settings') . '</a>';
		array_unshift($links, $settings_link);
	}

	return $links;
}

/**
 * Add options page
 */
add_action( 'admin_menu', 'cflg_setting_page' );
function cflg_setting_page()
{
	add_options_page(
		esc_attr__('Settings of Custom Fields List Generator', 'cflg'),
		esc_attr__('Custom Fields List Generator', 'cflg'),
		'manage_options',
		'cflg_setting',
		'cflg_admin_page'
	);
}

function cflg_admin_page()
{
	?>
	<div class="wrap">
		<h2><?php esc_attr_e('Settings of Custom Fields List Generator', 'cflg')?></h2>
		<p><?php esc_attr_e('The custom fields list is displayed on the target page with a check.', 'cflg')?><br><?php esc_attr_e('You can hide the custom fields list every post if you input post id separated by comma in textarea.', 'cflg')?></p>
		<form method="post" action="options.php" id="cflg-setting">
			<?php
			settings_fields( 'my_option_group' );
			do_settings_sections( 'cflg_setting' );
			submit_button();
			?>
		</form>
	</div>
	<?php
}

add_action( 'admin_init', 'cflg_page_init' );
/**
 * Register and add settings
 */
function cflg_page_init()
{
	/**
	 * Option set by Text Field
	 */
	register_setting(
		'my_option_group', // Option group
		'checkboxes_opt_name' // Option name
	);

	add_settings_section(
		'setting_section_id', // ID
		'', // Title
		'', // Callback
		'cflg_setting' // Page
	);

	$target_post_types = [];

	$publish_post_types = get_post_types(['public' => true]);
	foreach ($publish_post_types as $publish_post_type) {
		if (0 == strcmp($publish_post_type, 'attachment'))    {
			continue;
		}
		$target_post_types[$publish_post_type] = get_post_type_object($publish_post_type)->labels->name;
	}

	add_settings_field(
		'checkboxes_opt_name',
		esc_attr__('Target Page', 'cflg'),
		'cflg_checkboxes_callback',
		'cflg_setting',
		'setting_section_id',
		array(
			'options' => $target_post_types
		)
	);

	function cflg_checkboxes_callback( $args )
	{
		$optname = 'checkboxes_opt_name';
		$option = get_option( $optname );
		$html = '';
		foreach ( $args['options'] as $val => $title ) {
			if (isset($option) && is_array($option)) {
				$checked = in_array($val, $option) ? 'checked="checked"' : '';
				$html .= sprintf( '<input type="checkbox" id="%2$s" name="%1$s[%2$s]" value="%2$s" %3$s />', $optname, $val, $checked );
			} else {
				$html .= sprintf( '<input type="checkbox" id="%2$s" name="%1$s[%2$s]" value="%2$s" />', $optname, $val );
			}
			$html .= sprintf( '<label for="%2$s"> %3$s</label><br />', $optname, $val, $title );
		}

		$html .= '</label>';
		echo $html;
	}

	register_setting(
		'my_option_group', // Option group
		'textarea_opt_name' // Option name
	);
	add_settings_field(
		'textarea_opt_name',
		esc_attr__('Post ID you want to hide the custom fields list', 'cflg'),
		'cflg_textarea_callback',
		'cflg_setting',
		'setting_section_id'
	);
	/**
	 * Get the settings option and print its values (Text Field)
	 */
	function cflg_textarea_callback()
	{
		$option = get_option( 'textarea_opt_name' );
		printf(
			'<textarea name="textarea_opt_name" id="textarea_opt_name" class="regular-text" cols="30" rows="5" placeholder="1,2,3...">%s</textarea>',
			isset( $option ) ? esc_attr( $option ) : ''
		);
	}
}

function cflg_plugin_active_check($file) {
	$is_active = false;
	foreach ((array) get_option('active_plugins') as $val) {
		if (preg_match('/'.preg_quote($file, '/').'/i', $val)) {
			$is_active = true;
			break;
		}
	}
	return $is_active;
}

if ( version_compare( $wp_version, '5', '<=' ) || cflg_plugin_active_check('classic-editor.php') ) {

	function cflg_script_classic(){
		global $pagenow;
		if (($pagenow == 'post.php') || $pagenow == 'post-new.php') {
			global $post_type;
			$checkboxes_option = get_option('checkboxes_opt_name');
			$textfield_option = get_option( 'textarea_opt_name' );
			$textfield_array = explode(",", $textfield_option);
			if (!empty($checkboxes_option)) {
				foreach ( $checkboxes_option as $value ) {
					if ( $post_type === $value ) {
						wp_enqueue_script( 'cflg_script_classic', plugins_url('dist/js/classic.js', __FILE__), array('jquery'), '', true);
					}
				}
			}
			if (isset($_GET['post'])) {
				if (!empty($textfield_array)) {
					foreach ($textfield_array as $textfield_value) {
						if ($_GET['post'] === $textfield_value) {
							wp_dequeue_script( 'cflg_script_classic', plugins_url('dist/js/classic.js', __FILE__), array('jquery'), '', true);
						}
					}
				}
			}
		}
	}
	add_action( 'admin_enqueue_scripts', 'cflg_script_classic' );

	function cflg_style_classic(){
		wp_enqueue_style( 'my_admin_style', plugins_url('dist/css/classic.css', __FILE__));
	}
	add_action( 'admin_enqueue_scripts', 'cflg_style_classic' );
} else {
	function cflg_sidebar_plugin_register() {
		wp_register_script(
			'plugin-sidebar-js',
			plugins_url( 'dist/js/index.js', __FILE__ ),
			array(
				'wp-element',
				'wp-edit-post',
				'wp-components',
				'wp-data',
				'wp-plugins',
			)
		);
	}
	add_action( 'init', 'cflg_sidebar_plugin_register' );

	function cflg_sidebar_plugin_script_enqueue() {
		global $post_type;
		$checkboxes_option = get_option('checkboxes_opt_name');
		$textfield_option = get_option( 'textarea_opt_name' );
		$textfield_array = explode(",", $textfield_option);
		if (!empty($checkboxes_option)) {
			foreach ( $checkboxes_option as $value ) {
				if ( $post_type === $value ) {
					wp_enqueue_script( 'plugin-sidebar-js' );
				}
			}
		}
		if (isset($_GET['post'])) {
			if (!empty($textfield_array)) {
				foreach ($textfield_array as $textfield_value) {
					if ($_GET['post'] === $textfield_value) {
						wp_dequeue_script('plugin-sidebar-js');
					}
				}
			}
		}
	}
	add_action( 'enqueue_block_editor_assets', 'cflg_sidebar_plugin_script_enqueue' );

	function cflg_style(){
		wp_enqueue_style( 'my_admin_style', plugins_url('dist/css/style.css', __FILE__));
	}
	add_action( 'admin_enqueue_scripts', 'cflg_style' );
}
