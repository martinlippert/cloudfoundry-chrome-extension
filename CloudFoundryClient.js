var CloudFoundryClient = function(url) {
	this.cloudUrl = url;
}

CloudFoundryClient.prototype = {
	
	// login
	login: function(username, password, callbackSuccess, callbackError) {
		var xhr = new XMLHttpRequest();
		var jsonObject = { 'password' : password }
		var jsonString = JSON.stringify(jsonObject);
		var client = this;

		xhr.open("POST", this.cloudUrl + "/users/" + username + "/tokens", true);
		xhr.onreadystatechange = function() {
		    if (xhr.readyState == 4) {
		        if (xhr.status==200) {
					var response = JSON.parse(xhr.responseText);
					client.setToken(response.token);
					callbackSuccess();
		        } else {
//		            alert('error: ' + xhr.statusText);
					callbackError();
		        }
		    }
		}

		xhr.setRequestHeader("Content-type", "application/json");
		xhr.send(jsonString);
	},
	
	setToken: function(token) {
		this.token = token;
	},
	
	isConnected: function() {
		return this.token != null;
	}
}
