
// Yes, this is shown publicly, no you do not have permission to use it
var apiKey = 'AIzaSyCe_BSo93KVRNpwYUpfrvNiJxmoqXlzvyM';

// Helper function to display JavaScript value on HTML page.
function showResponse(response) {    
  var items = response.items;
  
  // TODO just remove/replace circles - keep video-container untouched (load first in HTML)
  $( '#main-container' ).html('<div id="video-container"></div>');
  $( '#video-container' ).html('<form id="search-form"></form>');
  
  $( '#search-form' ).html('<input id="search-text" type="text" placeholder="ENTER: MUSIC"></input>');
  
  //$( '#main-container' ).remove( $( '.circle' ) );
  
  $( '#search-form' ).submit(function() {
    search( $( "#search-text" ).val() );
    return false;
  });
  $( "#search-text" ).keypress(function(event) {
    if (event.which == 13) {
      event.preventDefault();
      $( "#search-form" ).submit();
    }
  });
  
  if (items != null) {
    // display search results
    for (var i = 0; i < items.length; i++) {
      var item = response.items[i];
      var kind = item.id.kind;
    
      if ( kind == 'youtube#video' ) {
        // add circle to div with video data
        var imgURL = item.snippet.thumbnails['medium'].url
        var circleHTML = '<div class="circle" style="background:url(' + imgURL + ') no-repeat; background-position: center, center;"></div>';
        $( '#main-container' ).append(circleHTML);
      
        var circle = $( '#main-container' ).children('.circle').last();
        circle.data('videoinfo', {
          videoId : item.id.videoId,
          title : item.snippet.title,
          imageURL : item.snippet.thumbnails['high'].url
        });
      }
    }
  }
  
  $( document ).handleResize(true);
  $( document ).refreshPlayerProperties();
}

// Called automatically when JavaScript client library is loaded.
function onClientLoad() {
  gapi.client.load('youtube', 'v3', onYouTubeApiLoad);
}

// Called automatically when YouTube API interface is loaded
function onYouTubeApiLoad() {
  gapi.client.setApiKey( apiKey );

  search(null);
}

// Perform search using query passed by user
function search(userSearch) {
  var request = gapi.client.youtube.search.list({
    part: 'snippet',
    q: userSearch,
    maxResults: '10'
  });
  
  if (userSearch == null || userSearch == '') {
    request = gapi.client.youtube.search.list({
      maxResults: '0'
    });
  }
  
  request.execute(onSearchResponse);
}

// Called automatically with the response of the YouTube API request.
function onSearchResponse(response) {
    showResponse(response);
}
