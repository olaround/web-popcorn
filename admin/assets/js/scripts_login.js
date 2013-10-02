var cityNameArray = new Array();
var cinemaNameArray = new Array();
var AppId = '';
var AppURL = '';
var setAuth = '';
var GlobalUserId = 0;
var GlobalUserKey = 0;
var UserFound = 0;
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
		
		
function refreshAuthDisplay() {
	var isLoggedIn = client.currentUser !== null;
	if (isLoggedIn) {
		console.log(client.currentUser);
		$('.loader').html('Validating...');
		$('.loader').removeClass('hideMe');
		GlobalUserId = client.currentUser.userId;
		GlobalUserKey = client.currentUser.mobileServiceAuthenticationToken;
		var clientId = client.currentUser.userId;
		clientId = clientId.split(':');
		checkUser(clientId[1],setAuth);
		//$("#login-name").text(client.currentUser.userId);
		//refreshTodoItems();
	}
}
function handleError(error) {
			var text = error + (error.request+' : Please try again later.');
			//$('#errorlog').append($('<li>').text(text));
		}
function checkUser(id,platform){
	if(platform == 'fb'){
		 queryUsers = UserTable.where({fb:id, status: '1'}).take(1);
	}
	if(platform == 'twitter'){
		 queryUsers = UserTable.where({twitter:id, status: '1'}).take(1);
	}
	if(platform == 'google'){
		 queryUsers = UserTable.where({google:id, status: '1'}).take(1);
	}
	if(platform == 'microsoft'){
		 queryUsers = UserTable.where({microsoft:id, status: '1'}).take(1);
	}
	queryUsers.read().then(function(users) {
				$.each(users,function(index,items){
						localStorage.setItem('userId',GlobalUserId);
						localStorage.setItem('mobileServiceAuthenticationToken',GlobalUserKey);
						localStorage.setItem('userName',items.name);
						top.location.href = 'users.html';
						UserFound++;
				});
			}, handleError).done(function(){
				$('.loader').addClass('hideMe');
				if(UserFound == 0){
					alert('You are not authorise user for this admin. Kindly do contact admin for futher assitance');
				}
			});
    
		
};


function logInTwt() {
	setAuth = 'twitter';
    client.login("twitter").then(refreshAuthDisplay, function(error){
    });
}
function logInFb() {
	setAuth = 'fb';
    client.login("facebook").then(refreshAuthDisplay, function(error){
        
    });
}
function logInMicro() {
	setAuth = 'microsoft';
    client.login("microsoftaccount").then(refreshAuthDisplay, function(error){
        
    });
}
function logInGoogle() {
	setAuth = 'google';
    client.login("google").then(refreshAuthDisplay, function(error){
    });
}


function logOut() {
    client.logout();
    refreshAuthDisplay();
    $('#summary').html('<strong>You must login to access data.</strong>');
}


// On page init, fetch the data and set up event handlers
$(function () {
    $("#micro").click(logInMicro);
	$("#fb").click(logInFb);
	$("#twt").click(logInTwt);
	$("#google").click(logInGoogle);
    
});
		
		
}
