var pricingArray = new Array();
var schdeuleArray = new Array();
var AppId = '';
var AppURL = '';
var daysOFWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
var daysOFWeekAll = ["Monday", "Tuesday", "Wednesday", "Thrusday", "Friday", "Saturday","Sunday"];
var daysOFWeekAnimation = ["304px", "381px", "462px", "541px", "618px", "698px", "225px"];
var daysOFWeekLiPos = ["4", "5", "6", "7", "8", "9", "3"];

function GetApp(){
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
			var CinemaQuery = CinemaTable.where({cinema:'Arena'});
			console.log(CinemaQuery);
			CinemaQuery.read().then(function(todoItemsCinema) {
				$.each(todoItemsCinema,function(indexCinema,itemCinema){
					var PricingQuery = PricingTable.where({cinemaid:itemCinema.id});
					PricingQuery.read().then(function(Pricing) {
						$.each(Pricing,function(indexPrice,itemPrice){							
							pricingArray[itemPrice.id] = itemPrice.amount;
						});
					}, handleError).done(function(){
							var ScheduleQuery = ScheduleTable.where({cinema:itemCinema.id});
							ScheduleQuery.read().then(function(Schedule) {
								$.each(Schedule,function(indexSchedule,itemSchedule){
									schdeuleArray.push(itemSchedule);
								});
							}, handleError).done(function(){
								createHtmlForPage();
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
			$.each(schdeuleArray,function(index,item){
				var dayOWeek  = new Date().getDay();
				var itemSchedule = JSON.parse(item.movieschedule);
				var days = '&nbsp;';
				var displayItem = 'hideMe';
				
				$.each(itemSchedule,function(id,itm){
						if(itm[1] == true){
							days += '-MON-';
							if(daysOFWeek[dayOWeek] == 'MON'){
								displayItem = '';
							}
						}
						if(itm[2] == true){
							days += '-TUE-';
							if(daysOFWeek[dayOWeek] == 'TUE'){
								displayItem = '';
							}
						}
						if(itm[3] == true){
							days += '-WED-';
							if(daysOFWeek[dayOWeek] == 'WED'){
								displayItem = '';
							}
						}
						if(itm[4] == true){
							days += '-THU-';
							if(daysOFWeek[dayOWeek] == 'THU'){
								displayItem = '';
							}
						}
						if(itm[5] == true){
							days += '-FRI-';
							if(daysOFWeek[dayOWeek] == 'FRI'){
								displayItem = '';
							}
						}
						if(itm[6] == true){
							days += '-SAT-';
							if(daysOFWeek[dayOWeek] == 'SAT'){
								displayItem = '';
							}
						}
						if(itm[7] == true){
							days += '-SUN-';
							if(daysOFWeek[dayOWeek] == 'SUN'){
								displayItem = '';
							}
						}						
					});
					if(item.upcoming == true){
						displayItem = '';
					}
					$('#week-days li:nth-child('+daysOFWeekLiPos[dayOWeek]+')').addClass('active');
					$('.arrow-down').css('left',daysOFWeekAnimation[dayOWeek]);
					
				var Html = '';
					Html += '<div class="movie-detail-widget '+displayItem+'" data-type="'+item.upcoming+'" data-day="'+days+'">';
					Html += "<img class='listingItem' data-upcoming='"+item.upcoming+"'  data-image='"+item.image+"' data-sch='"+item.movieschedule+"' data-durHH='"+item.durationHH+"' data-durMM='"+item.durationMM+"' data-name='"+item.name+"' data-cast='"+item.cast+"' data-synopsis='"+item.synopsis+"' data-image='"+item.image+"' data-catagory='"+item.genre+"' data-date='"+item.durationHH+"' data-price='"+item.price+"' src='"+item.image+"' alt='"+item.name+"'>";
					Html += '<div class="movie-details">';
					Html += "<h1 class='listingItem' data-upcoming='"+item.upcoming+"'  data-image='"+item.image+"' data-sch='"+item.movieschedule+"' data-durHH='"+item.durationHH+"' data-durMM='"+item.durationMM+"' data-name='"+item.name+"' data-cast='"+item.cast+"' data-synopsis='"+item.synopsis+"' data-image='"+item.image+"' data-catagory='"+item.genre+"' data-date='"+item.durationHH+"' data-price='"+item.price+"'>"+item.name+"</h1>";
					Html += '<div><span>Action, Thirller</span><span> | </span><span>'+item.durationHH+'hr '+item.durationMM+' min</span></div>';
					Html += '<div class="synopsis-container">';
					Html += '<h2>Synopsis:</h2>';
					Html += ' <p>'+item.synopsis+'</p>';
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
									Html += itm[0]+', ';
								}else{
									Html += itm[0];
								}
							});
							Html += '</p>';
					}
					Html += ' </div>';
					Html += '</div>';
					Html += '<div class="movie-price"><div class="price">PKR '+pricingArray[item.price]+'</div><button>Book Now</button></div>';
					Html += '</div>';
					if(item.upcoming != true){
						$('.movie-posters').append("<li data-type='"+item.upcoming+"' data-day='"+days+"' class='"+displayItem+"'><img src='"+item.image+"' alt='"+item.name+"' class='listingItem' data-upcoming='"+item.upcoming+"'  data-image='"+item.image+"' data-sch='"+item.movieschedule+"' data-durHH='"+item.durationHH+"' data-durMM='"+item.durationMM+"' data-name='"+item.name+"' data-cast='"+item.cast+"' data-synopsis='"+item.synopsis+"' data-image='"+item.image+"' data-catagory='"+item.genre+"' data-date='"+item.durationHH+"' data-price='"+item.price+"'></li>");
						$('.movieListingBottom').append(Html);
					}else{
						$('.movie-postersUp').append("<li data-type='"+item.upcoming+"' data-day='"+days+"' class='"+displayItem+"'><img src='"+item.image+"' alt='"+item.name+"' class='listingItem' data-upcoming='"+item.upcoming+"'  data-image='"+item.image+"' data-sch='"+item.movieschedule+"' data-durHH='"+item.durationHH+"' data-durMM='"+item.durationMM+"' data-name='"+item.name+"' data-cast='"+item.cast+"' data-synopsis='"+item.synopsis+"' data-image='"+item.image+"' data-catagory='"+item.genre+"' data-date='"+item.durationHH+"' data-price='"+item.price+"'></li>");
						$('.movieListingBottomUp').append(Html);
					}
				$('.preLoader').fadeOut();
			});
		}
		
		//end get city function
		
		// createHtmlForMovies
		
		// event listener
		var ClickedLi = '';
		$(document.body).on('click', '#week-days li', function() {
			ClickedLi = $(this).attr('data-pos');
			if($(this).index() >= 2){
				$('.movieListingBottom').find('.movie-detail-widget').each(function(index, element) {
						var listDays = $(this).attr('data-day');
                    	if(listDays.indexOf(daysOFWeek[ClickedLi]) > -1){
							$(this).removeClass('hideMe');
							$('#week-days li').removeClass('active');
							$('#week-days li:nth-child('+daysOFWeekLiPos[ClickedLi]+')').addClass('active');
							$('.arrow-down').css('left',daysOFWeekAnimation[ClickedLi]);
						}else{
							$(this).addClass('hideMe');
						}
                });
				
				$('.movie-posters').find('li').each(function(index, element) {
						var listDays = $(this).attr('data-day');
                    	if(listDays.indexOf(daysOFWeek[ClickedLi]) > -1){
							$(this).removeClass('hideMe');
						}else{
							$(this).addClass('hideMe');
						}
                });
			}
			
		});
		
		$(document.body).on('click', '#main-buttons li button', function() {
					if($(this).attr('data-pos') == 1){
							$('.movie-posters').removeClass('hideMe');
							$('.movieListingBottom').removeClass('hideMe');
							$('.movie-postersUp').addClass('hideMe');
							$('.movieListingBottomUp').addClass('hideMe');
							$('#main-buttons li button').removeClass('active');
							$(this).addClass('active');
							$('#week-days').slideDown();
							$('.arrow-down').show();
							
							
					}else{
							$('.movie-postersUp').removeClass('hideMe');
							$('.movieListingBottomUp').removeClass('hideMe');
							$('.movie-posters').addClass('hideMe');
							$('.movieListingBottom').addClass('hideMe');
							$('#main-buttons li button').removeClass('active');
							$(this).addClass('active');
							$('#week-days').slideUp();
							$('.arrow-down').hide();
					}
		});
		$(document.body).on('click', '.close-btn', function() {
					$('.modal').addClass('hideMe');
					$('#alpha-layer').addClass('hideMe');
		});
		$(document.body).on('click', '.listingItem', function() {
					var dataSchedule = JSON.parse($(this).attr('data-sch'));
					if($(this).attr('data-upcoming') == '1'){
						$('#schDetails').addClass('hideMe');
					}else{
						$('#schDetails').removeClass('hideMe');
					}
					var NextItem = '';
						$.each(daysOFWeekAll,function(indexD,itemD){
							NextItem += '<tr>';
							NextItem += '<td>'+itemD+'</td>';
							var NextItemDp = '';
							$.each(dataSchedule,function(index,items){
							if(items[(indexD+1)] == true){
								NextItemDp += items[0]+',';
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
					//$('.MovieImg').attr('src',$(this).attr('data-image'))
					//alert($(this).attr('data-upcoming'));
					
					$('.MoviePrice').html('PKR '+pricingArray[$(this).attr('data-price')]);
					$('.MovieImg').attr('src',$(this).attr('data-image'));
					$('.Dur').html($(this).attr('data-durHH')+'hr '+$(this).attr('data-durMM')+'min')
					$('.MovieName').html($(this).attr('data-name'))
					$('.MovieCat').html($(this).attr('data-catagory'))
					//$('.MovieSchDate').html($(this).attr('data-date'))
					//$('.MovieSch').attr('src',$(this).attr('data-image'))
					$('.MovieCast').html($(this).attr('data-cast'))
					$('.MovieSynopsis').html($(this).attr('data-synopsis'));
					$('.modal').removeClass('hideMe');
					$('#alpha-layer').removeClass('hideMe');
		});
		
		
		
		// end event listener
		
		$(function(){})
}