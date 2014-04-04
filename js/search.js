
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
      
      var imgURL = item.snippet.thumbnails[ "medium" ].url,
          circle = $( "<div class='circle'></div>" );
      $( "#main-container" ).append( circle );
      
      // add circle to div with video data
      circle.css({
        "background": "url(" + imgURL + ") no-repeat",
        "background-position": "center, center"
      });
      circle.data("videoinfo", {
        imageURL : item.snippet.thumbnails[ "high" ].url,
        title : item.snippet.title,
        videoId : item.id.videoId
      });
    }
  }
  
  $( document ).handleResize( true );
  $( document ).refreshPlayerProperties();
}

// Called automatically when JavaScript client library is loaded.
function onClientLoad() {
  gapi.client.load( "youtube", "v3", onYouTubeApiLoad );
}

// Called automatically when YouTube API interface is loaded
function onYouTubeApiLoad() {
  gapi.client.setApiKey( apiKey );

  var searchForm = $( "#search-form" ),
      searchText = $( "#search-text" ),
      musicContainer = $( "#bg-music-container" ),
      mainContainer = $( "#main-container" )
      playButton = $( "#play-pause-btn" ),
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
  musicContainer.tubeplayer({
    width: 0,
    height: 0,
    allowFullScreen: "false",
    initialVideo: "",
    preferredQuality: "default",
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
        $( document ).startNewSong( circles.first().data( "videoinfo" ));
      }
    }
  });
  
  // set up play pause button
  playButton.click( function() {
    $( document ).togglePlayPause();
  });
  
  // allow play pause with spacebar
  $( document ).keypress(function( event ) {
    if ( $( event.target ).closest( "input" )[ 0 ] ) {
      return;
    }
    if( event.which == 32 ) {
      $( document ).togglePlayPause();
    }
  });
  
  // set up volume slider
  volumeSlider.slider({
    range: "min",
    min: 1,
    value: 60,
    slide: function( event, ui ) {
      musicContainer.tubeplayer( "volume", ui.value );
    },
    stop: function( event, ui ) {
      volumeSlider.blur();
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
