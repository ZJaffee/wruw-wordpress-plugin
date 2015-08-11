<?php
/*
Plugin Name: WRUW FM 91.1
Description: Manage the WRUW FM 91.1 radio station
License: GPLv2
*/
  
  if(!isset($_SESSION)) {
    session_start();
  }

add_action( 'user_profile_update_errors', 'wpse5742_set_user_nicename_to_nickname', 10, 3 );
function wpse5742_set_user_nicename_to_nickname( &$errors, $update, &$user )
{
    if ( ! empty( $user->nickname ) ) {
        $user->user_nicename = sanitize_title( $user->nickname, $user->display_name );
    }
}

  // On Plugin Activation
  function wruw_init($networkwide) {
      
      global $wpdb;
                   
      if (function_exists('is_multisite') && is_multisite()) {
          // check if it is a network activation - if so, run the activation function for each blog id
          if ($networkwide) {
                      $old_blog = $wpdb->blogid;
              // Get all blog ids
              $blogids = $wpdb->get_col("SELECT blog_id FROM $wpdb->blogs");
              foreach ($blogids as $blog_id) {
                  switch_to_blog($blog_id);
                  wruw_activate();
              }
              switch_to_blog($old_blog);
              return;
          }  
      }
      wruw_activate(); 
          
  }
  register_activation_hook( __FILE__, 'wruw_init' );
 
  function wruw_activate() {
     
    // Create schedule table
    global $wpdb;

    $table_name = $wpdb->prefix . "radio_schedules"; 

    $charset_collate = $wpdb->get_charset_collate();

    $sql = "CREATE TABLE `wruw_all_schedules` (`schedule_id` INT(11) NOT NULL, `hour_0` INT(11) NULL, `hour_1` INT(11) NULL, `hour_2` INT(11) NULL, `hour_3` INT(11) NULL, `hour_4` INT(11) NULL, `hour_5` INT(11) NULL, `hour_6` INT(11) NULL, `hour_7` INT(11) NULL, `hour_8` INT(11) NULL, `hour_9` INT(11) NULL, `hour_10` INT(11) NULL, `hour_11` INT(11) NULL, `hour_12` INT(11) NULL, `hour_13` INT(11) NULL, `hour_14` INT(11) NULL, `hour_15` INT(11) NULL, `hour_16` INT(11) NULL, `hour_17` INT(11) NULL, `hour_18` INT(11) NULL, `hour_19` INT(11) NULL, `hour_20` INT(11) NULL, `hour_21` INT(11) NULL,`hour_22` INT(11) NULL, `hour_23` INT(11) NULL,`hour_24` INT(11) NULL,`hour_25` INT(11) NULL,`hour_26` INT(11) NULL,`hour_27` INT(11) NULL,`hour_28` INT(11) NULL,`hour_29` INT(11) NULL,`hour_30` INT(11) NULL,`hour_31` INT(11) NULL,`hour_32` INT(11) NULL,`hour_33` INT(11) NULL,`hour_34` INT(11) NULL,`hour_35` INT(11) NULL,`hour_36` INT(11) NULL,`hour_37` INT(11) NULL,`hour_38` INT(11) NULL,`hour_39` INT(11) NULL,`hour_40` INT(11) NULL,`hour_41` INT(11) NULL,`hour_42` INT(11) NULL,`hour_43` INT(11) NULL,`hour_44` INT(11) NULL,`hour_45` INT(11) NULL,`hour_46` INT(11) NULL,`hour_47` INT(11) NULL,`day` INT(1) NOT NULL, `date_updated` TIMESTAMP(11) NOT NULL DEFAULT CURRENT_TIMESTAMP, `updated_by` INT NOT NULL, INDEX (`schedule_id`, `day`)) $charset_collate;";

    require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
    
    dbDelta( $sql );
      
  }

  // Other setup functions
  $plugin_dir = plugin_dir_path(__FILE__);
  
  include_once($plugin_dir.'includes/functions.php');


  // Create admin menu  
  function custom_wruw_menu() {
      
      global $plugin_dir;
      
      add_menu_page( 'WRUW FM 91.1',
                      'WRUW FM 91.1',
                      'dj',
                      'wruw-admin-menu',
                      'wruw_show_home_screen',
                      plugins_url( '/images/logo-small.png', __FILE__ ),
                      10
                      
                  );

      add_submenu_page( 'wruw-admin-menu', 'WRUW FM 91.1', 'WRUW FM 91.1', 'dj', 'wruw-admin-menu', 'wruw_show_home_screen');
      add_submenu_page( 'wruw-admin-menu', 'My Radio Program', 'My Radio Program', 'dj', 'wruw-manage-my-program', 'wruw_show_my_program_screen'); 
      add_submenu_page( 'wruw-admin-menu', 'My Current Show', 'My Current Show', 'dj', 'wruw-manage-current-show', 'wruw_show_current_show_screen'); 
      add_submenu_page( 'wruw-admin-menu', 'My Past Shows', 'My Past Shows', 'dj', 'wruw-manage-past-shows', 'wruw_show_past_shows_screen'); 
      add_submenu_page( 'wruw-admin-menu','My Blog','My Blog', 'dj', 'edit.php?post_type=post');
      add_submenu_page( 'wruw-admin-menu', 'Requests', 'Requests', 'dj', 'wruw-manage-requests', 'wruw_show_requests_screen'); 

      if($_SESSION['wruw-role'] != 'dj') {
        add_submenu_page( 'wruw-admin-menu', 'Manage All Schedules', 'Manage All Schedules', 'edit_posts', 'wruw-manage-schedules', 'wruw_show_schedules_screen'); 
      }


      function wruw_submenu_order( $menu_ord ) {
          
          global $submenu;

          // Enable the next line to see all menu orders
          //echo '<pre>'.print_r($submenu,true).'</pre>';

          $arr = array();

          if($_SESSION['wruw-role'] == 'dj') {
            $arr[] = $submenu['wruw-admin-menu'][3];
            $arr[] = $submenu['wruw-admin-menu'][4];
            $arr[] = $submenu['wruw-admin-menu'][5];
            $arr[] = $submenu['wruw-admin-menu'][6];
            $arr[] = $submenu['wruw-admin-menu'][7];
            $arr[] = $submenu['wruw-admin-menu'][8];
          }
          else {
            $arr[] = $submenu['wruw-admin-menu'][3];
            $arr[] = $submenu['wruw-admin-menu'][4];
            $arr[] = $submenu['wruw-admin-menu'][5];
            $arr[] = $submenu['wruw-admin-menu'][6];
            $arr[] = $submenu['wruw-admin-menu'][7];
            $arr[] = $submenu['wruw-admin-menu'][8];
            $arr[] = $submenu['wruw-admin-menu'][9];
            $arr[] = $submenu['wruw-admin-menu'][0];
            $arr[] = $submenu['wruw-admin-menu'][1];
            $arr[] = $submenu['wruw-admin-menu'][2];
          }

          $submenu['wruw-admin-menu'] = $arr;

          return $menu_ord;

      }
      add_filter( 'custom_menu_order', 'wruw_submenu_order' );

  }
  add_action( 'admin_menu', 'custom_wruw_menu' );

  
  // Load in scripts and styles
  function custom_wruw_scripts_styles() {  

    global $plugin_dir;

    wp_register_style('wruw-jqueryui-css','//code.jquery.com/ui/1.11.2/themes/smoothness/jquery-ui.css');
    wp_enqueue_style('wruw-jqueryui-css');

    wp_register_style('wruw-fancybox-css',plugin_dir_url().'wruw/js/fancybox/jquery.fancybox.css');
    wp_enqueue_style('wruw-fancybox-css');

    wp_register_style('wruw-awesome-css',plugin_dir_url().'wruw/css/font-awesome.min.css');
    wp_enqueue_style('wruw-awesome-css');

    wp_register_style('wruw-custom-style',plugin_dir_url().'wruw/css/wruw.css');
    wp_enqueue_style('wruw-custom-style');

    wp_register_script('wruw-jqueryui-js','//code.jquery.com/ui/1.11.2/jquery-ui.js', array('jquery'), false, true );
    wp_enqueue_script('wruw-jqueryui-js');

    wp_register_script('wruw-jquery-cookie',plugin_dir_url().'wruw/js/jquery.cookie.js', array('jquery'), false, true );
    wp_enqueue_script('wruw-jquery-cookie');

    wp_register_script('wruw-jquery-autocomplete',plugin_dir_url().'wruw/js/jquery.autocomplete.min.js', array('jquery'), false, true );
    wp_enqueue_script('wruw-jquery-autocomplete');

    wp_register_script('wruw-fancybox-js',plugin_dir_url().'wruw/js/fancybox/jquery.fancybox.js', array('jquery'), false, true );
    wp_enqueue_script('wruw-fancybox-js');

    wp_register_script('wruw-custom-functions',plugin_dir_url().'wruw/js/wruw.js', array('jquery'), false, true );
    wp_enqueue_script('wruw-custom-functions');

  }
  add_action( 'admin_enqueue_scripts', 'custom_wruw_scripts_styles' ); 


  //Custom Post Types
  
  // Schedules
  function wruw_cpt_schedules() {
    
    $labels = array(
              'name' => 'Schedules',
              'singular_name' => 'Schedules',
              'add_new' => 'Add New Schedules',
              'all_items' => 'Manage All Schedules',
              'add_new_item' => 'Add New Schedules',
              'edit_item' => 'Edit Scheduless',
              'new_item' => 'New Schedules',
              'view_item' => 'View Schedules',
              'search_items' => 'Search Schedules',
              'not_found' =>  'No Schedules found',
              'not_found_in_trash' => 'No Scheduless found in trash',
              'parent_item_colon' => 'Parent Scheduless:',
              'menu_name' => 'Manage All Schedules'
          );

    $args = array(
            'labels' => $labels,
            'public' => false,
            'supports' => array('title','editor','thumbnail', 'page-attributes','author'),
            'has_archive' => false,
            'show_ui' => false,
          ); 
      
      register_post_type('schedule',$args);

  }
  add_action( 'init', 'wruw_cpt_schedules' );
  
  
  // Programs
  function wruw_cpt_program() {
    
    $labels = array(
              'name' => 'Programs',
              'singular_name' => 'Program',
              'add_new' => 'Add New Program',
              'all_items' => 'Manage All Programs',
              'add_new_item' => 'Add New Program',
              'edit_item' => 'Edit Programs',
              'new_item' => 'New Program',
              'view_item' => 'View Program',
              'search_items' => 'Search Programs',
              'not_found' =>  'No Program found',
              'not_found_in_trash' => 'No Programs found in trash',
              'parent_item_colon' => 'Parent Programs:',
              'menu_name' => 'Manage All Programs'
          );

    $args = array(
            'labels' => $labels,
            'public' => true,
            'supports' => array('title','editor','thumbnail', 'page-attributes','author'),
            'has_archive' => false,
            'show_ui' => true,
            'show_in_menu' => 'wruw-admin-menu'
          ); 
      
      register_post_type('program',$args);

  }
  add_action( 'init', 'wruw_cpt_program' );

  
  // Shows
  function wruw_cpt_show() {
    
    $labels = array(
              'name' => 'Shows',
              'singular_name' => 'Show',
              'add_new' => 'Add New Show',
              'all_items' => 'Manage All Shows',
              'add_new_item' => 'Add New Show',
              'edit_item' => 'Edit Shows',
              'new_item' => 'New Show',
              'view_item' => 'View Show',
              'search_items' => 'Search Shows',
              'not_found' =>  'No Show found',
              'not_found_in_trash' => 'No Shows found in trash',
              'parent_item_colon' => 'Parent Shows:',
              'menu_name' => 'Manage All Shows'
          );

    $args = array(
            'labels' => $labels,
            'public' => true,
            'supports' => array('title','editor','thumbnail', 'page-attributes','author'),
            'has_archive' => false,
            'show_ui' => true,
            'show_in_menu' => 'wruw-admin-menu'
          ); 
      
      register_post_type('show',$args);

  }
  add_action( 'init', 'wruw_cpt_show' );

  
  // Songs
  function wruw_cpt_song() {
    
    $labels = array(
              'name' => 'Songs',
              'singular_name' => 'Song',
              'add_new' => 'Add New Song',
              'all_items' => 'Manage All Songs',
              'add_new_item' => 'Add New Song',
              'edit_item' => 'Edit Songs',
              'new_item' => 'New Song',
              'view_item' => 'View Song',
              'search_items' => 'Search Songs',
              'not_found' =>  'No Song found',
              'not_found_in_trash' => 'No Songs found in trash',
              'parent_item_colon' => 'Parent Songs:',
              'menu_name' => 'Manage All Songs',
          );

    $args = array(
            'labels' => $labels,
            'public' => false,
            'supports' => array('title','editor','thumbnail', 'page-attributes','author'),
            'has_archive' => false,
            'show_ui' => true,
            'show_in_menu' => 'wruw-admin-menu'
          ); 
      
      register_post_type('song',$args);

  }
  add_action( 'init', 'wruw_cpt_song' );

  // Requests
  function wruw_cpt_request() {
    
    $labels = array(
              'name' => 'Requests',
          );

    $args = array(
            'labels' => $labels,
            'public' => false,
            'supports' => array('title','editor'),
            'has_archive' => false,
            'show_ui' => false
          ); 
      
      register_post_type('song-request',$args);

  }
  add_action( 'init', 'wruw_cpt_request' );

  // Genre Taxonomies  
  function wruw_create_genre_taxonomy() {
        
        $labels = array(
           'name' => _x( 'Genres', 'taxonomy general name' ),
           'singular_name' => _x( 'Genre', 'taxonomy singular name' ),
           'search_items' =>  __( 'Search Genres' ),
           'all_items' => __( 'All Genres' ),
           'parent_item' => __( 'Parent Genre' ),
           'parent_item_colon' => __( 'Parent Genre:' ),
           'edit_item' => __( 'Edit Genre' ), 
           'update_item' => __( 'Update Genre' ),
           'add_new_item' => __( 'Add New Genre' ),
           'new_item_name' => __( 'New Genre Name' ),
           'menu_name' => __( 'Genres' ),
         );  

         register_taxonomy('genre',array('program'), array(
           'hierarchical' => true,
           'labels' => $labels,
           'show_ui' => true,
           'query_var' => 'genre'
         ));

  }
  add_action( 'init', 'wruw_create_genre_taxonomy', 0 );


  // Song Genre Taxonomies  
  function wruw_create_song_genre_taxonomy() {
        
        $labels = array(
           'name' => _x( 'Genres', 'taxonomy general name' ),
           'singular_name' => _x( 'Genre', 'taxonomy singular name' ),
           'search_items' =>  __( 'Search Genres' ),
           'all_items' => __( 'All Genres' ),
           'parent_item' => __( 'Parent Genre' ),
           'parent_item_colon' => __( 'Parent Genre:' ),
           'edit_item' => __( 'Edit Genre' ), 
           'update_item' => __( 'Update Genre' ),
           'add_new_item' => __( 'Add New Genre' ),
           'new_item_name' => __( 'New Genre Name' ),
           'menu_name' => __( 'Genres' ),
         );  

         register_taxonomy('song-genre',array('song'), array(
           'hierarchical' => false,
           'labels' => $labels,
           'show_ui' => true,
           'public' => false,
           'query_var' => 'song-genre'
         ));

  }
  add_action( 'init', 'wruw_create_song_genre_taxonomy', 0 );

  
  // Update author base to dj
  function wruw_change_author_base() {
    global $wp_rewrite;
    $wp_rewrite->author_base = 'dj';
    $wp_rewrite->author_structure = '/' . $wp_rewrite->author_base. '/%author%';
  }
  add_action('init','wruw_change_author_base');


  // Refresh permalinks for new post types
  function wruw_refresh_permalink() { 
    
    if(!$_SESSION['wruw_refresh_permalink']) {
      flush_rewrite_rules();
      $_SESSION['wruw_refresh_permalink'] = 1;
    }

  }
  add_action( 'admin_init', 'wruw_refresh_permalink', 0 );


  // Add new DJ and Station manager roles
  add_role('dj', 'DJ', array(
        'dj'         => true,
        'read'         => true,
        'edit_posts'   => true,
        'edit_published_posts'   => true,
        'edit_pages'   => false,
        'publish_posts' => true,
        'publish_pages' => false,
        'delete_posts' => true,
        'delete_others_pages' => false,
        'delete_others_posts' => false,
        'edit_others_pages' => false,
        'edit_others_posts' => false,
        'read_others_pages' => false,
        'read_others_posts' => false,
        'upload_files' => true,
        'level_2' => true,
        'level_1' => true,
        'level_0' => true
    ));

  add_role('manager', 'Station Manager', array(
        'moderate_comments' => true, 
        'manage_categories' => true, 
        'manage_links' => false, 
        'upload_files' => true, 
        'unfiltered_html' => true, 
        'edit_posts' => true, 
        'edit_others_posts' => true, 
        'edit_published_posts' => true, 
        'publish_posts' => true, 
        'edit_pages' => true, 
        'read' => true, 
        'level_7' => true, 
        'level_6' => true, 
        'level_5' => true, 
        'level_4' => true, 
        'level_3' => true, 
        'level_2' => true, 
        'level_true,' => true, 
        'level_0' => true, 
        'edit_others_pages' => true, 
        'edit_published_pages' => true, 
        'publish_pages' => true, 
        'delete_pages' => true, 
        'delete_others_pages' => true, 
        'delete_published_pages' => true, 
        'delete_posts' => true, 
        'delete_others_posts' => true, 
        'delete_published_posts' => true, 
        'delete_private_posts' => false, 
        'edit_private_posts' => false, 
        'read_private_posts' => false, 
        'delete_private_pages' => false, 
        'edit_private_pages' => false, 
        'read_private_pages' => false,  
        'manager' => true, 
        'dj' => true
        ));


  function add_capability() {
    $role = get_role( 'administrator' );
    $role->add_cap( 'dj' ); 
  }
  add_action( 'admin_init', 'add_capability'); 


  // Filter content by role
  function wruw_setup_this_user() { 
    
    $user_ID = get_current_user_id();
    $user = new WP_User($user_ID);
    $role = array_shift($user -> roles);
    $_SESSION['wruw-role'] = $role;
    $_SESSION['wruw-userid'] = $user_ID;

    if($_SESSION['wruw-role'] == 'dj' || $_SESSION['wruw-role'] == 'manager') { 

      function wruw_dj_filter_1() {
        
        // Remove admin links
        remove_menu_page( 'index.php' );                      //Dashboard
        remove_menu_page( 'edit.php' );                       //Posts
        remove_menu_page( 'upload.php' );                     //Media
        remove_menu_page( 'edit.php?post_type=page' );        //Pages
        remove_menu_page( 'edit-comments.php' );              //Comments
        remove_menu_page( 'themes.php' );                     //Appearance
        remove_menu_page( 'plugins.php' );                    //Plugins
        remove_menu_page( 'users.php' );                      //Users
        remove_menu_page( 'tools.php' );                      //Tools
        remove_menu_page( 'options-general.php' );            //Settings
        remove_menu_page( 'admin.php?page=tribe-app-shop' );  //Events
        remove_menu_page( 'edit.php?post_type=tribe_events&page=tribe-app-shop' );  //Events
        remove_menu_page( 'edit.php?post_type=tribe_events' );  //Events

        // Remove notices
        remove_action( 'admin_notices', 'update_nag', 3 );

        // Remove events calendar
        define('TRIBE_DISABLE_TOOLBAR_ITEMS', true);
        define('TRIBE_DISABLE_PUE', true);
        define('TRIBE_HIDE_UPSELL', true);
      }
      add_action( 'admin_menu', 'wruw_dj_filter_1' );

      function wruw_dj_filter_2() { 

        global $wp_admin_bar;
        $wp_admin_bar->remove_menu('wp-logo');          // Remove the WordPress logo
        $wp_admin_bar->remove_menu('about');            // Remove the about WordPress link
        $wp_admin_bar->remove_menu('wporg');            // Remove the WordPress.org link
        $wp_admin_bar->remove_menu('documentation');    // Remove the WordPress documentation link
        $wp_admin_bar->remove_menu('support-forums');   // Remove the support forums link
        $wp_admin_bar->remove_menu('feedback');         // Remove the feedback link
        $wp_admin_bar->remove_menu('updates');          // Remove the updates link
        $wp_admin_bar->remove_menu('comments');         // Remove the comments link
        $wp_admin_bar->remove_menu('new-content');      // Remove the content link
        $wp_admin_bar->remove_menu('w3tc');             // If you use w3 total cache remove the performance link

      }
      add_action( 'wp_before_admin_bar_render', 'wruw_dj_filter_2' );

      if($_SESSION['wruw-role'] == 'dj') { 

        function wruw_dj_filter_3() { 
          
          $screen = get_current_screen();

          $base = $screen->id;

          if($base != 'profile' && $base != 'toplevel_page_wruw-admin-menu' && $base != 'wruw-fm-91-1_page_wruw-manage-my-program' && $base != 'wruw-fm-91-1_page_wruw-manage-current-show' && $base != 'wruw-fm-91-1_page_wruw-manage-new-show' && $base != 'wruw-fm-91-1_page_wruw-manage-past-shows' && $base != 'wruw-fm-91-1_page_wruw-manage-requests' && $base != 'media-upload' && $base != 'edit-post' && $base != 'post') { 

            if (strpos($base, 'async-upload') !== false) {
            }
            else {
              wp_redirect( admin_url( 'admin.php?page=wruw-admin-menu' ) );
              exit();
            }
            
          }

        }
        add_action( 'current_screen', 'wruw_dj_filter_3' );

        
        // Only show logged in user's posts
        function wruw_dj_filter_4($query) {
          
          global $pagenow;

          if( 'edit.php' != $pagenow || !$query->is_admin ) {
            return $query;
          }
          else {
              $query->set('author', $_SESSION['wruw-userid'] );
          }

          return $query;
        }
        add_filter('pre_get_posts', 'wruw_dj_filter_4');

        
        // Remove all and published and trash header
        function wruw_dj_filter_5($views) {
          
          unset($views['all']);
          unset($views['publish']);
          unset($views['trash']);

          return $views;
        }
        add_action( 'views_edit-post',  'wruw_dj_filter_5' );

      }
      else if($_SESSION['wruw-role'] == 'manager') { 

        function wruw_dj_filter_3() { 
          
          $screen = get_current_screen();
          $base = $screen->id;

          if($base != 'profile' && $base != 'toplevel_page_wruw-admin-menu' && $base != 'wruw-fm-91-1_page_wruw-manage-my-program' && $base != 'wruw-fm-91-1_page_wruw-manage-current-show' && $base != 'wruw-fm-91-1_page_wruw-manage-new-show' && $base != 'wruw-fm-91-1_page_wruw-manage-past-shows' && $base != 'wruw-fm-91-1_page_wruw-manage-requests' && $base != 'media-upload' && $base != 'wruw-fm-91-1_page_wruw-manage-schedules' && $base != 'edit-program' && $base != 'edit-show' && $base != 'edit-song' && $base != 'edit-post' && $base != 'program' && $base != 'show' && $base != 'song' && $base != 'song-request' && $base != 'post') { 
             
            if (strpos($base, 'async-upload') !== false) {
            }
            else {
              wp_redirect( admin_url( 'admin.php?page=wruw-admin-menu' ) );
              exit();
            }
            
          }

        }
        add_action( 'current_screen', 'wruw_dj_filter_3' );

      }

      // Remove normal categories box
      function wruw_dj_filter_6() {
            remove_meta_box('categorydiv', 'post', 'side');
      }
      add_action( 'admin_head', 'wruw_dj_filter_6' );

      // Add new categories box
      function wruw_dj_filter_7() {
            add_meta_box('customcategorydiv', 'Radio Program', 'wruw_custom_post_categories_meta_box', 'post', 'side', 'low', array( 'taxonomy' => 'category' ));
      }
      add_action('admin_menu', 'wruw_dj_filter_7');

    }
    else {

      function wruw_admin_filter() { 

        global $wp_admin_bar;
        $wp_admin_bar->remove_menu('wp-logo');          // Remove the WordPress logo
        $wp_admin_bar->remove_menu('about');            // Remove the about WordPress link
        $wp_admin_bar->remove_menu('wporg');            // Remove the WordPress.org link
        $wp_admin_bar->remove_menu('documentation');    // Remove the WordPress documentation link
        $wp_admin_bar->remove_menu('support-forums');   // Remove the support forums link
        $wp_admin_bar->remove_menu('feedback');         // Remove the feedback link
        
      }
      add_action( 'wp_before_admin_bar_render', 'wruw_admin_filter' );

    }

  }
  add_action( 'init', 'wruw_setup_this_user', 0 );

  // Add link in admin toolbar
  function wruw_toolbar_link($wp_admin_bar) {
    $args = array(
      'id'    => 'wruw_admin_link',
      'title' => '<span class="ab-icon"><img src="'.plugins_url( '/images/logo-small.png', __FILE__ ).'" /></span>Manage WRUW FM 91.1',
      'href'  => '/wp-admin/admin.php?page=wruw-admin-menu',
      'meta'  => array( 'class' => 'wruw-toolbar-page' )
    );
    $wp_admin_bar->add_node($args);
  }
  add_action( 'admin_bar_menu', 'wruw_toolbar_link', 999 );


  // Remove wordpress thank you branding
  function wruw_edit_footer() {
    add_filter( 'admin_footer_text', 'wruw_edit_text', 11 );
  }

  function wruw_edit_text($content) {
    return "WRUW - Radio from Case Western Reserve";
  }
  add_action( 'admin_init', 'wruw_edit_footer' );

  
  // Destroy session on logout
  function wruw_destroy_the_session() {
    session_destroy();   
    session_unset();
    $_SESSION = array();
  }
  add_action( 'wp_logout', 'wruw_destroy_the_session');

?>
