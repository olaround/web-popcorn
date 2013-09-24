var cityNameArray = new Array();
var cinemaNameArray = new Array();
var MoviesArray = new Array();
var MoviesList = '';
var AppId = '';
var AppURL = '';
var WeekDays = '';
var WeekCount = 0;
var WeekOptions = new Array();
WeekOptions[WeekCount] = new Array();
WeekOptions[WeekCount]['start'] = '2013-1-1';
function returnDayWeek(m,d){
	var time = new Time(2013, m, d);
						time.firstDayOfWeek = 4;
						if(WeekDays != time.weekOfCurrentMonth() && time.weekday() == 1){
							WeekDays = time.weekOfCurrentMonth();
							//console.log(time.year()+'-'+time.month()+'-'+time.day());
							WeekOptions[WeekCount]['end'] = time.year()+'-'+time.month()+'-'+time.day();
							//console.log(WeekDays);
							//console.log(WeekCount);
							WeekCount++;
						}else if(time.weekday() == 2){
							WeekOptions[WeekCount] = new Array();
							//console.log(time.year()+'-'+time.month()+'-'+time.day());
							WeekOptions[WeekCount]['start'] = time.year()+'-'+time.month()+'-'+time.day();
						}
}
function GetApp(){
	for(var m=1;m<=12;m++){
		for(var d=1;d<=31;d++){
			if(m==2){
				if(new Time(2013).isLeapYear()){
					if(d <=29){
						returnDayWeek(m,d);
					}
				}else{
					if(d <=28){
						
					}
				}
			}else{
				if(m%2 == 0 && m < 8){
					if(d <= 30){
						returnDayWeek(m,d);
					}
				}else{
					if(m >= 8){
						if(m%2 != 0){
							if(d <= 30){
								returnDayWeek(m,d);
							}
						}else{
							if(d <= 31){
								returnDayWeek(m,d);
							}
						}
					}else if(d <= 31){
						returnDayWeek(m,d);
					}
				}
			}
		}
	}
	WeekOptions[WeekCount]['end'] = '2013-12-31';
	var OptionList = '';
	$.each(WeekOptions,function(index,item){
		OptionList += '<option value="'+item['start']+'/'+item['end']+'">Week '+(index+1)+' (<b>'+item['start']+'</b> to <b>'+item['end']+'</b>)</option>';
		//console.log(item['end']);
	});
	$('#fromDate').html(OptionList);
	console.log(OptionList);
	//console.log(WeekOptions);
	                            // Monday
	//time.firstDayOfWeek = 1; 
	
	$.getJSON('../app.json', function(data) {
		AppId = data.id;
		AppURL = data.url;
		StartApp();
	});
}
function StartApp(){	
	var client = new WindowsAzure.MobileServiceClient(AppURL, AppId),
        ScheduleTable = client.getTable('schedule');
		MoviesTable = client.getTable('movies');
		CityTable = client.getTable('city');
		CinemaTable = client.getTable('cinema');
		PricingTable = client.getTable('pricing');
		
		//get page wise start data
   	 	getCity();
		//end page wise start data
		
		// handle error
		function handleError(error) {
			var text = error + (error.request ? ' - ' + error.request.status : '');
			$('#errorlog').append($('<li>').text(text));
		}
		//end handle error
		
		// get city function
		function getCity(){
			var queryCity = CityTable.where({});
			queryCity.read().then(function(todoItemsCity) {
				$.each(todoItemsCity,function(index,item){
					if(item.city){
						$('#city').append('<option value='+item.id+'>'+item.city+'</option>');				
						cityNameArray[item.id] = 	item.city;
						cinemaNameArray[item.id] = new Array();
					}
				});
			}, handleError).done(function(){
				$('.loader').hide();
			});
		}
		
		//end get city function
		
		// get city function
		function getCinema(city_id){
			var queryCinema = CinemaTable.where({cityid: city_id});
			$('#cinema').html('<option value="">Select Cinema</option>');
			queryCinema.read().then(function(todoItemsCinema) {
				$.each(todoItemsCinema,function(index,item){
					if(item.cinema){
						if(cinemaNameArray[item.cityid]){
							if(city_id == item.cityid){
								$('#cinema').append('<option value='+item.id+'>'+item.cinema+'</option>');					
								cinemaNameArray[item.cityid][item.id] =	item.cinema;
							}
						}
					}
				});
			}, handleError).done(function(){
				$('.loader').hide();
			});
		}
		
		//end get city function
		
		// get city function
		function getPricing(cinama_id){
			var queryCinema = PricingTable.where({cinemaid: cinama_id});
			pricingList = '';
			pricingList += '<option value="">Select Pricing</option>';
			queryCinema.read().then(function(todoItemsCinema) {
				$.each(todoItemsCinema,function(index,item){
								pricingList += '<option value='+item.id+'>'+item.name+'</option>';					
								pricingArray[item.id] = item.amount;
							
				});
				$('#moviePrice').html(pricingList);
				//alert(pricingList);
			}, handleError).done(function(){
				$('.loader').hide();
			});
		}
		function getMovies(cinama_id){
			var queryMovies = MoviesTable.where({cinema: cinama_id, upcoming: 'false' });
			MoviesList = '';
			MoviesList += '<option value="">Select Movie</option>';
			queryMovies.read().then(function(todoItemsMovies) {
				$.each(todoItemsMovies,function(index,item){
								MoviesList += '<option value='+item.id+'>'+item.name+'</option>';					
								MoviesArray[item.id] = item.name;
							
				});
				$('#movieSelect').html(MoviesList);
				//alert(pricingList);
			}, handleError).done(function(){
				$('.loader').hide();
			});
		}
		
		//end get city function
		
		// createHtmlForMovies
		function createHtmlForMovies(){
		
			var query = ScheduleTable.where({ city: $('#city').val() , cinema: $('#cinema').val(), fromdate: $('#fromDate').val()});
		  /*var query = todoItemTable.where(function(dated){
											return this.id <= dated
											},2);*/
			
			query.read().then(function(todoItems) {
				var listItems = $.map(todoItems, function(item) {
					console.log(item);
						var html='';
							html +='<div class="panel panel-default" data-id="'+item.id+'">';
							html +='<div class="panel-heading">';
							html +='<div class="col-lg-11 movieTitle"> '+MoviesArray[item.movieSelect]+' </div>';
							html +='<div class="col-lg-1">';
							html +='<button  class="close"  data-id="'+item.id+'">x</button>';
							html +="<button data-schedule='"+item.movieschedule+"' data-id='"+item.id+"'  type='button' class='edit' title='edit'><span class='glyphicon glyphicon-pencil'></span></button>";
							html +='</div>     ';              
							html +='<div class="clearOnly"></div>';
							html +='</div>';
							html +='</div>';
						return  $(html)														
				});
				 $('#todo-items').empty().append(listItems).toggle(listItems.length > 0);
				 $('.loader').hide();
			}, handleError);
    
		}
		//end createHtmlForMovies
		
		function createHtmlForCinemas(){
			
		}
		
		// event listener
		$(document.body).on('change', '#city', function() {
			if($(this).val() != ''){
				$('.loader').show();
				 getCinema($(this).val());
			}
			$('#addMovies').hide();
			$('#todo-items').hide();
			$('#fromDate').val('');
			$('#movieSelect').val('');
		});
		
		$(document.body).on('click', '.edit', function() {
			$('#scheduleList').html('');
			if($(this).attr('data-schedule') != ''){
				var itemSC =$(this).attr('data-schedule');
				var itemSchedule = JSON.parse(itemSC);
				$.each(itemSchedule,function(index,value){
					var Html = '';
						Html +='<li class="list-group-item">';
						Html +='<div class="col-lg-12">';
						Html +='<button  class="closeSch">x</button>';
						Html +=' </div>';
						Html +=' <div style="clear:both;"></div>';
						Html +='<div class="input-group col-lg-4">';
						Html +='<span class="label label-info">HH</span> ';
						Html +='<input maxlength="2" type="text" value="'+value[0]+'" class="form-control timeHH"  />';
						Html +='</div>';
						Html +='<div class="input-group col-lg-4">';
						Html +='<span class="label label-info">MM</span> ';
						Html +='<input  maxlength="2" type="text" value="'+value[1]+'" class="form-control timeMM"  />';
						Html +='</div>';
						Html +='<div class="input-group col-lg-4">';
						Html +='<span class="label label-info">Type</span> ';
						Html +='<select type="text" value="'+value[2]+'" class="form-control timeType"  >';
						if(value[2] == 'AM'){
							Html +='<option selected="selected" value="AM">AM</option>';
						}else{
							Html +='<option value="AM">AM</option>';
						}
						if(value[2] == 'PM'){
							Html +='<option selected="selected" value="PM">PM</option>';
						}else{
							Html +='<option value="PM">PM</option>';
						}
						Html +='</select>';
						Html +='</div>';						
						Html +='<div class="input-group col-lg-12">';
						Html +='<span class="label label-info">DAYS</span> ';
						Html +='<div class="table-responsive scheduleList">';
						Html +='<table class="table  table-condensed">';
						Html +='<tbody>';
						Html +='<tr>';
						if(value[3] == true){
							Html +='<td><input checked="checked" type="checkbox" class="MON"></td>';
						}else{
							Html +='<td><input type="checkbox" class="MON"></td>';
						}
						Html +='<td>MON</td>';
						if(value[4] == true){
							Html +='<td><input checked="checked" type="checkbox"  class="TUE"></td>';
						}else{
							Html +='<td><input type="checkbox"  class="TUE"></td>';
						}
						Html +='<td>TUE</td>';
						if(value[5] == true){
							Html +='<td><input checked="checked" type="checkbox"  class="WED"></td>';
						}else{
							Html +='<td><input type="checkbox"  class="WED"></td>';
						}
						Html +=' <td>WED</td>';
						if(value[6] == true){
							Html +='<td><input checked="checked" type="checkbox"  class="THU"></td>';
						}else{
							Html +='<td><input type="checkbox"  class="THU"></td>';
						}
						Html +='<td>THR</td>';
						if(value[7] == true){
							Html +='<td><input checked="checked" type="checkbox"  class="FRI"></td>';
						}else{
							Html +='<td><input type="checkbox"  class="FRI"></td>';
						}
						Html +='<td>FRI</td>';
						if(value[8] == true){
							Html +='<td><input checked="checked" type="checkbox"  class="SAT"></td>';
						}else{
							Html +='<td><input type="checkbox"  class="SAT"></td>';
						}
						Html +='<td>SAT</td>';
						if(value[9] == true){
							Html +='<td><input checked="checked" type="checkbox"  class="SUN"></td>';
						}else{
							Html +='<td><input type="checkbox"  class="SUN"></td>';
						}
						Html +='<td>SUN</td>';
						Html +='</tr>';
						Html +=' </tbody>';
						Html +='</table>';
						Html +=' </div>';
						Html +='</div>';
						Html +='<div class="clear"></div>';
						Html +='</li>';
					$('#scheduleList').append(Html);
				});
			}
			$('#movieId').val($(this).attr('data-id'));
			$('#movieImage').val($(this).attr('data-image'));
			if($(this).attr('data-image') != ''){
				$('#movieImage').val($(this).attr('data-image'));
				$('#upload').attr('src',$(this).attr('data-image'));
			}
			$('#movieName').val(decodeURIComponent(unescape($(this).attr('data-name'))));
			if($(this).attr('data-3d') == true){
				$('#movie3d').attr('checked','checked');
			}else{
				$('#movie3d').removeAttr('checked');
			}
			$('#movieCast').val(decodeURIComponent(unescape($(this).attr('data-cast'))));
			$('#movieGenre').val(decodeURIComponent(unescape($(this).attr('data-genre'))));
			$('#movieDurationHH').val($(this).attr('data-durationHH'));
			$('#movieDurationMM').val($(this).attr('data-durationMM'));
			$('#moviePrice').val($(this).attr('data-price'));			
			$('#movieSynopsis').val(decodeURIComponent(unescape($(this).attr('data-synopsis'))));
			if($(this).attr('data-upcoming') == true){
				$('#movieUpcoming').attr('checked','checked');
				$('.scheduleModel').hide();
			}else{
				$('#movieUpcoming').removeAttr('checked');
				$('.scheduleModel').show();
			}
			
			$('#myModal').modal();
		});
			
		$(document.body).on('change', '#cinema', function() {
			if($(this).val() != ''){
				$('.loader').show();
				 getMovies($(this).val());
			}
			$('#fromDate').val('');
			$('#addMovies').hide();
			$('#todo-items').hide();
		});
		$(document.body).on('change', '#fromDate', function() {
			if($('#fromDate').val() != null){
				$('.loader').show();
				console.log('yes');
				createHtmlForMovies();
				$('#addMovies').show();
				$('#todo-items').show();
			}else{
				$('#addMovies').hide();
				$('#todo-items').hide();
			}
		});
		
		$(document.body).on('click', '.close', function() {
			$('.loader').show();
			ScheduleTable.del({ id: $(this).attr('data-id') }).then(createHtmlForMovies, handleError).done(function(){
				$('.loader').hide();
			});
		});
		$(document.body).on('click', '.closeSch', function() {
			$(this).parent().parent('li').remove();
		});
		
		$(document.body).on('click', '#addMovies', function() {
			$('#scheduleList').html('');
			$('#movieId').val('');
			$('#movieImage').val('');
			$('#movieImage').val('');
			$('#upload').attr('src','./assets/images/icon.jpg');
			$('#movieName').val('');
			$('#movie3d').removeAttr('checked');
			$('#movieCast').val('');
			$('#movieGenre').val('');
			$('#movieDurationHH').val('');
			$('#movieDurationMM').val('');
			$('#moviePrice').val('');			
			$('#movieSynopsis').val('');
			$('#movieUpcoming').removeAttr('checked');
			$('.scheduleModel').show();
			$('#myModal').modal();
		});
		$(document.body).on('click', '#movieUpcoming', function() {
			if($(this).prop('checked')){
				$('.scheduleModel').hide();
			}else{
				$('.scheduleModel').show();
			}
		});
		
		
		$(document.body).on('click', '#addSchedule', function() {
			var Html = '';
				Html +='<li class="list-group-item">';
				Html +='<div class="col-lg-12">';
				Html +='<button  class="closeSch">x</button>';
				Html +=' </div>';
				Html +=' <div style="clear:both;"></div>';
				Html +='<div class="input-group col-lg-4">';
				Html +='<span class="label label-info">HH</span> ';
				Html +='<input maxlength="2" type="text"  class="form-control timeHH"  />';
				Html +='</div>';
				Html +='<div class="input-group col-lg-4">';
				Html +='<span class="label label-info">MM</span> ';
				Html +='<input  maxlength="2" type="text"  class="form-control timeMM"  />';
				Html +='</div>';
				Html +='<div class="input-group col-lg-4">';
				Html +='<span class="label label-info">Type</span> ';
				Html +='<select type="text"  class="form-control timeType"  >';
				Html +='<option value="AM">AM</option>';
				Html +='<option value="PM">PM</option>';
				Html +='</select>';
				Html +='</div>';	
				Html +='<div class="input-group col-lg-12">';
				Html +='<span class="label label-info">DAYS</span> ';
				Html +='<div class="table-responsive scheduleList">';
				Html +='<table class="table  table-condensed">';
				Html +='<tbody>';
				Html +='<tr>';
				Html +='<td><input type="checkbox" class="MON"></td>';
				Html +='<td>MON</td>';
				Html +='<td><input type="checkbox"  class="TUE"></td>';
				Html +='<td>TUE</td>';
				Html +='<td><input type="checkbox"  class="WED"></td>';
				Html +=' <td>WED</td>';
				Html +='<td><input type="checkbox"  class="THR"></td>';
				Html +='<td>THR</td>';
				Html +='<td><input type="checkbox"  class="FRI"></td>';
				Html +='<td>FRI</td>';
				Html +='<td><input type="checkbox"  class="SAT"></td>';
				Html +='<td>SAT</td>';
				Html +='<td><input type="checkbox"  class="SUN"></td>';
				Html +='<td>SUN</td>';
				Html +='</tr>';
				Html +=' </tbody>';
				Html +='</table>';
				Html +=' </div>';
				Html +='</div>';
				Html +='<div class="clear"></div>';
				Html +='</li>';
			$('#scheduleList').append(Html);
		});
		
		
		$('#add-item').on('click',function() {
			$('.loader').show();
			var itemSchedule = new Array();
			$('#scheduleList').find('li').each(function(index, element) {
				itemSchedule[index]  = new Array();
                $(this).find('input,select').each(function(){
					if($(this).hasClass('timeHH') || $(this).hasClass('timeMM') || $(this).hasClass('timeType')){
						itemSchedule[index].push($(this).val());
					}else{
						itemSchedule[index].push($(this).prop('checked'));
						
					}
				});
            });
			var cityName = $('#city').val();
			var cinemaName =$('#cinema').val();
			var fromdate = $('#fromDate').val();
			var movieSelect = $('#movieSelect').val();
			var MovieSchedules = JSON.stringify(itemSchedule);
			console.log(MovieSchedules);
			
			if(movieSelect == ''){
				alert('Please enter movie Name');
			}else{
				if($('#movieId').val() == ''){
						var theNewRow = {
							city: cityName,
							cinema: cinemaName,
							fromdate: fromdate,
							movieSelect: movieSelect,
							movieschedule:MovieSchedules
						};
						ScheduleTable.insert(theNewRow).then(createHtmlForMovies, handleError).then(function(){
							$('#myModal').modal('hide');
						}).done(function(){
							$('.loader').hide();
						});
				}else{
						var theNewRow = {
							id: parseInt($('#movieId').val()),
							city: cityName,
							cinema: cinemaName,
							fromdate: fromdate,
							movieSelect: movieSelect,
							movieschedule:MovieSchedules				
						};
						ScheduleTable.update(theNewRow).then(createHtmlForMovies, handleError).then(function(){
							$('#myModal').modal('hide');
						}).done(function(){
							$('.loader').hide();
						});
				}
												
		}
    });
		// end event listener
		
		$(function(){})
}