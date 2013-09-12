var cityNameArray = new Array();
var cinemaNameArray = new Array();
var pricingArray = new Array();
var pricingList = '';
var AppId = '';
var AppURL = '';
function GetApp(){
	$.getJSON('app.json', function(data) {
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
		
		//end get city function
		
		// createHtmlForMovies
		function createHtmlForMovies(){
		
			var query = ScheduleTable.where({ city: $('#city').val() , cinema: $('#cinema').val() , parent: 0 });
		  /*var query = todoItemTable.where(function(dated){
											return this.id <= dated
											},2);*/
			
			query.read().then(function(todoItems) {
				var listItems = $.map(todoItems, function(item) {
					console.log(item);
					var timetypeOptions = '';
					if(item.timetype == 'AM'){
						timetypeOptions+= '<select type="text" class="movietimetype">';
						timetypeOptions+= '<option selected value="AM" selected>AM</option>';
						timetypeOptions+= '<option value="PM">PM</option>';
						timetypeOptions+= '</select>';
					}else{
						timetypeOptions+= '<select type="text" class="movietimetype">';
						timetypeOptions+= '<option value="AM">AM</option>';
						timetypeOptions+= '<option selected value="PM">PM</option>';
						timetypeOptions+= '</select>';
					}
					if(item.images == ''){
						var img = 'movie-placeholder.jpg';
					}else{
						var img = item.images;
					}
						var html='';
							html +='<div class="panel panel-default" data-id="'+item.id+'">';
							html +='<div class="panel-heading">';
							if(item.threeD == true){
								html +='<div class="col-lg-11 movieTitle"> '+item.name+' <span class="label  label-danger">3D</span> </div>';
							}else{
								html +='<div class="col-lg-11 movieTitle"> '+item.name+' </div>';
							}
							html +='<div class="col-lg-1">';
							html +='<button  class="close"  data-id="'+item.id+'">x</button>';
							html +="<button data-schedule='"+item.movieschedule+"' data-id='"+item.id+"' data-name='"+item.name+"' data-image='"+item.image+"' data-cast='"+item.cast+"' data-genre='"+item.genre+"' data-synopsis='"+item.synopsis+"' data-3d='"+item.threeD+"' data-price='"+item.price+"' data-durationHH='"+item.durationHH+"' data-durationMM='"+item.durationMM+"' data-upcoming='"+item.upcoming+"' type='button' class='edit' title='edit'><span class='glyphicon glyphicon-pencil'></span></button>";
							html +='</div>     ';              
							html +='<div class="clearOnly"></div>';
							html +='</div>';
							html +='<div class="panel-body">';
							html +='<div class="col-lg-2">';
							html +='<div class="col-lg-12">';
							if(item.image != ''){
								html +='<img src="'+item.image+'">';
							}else{
								html +='<img src="./assets/images/no.jpg">';
							}
							html +='</div>';
							html +='</div>';
							html +='<div class="col-lg-8">';
							html +='<div class="col-lg-2">';
							html +='<span class="label  label-info">Duration</span>';
							if(item.durationHH && item.durationMM){
								html +='<p>'+item.durationHH+':'+item.durationMM+'</p>';
							}else{
								html +='<p>-</p>';
							}
							html +='</div>';
							html +='<div class="col-lg-10">';
							html +='<span class="label  label-info">Genre</span>';
							html +='<p>'+item.genre+'</p>';
							html +='</div>';  
							html +='<div class="col-lg-12">';
							html +='<span class="label  label-info">Synopsis</span>';
							html +='<p>'+item.synopsis+'</p>';
							html +='</div>';    
							html +='<div class="col-lg-12">';
							html +='<span class="label  label-info">Cast</span>';
							html +='<p>'+item.cast+'</p>';
							html +='</div>';
							html +='</div>';
							html +='<div class="col-lg-2">';
							if(pricingArray[item.price]){
								html +='<h1 class="pricingText">PKR '+pricingArray[item.price]+'</h1>';
							}
							html +='</div>';
							html +='</div> ';             
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
			$('#toDate').val('');
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
						Html +='<div class="input-group col-lg-12">';
						Html +='<span class="label label-info">TIME</span> ';
						Html +='<input type="text" value="'+value[0]+'" class="form-control time"  />';
						Html +='</div>';
						Html +='<div class="input-group col-lg-12">';
						Html +='<span class="label label-info">DAYS</span> ';
						Html +='<div class="table-responsive scheduleList">';
						Html +='<table class="table  table-condensed">';
						Html +='<tbody>';
						Html +='<tr>';
						if(value[1] == true){
							Html +='<td><input checked="checked" type="checkbox" class="MON"></td>';
						}else{
							Html +='<td><input type="checkbox" class="MON"></td>';
						}
						Html +='<td>MON</td>';
						if(value[2] == true){
							Html +='<td><input checked="checked" type="checkbox"  class="TUE"></td>';
						}else{
							Html +='<td><input type="checkbox"  class="TUE"></td>';
						}
						Html +='<td>TUE</td>';
						if(value[3] == true){
							Html +='<td><input checked="checked" type="checkbox"  class="WED"></td>';
						}else{
							Html +='<td><input type="checkbox"  class="WED"></td>';
						}
						Html +=' <td>WED</td>';
						if(value[4] == true){
							Html +='<td><input checked="checked" type="checkbox"  class="THU"></td>';
						}else{
							Html +='<td><input type="checkbox"  class="THU"></td>';
						}
						Html +='<td>THR</td>';
						if(value[5] == true){
							Html +='<td><input checked="checked" type="checkbox"  class="FRI"></td>';
						}else{
							Html +='<td><input type="checkbox"  class="FRI"></td>';
						}
						Html +='<td>FRI</td>';
						if(value[6] == true){
							Html +='<td><input checked="checked" type="checkbox"  class="SAT"></td>';
						}else{
							Html +='<td><input type="checkbox"  class="SAT"></td>';
						}
						Html +='<td>SAT</td>';
						if(value[7] == true){
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
			$('#movieName').val($(this).attr('data-name'));
			if($(this).attr('data-3d') == true){
				$('#movie3d').attr('checked','checked');
			}else{
				$('#movie3d').removeAttr('checked');
			}
			$('#movieCast').val($(this).attr('data-cast'));
			$('#movieGenre').val($(this).attr('data-genre'));
			$('#movieDurationHH').val($(this).attr('data-durationHH'));
			$('#movieDurationMM').val($(this).attr('data-durationMM'));
			$('#moviePrice').val($(this).attr('data-price'));			
			$('#movieSynopsis').val($(this).attr('data-synopsis'));
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
				 getPricing($(this).val());
			}
			$('#fromDate').val('');
			$('#toDate').val('');
			$('#addMovies').hide();
			$('#todo-items').hide();
		});
		$(document.body).on('change', '#fromDate', function() {
			if($('#fromDate').val() != '' && $('#toDate').val() != ''){
				$('.loader').show();
				createHtmlForMovies();
				$('#addMovies').show();
				$('#todo-items').show();
			}else{
				$('#addMovies').hide();
				$('#todo-items').hide();
			}
		});
		$(document.body).on('change', '#toDate', function() {
			if($('#fromDate').val() != '' && $('#toDate').val() != ''){
				$('.loader').show();
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
				Html +='<div class="input-group col-lg-12">';
				Html +='<span class="label label-info">TIME</span> ';
				Html +='<input type="text" class="form-control time"  />';
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
                $(this).find('input').each(function(){
					if($(this).hasClass('time')){
						itemSchedule[index].push($(this).val());
					}else{
						itemSchedule[index].push($(this).prop('checked'));
						
					}
				});
            });
			var cityName = $('#city').val();
			var cinemaName =$('#cinema').val();
			var fromdate = $('#fromDate').val();
			var todate = $('#toDate').val();
			var movieImage = $('#movieImage').val();
			var movieName = $('#movieName').val();
			var movie3d = $('#movie3d').prop('checked');
			var movieCast = $('#movieCast').val();
			var movieGenre = $('#movieGenre').val();
			var movieDurationHH = $('#movieDurationHH').val();
			var movieDurationMM = $('#movieDurationMM').val();
			var moviePrice = $('#moviePrice').val();			
			var movieSynopsis = $('#movieSynopsis').val();
			var movieUpcoming = $('#movieUpcoming').prop('checked');
			var MovieSchedules = JSON.stringify(itemSchedule);
			
			
			if(movieName == ''){
				alert('Please enter movie Name');
			}else{
				if($('#movieId').val() == ''){
						var theNewRow = {
							city: cityName,
							cinema: cinemaName,
							fromdate: fromdate,
							todate: todate,
							image: movieImage,
							threeD: movie3d,
							price: moviePrice,
							durationHH: movieDurationHH,
							durationMM: movieDurationMM,
							synopsis: movieSynopsis,
							genre : movieGenre,
							images: movieImage,				
							name: movieName,
							cast: movieCast,
							upcoming: movieUpcoming,
							movieschedule:MovieSchedules,
							parent: 0					
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
							todate: todate,
							image: movieImage,
							threeD: movie3d,
							price: moviePrice,
							durationHH: movieDurationHH,
							durationMM: movieDurationMM,
							synopsis: movieSynopsis,
							genre : movieGenre,
							images: movieImage,				
							name: movieName,
							cast: movieCast,
							upcoming: movieUpcoming,
							movieschedule:MovieSchedules,
							parent: 0					
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
		
		$(function(){
			var btnUpload=$('#upload');
			var status=$('#status');
			var maxwdith=400;
			var maxheight=200;
			new AjaxUpload(btnUpload, {
				action: 'upload-file.php',
				name: 'uploadfile',
				onSubmit: function(file, ext){
					/* if (! (ext && /^(jpg|png|jpeg|gif)$/.test(ext))){ 
						// extension is not allowed 
						status.text('Only JPG, PNG or GIF files are allowed');
						return false;
					}*/
					
					status.text('Uploading...');
				},
				onComplete: function(file, response){
					//On completion clear the status
					status.text('');
					//Add uploaded file to list
					var res = response.split('|');
					if(res[0]==="success"){
						btnUpload.attr('src',res[1]);
						$('#movieImage').val(res[1]);
					} else{
						//$('<li></li>').appendTo('#files').text(file).addClass('error');
					}
				}
			});
		})
}