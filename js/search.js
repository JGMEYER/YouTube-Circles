
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
        videoId : item.id.videoId,
        title : item.snippet.title,
        imageURL : item.snippet.thumbnails[ "high" ].url
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

  // setup search functionality
  $( "#search-form" ).submit(function() {
    searchByQuery( $( "#search-text" ).val() );
    return false;
  });
  $( "#search-text" ).keypress(function( event ) {
    if ( event.which == 13 ) { // submit on enter
      event.preventDefault();
      $( "#search-form" ).submit();
    }
  });
  
  // setup music player
  $( "#bg-music-container" ).tubeplayer({
    width: 0,
    height: 0,
    allowFullScreen: "false",
    initialVideo: "",
    preferredQuality: "default",
    onPlayerEnded: function() {
      var firstCircle = $( "#main-container" ).children( ".circle" ).first(),
          data = firstCircle.data( "videoinfo" );
      $( document ).startNewSong( data );
    }
  });
  
  // set up play pause
  $( "#play-pause-btn" ).click(function() {
    if ( $( this ).attr( "class" ) == "play" ) {
      $( "#bg-music-container" ).tubeplayer( "play" );
      $( this ).attr( "class", "pause" );
    } else {
      $( "#bg-music-container" ).tubeplayer( "pause" );
      $( this ).attr( "class", "play" );
    }
  });
  
  // set up volume slider
  $( "#volume-slider" ).slider({
    range: "min",
    min: 1,
    value: 75,
    slide: function( event, ui ) {
      $( "#bg-music-container" ).tubeplayer( "volume", ui.value );
    },
    stop: function( event, ui ) {
      $( "#volume-slider" ).blur();
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
  
  request.execute( onSearchResponse );
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
  
  request.execute( onSearchResponse );
}

// Called automatically with the response of the YouTube API request.
function onSearchResponse( response ) {
    showResponse( response );
}
