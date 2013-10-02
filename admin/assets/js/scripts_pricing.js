var cityNameArray = new Array();
var cinemaNameArray = new Array();
var AppId = '';
var AppURL = '';
function GetApp(){
	$.getJSON('../app.json', function(data) {
		AppId = data.id;
		AppURL = data.url;
		StartApp();
	});
}
function StartApp(){	
	var client = new WindowsAzure.MobileServiceClient(AppURL, AppId),
	   	CityTable = client.getTable('city');
		CinemaTable = client.getTable('cinema');
		PricingTable = client.getTable('pricing');
		//get page wise start data
		if(localStorage.getItem('userId')){
			client.currentUser = {};
			client.currentUser.userId = localStorage.getItem('userId');
			client.currentUser.mobileServiceAuthenticationToken = localStorage.getItem('mobileServiceAuthenticationToken');
			$('.adminName').html(localStorage.getItem('userName'));
		}else{
			top.location.href = 'login.html';
		}
   	 	getCity();
		
		//end page wise start data
		
		// handle error
		function handleError(error) {
			if(error.message.indexOf('authentication') > 0){
				top.location.href = 'login.html';
			}else if(error.message.indexOf('connection') > 0){
				alert('Internet Connection failure, Please check your internet connection and then reload the page');
			}else{
				var text = error + (error.request+' : Please try again later.');
				alert(text);
			}
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
		
		
		
		// get cinema function
		function getCinema(city_id){
			var queryCinema = CinemaTable.where({});
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
		
		// createHtmlForMovies
		function createHtmlForPricing(){
			var query = PricingTable.where({ cinemaid: $('#cinema').val()});
		  /*var query = todoItemTable.where(function(dated){
											return this.id <= dated
											},2);*/
			
			query.read().then(function(todoItems) {
				var listItems = $.map(todoItems, function(item) {
						var html='';
							html +='<div class="panel panel-default" data-id="'+item.id+'">';
							html +='<div class="panel-heading">';
							html +='<div class="col-lg-11 cinemaName"> '+item.name+'</div>';
							html +='<div class="col-lg-1">';
							html +='<button  class="close"  data-id="'+item.id+'">x</button>';
							html +="<button data-name='"+item.name+"' data-id='"+item.id+"' data-amount='"+item.amount+"'  type='button' class='edit' title='edit'><span class='glyphicon glyphicon-pencil'></span></button>";
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
		// event listener
		$(document.body).on('change', '#city', function() {
			if($(this).val() != ''){
				$('.loader').show();
				 getCinema($(this).val());
			}
			$('#addPricing').hide();
			$('#todo-items').hide();
			
		});
		$(document.body).on('change', '#cinema', function() {
			if($(this).val() != ''){
				$('#addPricing').show();
				 $('#todo-items').show();
				 $('.loader').show();
				 createHtmlForPricing();
				 
			}else{
				$('#addPricing').hide();
				$('#todo-items').hide();
			}
		});
		
		$(document.body).on('click', '.edit', function() {
			$('#pricingId').val($(this).attr('data-id'));
			$('#pricingName').val($(this).attr('data-name'));
			$('#pricingAmount').val($(this).attr('data-amount'));
			$('#myModal').modal();
		});
		
		$(document.body).on('click', '.close', function() {
			if($(this).attr('data-id')){
			var result = confirm("You are about to delete this item, all associated data will de deleted. Click OK to continue.");
			if (result==true) {
				$('.loader').show();
			PricingTable.del({ id: $(this).attr('data-id') }).then(createHtmlForPricing, handleError).done(function(){
				$('.loader').hide();
			});
			}}
		});
		$(document.body).on('click', '#addPricing', function() {
			$('#pricingId').val('');
			$('#pricingName').val('');
			$('#pricingAmount').val('');
			$('#myModal').modal();
		});
		
		$('#add-item').on('click',function() {
			$('.loader').show();
			var cityName = $('#city').val();
			var cinemaName =$('#cinema').val();
			var pricingName = $('#pricingName').val();
			var pricingAmount = $('#pricingAmount').val();
			
			if(cinemaName == ''){
				alert('Please enter Cinema Name');
			}else{
				if($('#pricingId').val() == ''){
						var theNewRow = {
							cityid: cityName,
							cinemaid: cinemaName,
							name: pricingName,
							amount: pricingAmount							
						};
						PricingTable.insert(theNewRow).then(createHtmlForPricing, handleError).then(function(){
							$('#myModal').modal('hide');
							$('.loader').hide();
						});
				}else{
						var theNewRow = {
							id: parseInt($('#pricingId').val()),
							cityid: cityName,
							cinemaid: cinemaName,
							name: pricingName,
							amount: pricingAmount			
						};
						PricingTable.update(theNewRow).then(createHtmlForPricing, handleError).then(function(){
							$('#myModal').modal('hide');
							$('.loader').hide();
						});
				}
												
		}
    });
		// end event listener
		
		
}