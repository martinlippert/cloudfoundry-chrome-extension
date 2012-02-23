var CloudFoundryClient = function(url) {
	this.cloudUrl = url;
	this.token = null;
}

CloudFoundryClient.prototype = {
	
	// login to a cloud foundry instance
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
					callbackError(xhr.statusText);
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
	},
	
	getApplications: function(callbackSuccess, callbackError) {
		var xhr = new XMLHttpRequest();

		xhr.open("GET", this.cloudUrl + "/apps", true);
		xhr.onreadystatechange = function() {
		    if (xhr.readyState == 4) {
		        if (xhr.status==200) {
					var response = JSON.parse(xhr.responseText);
					callbackSuccess(response);
		        } else {
					callbackError(xhr.statusText);
		        }
		    }
		}

		xhr.setRequestHeader("Content-type", "application/json");
		xhr.setRequestHeader("Authorization", this.token);
		xhr.send();
	},
	
	getInstances: function(appName, callbackSuccess, callbackError) {
		var xhr = new XMLHttpRequest();

		xhr.open("GET", this.cloudUrl + "/apps/" + appName + "/instances", true);
		xhr.onreadystatechange = function() {
		    if (xhr.readyState == 4) {
		        if (xhr.status==200) {
					var response = JSON.parse(xhr.responseText);
					callbackSuccess(response);
		        } else {
					callbackError(xhr.statusText);
		        }
		    }
		}

		xhr.setRequestHeader("Content-type", "application/json");
		xhr.setRequestHeader("Authorization", this.token);
		xhr.send();
	}
}
