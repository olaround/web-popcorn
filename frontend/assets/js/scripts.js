var pricingArray = new Array();
var MoviesArray = new Array();
var AppId = '';
var AppURL = '';
var daysOFWeek = ["FRI","SAT","SUN", "MON", "TUE", "WED", "THU"];
var daysOFWeekAll = ["Monday", "Tuesday", "Wednesday", "Thrusday", "Friday", "Saturday","Sunday"];
var daysOFWeekAnimation = [ "225px","304px", "381px", "462px", "541px", "618px", "698px"];
var daysOFWeekLiPos = ["3","4", "5", "6", "7", "8", "9"];
var months = new Array('Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec');
var StartDateOfQuery = '';
var WeekDays = '';
var WeekCount = 0;
var WeekOptions = new Array();
WeekOptions[WeekCount] = new Array();
WeekOptions[WeekCount]['start'] = '2013-1-1';
var daysToSubtract = [-2,-3,-4,-5,-6,0,-1];
var daysPointer = [];
var daysPointerDisp = [];
function GetApp(){
	
	var today =new Date();
	//var lastFriday = today.getDate() + daysToSubtract[currentDate];
	today.setDate(today.getDate() + daysToSubtract[today.getDay()]);
	
	daysPointer.push(today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate());
	$('.dayofwekS').html(today.getDate() +' '+months[today.getMonth()]);
	
	today.setDate(today.getDate() + 6);
	
	daysPointer.push(today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate());
	$('.dayofwekE').html(today.getDate() +' '+months[today.getMonth()]);
	
	
	var appendHtml = '';
	var appendHtmlDisp = '';
	var OptionList = '';
	$.each(daysPointer,function(index,items){
		if(index%2 == 0){
			appendHtml += items+'/';
			
		}else{
			appendHtml += items;
			StartDateOfQuery = appendHtml;
		}
	});
	
	$.getJSON('../app.json', function(data) {
		AppId = data.id;
		AppURL = data.url;
		StartApp();
		
	});
}
function StartApp(){	
	var client = new WindowsAzure.MobileServiceClient(AppURL, AppId),
        ScheduleTable = client.getTable('schedule');
		CityTable = client.getTable('city');
		CinemaTable = client.getTable('cinema');
		PricingTable = client.getTable('pricing');
		MoviesTable = client.getTable('movies');
		//get page wise start data
   	 	
		//end page wise start data
		getCinema();
		// handle error
		function handleError(error) {
			var text = error + (error.request ? ' - ' + error.request.status : '');
			$('#errorlog').append($('<li>').text(text));
		}
		//end handle error
		
		// get city function
		function getCinema(){
			var CinemaQuery = CinemaTable.where({cinema:'The Arena'});
			//console.log(CinemaQuery);
			CinemaQuery.read().then(function(todoItemsCinema) {
				$.each(todoItemsCinema,function(indexCinema,itemCinema){
					var PricingQuery = PricingTable.where({cinemaid:itemCinema.id});
					PricingQuery.read().then(function(Pricing) {
						$.each(Pricing,function(indexPrice,itemPrice){							
							pricingArray[itemPrice.id] = itemPrice.amount;
						});
					}, handleError).done(function(){
							var MoviesQuery = MoviesTable.where({cinema:itemCinema.id});
							MoviesQuery.read().then(function(Movies) {
								$.each(Movies,function(indexMovies,itemMovies){
									MoviesArray[itemMovies.id] = itemMovies;
								});
							}, handleError).done(function(){
								//createHtmlForPage();
										var ScheduleQuery = ScheduleTable.where({cinema:itemCinema.id, fromdate: StartDateOfQuery});
										ScheduleQuery.read().then(function(Schedule) {
											if(Schedule != ''){
											$.each(MoviesArray,function(indexMoviesArray,itemMoviesArray){
												$.each(Schedule,function(indexSchedule,itemSchedule){
													if(indexMoviesArray == itemSchedule.movieSelect ){
														MoviesArray[indexMoviesArray].movieschedule = itemSchedule.movieschedule;
													}
												});
											});
											}else{
												//alert(Schedule);
												createHtmlForPage();
											}
											
											
										}, handleError).done(function(){
											createHtmlForPage();
											//console.log(MoviesArray);
										});
							});
					});
					
					
					
					
					
				});
			}, handleError).done(function(){
				$('.loader').hide();
			});
		}
		
		//end get city function
		
		// get city function
		
		//end get city function
		
		// get city function
		
		function createHtmlForPage(){
			$('.movie-posters').html('');
			$('.movieListingBottom').html('');
			console.log(MoviesArray);
			var DayDataCount = 0;
			var dailyWidth = 0;
			var dailyWidthUp = 0;
			console.log(MoviesArray);
			if(MoviesArray != ''){
			$.each(MoviesArray,function(index,item){
				if(item){
				var dayOWeek  = new Date().getDay()+2;
				if(dayOWeek >= 7 ){
						dayOWeek = 0;
					}
				//dayOWeek = 0;
				
				console.log(dayOWeek);
				//return true;
				if(item.movieschedule){
				var itemSchedule = JSON.parse(item.movieschedule);
				var days = '&nbsp;';
				var displayItem = 'hideMe';
				
				$.each(itemSchedule,function(id,itm){
						if(itm[3] == true){
							days += '-MON-';
							if(daysOFWeek[dayOWeek] == 'MON'){
								displayItem = '';
								DayDataCount++;
							}
						}
						if(itm[4] == true){
							days += '-TUE-';
							if(daysOFWeek[dayOWeek] == 'TUE'){
								displayItem = '';
								DayDataCount++;
							}
						}
						if(itm[5] == true){
							days += '-WED-';
							if(daysOFWeek[dayOWeek] == 'WED'){
								displayItem = '';
								DayDataCount++;
							}
						}
						if(itm[6] == true){
							days += '-THU-';
							if(daysOFWeek[dayOWeek] == 'THU'){
								displayItem = '';
								DayDataCount++;
							}
						}
						if(itm[7] == true){
							days += '-FRI-';
							if(daysOFWeek[dayOWeek] == 'FRI'){
								displayItem = '';
								DayDataCount++;
							}
						}
						if(itm[8] == true){
							days += '-SAT-';
							if(daysOFWeek[dayOWeek] == 'SAT'){
								displayItem = '';
								DayDataCount++;
							}
						}
						if(itm[9] == true){
							days += '-SUN-';
							if(daysOFWeek[dayOWeek] == 'SUN'){
								displayItem = '';
								DayDataCount++;
							}
						}
											
					});
					if(item.upcoming == true){
						displayItem = '';
					}
					$('#week-days li:nth-child('+daysOFWeekLiPos[dayOWeek]+')').addClass('active');
					$('.arrow-down').css('left',daysOFWeekAnimation[dayOWeek]);
				}
				
				var Html = '';
					Html += '<div class="movie-detail-widget '+displayItem+'" data-type="'+item.upcoming+'" data-day="'+days+'">';
					Html += "<img class='listingItem' data-movieTrailer='"+encodeURIComponent(escape(item.movieTralier))+"' data-upcoming='"+item.upcoming+"'  data-image='"+item.image+"' data-sch='"+item.movieschedule+"' data-durHH='"+item.durationHH+"' data-durMM='"+item.durationMM+"' data-name='"+encodeURIComponent(escape(item.name))+"' data-cast='"+encodeURIComponent(escape(item.cast))+"' data-synopsis='"+encodeURIComponent(escape(item.synopsis))+"' data-image='"+item.image+"' data-catagory='"+encodeURIComponent(escape(item.genre))+"' data-date='"+item.durationHH+"' data-price='"+item.price+"' src='"+item.image+"' alt='"+item.name+"'>";
					Html += '<div class="movie-details overwriteMargin">';
					Html += "<h1 class='listingItem' data-movieTrailer='"+encodeURIComponent(escape(item.movieTralier))+"' data-upcoming='"+item.upcoming+"'  data-image='"+item.image+"' data-sch='"+item.movieschedule+"' data-durHH='"+item.durationHH+"' data-durMM='"+item.durationMM+"' data-name='"+encodeURIComponent(escape(item.name))+"' data-cast='"+encodeURIComponent(escape(item.cast))+"' data-synopsis='"+encodeURIComponent(escape(item.synopsis))+"' data-image='"+item.image+"' data-catagory='"+encodeURIComponent(escape(item.genre))+"' data-date='"+item.durationHH+"' data-price='"+item.price+"'>"+item.name+"</h1>";
					Html += '<div><span>'+item.genre+'</span><span> | </span><span>'+item.durationHH+'hr '+item.durationMM+' min</span></div>';
					Html += '<div class="synopsis-container">';
					Html += '<h2>Synopsis:</h2>';
					if(item.upcoming != true){
					var synposis = item.synopsis;
					var yourString = synposis; //replace with your string.
					var maxLength = 110 // maximum number of characters to extract
					
					//trim the string to the maximum length
					var trimmedString = yourString.substr(0, maxLength);
					
					//re-trim if we are in the middle of a word
					trimmedString = trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(" ")))
						Html += ' <p>'+trimmedString+'...</p>';
					}else{
						Html += ' <p>'+item.synopsis+'</p>';
					}
					
					Html += '</div>';
					Html += '<div>';
					Html += '<h2>Cast:</h2>';
					Html += ' <p>'+item.cast+'</p>';
					Html += '</div>';
					Html += '<div>';
					if(item.upcoming != true){
							Html += '<h2>Shows:</h2>';
							Html += '<p>';
							$.each(itemSchedule,function(id,itm){
								if(id != (itemSchedule.length - 1)){
									Html += ' '+itm[0]+':'+itm[1]+' '+itm[2]+', ';
								}else{
									Html += ' '+itm[0]+':'+itm[1]+' '+itm[2];
								}
							});
							Html += '</p>';
					}
					Html += ' </div>';
					Html += '</div>';
					if(item.upcoming != true){
						Html += '<div class="movie-price marginLeftMoviePrice"><div class="price">PKR '+pricingArray[item.price]+'</div>';
						Html += '<a href="http://thearena.com.pk/membership.php" target="_blank"><button>Book Now</button></a>';
						if(item.movieTralier != '' && item.movieTralier != 'undefined' && item.movieTralier != undefined){
							Html += '<a href="'+item.movieTralier+'" target="_blank"><button class="tralier">Watch Trailer</button></a>';
						}
						Html += '</div>';
						Html += '</div>';
					}else{
						if(item.movieTralier != '' && item.movieTralier != 'undefined' && item.movieTralier != undefined){
							Html += '<div class="movie-price marginLeftMoviePrice"><div class="price"></div>';
							Html += '<a href="'+item.movieTralier+'" target="_blank"><button class="tralier uptralier">Watch Trailer</button></a>';
							Html += '</div>';
							Html += '</div>';
						}
					}
					console.log(Html);
					if(item.upcoming != true){
						dailyWidth = dailyWidth + 180;
						$('.movie-posters').append("<img data-type='"+item.upcoming+"' data-day='"+days+"' src='"+item.image+"' alt='"+item.name+"' class='listingItem' data-movieTrailer='"+encodeURIComponent(escape(item.movieTralier))+"' data-upcoming='"+item.upcoming+"'  data-image='"+item.image+"' data-sch='"+item.movieschedule+"' data-durHH='"+item.durationHH+"' data-durMM='"+item.durationMM+"' data-name='"+encodeURIComponent(escape(item.name))+"' data-cast='"+encodeURIComponent(escape(item.cast))+"' data-synopsis='"+encodeURIComponent(escape(item.synopsis))+"' data-image='"+item.image+"' data-catagory='"+encodeURIComponent(escape(item.genre))+"' data-date='"+item.durationHH+"' data-price='"+item.price+"'>");
						$('.movieListingBottom').append(Html);
					}else{
						dailyWidthUp = dailyWidthUp + 180;
						$('.movie-postersUp').append("<img data-type='"+item.upcoming+"' src='"+item.image+"' data-day='"+days+"' alt='"+item.name+"' class='listingItem' data-movieTrailer='"+encodeURIComponent(escape(item.movieTralier))+"' data-upcoming='"+item.upcoming+"'  data-image='"+item.image+"' data-sch='"+item.movieschedule+"' data-durHH='"+item.durationHH+"' data-durMM='"+item.durationMM+"' data-name='"+encodeURIComponent(escape(item.name))+"' data-cast='"+encodeURIComponent(escape(item.cast))+"' data-synopsis='"+encodeURIComponent(escape(item.synopsis))+"' data-image='"+item.image+"' data-catagory='"+encodeURIComponent(escape(item.genre))+"' data-date='"+item.durationHH+"' data-price='"+item.price+"'>");
						$('.movieListingBottomUp').append(Html);
					}
				$('.preLoader').fadeOut();
				}else{
					var dayOWeek  = new Date().getDay()+2;
					if(dayOWeek >= 7 ){
						dayOWeek = 0;
					}
					//dayOWeek = 0;
					//alert(dayOWeek);return true;
					$('#week-days li:nth-child('+daysOFWeekLiPos[dayOWeek]+')').addClass('active');
					$('.arrow-down').css('left',daysOFWeekAnimation[dayOWeek]);
					$('.preLoader').fadeOut();
				}
			});
			if(DayDataCount == 0){
				$('.soon').show();
			}
			}else{
				var dayOWeek  = new Date().getDay();
				dayOWeek = 5;
				$('#week-days li:nth-child('+daysOFWeekLiPos[dayOWeek]+')').addClass('active');
				$('.arrow-down').css('left',daysOFWeekAnimation[dayOWeek]);
				$('.preLoader').fadeOut();
			}
			
			//$('.movie-postersUp').css('width',dailyWidthUp+'px');
			$(".content_6").mCustomScrollbar({
					horizontalScroll:true,
					advanced:{
						autoExpandHorizontalScroll:true
					}
				});
			$(".content_5").mCustomScrollbar({
				horizontalScroll:true,
				advanced:{
					autoExpandHorizontalScroll:true
				}
			});
			$(".mainContUp").addClass('hideMe');
			/*$('.images_container img').hover(function(){
					$(this).animate({width:$(this).width() + 20 + 'px',height:$(this).height() + 20 + 'px',left: '-10px',top: '-10px'});
			},function(){				
					$(this).animate({width:$(this).width() - 20 + 'px',height:$(this).height() - 20 + 'px',left: '0',top: '0'});
			});*/
		}
		
		//end get city function
		
		// createHtmlForMovies
		
		// event listener
		var ClickedLi = '';
		var searchResult = 0;
		$(document.body).on('click', '#week-days li', function() {
			ClickedLi = $(this).attr('data-pos');
			if($(this).index() >= 2){
				$('.movieListingBottom').find('.movie-detail-widget').each(function(index, element) {
						var listDays = $(this).attr('data-day');
                    	if(listDays.indexOf(daysOFWeek[ClickedLi]) > -1){
							$(this).removeClass('hideMe');
							searchResult++;
							$('#week-days li').removeClass('active');
							$('#week-days li:nth-child('+daysOFWeekLiPos[ClickedLi]+')').addClass('active');
							$('.arrow-down').css('left',daysOFWeekAnimation[ClickedLi]);
						}else{
							$(this).addClass('hideMe');
						}
                });
				
				/*$('.movie-posters').find('li').each(function(index, element) {
						var listDays = $(this).attr('data-day');
                    	if(listDays.indexOf(daysOFWeek[ClickedLi]) > -1){
							$(this).removeClass('hideMe');
						}else{
							$(this).addClass('hideMe');
						}
                });*/
				if(searchResult  != 0){
					searchResult = 0;
					$('.soon').hide();
				}else{
					$('.soon').show();
					$('#week-days li').removeClass('active');
					$('#week-days li:nth-child('+daysOFWeekLiPos[ClickedLi]+')').addClass('active');
					$('.arrow-down').css('left',daysOFWeekAnimation[ClickedLi]);
				}
			}
			
		});
		
		$(document.body).on('click', '#main-buttons li button', function() {
					if($(this).attr('data-pos') == 1){
							$('.mainCont').removeClass('hideMe');
							$('.movieListingBottom').removeClass('hideMe');
							$('.mainContUp').addClass('hideMe');
							$('.movieListingBottomUp').addClass('hideMe');
							$('#main-buttons li button').removeClass('active');
							$(this).addClass('active');
							$('#week-days').slideDown();
							$('.arrow-down').show();
							if($('.movieListingBottom .movie-detail-widget').length != 0){								
								$('.soon').hide();
							}else{
								$('.soon').show();
							}
							
					}else{
							$('.mainContUp').removeClass('hideMe');
							$('.movieListingBottomUp').removeClass('hideMe');
							$('.mainCont').addClass('hideMe');
							$('.movieListingBottom').addClass('hideMe');
							$('#main-buttons li button').removeClass('active');
							$(this).addClass('active');
							$('#week-days').slideUp();
							$('.arrow-down').hide();
							if($('.movieListingBottomUp .movie-detail-widget').length != 0){								
								$('.soon').hide();
							}else{
								$('.soon').show();
							}
					}
		});
		$(document.body).on('click', '.close-btn', function() {
					$('.modal').addClass('hideMe');
					$('#alpha-layer').addClass('hideMe');
		});
		$(document.body).on('click', '.listingItem', function() {
			if($(this).attr('data-upcoming') != 'true'){
				if($(this).attr('data-upcoming') != 'true'){
					var dataSchedule = JSON.parse($(this).attr('data-sch'));
				}
					if($(this).attr('data-upcoming') == 'true'){
						$('#schDetails').addClass('hideMe');
					}else{
						$('#schDetails').removeClass('hideMe');
					}
					if($(this).attr('data-upcoming') != 'true'){
					var NextItem = '';
						$.each(daysOFWeekAll,function(indexD,itemD){
							NextItem += '<tr class="day_'+indexD+'">';
							NextItem += '<td>'+itemD+'</td>';
							var NextItemDp = '';
							$.each(dataSchedule,function(index,items){
								console.log(dataSchedule);
							if(items[(indexD+3)] == true){
								NextItemDp += items[0]+':'+items[1]+' '+items[2]+',';
							}
						});
						if(NextItemDp != ''){
							//alert(NextItemDp);
							NextItem += '<td>'+NextItemDp.substr(0,NextItemDp.length -1)+'</td></tr>';
						}else{
							NextItem += '<td>-</td></tr>';
						}
						
						
						
					});
						if(NextItem == '<tr>'){
							NextItem += '<td>-</td><td>-</td>';
						}
						if(NextItem == ''){
							NextItem += '<tr><td>-</td><td>-</td>';
						}
						NextItem += '</tr>';
						$('.MovieSch').html(NextItem);
						$('.MovieSch').prepend('<tr>'+$('.day_6').html()+'</tr>');
						$('.MovieSch').prepend('<tr>'+$('.day_5').html()+'</tr>');
						$('.MovieSch').prepend('<tr>'+$('.day_4').html()+'</tr>');
						$('.MovieSch tr:nth-child(8)').remove();
						$('.MovieSch tr:nth-child(8)').remove();
						$('.MovieSch tr:nth-child(8)').remove();
						
					}
					//$('.MovieImg').attr('src',$(this).attr('data-image'))
					//alert($(this).attr('data-upcoming'));
					if($(this).attr('data-movieTrailer') != '' && $(this).attr('data-movieTrailer') != null && $(this).attr('data-movieTrailer') != 'null' && $(this).attr('data-movieTrailer') != 'undefined'){
						//$('.movieTrailer').attr('href',decodeURIComponent(unescape($(this).attr('data-movieTrailer'))));
						//$('.movieTrailer').show();
						$('.traliers').attr('href',decodeURIComponent(unescape($(this).attr('data-movieTrailer'))));
						$('.traliers').show();
					}else{
						$('.traliers').hide();
					}
					$('.MoviePrice').html('PKR '+pricingArray[$(this).attr('data-price')]);
					$('.MovieImg').attr('src',$(this).attr('data-image'));
					$('.Dur').html($(this).attr('data-durHH')+'hr '+$(this).attr('data-durMM')+'min');
					$('.MovieName').html(decodeURIComponent(unescape($(this).attr('data-name'))));
					$('.MovieCat').html(decodeURIComponent(unescape($(this).attr('data-catagory'))));
					//$('.MovieSchDate').html($(this).attr('data-date'))
					//$('.MovieSch').attr('src',$(this).attr('data-image'))
					$('.MovieCast').html(decodeURIComponent(unescape($(this).attr('data-cast'))));
					$('.MovieSynopsis').html(decodeURIComponent(unescape($(this).attr('data-synopsis'))));
					$('.modal').removeClass('hideMe');
					$('#alpha-layer').removeClass('hideMe');
		}
		});
		
		
		
		// end event listener
		
		
}