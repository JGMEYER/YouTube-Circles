
/*
This work is licensed under the Creative Commons Attribution-NonCommercial-
NoDerivatives 4.0 International License. To view a copy of this license, visit
http://creativecommons.org/licenses/by-nc-nd/4.0/ or send a letter to:

	Creative Commons
	444 Castro Street, Suite 900
	Mountain View, CA, 94041
*/

// Yes, this is shown publicly, no you do not have permission to use it
var apiKey = "AIzaSyCe_BSo93KVRNpwYUpfrvNiJxmoqXlzvyM";

// Called automatically when JavaScript client library is loaded.
function onClientLoad() {
  gapi.client.load( "youtube", "v3", onYouTubeApiLoad );
}

// Called automatically when YouTube API interface is loaded
function onYouTubeApiLoad() {
  gapi.client.setApiKey( apiKey );

  var searchForm = $( "#search-form" ),
      searchText = $( "#search-text" ),
      mainContainer = $( "#main-container" )
      playButton = $( "#play-pause-btn" ),
      video = $( "#video" ),
      volumeSlider = $( "#volume-slider" );

  // setup search functionality
  searchForm.submit(function() {
    searchByQuery( $( "#search-text" ).val() );
    return false;
  });
  searchText.keypress(function( event ) {
    if ( event.which == 13 ) { // submit on enter
      event.preventDefault();
      $( this ).submit();
      $( this ).blur();
    }
  });
  searchText.focus();
  
  // setup music player
  video.tubeplayer({
    allowFullScreen: false,
    annotations: false,
    height: "100%",
    initialVideo: "5A-cOmaaBgQ", // 10 hours black screen (TODO - better solution)
    preferredQuality: "default",
    showControls: 0,
    width: "100%",
    onPlayerEnded: function() {      
      var circles = $( "#main-container .circle" ),
          videoFound = false;
      
      // attempt to play suggestion that hasn't been played recently
      circles.each(function() {
        var data = $( this ).data( "videoinfo" )
        
        if ( $.inArray( data.videoId, recentSongs ) < 0 ) {
          $( document ).startNewSong( data );
          videoFound = true;
          return false;
        }
      });
      
      // if all else fails, select the first recommendation
      if ( !videoFound ) {
        $( document ).startNewSong( circles.first().data( "videoinfo" ) );
      }
    }
  });
  
  // set up play pause button
  playButton.click( function() {
    $( document ).togglePlayPause();
  });
  
  // set up volume slider
  volumeSlider.slider({
    range: "min",
    min: 1,
    value: 60,
    change: function( event, ui) { // change caused by hotkey
      video.tubeplayer( "volume", ui.value );
    },
    slide: function( event, ui ) { // change from manual slide
      video.tubeplayer( "volume", ui.value );
    },
    stop: function( event, ui ) {
      volumeSlider.blur(); // prevent odd box around slider after move
    }
  });
  
  // allow play pause with spacebar and volume control on -/+ keys
  $( document ).keypress(function( event ) {
    if ( $( event.target ).closest( "input" )[ 0 ] ) {
      return;
    }
    if ( event.which == 32 ) { // spacebar
      $( document ).togglePlayPause();
    } else if ( event.which == 45 ) { // '-' key, unshifted
      volumeSlider.slider( "value", volumeSlider.slider( "value" ) - 5 );
    } else if ( event.which == 61 ) { // '+' key, unshifted
      volumeSlider.slider( "value", volumeSlider.slider( "value" ) + 5 );
    }
  });

  searchByQuery(null);
}

// Get videos that match the user-submitted query
function searchByQuery( query ) {
  var request = gapi.client.youtube.search.list({
    maxResults: "10",
    part: "snippet",
    q: query,
    type: "video"
  });
  
  if ( query == null || query == "" ) {
    request = gapi.client.youtube.search.list({
      maxResults: "0"
    });
  }
  
  request.execute( showResponse );
}

// Get list of videos related to the given videoId
function searchByRelated( videoId ) {
  var request = gapi.client.youtube.search.list({
    maxResults: "10",
    part: "snippet",
    relatedToVideoId: videoId,
    type: "video"
  });
  
  if ( videoId == null || videoId == "" ) {
    request = gapi.client.youtube.search.list({
      maxResults: "0"
    });
  }
  
  request.execute( showResponse );
}

// Update circles with new search results
function showResponse( response ) {    
  var items = response.items;
  
  // reset circles
  $( "#search-text" ).val( "" );
  $( "#main-container .circle" ).remove();
  
  if ( items != null ) {
    // display search results
    for ( var i = 0; i < items.length; i++ ) {
      var item = response.items[ i ];
      
      var mainContainer = $( "#main-container" );
          imgURL = item.snippet.thumbnails[ "medium" ].url,
          title = item.snippet.title,
          circle = $( "<div class='circle'></div>" );
      
      // add title to circle for tooltip
      if ( title.length > 40 ) {
        title = title.substring(0, 40).trim() + " ...";
      }
      circle.attr( "title", title );
      
      // add song info to circle
      circle.css({
        "background": "url(" + imgURL + ") no-repeat",
        "background-position": "center, center",
        "background-size": "200%"
      });
      circle.data( "videoinfo", {
        imageURL: item.snippet.thumbnails[ "high" ].url,
        title: item.snippet.title,
        videoId: item.id.videoId
      });
      
      // add circle to div
      mainContainer.append( circle );
    }
  }
  
  $( document ).handleResize( true );
  $( document ).refreshPlayerProperties();
}
