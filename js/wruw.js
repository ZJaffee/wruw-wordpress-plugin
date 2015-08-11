// WRUW JS

(function($){
 
		
		// Create New Schedule
		$(document).on('click', '#new-schedule-submit', function(e) { 

			$('#new-schedule-submit').prop('disabled', true);

			var error = '';

			var scheduleTitle = $('#schedule-title').val();
			
			if(!scheduleTitle) {
				error = '1';
				$('#schedule-title').css('border-size','1px');
				$('#schedule-title').css('border-color','red');
				$('#schedule-title').css('border-style','solid');
			}
			else {
				$('#schedule-title').css('border','none');
			}

			var scheduleSemester = $('#schedule-semester').val();
			
			if(!scheduleSemester) {
				error = '1';
				$('#schedule-semester').css('border-size','1px');
				$('#schedule-semester').css('border-color','red');
				$('#schedule-semester').css('border-style','solid');
			}
			else {
				$('#schedule-semester').css('border','none');
			}

			var scheduleYear = $('#schedule-year').val();
			
			if(!scheduleYear) {
				error = '1';
				$('#schedule-year').css('border-size','1px');
				$('#schedule-year').css('border-color','red');
				$('#schedule-year').css('border-style','solid');
			}
			else {
				$('#schedule-year').css('border','none');
			}

			if(!error) {

				$.ajax({type: "POST",
				    cache: false,
					url:"/wp-admin/admin-ajax.php",
				    data: ({action : 'wruw_create_new_schedule', title: scheduleTitle, semester: scheduleSemester, year: scheduleYear}),
				    dataType: 'html',
				    success: function(html) {
				    	if(html != 'error') {
				    		$('.notice, .open-p, #schedule-list-holder, .update-schedule-title, .update-schedule-title, .not-found').hide();
				    		$('#new-schedule-form').html('<h3>Success! You have created the new schedule: '+scheduleTitle+'</h3><p>The new schedule has been pre-populated with all of the radio shows and times from the current schedule.</p><p>You will be redirected to your new schedule page in 2 seconds or you can <a href="/wp-admin/admin.php?page=wruw-manage-schedules&step=update&id='+html+'">Click Here</a></p>')
							setTimeout('location.href = "/wp-admin/admin.php?page=wruw-manage-schedules&step=update&id='+html+'";',2000);
						}
						else {
							alert('There was an error and the process can not be completed');
						}
					},
				    error: function() {
				        alert('There was an error and the process can not be completed');
				    }

				});

			}
			else {
				$('#new-schedule-submit').prop('disabled', false);
				$('#error-message').html('<p>The fields marked in red must be completed before submitting the form</p>').css('visibility','visible');
			}

			return false;

		});


		// Auto populate start and stop time for schedule
		$(document).on('click', '.schedule_time', function(e) { 

			$('#schedule_time_submit').prop('disabled', false);
			$('#success-message, #error-message').html('').css('visibility','hidden');

			var spotFilled = $(this).attr('data-filled');

			if(spotFilled) {
				$('#program_id').val(spotFilled);
			}
			else {
				$('#program_id').val('');
			}

			var startDay = $(this).attr('data-day');
			var startTime = $(this).attr('data-time');
			var endTime = +startTime + 1;

			if(endTime == 48) { 
				endTime = 0;
			}

			if(startDay == 1) {var displayDay = 'Sunday';}
			if(startDay == 2) {var displayDay = 'Monday';}
			if(startDay == 3) {var displayDay = 'Tuesday';}
			if(startDay == 4) {var displayDay = 'Wednesday';}
			if(startDay == 5) {var displayDay = 'Thursday';}
			if(startDay == 6) {var displayDay = 'Friday';}
			if(startDay == 7) {var displayDay = 'Saturday';}

			$('#schedule-day-display').text(displayDay);
			$('#schedule_day').val(startDay);
			$('#schedule_time_start').val(startTime);
			$('#schedule_time_end').val(endTime);

		});


		// Schedule time select
		$(document).on('click', '#schedule_time_submit', function(e) { 

			$('#schedule_time_submit').prop('disabled', true);

			var error = '';

			var scheduleId = $('#schedule_id').val();
			var programId = $('#program_id').val();

			if(!programId) {
				error = '1';
				$('#program_id').css('border-size','1px');
				$('#program_id').css('border-color','red');
				$('#program_id').css('border-style','solid');
			}
			else {
				$('#program_id').css('border','none');
			}

			var startDay = $('#schedule_day').val();
			var endDay = startDay;
			var startTime = $('#schedule_time_start').val();

			if(!startTime) {
				error = '1';
				$('#schedule_time_start').css('border-size','1px');
				$('#schedule_time_start').css('border-color','red');
				$('#schedule_time_start').css('border-style','solid');
			}
			else {
				$('#schedule_time_start').css('border','none');
			}

			var endTime = $('#schedule_time_end').val();

			if(!endTime) {
				error = '1';
				$('#schedule_time_end').css('border-size','1px');
				$('#schedule_time_end').css('border-color','red');
				$('#schedule_time_end').css('border-style','solid');
			}
			else {
				$('#schedule_time_end').css('border','none');
			}

			if(+endTime < +startTime) { 
				
				var endDay = +startDay + 1;

				if(endDay == 8){
					endDay = 1;
				}
			}

			if(startTime == 0) {
				var startTime = '0am'
			}

			if(endTime == 0) {
				var endTime = '0am'
			}

			if(!error) {

				$.ajax({type: "POST",
				    cache: false,
					url:"/wp-admin/admin-ajax.php",
				    data: ({action : 'wruw_create_new_time_slot', program: programId, schedule: scheduleId, startday: startDay, endday: endDay, starttime: startTime, endtime: endTime}),
				    dataType: 'html',
				    success: function(html) {
				    	$('#error-message').html('').css('visibility','hidden');
				    	$('#success-message').html('<p>Success! The time slot has been scheduled</p>').css('visibility','visible');
				    	setTimeout(function(){
				    		$.fancybox.close();
				    		$('#schedule-tabs .ui-tabs-active').click();
				    	},2000);
					},
				    error: function() {
				        alert('There was an error and the process can not be completed');
				    }

				});

			}
			else {
				$('#schedule_time_submit').prop('disabled', false);
				$('#error-message').html('<p>The fields marked in red must be completed before submitting the form</p>').css('visibility','visible');
			}

			return false;

		});


		

		// Register as a guest host
		$(document).on('click', '#guest-host-submit', function(e) { 

			$('#guest-host-submit').prop('disabled', false);
			$('#success-message, #error-message').html('').css('visibility','hidden');

			var showId = $(this).attr('data-showid');

			if(showId) {

				var reallyRegister = confirm("Are you sure you want to register as a guest host for this radio show?");

				if (reallyRegister == true) {

					$.ajax({type: "POST",
						    cache: false,
							url:"/wp-admin/admin-ajax.php",
						    data: ({action : 'wruw_register_as_guest_host', show: showId}),
						    dataType: 'html',
						    success: function(html) {
						    	$('.guest-content').html('<p>You have successfully registered as a guest host, you will now be taken to the show.</p>');
					    		setTimeout('location.href = "/wp-admin/admin.php?page=wruw-manage-current-show";',2000);
							},
						    error: function() {
						    }
						});
				}
				else {
					$("#active-schedule").attr('checked', false);
				}
			}

		});


		$(document).on('click', '#schedule-tabs li.ui-state-default', function(e) { 

			var activeTab = $(this).attr('data-id');
			var scheduleId = $('#schedule_id').val();

			if(activeTab) {

				$('#tabs-'+activeTab).hide();

				$.ajax({type: "POST",
				    cache: false,
					url:"/wp-admin/admin-ajax.php",
				    data: ({action : 'wruw_update_schedule_display', schedule: scheduleId, tab: activeTab}),
				    dataType: 'html',
				    success: function(html) {
				    	$('#tabs-'+activeTab).html(html).fadeIn('fast');
					},
				    error: function() {
				    }
				});

			}

		});

		
		$(document).on('change', '#active-schedule', function(e) {

			var scheduleId = $('#schedule_id').val();

			if($("#active-schedule").is(':checked')) {
				var isActive = '1';
			}
			else {
				var isActive = '';
			}

			if(isActive) {

				var reallyUpdate = confirm("Are you sure you want to make this the active schedule? This will archive all other schedules.");

				if (reallyUpdate == true) {

					$.ajax({type: "POST",
						    cache: false,
							url:"/wp-admin/admin-ajax.php",
						    data: ({action : 'wruw_mark_active_schedule', schedule: scheduleId}),
						    dataType: 'html',
						    success: function(html) {
							},
						    error: function() {
						    }
						});
				}
				else {
					$("#active-schedule").attr('checked', false);
				}
			}

		});


		// Delete Schedule
		$(document).on('click', '#delete-schedule', function(e) { 

			var reallyDelete = confirm("Are you sure you want to delete this schedule? This action can not be undone.");

			if (reallyDelete == true) {

				var scheduleId = $('#schedule_id').val();

				$.ajax({type: "POST",
					    cache: false,
						url:"/wp-admin/admin-ajax.php",
					    data: ({action : 'wruw_delete_schedule', schedule: scheduleId}),
					    dataType: 'html',
					    success: function(html) {
					    	$('.schedule-holder').html('<p>You have successfully deleted this schedule</p>');
					    	$('#delete-schedule').hide();
					    	setTimeout('location.href = "/wp-admin/admin.php?page=wruw-manage-schedules";',1000);
						},
					    error: function() {
					    }
					});
			}

			return false;

		});

		
		


		// Update Program
		$(document).on('click', '#update-program-form-submit', function(e) { 

			$('#update-program-form-submit').prop('disabled', true);

			var error = '';

			var programId = $('#program-id').val();

			if(!programId) {
				error = '1';
			}

			// Click back to visual mode
			$('#program-description-tmce').click();
			var longDescription = '';
			var editor = tinyMCE.get('program-description');
			if (editor) {
				// Ok, the active tab is Visual
				longDescription = editor.getContent({format : 'raw'});
			}
			else {
				// The active tab is HTML, so just query the textarea
				longDescription = $('#program-description').val();
			}

			if(!longDescription) {
				error = '1';
				$('#wp-program-description-wrap').css('border-size','1px');
				$('#wp-program-description-wrap').css('border-color','red');
				$('#wp-program-description-wrap').css('border-style','solid');
			}
			else {
				$('#wp-program-description-wrap').css('border','none');
			}

			var shortDescription = $('#short-description').val();

			if(!shortDescription) {
				error = '1';
				$('#short-description').css('border-size','1px');
				$('#short-description').css('border-color','red');
				$('#short-description').css('border-style','solid');
			}
			else {
				$('#short-description').css('border','none');
			}

			var website = $('#web-url').val();
			var myspace = $('#myspace-url').val();
			var facebook = $('#facebook-url').val();
			var twitter = $('#twitter-url').val();
			var hosts = $('#hosts').val();
			var featuredImage = $('#upload_image').val();

			if(!error) {

				$.ajax({type: "POST",
				    cache: false,
					url:"/wp-admin/admin-ajax.php",
				    data: ({action : 'wruw_update_program', program: programId, longdescription: longDescription, shortdescription: shortDescription, website: website, myspace: myspace, facebook: facebook, twitter: twitter, hosts: hosts, image: featuredImage}),
				    dataType: 'html',
				    success: function(html) {
				    	$('.open-p').hide();
				    	$('#updateprogramform').html('<h3>Success! You have updated the program</h3><p>You will be redirected to your program page in 2 seconds or you can <a href="/wp-admin/admin.php?page=wruw-manage-my-program">Click Here</a></p>')
						setTimeout('location.href = "/wp-admin/admin.php?page=wruw-manage-my-program";',2000);
					},
				    error: function() {
				        alert('There was an error and the process can not be completed');
				    }

				});

			}
			else {
				$('#update-program-form-submit').prop('disabled', false);
				$('#error-message').html('<p>The fields marked in red must be completed before submitting the form</p>').css('visibility','visible');
			}

			return false;

		});


		// Update Show
		$(document).on('click', '#update-show-form-submit', function(e) { 

			$('#update-show-form-submit').prop('disabled', true);

			var error = '';

			var showId = $('#show-id').val();

			if(!showId) {
				error = '1';
			}

			var showTitle = $('#show-title').val();

			if(!showTitle) {
				error = '1';
				$('#show-title').css('border-size','1px');
				$('#show-title').css('border-color','red');
				$('#show-title').css('border-style','solid');
			}
			else {
				$('#show-title').css('border','none');
			}

			// Click back to visual mode
			$('#show-description-tmce').click();
			var description = '';
			var editor = tinyMCE.get('show-description');
			if (editor) {
				// Ok, the active tab is Visual
				description = editor.getContent({format : 'raw'});
			}
			else {
				// The active tab is HTML, so just query the textarea
				description = $('#show-description').val();
			}

			var hosts = $('#hosts').val();

			if(!error) {

				$.ajax({type: "POST",
				    cache: false,
					url:"/wp-admin/admin-ajax.php",
				    data: ({action : 'wruw_update_show', show: showId, title: showTitle, description: description, hosts: hosts}),
				    dataType: 'html',
				    success: function(html) {
				    	$('.open-p').hide();
				    	$('#update-show-form').html('<h3>Success! You have update the show: '+showTitle+'</h3><p>You will be redirected to your show page in 2 seconds or you can <a href="/wp-admin/admin.php?page=wruw-manage-current-show">Click Here</a></p>')
						setTimeout('location.href = "/wp-admin/admin.php?page=wruw-manage-current-show";',2000);
					},
				    error: function() {
				        alert('There was an error and the process can not be completed');
				    }

				});

			}
			else {
				$('#update-show-form-submit').prop('disabled', false);
				$('#error-message').html('<p>The fields marked in red must be completed before submitting the form</p>').css('visibility','visible');
			}

			return false;

		});



		// Add song to playlist
		$(document).on('click', '#new-song-submit', function(e) { 

			$('#new-song-submit').prop('disabled', true);
			$('#error-message').html('').css('visibility','hidden');
			$('#success-message').html('').css('visibility','hidden');

			var error = '';

			var showId = $('#show-id').val();

			if(!showId) {
				error = '1';
			}

			var songId = $('#song-id').val();

			var songName = $('#song-name').val();

			if(!songName) {
				error = '1';
				$('#song-name').css('border-size','1px');
				$('#song-name').css('border-color','red');
				$('#song-name').css('border-style','solid');
			}
			else {
				$('#song-name').css('border','none');
			}

			var songArtist = $('#song-artist').val();

			if(!songArtist) {
				error = '1';
				$('#song-artist').css('border-size','1px');
				$('#song-artist').css('border-color','red');
				$('#song-artist').css('border-style','solid');
			}
			else {
				$('#song-artist').css('border','none');
			}

			var songAlbum = $('#song-album').val();

			if(!songAlbum) {
				error = '1';
				$('#song-album').css('border-size','1px');
				$('#song-album').css('border-color','red');
				$('#song-album').css('border-style','solid');
			}
			else {
				$('#song-album').css('border','none');
			}

			var songLabel = $('#song-label').val();

			if(!songLabel) {
				error = '1';
				$('#song-label').css('border-size','1px');
				$('#song-label').css('border-color','red');
				$('#song-label').css('border-style','solid');
			}
			else {
				$('#song-label').css('border','none');
			}

			var songGenres = $('#song-genre').val();

			if($('#is-a-request').is(':checked') ) {
				var request = 1;
				var songRequest = 'Yes';
				var songRequestStyle = "song-request";
			}
			else {
				var request = '';
				var songRequest = '';
				var songRequestStyle = "";
			}

			if($('#is-new').is(':checked') ) {
				var newSong = 1;
				var songNew = 'Yes';
				var songNewStyle = "song-new";
			}
			else {
				var newSong = '';
				var songNew = '';
				var songNewStyle = "";
			}

			if(!error) {

				if(!songId) {

					if(!songGenres) {
						$('#new-song-details').show();
						$('#new-song-submit').prop('disabled', false);
					}
					else {

						$.ajax({type: "POST",
						    cache: false,
							url:"/wp-admin/admin-ajax.php",
						    data: ({action : 'wruw_song_save_to_playlist', show: showId, song: songId, name: songName, artist: songArtist, album: songAlbum, label: songLabel, genres: songGenres, request: request, newsong: newSong}),
						    dataType: 'html',
						    success: function(html) {
						    	$('#success-message').html('<p>Success! '+songName+' added to the playlist</p>').css('visibility','visible');
						    	$('#error-message').html('').css('visibility','hidden');
						    	$('#song-id').val('');
						    	$('#song-name').val('');
						    	$('#song-artist').val('');
						    	$('#song-album').val('');
						    	$('#song-label').val('');
						    	$('#song-genre').val('');
						    	$('#new-song-details').val();
						    	$('#new-song-details').hide();
						    	$('#is-a-request').prop('checked', false);
						    	$('#is-new').prop('checked', false);
						    	$('#show-playlist li:first-child').remove();
						    	$('#show-playlist li#default-playlist-song').remove();
					    		$('#show-playlist').prepend('<li><div class="song-field">Artist</div><div class="song-field">Song</div><div class="song-field">Album</div><div class="song-field">Label</div><div class="song-field">Request</div><div class="song-field">New</div><div class="song-field">Update</div></li><li id="song-'+html+'" class="'+songRequestStyle+' '+songNewStyle+'"><div class="song-field artist">'+songArtist+'</div><div class="song-field song">'+songName+'</div><div class="song-field album">'+songAlbum+'</div><div class="song-field label">'+songLabel+'</div><div class="song-field">'+songRequest+'</div><div class="song-field">'+songNew+'</div><div class="song-field"><a class="edit-song" data-song="'+html+'" data-show="'+showId+'" data-request="'+request+'" data-new="'+newSong+'" href="#" title="Update Song"><i class="fa fa-pencil"></i></a> &nbsp; / &nbsp; <a class="delete-song" data-song="'+html+'" data-show="'+showId+'" data-request="'+request+'" data-new="'+newSong+'" href="#" title="Delete Song"><i class="fa fa-trash-o"></i></div></li>');

						    	setTimeout(function(){
						    		$('#success-message').html('').css('visibility','hidden');
						    		$('#new-song-submit').prop('disabled', false);
						    	},5000);

							},
						    error: function() {
						    	$('#success-message').html('');
						        $('#error-message').html('<p>The song was unable to be added to the playlist, please try again.</p>').css('visibility','visible');
						    }

						});

					}
				}
				else {

					$('#new-song-details').hide();

					$.ajax({type: "POST",
					    cache: false,
						url:"/wp-admin/admin-ajax.php",
					    data: ({action : 'wruw_song_save_to_playlist', show: showId, song: songId, name: songName, artist: songArtist, album: songAlbum, label: songLabel, request: request, newsong: newSong}),
					    dataType: 'html',
					    success: function(html) {
					    	$('#success-message').html('<p>Success! '+songName+' added to the playlist</p>').css('visibility','visible');
					    	$('#error-message').html('').css('visibility','hidden');
					    	$('#song-id').val('');
					    	$('#song-name').val('');
					    	$('#song-artist').val('');
					    	$('#song-album').val('');
					    	$('#song-label').val('');
					    	$('#song-genre').val('');
					    	$('#new-song-details').val();
					    	$('#is-a-request').prop('checked', false);
					    	$('#is-new').prop('checked', false);
							$('#show-playlist li:first-child').remove();
							$('#show-playlist li#default-playlist-song').remove();
					    	$('#show-playlist').prepend('<li><div class="song-field">Artist</div><div class="song-field">Song</div><div class="song-field">Album</div><div class="song-field">Label</div><div class="song-field">Request</div><div class="song-field">New</div><div class="song-field">Update</div></li><li id="song-'+songId+'" class="'+songRequestStyle+' '+songNewStyle+'"><div class="song-field artist">'+songArtist+'</div><div class="song-field song">'+songName+'</div><div class="song-field album">'+songAlbum+'</div><div class="song-field label">'+songLabel+'</div><div class="song-field">'+songRequest+'</div><div class="song-field">'+songNew+'</div><div class="song-field"><a class="edit-song" data-song="'+songId+'" data-show="'+showId+'" data-request="'+request+'" data-new="'+newSong+'" href="#" title="Update Song"><i class="fa fa-pencil"></i></a> &nbsp; / &nbsp; <a class="delete-song" data-song="'+songId+'" data-show="'+showId+'" data-request="'+request+'" data-new="'+newSong+'" href="#" title="Delete Song"><i class="fa fa-trash-o"></i></a></div></li>');

					    	setTimeout(function(){
					    		$('#success-message').html('').css('visibility','hidden');
					    		$('#new-song-submit').prop('disabled', false);
					    	},5000);

						},
					    error: function() {
					    	$('#success-message').html('');
					        $('#error-message').html('<p>The song was unable to be added to the playlist, please try again.</p>').css('visibility','visible');
					    }

					});
				}

			}
			else {
				$('#new-song-submit').prop('disabled', false);
				$('#error-message').html('<p>The fields marked in red must be completed before submitting the form</p>').css('visibility','visible');
			}

			return false;

		});


		// Update song in playlist
		$(document).on('click', '#edit-song-submit', function(e) { 

			$('#edit-song-submit').prop('disabled', true);
			$('#edit-error-message').html('').css('visibility','hidden');
			$('#edit-success-message').html('').css('visibility','hidden');

			var error = '';

			var showId = $('#edit-show-id').val();

			if(!showId) {
				error = '1';
			}

			var origSongId = $('#edit-orig-song-id').val();

			if(!origSongId) {
				error = '1';
			}

			var songId = $('#edit-song-id').val();

			var songName = $('#edit-song-name').val();

			if(!songName) {
				error = '1';
				$('#edit-song-name').css('border-size','1px');
				$('#edit-song-name').css('border-color','red');
				$('#edit-song-name').css('border-style','solid');
			}
			else {
				$('#edit-song-name').css('border','none');
			}

			var songArtist = $('#edit-song-artist').val();

			if(!songArtist) {
				error = '1';
				$('#edit-song-artist').css('border-size','1px');
				$('#edit-song-artist').css('border-color','red');
				$('#edit-song-artist').css('border-style','solid');
			}
			else {
				$('#edit-song-artist').css('border','none');
			}

			var songAlbum = $('#edit-song-album').val();

			if(!songAlbum) {
				error = '1';
				$('#edit-song-album').css('border-size','1px');
				$('#edit-song-album').css('border-color','red');
				$('#edit-song-album').css('border-style','solid');
			}
			else {
				$('#edit-song-album').css('border','none');
			}

			var songLabel = $('#edit-song-label').val();

			if(!songLabel) {
				error = '1';
				$('#edit-song-label').css('border-size','1px');
				$('#edit-song-label').css('border-color','red');
				$('#edit-song-label').css('border-style','solid');
			}
			else {
				$('#edit-song-label').css('border','none');
			}

			var songGenres = $('#edit-song-genre').val();

			if($('#edit-is-a-request').is(':checked') ) {
				var request = 1;
				var songRequest = 'Yes';
				var songRequestStyle = "song-request";
			}
			else {
				var request = '';
				var songRequest = '';
				var songRequestStyle = "";
			}

			if($('#edit-is-new').is(':checked') ) {
				var newSong = 1;
				var songNew = 'Yes';
				var songNewStyle = "song-new";
			}
			else {
				var newSong = '';
				var songNew = '';
				var songNewStyle = "";
			}

			if(!error) {

				if(!songId) {

					if(!songGenres) {
						$('#edit-new-song-details').show();
						$('#edit-song-submit').prop('disabled', false);
					}
					else {

						$.ajax({type: "POST",
						    cache: false,
							url:"/wp-admin/admin-ajax.php",
						    data: ({action : 'wruw_song_update_playlist', show: showId, song: songId, orig: origSongId, name: songName, artist: songArtist, album: songAlbum, label: songLabel, genres: songGenres, request: request, newsong: newSong}),
						    dataType: 'html',
						    success: function(html) {
						    	$('#edit-success-message').html('<p>Success! '+songName+' updated in the playlist</p>').css('visibility','visible');
						    	$('#edit-error-message').html('').css('visibility','hidden');
						    	$('#edit-song-id').val('');
						    	$('#edit-song-name').val('');
						    	$('#edit-song-artist').val('');
						    	$('#edit-song-album').val('');
						    	$('#edit-song-label').val('');
						    	$('#edit-song-genre').val('');
						    	$('#edit-new-song-details').val();
						    	$('#edit-new-song-details').hide();
						    	$('#edit-is-a-request').prop('checked', false);
						    	$('#edit-is-new').prop('checked', false);
					    		$('#song-'+origSongId).html('<div class="song-field artist">'+songArtist+'</div><div class="song-field song">'+songName+'</div><div class="song-field album">'+songAlbum+'</div><div class="song-field label">'+songLabel+'</div><div class="song-field">'+songRequest+'</div><div class="song-field">'+songNew+'</div><div class="song-field"><a class="edit-song" data-song="'+html+'" data-show="'+showId+'" data-request="'+request+'" data-new="'+newSong+'" href="#" title="Update Song"><i class="fa fa-pencil"></i></a> &nbsp; / &nbsp; <a class="delete-song" data-song="'+html+'" data-show="'+showId+'" data-request="'+request+'" data-new="'+newSong+'" href="#" title="Delete Song"><i class="fa fa-trash-o"></i></div>');
					    		$('#song-'+origSongId).attr("class",songRequestStyle+' '+songNewStyle);
					    		$('#song-'+origSongId).attr("id",'song-'+html);

						    	setTimeout(function(){
						    		$('#edit-success-message').html('').css('visibility','hidden');
						    		$('#edit-song-holder').remove();
						    	},2000);

							},
						    error: function() {
						    	$('#edit-success-message').html('');
						        $('#edit-error-message').html('<p>The song was unable to be updated in the playlist, please try again.</p>').css('visibility','visible');
						    	$('#edit-song-submit').prop('disabled', false);
						    }

						});

					}
				}
				else {

					$('#edit-new-song-details').hide();

					$.ajax({type: "POST",
					    cache: false,
						url:"/wp-admin/admin-ajax.php",
					    data: ({action : 'wruw_song_update_playlist', show: showId, song: songId, orig: origSongId, name: songName, artist: songArtist, album: songAlbum, label: songLabel, request: request, newsong: newSong}),
					    dataType: 'html',
					    success: function(html) {
					    	$('#edit-success-message').html('<p>Success! '+songName+' updated in the playlist</p>').css('visibility','visible');
					    	$('#edit-error-message').html('').css('visibility','hidden');
					    	$('#edit-song-id').val('');
					    	$('#edit-song-name').val('');
					    	$('#edit-song-artist').val('');
					    	$('#edit-song-album').val('');
					    	$('#edit-song-label').val('');
					    	$('#edit-song-genre').val('');
					    	$('#edit-new-song-details').val();
					    	$('#edit-is-a-request').prop('checked', false);
					    	$('#edit-is-new').prop('checked', false);
					    	$('#song-'+origSongId).html('<div class="song-field artist">'+songArtist+'</div><div class="song-field song">'+songName+'</div><div class="song-field album">'+songAlbum+'</div><div class="song-field label">'+songLabel+'</div><div class="song-field">'+songRequest+'</div><div class="song-field">'+songNew+'</div><div class="song-field"><a class="edit-song" data-song="'+songId+'" data-show="'+showId+'" data-request="'+request+'" data-new="'+newSong+'" href="#" title="Update Song"><i class="fa fa-pencil"></i></a> &nbsp; / &nbsp; <a class="delete-song" data-song="'+songId+'" data-show="'+showId+'" data-request="'+request+'" data-new="'+newSong+'" href="#" title="Delete Song"><i class="fa fa-trash-o"></i></a></div>');
					    	$('#song-'+origSongId).attr("class",songRequestStyle+' '+songNewStyle);
					    	$('#song-'+origSongId).attr("id",'song-'+songId);

					    	setTimeout(function(){
					    		$('#edit-success-message').html('').css('visibility','hidden');
					    		$('#edit-song-holder').remove();
					    	},2000);

						},
					    error: function() {
					    	$('#edit-success-message').html('');
					        $('#edit-error-message').html('<p>The song was unable to be updated in the playlist, please try again.</p>').css('visibility','visible');
					    	$('#edit-song-submit').prop('disabled', false);
					    }

					});
				}

			}
			else {
				$('#new-song-submit').prop('disabled', false);
				$('#error-message').html('<p>The fields marked in red must be completed before submitting the form</p>').css('visibility','visible');
			}

			return false;

		});


		// Edit song in playlist
		$(document).on('click', '.edit-song', function(e) { 

			$('#edit-song-holder').remove();

			var error = '';

			var showId = $(this).attr('data-show');

			if(!showId) {
				error = '1';
			}

			var songId = $(this).attr('data-song');

			if(!songId) {
				error = '1';
			}

			if($(this).attr('data-request') != '') {
				var request = 'checked';
			}
			else {
				var request = '';
			}

			if($(this).attr('data-new') != '') {
				var newSong = 'checked';
			}
			else {
				var newSong = '';
			}

			if(!error) {

				var artist = $(this).closest('li#song-'+songId).children('.artist').text();
				var song = $(this).closest('li#song-'+songId).children('.song').text();
				var album = $(this).closest('li#song-'+songId).children('.album').text();
				var label = $(this).closest('li#song-'+songId).children('.label').text();

				$('body').append('<div id="edit-song-holder"><div class="close-button">X</div><form id="edit-song-form" onsubmit="return false;" method="post"><input id="edit-show-id" type="hidden" value="'+showId+'" name="show-id"><input id="edit-orig-song-id" type="hidden" value="'+songId+'" name="orig-song-id"><input id="edit-song-id" type="hidden" value="'+songId+'" name="song-id"><h2>Update This Playlist Entry</h2><div class="data-field"><div class="song-field"><label>Artist Name:</label><br><input type="text" placeholder="Artist Name" id="edit-song-artist" name="song-artist" autocomplete="off" class="ac_input" value="'+artist+'"></div><div class="song-field"><label>Song Name:</label><br><span id="edit-song-name-holder"><input type="text" placeholder="Song Name" id="edit-song-name" name="song-name" autocomplete="off" class="ac_input" value="'+song+'"></span></div><div class="song-field"><label>Album Name:</label><br><input type="text" placeholder="Album Name" id="edit-song-album" name="song-album" autocomplete="off" class="ac_input" value="'+album+'"></div><div class="song-field"><label>Album Label:</label><br><input type="text" placeholder="Album Label" id="edit-song-label" name="song-label" autocomplete="off" class="ac_input" value="'+label+'"></div></div><div id="edit-new-song-details"><div class="data-field"><p>You are adding a brand new song, please select the song\'s genres below and then click the submit button.</p><div class="song-field"><label>Song Genre:</label><br><select id="edit-song-genre" name="song-genre"><option value="">== Select Genre ==</option><option value="general-other">General/Other</option><option value="hip-hop">Hip Hop</option><option value="jazz">Jazz</option><option value="loud-rock">Loud Rock</option><option value="rpm">RPM</option><option value="world">World</option></select></div></div></div><div class="data-field"><input type="submit" value="Update This Song" id="edit-song-submit" name="edit-song-submit"><input type="checkbox" id="edit-is-a-request" name="is-a-request" '+request+'><label for="edit-is-a-request">Is A Request</label><input type="checkbox" id="edit-is-new" name="is-new" '+newSong+'><label for="edit-is-new">Is New</label><div id="edit-error-message"></div><div id="edit-success-message"></div></div></form></div>');

				// Auto song suggestions
				$("#edit-song-artist").autocomplete("/wp-admin/admin-ajax.php?action=wruw_artist_auto_suggest", {
					width: 365,
					matchContains: true,
					minChars: 3,
					scroll: true,
					selectFirst: false,
					cacheLength: 0
				});

				$("#edit-song-name").autocomplete("/wp-admin/admin-ajax.php?action=wruw_song_auto_suggest", {
					width: 365,
					matchContains: true,
					minChars: 3,
					scroll: true,
					selectFirst: false,
					cacheLength: 0
				});

				$("#edit-song-album").autocomplete("/wp-admin/admin-ajax.php?action=wruw_album_auto_suggest", {
					width: 365,
					matchContains: true,
					minChars: 3,
					scroll: true,
					selectFirst: false,
					cacheLength: 0
				});

				$("#edit-song-label").autocomplete("/wp-admin/admin-ajax.php?action=wruw_label_auto_suggest", {
					width: 365,
					matchContains: true,
					minChars: 3,
					scroll: true,
					selectFirst: false,
					cacheLength: 0
				});

				$("#edit-song-name").result(function() {
		    		findSongName('update');
		    		$(this).flushCache();
				});

				$("#edit-song-artist, #edit-song-album, #edit-song-label").result(function() {
		    		//findSong('update');
		    		$(this).flushCache();
				});

			}

			return false;

		});

		// Close edit song box
		$(document).on('click', '#edit-song-holder .close-button', function(e) { 
			$('#edit-song-holder').remove();
		});


		// Delete song from playlist
		$(document).on('click', '.delete-song', function(e) { 

			var reallyDelete = confirm("Are you sure you want to delete this song from the playlist? This action can not be undone.");

			if (reallyDelete == true) {

				var error = '';

				var showId = $(this).attr('data-show');

				if(!showId) {
					error = '1';
				}

				var songId = $(this).attr('data-song');

				if(!songId) {
					error = '1';
				}

				if($(this).attr('data-request') != '') {
					var request = 1;
				}
				else {
					var request = '';
				}

				if($(this).attr('data-new') != '') {
					var newSong = 1;
				}
				else {
					var newSong = '';
				}

				toBeRemoved = $(this).closest('li#song-'+songId);

				if(!error) {

					$.ajax({type: "POST",
						    cache: false,
							url:"/wp-admin/admin-ajax.php",
						    data: ({action : 'wruw_song_delete_from_playlist', show: showId, song: songId, request: request, newsong: newSong}),
						    dataType: 'html',
						    success: function(html) {
						    	$('#success-message').html('<p>Success! The song has been removed from the playlist</p>').css('visibility','visible');
						    	$('#error-message').html('').css('visibility','hidden');
						    	$('#song-id').val('');
						    	$('#song-name').val('');
						    	$('#song-artist').val('');
						    	$('#song-album').val('');
						    	$('#song-label').val('');
						    	$('#song-genre').val('');
						    	$('#new-song-details').val();
						    	$('#is-a-request').prop('checked', false);
						    	$('#is-new').prop('checked', false);
								toBeRemoved.remove();

						    	setTimeout(function(){
						    		$('#success-message').html('').css('visibility','hidden');
						    		$('#new-song-submit').prop('disabled', false);
						    	},5000);

							},
						    error: function() {
						    	$('#success-message').html('');
						        $('#error-message').html('<p>The song was unable to be removed from the playlist, please try again.</p>').css('visibility','visible');
						    }

					});

				}

			}

			return false;

		});


		// Auto song suggestions
		$("#song-artist").autocomplete("/wp-admin/admin-ajax.php?action=wruw_artist_auto_suggest", {
			width: 365,
			matchContains: true,
			minChars: 3,
			scroll: true,
			selectFirst: false,
			cacheLength: 0
		});

		$("#song-name").autocomplete("/wp-admin/admin-ajax.php?action=wruw_song_auto_suggest", {
			width: 365,
			matchContains: true,
			minChars: 3,
			scroll: true,
			selectFirst: false,
			cacheLength: 0
		});

		$("#song-album").autocomplete("/wp-admin/admin-ajax.php?action=wruw_album_auto_suggest", {
			width: 365,
			matchContains: true,
			minChars: 3,
			scroll: true,
			selectFirst: false,
			cacheLength: 0
		});

		$("#song-label").autocomplete("/wp-admin/admin-ajax.php?action=wruw_label_auto_suggest", {
			width: 365,
			matchContains: true,
			minChars: 3,
			scroll: true,
			selectFirst: false,
			cacheLength: 0
		});

		$("#song-name").result(function() {
    		findSongName();
    		$(this).flushCache();
		});

		$("#song-artist,#song-album,#song-label").result(function() {
    		//findSong();
    		$(this).flushCache();
		});


		function findSong(update) { 

			if(update == 'update') { 

				if(!$("#edit-song-name").val()) { 

					$('#edit-song-submit').prop('disabled', true);
					$('#edit-song-name-holder').html('<img src="/wp-content/plugins/wruw/css/indicator.gif" />');
				
					var artist = $("#edit-song-artist").val();
					var album = $("#edit-song-album").val();
					var label = $("#edit-song-label").val();

					$.ajax({type: "POST",
						    cache: false,
							url:"/wp-admin/admin-ajax.php",
						    data: ({action : 'wruw_find_songs', artist: artist, album: album, label: label, update: 'update'}),
						    dataType: 'html',
						    success: function(html) {
						    	if(html) {
						    		$('#edit-song-name-holder').html(html);
						    		$('#edit-song-submit').prop('disabled', false);
						    	}
						    	else {
						    		$('#edit-song-name-holder').html('<input type="text" placeholder="Song Name" id="edit-song-name" name="song-name">');
						    		$("#edit-song-name").autocomplete("/wp-admin/admin-ajax.php?action=wruw_song_auto_suggest", {
										width: 365,
										matchContains: true,
										minChars: 3,
										scroll: true,
										selectFirst: false,
										cacheLength: 0
									});
									$("#edit-song-name").result(function() {
							    		findSongName('update');
							    		$(this).flushCache();
									});
									$('#edit-song-submit').prop('disabled', false);
						    	}
							},
						    error: function() {
						    }

					});

				}

			}
			else { 

				if(!$("#song-name").val()) { 

					$('#new-song-submit').prop('disabled', true);
					$('#song-name-holder').html('<img src="/wp-content/plugins/wruw/css/indicator.gif" />');
				
					var artist = $("#song-artist").val();
					var album = $("#song-album").val();
					var label = $("#song-label").val();

					$.ajax({type: "POST",
						    cache: false,
							url:"/wp-admin/admin-ajax.php",
						    data: ({action : 'wruw_find_songs', artist: artist, album: album, label: label}),
						    dataType: 'html',
						    success: function(html) {
						    	if(html) {
						    		$('#song-name-holder').html(html);
						    		$('#new-song-submit').prop('disabled', false);
						    	}
						    	else {
						    		$('#song-name-holder').html('<input type="text" placeholder="Song Name" id="song-name" name="song-name">');
						    		$("#song-name").autocomplete("/wp-admin/admin-ajax.php?action=wruw_song_auto_suggest", {
										width: 365,
										matchContains: true,
										minChars: 3,
										scroll: true,
										selectFirst: false,
										cacheLength: 0
									});
									$("#song-name").result(function() {
							    		findSongName();
							    		$(this).flushCache();
									});
									$('#new-song-submit').prop('disabled', false);
						    	}
							},
						    error: function() {
						    }

					});

				}

			}

		}


		










		function findSongName(update) { 

			





			if(update == 'update') { 

				var songName = $('#edit-song-name').val().split(' - ');

				$('#edit-song-submit').prop('disabled', true);
				
				var artist = $("#song-artist").val();
				$("#edit-song-artist").css('background-image','url(/wp-content/plugins/wruw/css/indicator.gif)');
				$("#edit-song-artist").css('background-repeat','no-repeat');
				$("#edit-song-artist").css('background-position','right center');
				var album = $("#edit-song-album").val();
				$("#edit-song-album").css('background-image','url(/wp-content/plugins/wruw/css/indicator.gif)');
				$("#edit-song-album").css('background-repeat','no-repeat');
				$("#edit-song-album").css('background-position','right center');
				var label = $("#edit-song-label").val();
				$("#edit-song-label").css('background-image','url(/wp-content/plugins/wruw/css/indicator.gif)');
				$("#edit-song-label").css('background-repeat','no-repeat');
				$("#edit-song-label").css('background-position','right center');
				var name = $("#edit-song-name").val();

				$.ajax({type: "POST",
						    cache: false,
							url:"/wp-admin/admin-ajax.php",
						    data: ({action : 'wruw_song_select_update', name : songName[0], artist : songName[1]}),
						    dataType: 'json',
						    success: function(json) {
						    	if(json) {
						    		
						    		if(!$("#edit-song-artist").val()) { 
						    			$("#edit-song-artist").val(json[1]);
						    			$("#edit-song-id").val(json[4]);
						    		}
						    		else { 
						    			if( $("#edit-song-artist").val().toLowerCase() == json[1].toLowerCase() ) { 
						    				$("#edit-song-id").val(json[4]);
						    			}
						    			else { 
						    				$("#edit-song-id").val();
						    			}
						    		}

						    		if(!$("#edit-song-album").val()) {
						    			$("#edit-song-album").val(json[2]);
						    		}

						    		if(!$("#edit-song-label").val()) {
						    			$("#edit-song-label").val(json[3]);
						    		}

						    		$("#edit-song-name").val(json[0]);
						    		
									$('#edit-song-submit').prop('disabled', false);
						    	}

						    	$("#edit-song-artist").css('background-image','none');
								$("#edit-song-album").css('background-image','none');
								$("#edit-song-label").css('background-image','none');
						    	
							},
						    error: function() {
						    }

					});

			}









			else { 

				var songName = $('#song-name').val().split(' - ');

				$('#new-song-submit').prop('disabled', true);
				
				var artist = $("#song-artist").val();
				$("#song-artist").css('background-image','url(/wp-content/plugins/wruw/css/indicator.gif)');
				$("#song-artist").css('background-repeat','no-repeat');
				$("#song-artist").css('background-position','right center');
				var album = $("#song-album").val();
				$("#song-album").css('background-image','url(/wp-content/plugins/wruw/css/indicator.gif)');
				$("#song-album").css('background-repeat','no-repeat');
				$("#song-album").css('background-position','right center');
				var label = $("#song-label").val();
				$("#song-label").css('background-image','url(/wp-content/plugins/wruw/css/indicator.gif)');
				$("#song-label").css('background-repeat','no-repeat');
				$("#song-label").css('background-position','right center');
				var name = $("#song-name").val();

				$.ajax({type: "POST",
						    cache: false,
							url:"/wp-admin/admin-ajax.php",
						    data: ({action : 'wruw_song_select_update', name : songName[0], artist : songName[1]}),
						    dataType: 'json',
						    success: function(json) {
						    	if(json) {
						    		
						    		if(!$("#song-artist").val()) { 
						    			$("#song-artist").val(json[1]);
						    			$("#song-id").val(json[4]);
						    		}
						    		else { 
						    			if( $("#song-artist").val().toLowerCase() == json[1].toLowerCase() ) { 
						    				$("#song-id").val(json[4]);
						    			}
						    			else { 
						    				$("#song-id").val();
						    			}
						    		}

						    		if(!$("#song-album").val()) {
						    			$("#song-album").val(json[2]);
						    		}

						    		if(!$("#song-label").val()) {
						    			$("#song-label").val(json[3]);
						    		}

						    		$("#song-name").val(json[0]);
						    		
									$('#new-song-submit').prop('disabled', false);
						    	}

						    	$("#song-artist").css('background-image','none');
								$("#song-album").css('background-image','none');
								$("#song-label").css('background-image','none');
						    	
							},
						    error: function() {
						    }

					});

			}

		}


		// Reset new song form fields
		$(document).on('click', '#reset-fields', function(e) { 

			$('#success-message').html('').css('visibility','hidden');
			$('#error-message').html('').css('visibility','hidden');
			$('#song-id').val('');
			$('#song-artist').val('');
			$('#song-artist').css('border','none');
			$('#song-album').val('');
			$('#song-album').css('border','none');
			$('#song-label').val('');
			$('#song-label').css('border','none');
			$('#song-genre').val('');
			$('#new-song-details').val();
			$('#new-song-details').hide();
			$('#is-a-request').prop('checked', false);
			$('#is-new').prop('checked', false);
			$('#song-name-holder').html('<input type="text" placeholder="Song Name" id="song-name" name="song-name">');
			$('#song-name').val('');
			$('#song-name').css('border','none');
			$("#song-name").autocomplete("/wp-admin/admin-ajax.php?action=wruw_song_auto_suggest", {
					width: 365,
					matchContains: true,
					minChars: 3,
					scroll: true,
					selectFirst: false,
					cacheLength: 0
			});
			$("#song-name").result(function() {
    			findSongName();
    			$(this).flushCache();
			});

			return false;

		});


		// Enter new song on select
		$(document).on('change', 'select#song-name', function() { 

			if( $(this).val() == 'enter-new-song' ) { 
				$('#song-name-holder').html('<input type="text" placeholder="Song Name" id="song-name" name="song-name">');
				$("#song-name").autocomplete("/wp-admin/admin-ajax.php?action=wruw_song_auto_suggest", {
					width: 365,
					matchContains: true,
					minChars: 3,
					scroll: true,
					selectFirst: false,
					cacheLength: 0
				});
				$("#song-name").result(function() {
    				findSongName();
    				$(this).flushCache();
				});
			}
			else if( $(this).val() != '' ) { 

				$("#song-artist").css('background-image','url(/wp-content/plugins/wruw/css/indicator.gif)');
				$("#song-artist").css('background-repeat','no-repeat');
				$("#song-artist").css('background-position','right center');
				$("#song-album").css('background-image','url(/wp-content/plugins/wruw/css/indicator.gif)');
				$("#song-album").css('background-repeat','no-repeat');
				$("#song-album").css('background-position','right center');
				$("#song-label").css('background-image','url(/wp-content/plugins/wruw/css/indicator.gif)');
				$("#song-label").css('background-repeat','no-repeat');
				$("#song-label").css('background-position','right center');
				
				$.ajax({type: "POST",
					    cache: false,
						url:"/wp-admin/admin-ajax.php",
					    data: ({action : 'wruw_song_select_update', song: $(this).val()}),
					    dataType: 'json',
					    success: function(json) {
					    	if(json) {

					    		if(!$("#song-artist").val()) { 
					    			$("#song-artist").val(json[1]);
					    			$("#song-id").val(json[4]);
					    		}
					    		else { 
					    			if( $("#song-artist").val().toLowerCase() == json[1].toLowerCase() ) { 
					    				$("#song-id").val(json[4]);
					    			}
					    			else { 
					    				$("#song-id").val();
					    			}
					    		}

					    		if(!$("#song-album").val()) {
					    			$("#song-album").val(json[2]);
					    		}

					    		if(!$("#song-label").val()) {
					    			$("#song-label").val(json[3]);
					    		}

								$('#song-name-holder').html('<input type="text" placeholder="Song Name" id="song-name" name="song-name" value="">');
								$("#song-name").val(json[0]);
								$("#song-name").autocomplete("/wp-admin/admin-ajax.php?action=wruw_song_auto_suggest", {
									width: 365,
									matchContains: true,
									minChars: 3,
									scroll: true,
									selectFirst: false,
									cacheLength: 0
								});
								$("#song-name").result(function() {
						    		findSongName();
						    		$(this).flushCache();
								});
								
					    	}

					    	$("#song-artist").css('background-image','none');
							$("#song-album").css('background-image','none');
							$("#song-label").css('background-image','none');
					    	
						},
					    error: function() {
					    	$("#song-artist").css('background-image','none');
							$("#song-album").css('background-image','none');
							$("#song-label").css('background-image','none');
					    }

				});

			}

		});


		// Enter new song on update select
		$(document).on('change', 'select#edit-song-name', function() { 

			if( $(this).val() == 'enter-new-song' ) {
				$('#edit-song-name-holder').html('<input type="text" placeholder="Song Name" id="edit-song-name" name="song-name">');
				$("#edit-song-name").autocomplete("/wp-admin/admin-ajax.php?action=wruw_song_auto_suggest", {
					width: 365,
					matchContains: true,
					minChars: 3,
					scroll: true,
					selectFirst: false,
					cacheLength: 0
				});
				$("#edit-song-name").result(function() {
    				findSongName('update');
    				$(this).flushCache();
				});
			}
			else if( $(this).val() != '' ) {
				
				$("#edit-song-artist").css('background-image','url(/wp-content/plugins/wruw/css/indicator.gif)');
				$("#edit-song-artist").css('background-repeat','no-repeat');
				$("#edit-song-artist").css('background-position','right center');
				$("#edit-song-album").css('background-image','url(/wp-content/plugins/wruw/css/indicator.gif)');
				$("#edit-song-album").css('background-repeat','no-repeat');
				$("#edit-song-album").css('background-position','right center');
				$("#edit-song-label").css('background-image','url(/wp-content/plugins/wruw/css/indicator.gif)');
				$("#edit-song-label").css('background-repeat','no-repeat');
				$("#edit-song-label").css('background-position','right center');
				
				$.ajax({type: "POST",
					    cache: false,
						url:"/wp-admin/admin-ajax.php",
					    data: ({action : 'wruw_song_select_update', song: $(this).val()}),
					    dataType: 'json',
					    success: function(json) {
					    	if(json) {
					    		
					    		if(!$("#edit-song-artist").val()) { 
					    			$("#edit-song-artist").val(json[1]);
					    			$("#edit-song-id").val(json[4]);
					    		}
					    		else { 
					    			if( $("#edit-song-artist").val().toLowerCase() == json[1].toLowerCase() ) { 
					    				$("#edit-song-id").val(json[4]);
					    			}
					    			else { 
					    				$("#edit-song-id").val();
					    			}
					    		}

					    		if(!$("#edit-song-album").val()) {
					    			$("#edit-song-album").val(json[2]);
					    		}

					    		if(!$("#edit-song-label").val()) {
					    			$("#edit-song-label").val(json[3]);
					    		}

								$('#edit-song-name-holder').html('<input type="text" placeholder="Song Name" id="edit-song-name" name="song-name" value="">');
								$("#edit-song-name").val(json[0]);
								$("#edit-song-name").autocomplete("/wp-admin/admin-ajax.php?action=wruw_song_auto_suggest", {
									width: 365,
									matchContains: true,
									minChars: 3,
									scroll: true,
									selectFirst: false,
									cacheLength: 0
								});
								$("#edit-song-name").result(function() {
						    		findSongName('update');
						    		$(this).flushCache();
								});
								
					    	}

					    	$("#edit-song-artist").css('background-image','none');
							$("#edit-song-album").css('background-image','none');
							$("#edit-song-label").css('background-image','none');
					    	
						},
					    error: function() {
					    	$("#edit-song-artist").css('background-image','none');
							$("#edit-song-album").css('background-image','none');
							$("#edit-song-label").css('background-image','none');
					    }

				});

			}

		});


		// Remove stored song id if field is manually updated
		$(document).on('keyup', '#new-song-form input[type="text"]', function() {
			
			$("#song-id").val('');

			if($('select#song-name').length) { 
				$('#song-name-holder').html('<input type="text" placeholder="Song Name" id="song-name" name="song-name">');
				$("#song-name").autocomplete("/wp-admin/admin-ajax.php?action=wruw_song_auto_suggest", {
						width: 365,
						matchContains: true,
						minChars: 3,
						scroll: true,
						selectFirst: false,
						cacheLength: 0
				});
				$("#song-name").result(function() {
    				findSongName();
    				$(this).flushCache();
				});
			}

		});


		// Remove stored song id if field is manually updated
		$(document).on('keyup', '#edit-song-form input[type="text"]', function() { 
			
			$("#edit-song-id").val('');

			if($('select#edit-song-name').length) { 
				$('#edit-song-name-holder').html('<input type="text" placeholder="Song Name" id="edit-song-name" name="song-name">');
				$("#edit-song-name").autocomplete("/wp-admin/admin-ajax.php?action=wruw_song_auto_suggest", {
						width: 365,
						matchContains: true,
						minChars: 3,
						scroll: true,
						selectFirst: false,
						cacheLength: 0
				});
				$("#edit-song-name").result(function() {
    				findSongName('update');
    				$(this).flushCache();
				});
			}

		});


     	// Wordpress image upload
     	$('#upload_image_button').click(function() {
     		formfield = $('#upload_image').attr('name');
     		tb_show('', 'media-upload.php?type=image&amp;amp;TB_iframe=true');
     		return false;
		});

		window.send_to_editor = function(html) {
     		imgurl = $('img',html).attr('src');

     		$.ajax({type: "POST",
					    cache: false,
						url:"/wp-admin/admin-ajax.php",
					    data: ({action : 'wruw_attachment_by_url', url: imgurl}),
					    dataType: 'json',
					    success: function(html) {
							$('#upload_image').val(html);
     						$('#upload_image_prev').attr('src',imgurl).show();
						},
					    error: function() {
					    }

				});

     		tb_remove();
    	}


    	// Song search even without option being selected
    	$(document).on('change', '#song-artist, #song-album, #song-label', function(e) { 

    		setTimeout( function() {
			        
    			if(!$('.ac_results').is(':visible')){ 
    				//findSong();
    				$(this).flushCache();
	    		}

			}, 500);  

    	});


    	// Song search even without option being selected
    	$(document).on('change', '#edit-song-artist, #edit-song-album, #edit-song-label', function(e) { 

    		setTimeout( function() {
			        
    			if(!$('.ac_results').is(':visible')){ 
    				//findSong('update');
    				$(this).flushCache();
	    		}

			}, 500);  

    	});


    	$(document).on('change', '.request-played', function(e) {

			var requestId = $(this).attr('data-request');
			var thisId = $(this).attr('id');

			if($('#'+thisId).is(':checked')) {
				var isPlayed = '1';
			}
			else {
				var isPlayed = '';
			}

			if(requestId && isPlayed) {

				var reallyUpdate = confirm("Are you sure you want to mark this listener request as read?");

				if (reallyUpdate == true) {

					$.ajax({type: "POST",
						    cache: false,
							url:"/wp-admin/admin-ajax.php",
						    data: ({action : 'wruw_mark_request_played', request: requestId}),
						    dataType: 'html',
						    success: function(html) {
						    	$('#request-holder-'+requestId+' .checked-holder').html('<img src="/wp-content/plugins/wruw/images/checked.png" width="20" height="20" />');
								$('#requests-holder').hide();
				          		$.cookie("showRequestBox", "0", { path: '/' });
							},
						    error: function() {
						    }
						});
				}
				else {
					$('#'+thisId).attr('checked', false);
				}
			}

		});

    	

		// Fancybox
		if(jQuery.browser.mobile) {

		    // Mobile
		    $(".fancybox").fancybox({
		      fitToView : true,
		      autoSize  : true,
		      closeClick  : false,
		      openEffect  : 'none',
		      closeEffect : 'none',
		      beforeShow: function() {
		             curPos = $(document).scrollTop();
		             $('body').css('position','fixed');
		      },
		      afterClose: function() {
		              $('body').css('position','static');
		              $('html, body').animate({
		              scrollTop: curPos
		          }, 100);
		      }
		    });

		}
		else {

		    // Desktop
		    $(".fancybox").fancybox({
		      fitToView : true,
		      autoSize  : true,
		      closeClick  : false,
		      openEffect  : 'none',
		      closeEffect : 'none'
		    });

		}


		// Schedule Tabs
		$( "#schedule-tabs" ).tabs();


		// Initial request box
		$.ajax({
				cache: false,
				url:"/wp-admin/admin-ajax.php",
				data: ({action : 'wruw_check_for_requests'}),
				context: document.body,
				dataType: 'html',
				success: function(html) {
				    if(html) { 

				        if( $.cookie("showHtml") != html || $.cookie("showRequestBox") == 1) {
				          	$('#requests-holder .request-content').fadeOut('fast').html(html).fadeIn('fast');
				          	$('#requests-holder').fadeIn('fast');
				          	 $.cookie("showRequestBox", "1", { path: '/' });
				          	 $.cookie("showHtml", html, { path: '/' });
				        }
				        else {
				          	$('#requests-holder').hide();
				          	$.cookie("showRequestBox", "0", { path: '/' });
				        }

				    }
				}
		});
		
		// Auto refresh request box
		var interval = 0;
		function refreshRequestStart() {
			    setTimeout( function(){
			        refreshRequest();
			        interval    =   60;
			        setInterval( function(){
			            refreshRequest();
			        }, interval * 1000);
			    }, interval * 1000);    
		}

		function refreshRequest() {   
			
			$.ajax({
				    cache: false,
				    url:"/wp-admin/admin-ajax.php",
				    data: ({action : 'wruw_check_for_requests'}),
				    context: document.body,
				    dataType: 'html',
				    success: function(html) {
				        if(html) { 

				          	if( $.cookie("showHtml") != html || $.cookie("showRequestBox") == 1) {
				          		$('#requests-holder .request-content').fadeOut('fast').html(html).fadeIn('fast');
				          		$('#requests-holder').fadeIn('fast');
				          	 	$.cookie("showRequestBox", "1", { path: '/' });
				          	 	$.cookie("showHtml", html, { path: '/' });
					        }
					        else {
					          	$('#requests-holder').hide();
					          	$.cookie("showRequestBox", "0", { path: '/' });
					        }

				        }
				    }
				}); 

		}

		$(window).load(function() {
			var time    =   new Date();
			interval    =   60 - time.getSeconds();
			if(interval==60)
			    interval    =   0;
			refreshRequestStart();
		});

		// Close request box
		$(document).on('click', '#requests-holder .close-button, #requests-holder .manage-requests', function(e) { 
			$('#requests-holder').fadeOut('fast');
			$.cookie("showRequestBox", "0", { path: '/' });
		});


})(jQuery);



