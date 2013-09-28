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
		
		
		// handle error
		function handleError(error) {
			var text = error + (error.request+' : Please try again later.');
			alert(text);
			//$('#errorlog').append($('<li>').text(text));
		}
		//end handle error
		
		// get city function
		
		
		//end get city function
		
		// createHtmlForMovies
		function createHtmlForCities(){
			var query = CityTable.where({});
		  /*var query = todoItemTable.where(function(dated){
											return this.id <= dated
											},2);*/
			
			query.read().then(function(todoItems) {
				var listItems = $.map(todoItems, function(item) {
					
						var html='';
							html +='<div class="panel panel-default" data-id="'+item.id+'">';
							html +='<div class="panel-heading">';
							html +='<div class="col-lg-11 cityName"> '+item.city+'</div>';
							html +='<div class="col-lg-1">';
							html +='<button  class="close"  data-id="'+item.id+'">x</button>';
							html +="<button data-name='"+item.city+"' data-id='"+item.id+"'  type='button' class='edit' title='edit'><span class='glyphicon glyphicon-pencil'></span></button>";
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
		createHtmlForCities()
		//end createHtmlForMovies
		// event listener
		
		
		$(document.body).on('click', '.edit', function() {
			$('#cityId').val($(this).attr('data-id'));
			$('#cityName').val($(this).attr('data-name'));
			$('#myModal').modal();
		});
		
		$(document.body).on('click', '.close', function() {
			if($(this).attr('data-id')){
			var result = confirm("You are about to delete this item, all associated data will de deleted. Click OK to continue.");
			if (result==true) {
				$('.loader').show();
			CityTable.del({ id: $(this).attr('data-id') }).then(createHtmlForCities, handleError).done(function(){
				$('.loader').hide();
			});
			}}
		});
		$(document.body).on('click', '#addCity', function() {
			$('#cityName').html('');
			$('#cityId').val('');
			$('#myModal').modal();
		});
		
		$('#add-item').on('click',function() {
			$('.loader').show();
			var cityName = $('#cityName').val();
			if(cityName == ''){
				alert('Please enter Cinema Name');
			}else{
				if($('#cityId').val() == ''){
						var theNewRow = {
							city: cityName													
						};
						CityTable.insert(theNewRow).then(createHtmlForCities, handleError).then(function(){
							$('#myModal').modal('hide');
							$('.loader').hide();
						});
				}else{
						var theNewRow = {
							id: parseInt($('#cityId').val()),
							city: cityName	
						};
						CityTable.update(theNewRow).then(createHtmlForCities, handleError).then(function(){
							$('#myModal').modal('hide');
							$('.loader').hide();
						});
				}
												
		}
    });
		// end event listener
		
		
}