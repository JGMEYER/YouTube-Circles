<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">

<head>
	<link rel="stylesheet" type="text/css" href="style.css" />
	<link rel="stylesheet" href="//code.jquery.com/ui/1.10.4/themes/smoothness/jquery-ui.css">
	<script src="http://code.jquery.com/jquery-1.9.1.js"></script>
	<script src="http://code.jquery.com/ui/1.10.4/jquery-ui.js"></script>
	
	<!-- JQUERY -->
	<script>
		$( document ).ready(function() {
			
			// Resizes a player element within the browser window
			$.fn.resizeElement = function() {
				return this.each(function() {
					$( this ).css({
						'height': $( this ).width() + 'px',
						'border-radius': $( this ).width() / 2 + 'px'
					});
				});
			}
			
			// Resizes all player elements within the browser window
			$.fn.handleResize = function() {
				$( '.circle' ).resizeElement();
				$( '#video-container' ).resizeElement();
				$( document ).positionCircles();
			}
			
			// Organizes circles around the video container
			$.fn.positionCircles = function() {
				var circles = $( '.circle' ),
						radius_padding = $( '#main-container' ).height() / 8,
						radius = $( '#video-container' ).width() / 2 + radius_padding,
						center_x = $( '#main-container' ).width() / 2,
						center_y = $( '#main-container' ).height() / 2,
						theta = 0,
						theta_step = (2*Math.PI) / circles.length
						half_step = (Math.PI / 2);
				
				return circles.each(function() {
					var x = Math.round(center_x + radius * Math.cos(theta - half_step) - $( this ).width() / 2),
							y = Math.round(center_y + radius * Math.sin(theta - half_step) - $( this ).height() / 2);

					$( this ).css({
						left: x + 'px',
						top: y + 'px'
					});
					
					theta += theta_step;
				});
			}
			
			$( '.circle' ).draggable( { revert: true } );
			
			$( document ).handleResize();
		});
		
		// properly resize elements when window size changes
		$( window ).resize(function() {
			$( document ).handleResize();
		});
	</script>
	<!-- /JQUERY -->
</head>

<body>
	
	<div id="main-container">
		<div id="video-container"></div>
	
		<?php
		$num_circles = 10;
		for ($i = 0; $i < $num_circles; $i++) {
			echo '<div class="circle" style="z-index:'.$i.'">'.$i.'</div>';
		}
		?>
	</div>
	
</body>

</html>
