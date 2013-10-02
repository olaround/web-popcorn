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
		if(localStorage.getItem('userId')){
			client.currentUser = {};
			client.currentUser.userId = localStorage.getItem('userId');
			client.currentUser.mobileServiceAuthenticationToken = localStorage.getItem('mobileServiceAuthenticationToken');
			$('.adminName').html(localStorage.getItem('userName'));
		}else{
			top.location.href = 'login.html';
		}
		//get page wise start data
		
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
		
		
		
		// get city function
		
		
		//end get city function
		
		// createHtmlForMovies
		function createHtmlForCinemas(){
			var query = CinemaTable.where({ cityid: $('#city').val()});
		  /*var query = todoItemTable.where(function(dated){
											return this.id <= dated
											},2);*/
			
			query.read().then(function(todoItems) {
				var listItems = $.map(todoItems, function(item) {
						var html='';
							html +='<div class="panel panel-default" data-id="'+item.id+'">';
							html +='<div class="panel-heading">';
							html +='<div class="col-lg-11 cinemaName"> '+item.cinema+'</div>';
							html +='<div class="col-lg-1">';
							html +='<button  class="close"  data-id="'+item.id+'">x</button>';
							html +="<button data-name='"+item.cinema+"' data-id='"+item.id+"' data-contact='"+item.contact+"' data-address='"+item.address+"' type='button' class='edit' title='edit'><span class='glyphicon glyphicon-pencil'></span></button>";
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
				$('#addCinema').show();
				 $('#todo-items').show();
				 $('.loader').show();
				 createHtmlForCinemas();
				 
			}else{
				$('#addCinemas').hide();
				$('#todo-items').hide();
			}
		});
		
		$(document.body).on('click', '.edit', function() {
			$('#scheduleList').html('');
			$('#cinemaId').val($(this).attr('data-id'));
			$('#cinemaName').val($(this).attr('data-name'));
			$('#cinemaContact').val($(this).attr('data-contact'));
			$('#cinemaAddress').html($(this).attr('data-address'));
			$('#myModal').modal();
		});
		
		$(document.body).on('click', '.close', function() {
			if($(this).attr('data-id')){
			var result = confirm("You are about to delete this item, all associated data will de deleted. Click OK to continue.");
			if (result==true) {
				$('.loader').show();
			CinemaTable.del({ id: $(this).attr('data-id') }).then(createHtmlForCinemas, handleError).done(function(){
				$('.loader').hide();
			});
			}}
		});
		$(document.body).on('click', '#addCinema', function() {
			$('#cinemaName').html('');
			$('#cinemaContact').val('');
			$('#cinemaAddress').html('');
			$('#myModal').modal();
		});
		
		$('#add-item').on('click',function() {
			$('.loader').show();
			var cityName = $('#city').val();
			var cinemaName =$('#cinemaName').val();
			var cinemaContact = $('#cinemaContact').val();
			var cinemaAddress = $('#cinemaAddress').val();
			
			if(cinemaName == ''){
				alert('Please enter Cinema Name');
			}else{
				if($('#cinemaId').val() == ''){
						var theNewRow = {
							cityid: cityName,
							cinema: cinemaName,
							contact: cinemaContact,
							address: cinemaAddress							
						};
						CinemaTable.insert(theNewRow).then(createHtmlForCinemas, handleError).then(function(){
							$('#myModal').modal('hide');
							$('.loader').hide();
						});
				}else{
						var theNewRow = {
							id: parseInt($('#cinemaId').val()),
							cityid: cityName,
							cinema: cinemaName,
							contact: cinemaContact,
							address: cinemaAddress			
						};
						CinemaTable.update(theNewRow).then(createHtmlForCinemas, handleError).then(function(){
							$('#myModal').modal('hide');
							$('.loader').hide();
						});
				}
												
		}
    });
		// end event listener
		
		
}