
// Yes, this is shown publicly, no you do not have permission to use it
var apiKey = 'AIzaSyCe_BSo93KVRNpwYUpfrvNiJxmoqXlzvyM';

// Helper function to display JavaScript value on HTML page.
function showResponse(response) {    
    var items = response.items;
    $( '#main-container' ).html('<div id="video-container"></div>');
    
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

    search();
}

// Perform search using query passed by user
function search() {
    var request = gapi.client.youtube.search.list({
        part: 'snippet',
        q: userSearch,
        maxResults: '10'
    });
    
    request.execute(onSearchResponse);
}

// Called automatically with the response of the YouTube API request.
function onSearchResponse(response) {
    showResponse(response);
}
