
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
$.fn.positionCircles = function(animate) {
  var circles = $( ".circle" ),
      radius_padding = $( "#main-container" ).height() / 8,
      radius = $( "#video-container" ).width() / 2 + radius_padding,
      center_x = $( "#video-container" ).position().left;
      center_y = $( "#video-container" ).position().top;
      theta = 0,
      theta_step = ( 2 * Math.PI ) / circles.length
      half_step = ( Math.PI / 2);
  
  return circles.each(function() {
    var start_x = center_x - $( this ).width() / 2,
        start_y = center_y - $( this ).height() / 2,
        final_x = Math.round( center_x + radius * Math.cos( theta - half_step ) - $( this ).width() / 2),
        final_y = Math.round( center_y + radius * Math.sin( theta - half_step ) - $( this ).height() / 2);

    // animate circles outwards
    if ( animate ) {
      $( this ).css({
        "left": start_x + "px",
        "top": start_y + "px",
        "z-index": 1
      });
    
      $( this ).animate({
        "left": final_x + "px",
        "top": final_y + "px"
      }, 500, function() {
        $( this ).css( "z-index", "3" );
      });
      
    // automatically place at final positions
    } else {
      $( this ).css({
        "left": final_x + "px",
        "top": final_y + "px"
      });
    }
    
    // TODO keep thinkering (this will be organized and moved elsewhere)
    // display title of suggestion
    /*var titleContainer = $( "<div></div>" ),
        data = $( this ).data( "videoinfo" );
    $( "#main-container" ).append(titleContainer);
    titleContainer.html( data.title );
    var width = titleContainer.width();
    console.log( width );
    titleContainer.css({
      "color": "#fff",
      "left": final_x + titleContainer.width() + "px",
      "position": "absolute",
      "top": final_y,
      "z-index": 3
    });*/
    
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
  circles.draggable( { revert: true, revertDuration: 180 } );
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

// Resizes a player element to a circle of equal height and width
$.fn.resizeElement = function() {
  return this.each(function() {
    $( this ).css({
      "height": $( this ).width() + "px",
      "border-radius": $( this ).width() / 2 + "px"
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
      musicContainer = $( "#bg-music-container" ),
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
  musicContainer.tubeplayer( "play", videoId );
  musicContainer.tubeplayer( "volume", volume );
  searchByRelated( videoId );
  
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
      musicContainer = $( "#bg-music-container" );
  
  if ( playButton.attr( "class" ) == "play" ) {
    musicContainer.tubeplayer( "play" );
    playButton.attr( "class", "pause" );
  } else {
    musicContainer.tubeplayer( "pause" );
    playButton.attr( "class", "play" );
  }
}

// Properly resize elements when window size changes
$( window ).resize(function() {
  $( document ).handleResize( false );
});

// make main container visible
$( window ).load(function() {
  $( document ).handleResize( false );
  $( "#video-container" ).css( "visibility", "visible" );
});
