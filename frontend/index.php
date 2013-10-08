<!DOCTYPE html>
<html lang="en">
  <head>
  
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="">
    <meta name="author" content="">
    <link rel="shortcut icon" href="./assets/ico/favicon.png">

    <title>Arena App</title>

    <!-- Bootstrap core CSS -->
    

    <!-- Custom styles for this template -->
    <link href='http://fonts.googleapis.com/css?family=Open+Sans:700,600, 400' rel='stylesheet' type='text/css'>
    <link href="assets/css/style.css" rel="stylesheet">
    <link href="assets/css/jquery.mCustomScrollbar.css" rel="stylesheet" />

    <!-- HTML5 shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!--[if lt IE 9]>
      <script src="/assets/js/html5shiv.js"></script>
      <script src="/assets/js/respond.min.js"></script>
    <![endif]-->
  </head>

  <body onLoad="GetApp();">
  <header> 
       <img src="assets/images/arena-logo.png" alt="Arena Logo">
  <ol id="main-buttons">
    <li>
      <button data-pos="1" class="active">Now Showing</button>
    </li>
    <li>
      <button  data-pos="2">Upcoming</button>
    </li>
  </ol>
</header>
<div class="mainCont">
<div class="content_5 content">
		<div class="images_container movie-posters">
		</div>
</div>
</div>
<div class="mainContUp">
<div class="content_6 content">
		<div class="images_container movie-postersUp">
		</div>
</div>
</div>


    <ol id="week-days">
        <li>Weekly <span>Schedule</span></li>
        <li><span  class="dayofwekS">16 Sep</span> <br>- <br><span  class="dayofwekE">22 Sep</span></li>
            <li  data-pos="0">Fri</li>
            <li  data-pos="1">Sat</li>
            <li  data-pos="2">Sun</li>
            <li  data-pos="3">Mon</li>
            <li  data-pos="4">Tue</li>
            <li  data-pos="5">Wed</li>
            <li  data-pos="6">Thu</li>
    </ol>
<div style="clear:both;"></div>
<div id="arrow-container"><div class="arrow-down"></div></div>
<div style="clear:both;"></div>
<div class="movieListingBottom">
</div>

    <div class="movieListingBottomUp hideMe">
    </div>

<div id="alpha-layer" class="hideMe"></div>
<div class="modal hideMe">
<button class="close-btn">x</button>
  <div class="modal-left"><img  class="MovieImg" src="">
  						 
    <div class="movie-price overwriteMarginTop">
      <div class="price MoviePrice">PKR 500.00</div>
      <a href="http://thearena.com.pk/membership.php" target="_blank"><button>Book Now</button></a>
      <a class="traliers" href="" target="_blank"><button class="tralier">Watch Trailer</button></a>
    </div>
  </div>
  <div class="modal-right movie-details">
    <h1  class="MovieName">Getaway</h1>
    <div><span class="MovieCat">Action, Thirller</span><span> | </span><span  class="Dur">1hr 23 min</span></div>
    <div class="castScr">
      <table id="schDetails">
        <thead>
          <tr>
            <th>Weekly Schedule</th>
            <th  class="MovieSchDate"><span  class="dayofwekS colorblack">16 Sep</span> - <span  class="dayofwekE colorblack">22 Sep</span></th>
          </tr>
        </thead>
        <tbody   class="MovieSch">
        </tbody>
      </table>
      <h2>Cast:</h2>
      <p class="MovieCast">Ethan Hawke, Selena Gomez, Jon Volght...</p>
    </div>
    <div class="synopsis-container">
      <h2>Synopsis:</h2>
      <p  class="MovieSynopsis">Nick Fury is the of S.H.E.I.L.D, an international peace keeping 
        agency. The agency is a who's who of Marvel Super Heros, with Iron Man,
        The Incredible Hluk, Thor, Captain America, Hawkeye & Black Widow. 
        When global security is threatened by Loki and his cohorts, Nick Fury ...</p>
    </div>
  </div>
</div>
<div class="soon"></div>
	<div class="preLoader">
    </div>
    <script src="./assets/js/jquery-2.0.3.min.js"></script>
    <script src='./assets/js/MobileServices.Web-1.0.0.min.js'></script>
    <script src='./assets/js/time.js'></script>
    <script src="./assets/js/jquery.mCustomScrollbar.concat.min.js"></script>
    <script src="assets/js/scripts.js"></script>
    
    <div id="fb-root"></div>
<script type="text/javascript">
            window.fbAsyncInit = function() {
                FB.init({
                    appId: '608552492530546',
                    cookie: true,
                    xfbml: true,
                    oauth: true
                });
                FB.Canvas.setAutoGrow(true);
            };
            (function() {
                var e = document.createElement('script'); e.async = true;
                e.src = document.location.protocol +
                    '//connect.facebook.net/en_US/all.js';
                document.getElementById('fb-root').appendChild(e);
            }());
</script>
  </body>
</html>
