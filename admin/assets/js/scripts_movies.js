var cityNameArray = new Array();
var cinemaNameArray = new Array();
var pricingArray = new Array();
var pricingList = '';
var AppId = '';
var AppURL = '';
function GetApp(){
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
        MoviesTable = client.getTable('movies');
		CityTable = client.getTable('city');
		CinemaTable = client.getTable('cinema');
		PricingTable = client.getTable('pricing');
		
		//get page wise start data
   	 	getCity();
		//end page wise start data
		
		// handle error
		function handleError(error) {
			var text = error + (error.request+' : Please try again later.');
			alert(text);
			//$('#errorlog').append($('<li>').text(text));
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
				$('.loader').show();
				createHtmlForMovies();
				$('#addMovies').show();
				$('#todo-items').show();
			});
		}
		
		//end get city function
		
		// createHtmlForMovies
		function createHtmlForMovies(){
		
			var query = MoviesTable.where({ city: $('#city').val() , cinema: $('#cinema').val(), parent: 0 });
		  /*var query = todoItemTable.where(function(dated){
											return this.id <= dated
											},2);*/
			
			query.read().then(function(todoItems) {
				var listItems = $.map(todoItems, function(item) {
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
							html +="<button data-schedule='"+item.movieschedule+"' data-movieTralier='"+encodeURIComponent(escape(item.movieTralier))+"' data-id='"+item.id+"' data-name='"+encodeURIComponent(escape(item.name))+"' data-image='"+item.image+"' data-cast='"+encodeURIComponent(escape(item.cast))+"' data-genre='"+encodeURIComponent(escape(item.genre))+"' data-synopsis='"+encodeURIComponent(escape(item.synopsis))+"' data-3d='"+item.threeD+"' data-price='"+item.price+"' data-durationHH='"+item.durationHH+"' data-durationMM='"+item.durationMM+"' data-upcoming='"+item.upcoming+"' type='button' class='edit' title='edit'><span class='glyphicon glyphicon-pencil'></span></button>";
							html +='</div>     ';              
							html +='<div class="clearOnly"></div>';
							html +='</div>';
							html +='<div class="panel-body">';
							html +='<div class="col-lg-2">';
							html +='<div class="col-lg-12">';
							if(item.image != ''){
								if(item.movieTralier != '' && item.movieTralier != null){
									html +='<a href="'+item.movieTralier+'" target="_blank"><img src="'+item.image+'"  width="140" height="209">';
									html +='<img src="assets/images/plays.png" class="iconPlay"></a>';
								}else{
									html +='<img src="'+item.image+'"  width="140" height="209">';
								}
							}else{
								if(item.movieTralier != '' && item.movieTralier != null){
									html +='<a href="'+item.movieTralier+'" target="_blank"><img src="./assets/images/no.jpg" width="140" height="209">';
									html +='<img src="assets/images/plays.png" class="iconPlay"></a>';
								}else{
									html +='<img src="./assets/images/no.jpg" width="140" height="209">';
								}
								
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
			$('#movieId').val($(this).attr('data-id'));
			$('#movieImage').val($(this).attr('data-image'));
			if($(this).attr('data-image') != ''){
				$('#movieImage').val($(this).attr('data-image'));
				$('#upload').attr('src',$(this).attr('data-image'));
			}
			$('#movieName').val(unescape(decodeURIComponent($(this).attr('data-name'))));
			if($(this).attr('data-3d') == 'true'){
				$('#movie3d').attr('checked','checked');
			}else{
				$('#movie3d').removeAttr('checked');
			}
			$('#movieCast').val(unescape(decodeURIComponent($(this).attr('data-cast'))));
			$('#movieGenre').val(unescape(decodeURIComponent($(this).attr('data-genre'))));
			$('#movieDurationHH').val($(this).attr('data-durationHH'));
			$('#movieDurationMM').val($(this).attr('data-durationMM'));
			$('#moviePrice').val($(this).attr('data-price'));			
			$('#movieSynopsis').val(unescape(decodeURIComponent($(this).attr('data-synopsis'))));
			$('#movieTralier').val(unescape(decodeURIComponent($(this).attr('data-movieTralier'))));
			
			if($(this).attr('data-upcoming') == 'true'){
				
				$('#movieUpcoming').attr('checked','checked');
			}else{
				
				$('#movieUpcoming').removeAttr('checked');
			}
			
			$('#myModal').modal();
		});
			
		$(document.body).on('change', '#cinema', function() {
			if($(this).val() != ''){
				$('.loader').show();
				 getPricing($(this).val());
			}else{
				$('#addMovies').hide();
				$('#todo-items').hide();
			}
		});
		
		$(document.body).on('click', '.close', function() {
			if($(this).attr('data-id')){
			var result = confirm("You are about to delete this item, all associated data will de deleted. Click OK to continue.");
			if (result==true) {
				$('.loader').show();
				MoviesTable.del({ id: $(this).attr('data-id') }).then(createHtmlForMovies, handleError).done(function(){
					$('.loader').hide();
				});
			}}
			
		});
		$(document.body).on('click', '.closeSch', function() {
			$(this).parent().parent('li').remove();
		});
		
		$(document.body).on('click', '#addMovies', function() {
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
			$('#movieTralier').val('');
			$('#movieUpcoming').removeAttr('checked');
			$('#myModal').modal();
		});
		
		$('#add-item').on('click',function() {
			$('.loader').show();
			var cityName = $('#city').val();
			var cinemaName =$('#cinema').val();
			var movieImage = $('#movieImage').val();
			var movieName = $('#movieName').val();
			var movie3d = $('#movie3d').prop('checked');
			var movieCast = $('#movieCast').val();
			var movieGenre = $('#movieGenre').val();
			var movieDurationHH = $('#movieDurationHH').val();
			var movieDurationMM = $('#movieDurationMM').val();
			var moviePrice = $('#moviePrice').val();			
			var movieSynopsis = $('#movieSynopsis').val();
			var movieTralier = $('#movieTralier').val();
			var movieUpcoming = $('#movieUpcoming').prop('checked');
			
			if(movieName == ''){
				alert('Please enter movie Name');
			}else{
				if($('#movieId').val() == ''){
						var theNewRow = {
							city: cityName,
							cinema: cinemaName,
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
							movieTralier: movieTralier,
							upcoming: movieUpcoming,
							parent: 0					
						};
						MoviesTable.insert(theNewRow).then(createHtmlForMovies, handleError).then(function(){
							$('#myModal').modal('hide');
						}).done(function(){
							$('.loader').hide();
						});
				}else{
						var theNewRow = {
							id: parseInt($('#movieId').val()),
							city: cityName,
							cinema: cinemaName,
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
							movieTralier: movieTralier,
							upcoming: movieUpcoming,
							parent: 0					
						};
						MoviesTable.update(theNewRow).then(createHtmlForMovies, handleError).then(function(){
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