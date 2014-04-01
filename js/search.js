
// Yes, this is shown publicly, no you do not have permission to use it
var apiKey = "AIzaSyCe_BSo93KVRNpwYUpfrvNiJxmoqXlzvyM";

// Update circles with new search results
function showResponse(response) {    
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
      $( "#main-container" ).append(circle);
      
      // add circle to div with video data
<<<<<<< HEAD
      var imgURL = item.snippet.thumbnails['medium'].url;
      var circleHTML = '<div class="circle" style="background:url(' + imgURL + ') no-repeat; background-position: center, center;"></div>';
      $( '#main-container' ).append(circleHTML);
    
      var circle = $( '#main-container' ).children('.circle').last();
      circle.data('videoinfo', {
=======
      circle.css({
        "background": "url(" + imgURL + ") no-repeat",
        "background-position": "center, center"
      });
      circle.data("videoinfo", {
>>>>>>> master
        videoId : item.id.videoId,
        title : item.snippet.title,
        imageURL : item.snippet.thumbnails[ "high" ].url
      });
    }
  }
  
  $( document ).handleResize(true);
  $( document ).refreshPlayerProperties();
}

// Called automatically when JavaScript client library is loaded.
function onClientLoad() {
  gapi.client.load( "youtube", "v3", onYouTubeApiLoad );
}

// Called automatically when YouTube API interface is loaded
function onYouTubeApiLoad() {
  gapi.client.setApiKey(apiKey);

  // setup search functionality
  $( "#search-form" ).submit(function() {
    searchByQuery( $( "#search-text" ).val() );
    return false;
  });
  $( "#search-text" ).keypress(function( event ) {
    if (event.which == 13) {
      event.preventDefault();
      $( "#search-form" ).submit();
    }
  });
  
  // setup music player
  $( "#bg-music-container" ).tubeplayer({
    width: 0,
    height: 0,
<<<<<<< HEAD
    allowFullScreen: 'false',
    initialVideo: '',
    preferredQuality: 'default',
    onPlayerEnded: function() {
      var firstCircle = $( '#main-container' ).children('.circle').first(),
          data = firstCircle.data('videoinfo');
      $( document ).startNewSong(data);
=======
    allowFullScreen: "false",
    initialVideo: "",
    preferredQuality: "default",
    onPlayerEnded: function() {
      var firstCircle = $( "#main-container" ).children( ".circle" ).first(),
          data = firstCircle.data( "videoinfo" );
      $( document ).startNewSong( data );
>>>>>>> master
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
  
  if (query == null || query == "") {
    request = gapi.client.youtube.search.list({
      maxResults: "0"
    });
  }
  
  request.execute(onSearchResponse);
}

// Get list of videos related to the given videoId
function searchByRelated( videoId ) {
  var request = gapi.client.youtube.search.list({
    maxResults: "10",
    part: "snippet",
    relatedToVideoId: videoId,
    type: "video"
  });
  
  if (videoId == null || videoId == "") {
    request = gapi.client.youtube.search.list({
      maxResults: "0"
    });
  }
  
  request.execute(onSearchResponse);
}

// Called automatically with the response of the YouTube API request.
function onSearchResponse(response) {
    showResponse(response);
}
