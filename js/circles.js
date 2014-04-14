
/*
This work is licensed under the Creative Commons Attribution-NonCommercial-
NoDerivatives 4.0 International License. To view a copy of this license, visit
http://creativecommons.org/licenses/by-nc-nd/4.0/ or send a letter to:

	Creative Commons
	444 Castro Street, Suite 900
	Mountain View, CA, 94041
*/

// Initializes an empty song queue used to prevent repeats
var recentSongs = [];

// Resizes all player elements within the browser window
$.fn.handleResize = function(animate) {
  var videoContainer = $( "#video-container" ),
      searchText = $( "#search-text" );
  
  $( ".circle" ).resizeElement();
  videoContainer.resizeElement();
  searchText.css({
    "top": videoContainer.height() / 2 - searchText.height() / 2 + "px",
    "width": "50%"
  });
  
  $( document ).positionCircles( animate );
}

// Organizes circles around the video container
$.fn.positionCircles = function( animate ) {
  var circles = $( ".circle" ),
      circle_radius_padding = $( "#main-container" ).height() / 8,
      text_radius_padding = $( "#main-container" ).height() / 8;
      circle_pos_radius = $( "#video-container" ).width() / 2 + circle_radius_padding,
      text_pos_radius = circle_pos_radius + text_radius_padding,
      center_x = $( "#video-container" ).position().left,
      center_y = $( "#video-container" ).position().top,
      theta = 0,
      theta_step = ( 2 * Math.PI ) / circles.length,
      half_step = ( Math.PI / 2 );
  
  // organize circles and their titles
  circles.each(function( index, element ) {
    var circle = $( this ),
        circle_width = circle.width(),
        circle_height = circle.height(),
        circle_start_x = center_x - circle_width / 2,
        circle_start_y = center_y - circle_height / 2,
        cos_theta = Math.cos( theta - half_step );
        sin_theta = Math.sin( theta - half_step );
        circle_final_x = Math.round( center_x + circle_pos_radius * cos_theta - circle_width / 2 ),
        circle_final_y = Math.round( center_y + circle_pos_radius * sin_theta - circle_height / 2 );

    // animate circles outwards
    if ( animate ) {
      circle.css({
        "left": circle_start_x + "px",
        "top": circle_start_y + "px",
        "z-index": 1
      });
    
      circle.animate({
        "left": circle_final_x + "px",
        "top": circle_final_y + "px"
      }, 500, function() {
        circle.css( "z-index", "3" );
      });
      
    // automatically place at final positions
    } else {
      circle.css({
        "left": circle_final_x + "px",
        "top": circle_final_y + "px"
      });
    }
    
    theta += theta_step;
  });
}

// Reassigns player properties after new circles created
$.fn.refreshPlayerProperties = function() {
  var circles = $( ".circle" ),
      videoContainer = $( "#video-container" ),
      searchForm = $( "#search-form" ),
      searchText = $( "#search-text" );
  
  // handle how circles can be dragged and dropped
  circles.draggable( { containment: "body", revert: true, revertDuration: 180 } );
  videoContainer.droppable({
    drop: function ( event, ui ) {
      var data = ui.draggable.data( "videoinfo" );
      $( document ).startNewSong( data );
    }
  });
  
  // hide search bar when not hovering over center circle
  searchForm.hover(function(){
    searchText.stop( true ).fadeTo( 900, 0.7 );
  },
  function(){
    searchText.fadeTo( 1200, 0 );
  });

  // focus search bar when center circle clicked
  searchForm.click(function(){
    searchText.focus();
  });
}

// Resizes a player element to equal height and width
$.fn.resizeElement = function() {
  return this.each(function() {
    
    $( this ).css({
      "height": $( this ).width() + "px"
    });
  });
}

// Starts the song with the given information contained in a circle
$.fn.startNewSong = function( data ) {
  var videoId = data.videoId,
      title = data.title,
      imageURL = data.imageURL,
      videoContainer = $( "#video-container" ),
      volumeSlider = $( "#volume-slider" ),
      video = $( "#video" ),
      playerControls = $( "#player-controls" ),
      playButton = $( "#play-pause-btn" );
      
  // update center picture
  videoContainer.css({
    "background": "url(" + imageURL + ") no-repeat",
    "background-position": "center, center",
    "background-size": "180%, 180%"
  });
  
  // begin next song
  var volume = volumeSlider.slider( "option", "value" );
  video.tubeplayer( "play", videoId );
  video.tubeplayer( "volume", volume );
  searchByRelated( videoId );
  
  // make video visible
  video.css( "visibility", "visible" );
  
  // register songs in recently played
  recentSongs.push( videoId );
  if ( recentSongs.length > 10 ) {
    recentSongs.shift();
  }
  
  // set up player controls
  if ( playerControls.css( "visibility" ) == "hidden" ) {
    playerControls.css( "visibility", "visible" );
  }
  playButton.attr( "class", "pause" );
}

// Toggle play/pause on the current video
$.fn.togglePlayPause = function() {
  var playButton = $( "#play-pause-btn" ),
      video = $( "#video" );
  
  if ( playButton.attr( "class" ) == "play" ) {
    video.tubeplayer( "play" );
    playButton.attr( "class", "pause" );
  } else {
    video.tubeplayer( "pause" );
    playButton.attr( "class", "play" );
  }
}

// Properly resize elements when window size changes
$( window ).resize(function() {
  $( document ).handleResize( false );
});

// Make main container visible
$( window ).load(function() {
  $( document ).handleResize( false );
  $( "#video-container" ).css( "visibility", "visible" );
});
