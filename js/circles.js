
// Resizes a player element to a circle of equal height and width
$.fn.resizeElement = function() {
  return this.each(function() {
    $( this ).css({
      'height': $( this ).width() + 'px',
      'border-radius': $( this ).width() / 2 + 'px'
    });
  });
}

// Resizes all player elements within the browser window
$.fn.handleResize = function(animate) {
  $( '.circle' ).resizeElement();
  $( '#video-container' ).resizeElement();
  $( document ).positionCircles(animate);
}

// Organizes circles around the video container
$.fn.positionCircles = function(animate) {
  var circles = $( '.circle' ),
      radius_padding = $( '#main-container' ).height() / 8,
      radius = $( '#video-container' ).width() / 2 + radius_padding,
      center_x = $( '#video-container' ).position().left;
      center_y = $( '#video-container' ).position().top;
      theta = 0,
      theta_step = (2*Math.PI) / circles.length
      half_step = (Math.PI / 2);
  
  return circles.each(function() {
    var start_x = center_x - $( this ).width() / 2,
        start_y = center_y - $( this ).height() / 2;
    var final_x = Math.round(center_x + radius * Math.cos(theta - half_step) - $( this ).width() / 2),
        final_y = Math.round(center_y + radius * Math.sin(theta - half_step) - $( this ).height() / 2);

    if (animate) {
      $( this ).css({
        'left' : start_x + 'px',
        'top' : start_y + 'px'
      });
    
      $( this ).animate({
        'left' : final_x + 'px',
        'top' : final_y + 'px'
      }, 500, function() {
        $( this ).css('z-index', '3');
      });
      
    } else {
      $( this ).css({
        'left' : final_x + 'px',
        'top' : final_y + 'px'
      });
    }
    
    theta += theta_step;
  });
}

// Reassigns player drag and drop properties after new circles created
$.fn.refreshPlayerProperties = function() {
  $( '.circle' ).draggable({ revert: true, revertDuration: 180 });
  
  $( '#video-container' ).droppable({
    drop: function (event, ui) {
      var data = ui.draggable.data('videoinfo');
      var videoId = data.videoId;
      var title = data.title;
      var imageURL = data.imageURL
      $( '#video-container' ).css({
        'background' : 'url(' + imageURL + ') no-repeat',
        'background-position' : 'center, center',
        'background-size' : '180%, 180%'
      });
      $( '#bg-music-container' ).html('<embed height="0" width="0" src="//www.youtube.com/v/' + videoId + '&rel=0&showinfo=0&controls=0&autoplay=1&t=0s" />');
    }
  });
}

// Properly resize elements when window size changes
$( window ).resize(function() {
  $( document ).handleResize(false);
});
