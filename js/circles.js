
// Resizes all player elements within the browser window
$.fn.handleResize = function(animate) {
  var videoContainer = $( "#video-container" );
  var searchText = $( "#search-text" );
  
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
    
    theta += theta_step;
  });
}

// Reassigns player properties after new circles created
$.fn.refreshPlayerProperties = function() {
  
  // handle how circles can be dragged and dropped
<<<<<<< HEAD
  $( '.circle' ).draggable({ revert: true, revertDuration: 180 });
  $( '#video-container' ).droppable({
    drop: function (event, ui) {
      var data = ui.draggable.data('videoinfo');
      $( document ).startNewSong(data);
=======
  $( ".circle" ).draggable( { revert: true, revertDuration: 180 } );
  $( "#video-container" ).droppable({
    drop: function ( event, ui ) {
      var data = ui.draggable.data( "videoinfo" );
      $( document ).startNewSong( data );
>>>>>>> master
    }
  });
  
  // hide search bar when not hovering over center circle
  $( "#search-form" ).hover(function(){
    $( "#search-text" ).stop( true ).fadeTo( 900, 0.7 );
  },
  function(){
    $( "#search-text" ).fadeTo( 1200, 0 );
  });

  // focus search bar when center circle clicked
  $( "#search-form" ).click(function(){
    $( "#search-text" ).focus();
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
<<<<<<< HEAD
$.fn.startNewSong = function(data) {
=======
$.fn.startNewSong = function( data ) {
>>>>>>> master
  var videoId = data.videoId,
      title = data.title,
      imageURL = data.imageURL;
      
  // update center picture
<<<<<<< HEAD
  $( '#video-container' ).css({
    'background' : 'url(' + imageURL + ') no-repeat',
    'background-position' : 'center, center',
    'background-size' : '180%, 180%'
  });
  
  // begin next song
  $( '#bg-music-container' ).tubeplayer('play', videoId);
  searchByRelated(videoId);
=======
  $( "#video-container" ).css({
    "background": "url(" + imageURL + ") no-repeat",
    "background-position": "center, center",
    "background-size": "180%, 180%"
  });
  
  // begin next song
  $( "#bg-music-container" ).tubeplayer( "play", videoId );
  searchByRelated( videoId );
>>>>>>> master
}

// Properly resize elements when window size changes
$( window ).resize(function() {
  $( document ).handleResize( false );
});
