var version = "1.0.11";
var camPermission=false;
var micPermission=false;
var app = {
    permissions: null,
    init: function () {
        document.addEventListener('deviceready', app.ready);
    },
    ready: function () {
		if(!isConnected()){
			connectionError();
		} else {
			$.getScript("js/script.js");
		}
    }
}
app.init();
function isConnected() {
	var networkState = navigator.connection.type;
	if(networkState == Connection.NONE || typeof networkState === "undefined" || networkState == null)
		return false;
	return true;
}
function connectionError() {
	navigator.notification.alert(
    	'No Internet connection!',  
   		exitApp,         
    	'Connection Error',            
    	'Close'                  
	);
}

function exitApp() {
	navigator.app.exitApp();
}

function ConfirmExit(stat){
    if(stat == "1"){
        exitApp();
    }else{
        return;
    };
};