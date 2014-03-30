<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">

<?php
  require_once ($_SERVER["DOCUMENT_ROOT"].'/google-api-php-client/src/Google_Client.php');  
  require_once ($_SERVER["DOCUMENT_ROOT"].'/google-api-php-client/src/contrib/Google_YouTubeService.php');
  
  // Get at <http://code.google.com/apis/console#access> 
  $DEVELOPER_KEY = $_GET["api"];

  $client = new Google_Client();  
  $client->setDeveloperKey($DEVELOPER_KEY);  
  $youtube = new Google_YoutubeService($client);
  
  try {
    $searchResponse = $youtube->search->listSearch('id,snippet', array(
      'q' => $_GET['search'],
      'maxResults' => 10,
    ));

    $htmlBody = '';
    $circleDivs = '';

    // populate circles of search results
    foreach ($searchResponse['items'] as $searchResult) {
      if ($searchResult['id']['kind'] == 'youtube#video') {
          $circleDivs .= sprintf('<div class="circle" style="background:url(%s) no-repeat;"></div>',
                       $searchResult['snippet']['thumbnails']['medium']['url']);
      }
    }

  } catch (Google_ServiceException $e) {
    $htmlBody .= sprintf('<p>A service error occurred: <code>%s</code></p>',
                 htmlspecialchars($e->getMessage()));
  } catch (Google_Exception $e) {
    $htmlBody .= sprintf('<p>An client error occurred: <code>%s</code></p>',
                 htmlspecialchars($e->getMessage()));
  }
?>

<head>
  <link rel="stylesheet" type="text/css" href="css/style.css" />
  <link rel="stylesheet" href="//code.jquery.com/ui/1.10.4/themes/smoothness/jquery-ui.css">
  <script src="http://code.jquery.com/jquery-1.9.1.js"></script>
  <script src="http://code.jquery.com/ui/1.10.4/jquery-ui.js"></script>
  <script type="text/javascript" src="/js/circles.js"></script>
</head>

<body>
  
  <div id="main-container">
    <div id="video-container">
      <iframe id="video" src="//www.youtube.com/embed/NGhXjCuucLI?autoplay=1" frameborder="0" allowfullscreen></iframe>
    </div>
    <?php echo $circleDivs; ?>
  </div>
  
  <!-- <embed height="0" width="0" src="//www.youtube.com/v/V2mrOaKvxDg&rel=0&showinfo=0&controls=0&autoplay=1" /> -->
  
</body>

</html>
