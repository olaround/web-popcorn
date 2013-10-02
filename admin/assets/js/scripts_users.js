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
		UserTable = client.getTable('users');
		if(localStorage.getItem('userId')){
			client.currentUser = {};
			client.currentUser.userId = localStorage.getItem('userId');
			client.currentUser.mobileServiceAuthenticationToken = localStorage.getItem('mobileServiceAuthenticationToken');
			$('.adminName').html(localStorage.getItem('userName'));
		}else{
			top.location.href = 'login.html';
		}
		console.log(client);
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
		
		
		//end get city function
		
		// createHtmlForMovies
		function createHtmlForUsers(){
			var query = UserTable.where({});
		  /*var query = todoItemTable.where(function(dated){
											return this.id <= dated
											},2);*/
			
			query.read().then(function(todoItems) {
				var listItems = $.map(todoItems, function(item) {
					
						var html='';
							html +='<div class="panel panel-default" data-id="'+item.id+'">';
							html +='<div class="panel-heading">';
							html +='<div class="col-lg-11 cityName"> '+item.name+'</div>';
							html +='<div class="col-lg-1">';
							html +='<button  class="close"  data-id="'+item.id+'">x</button>';
							html +="<button data-name='"+item.name+"' data-id='"+item.id+"' data-fb='"+item.fb+"' data-twt='"+item.twitter+"' data-micro='"+item.microsoft+"' data-status='"+item.status+"' data-google='"+item.google+"'  type='button' class='edit' title='edit'><span class='glyphicon glyphicon-pencil'></span></button>";
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
		createHtmlForUsers()
		//end createHtmlForMovies
		// event listener
		
		
		$(document.body).on('click', '.edit', function() {
			$('#userId').val($(this).attr('data-id'));
			$('#userName').val($(this).attr('data-name'));
			$('#userFb').val($(this).attr('data-fb'));
			$('#userTwt').val($(this).attr('data-twt'));
			$('#userGoogle').val($(this).attr('data-google'));
			$('#userMicro').val($(this).attr('data-micro'));
			$('#userStatus').val($(this).attr('data-status'));
			$('#myModal').modal();
		});
		
		$(document.body).on('click', '.close', function() {
			if($(this).attr('data-id')){
			var result = confirm("You are about to delete this item, all associated data will de deleted. Click OK to continue.");
			if (result==true) {
				$('.loader').show();
			UserTable.del({ id: $(this).attr('data-id') }).then(createHtmlForUsers, handleError).done(function(){
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
			var userName = $('#userName').val();
			var userFb = $('#userFb').val();
			var userTwt = $('#userTwt').val();
			var userGoogle = $('#userGoogle').val();
			var userMicro = $('#userMicro').val();
			var userState = $('#userStatus').val();
			if(userName == '' && userFb == '' && userTwt == '' && userGoogle == ''){
				alert('Please enter User Name and one of ID');
			}else{
				if($('#userId').val() == ''){
						var theNewRow = {
							name: userName,
							fb: userFb,
							twitter: userTwt,
							google: userGoogle,
							microsoft: userMicro,
							status: userState											
						};
						UserTable.insert(theNewRow).then(createHtmlForUsers, handleError).then(function(){
							$('#myModal').modal('hide');
							$('.loader').hide();
						});
				}else{
						var theNewRow = {
							id: parseInt($('#userId').val()),
							name: userName,
							fb: userFb,
							twitter: userTwt,
							google: userGoogle,
							microsoft: userMicro,
							status: userState	
						};
						UserTable.update(theNewRow).then(createHtmlForUsers, handleError).then(function(){
							$('#myModal').modal('hide');
							$('.loader').hide();
						});
				}
												
		}
    });
		// end event listener
		
		
}
