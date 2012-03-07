function check(form) {
	chrome.extension.sendRequest({ action: "login", cloudurl: form.cloudurl.value, userid: form.userid.value, userpasswd: form.pswrd.value },
    	loginCallback);
}

loginCallback = function(loginResult) {
	if (loginResult.error) {
		alert(loginResult.error);
	}
	else {
		chrome.extension.sendRequest({ action: "getApplications"}, getAppsCallback);
	}
}

getAppsCallback = function(appsResult) {
	if (appsResult.message) {
		alert("Error in getting deployed apps: " + appsResult.message);			
	}
	else {
		for (var i = 0; i < appsResult.length; i++) {
			if (appsResult[i].name !== 'node-inspector') {
				chrome.extension.sendRequest({ action: "getInstances", appName: appsResult[i].name}, getInstancesCallback);
			}
		}
	}
}

getInstancesCallback = function(instancesResult) {
	if (instancesResult.message) {
		alert("Error in getting deployed apps: " + instancesResult.message);			
	}
	else {
		for (var i = 0; i < instancesResult.instances.length; i++) {
			if (instancesResult.instances[i].debug_port != null) {
				insertLink(instancesResult.name, instancesResult.instances[i].index, instancesResult.instances[i].debug_port);
			}
			else {
				insertText(instancesResult.name, instancesResult.instances[i].index);
			}
		}
	}
}

insertLink = function(appName, instanceName, debugPort) {
	var div = document.getElementById('instances');
	var a = document.createElement('a');
	a.innerText = 'Application: ' + appName + ' - Instance: ' + instanceName;
	
	var url = 'http://node-inspector.vcap.me/debug?port=' + debugPort;
	
	a.href = 'javascript:openInspectorWindow(\'' + url + '\');';
	div.appendChild(a);
	
	var p = document.createElement('p');
	div.appendChild(p);
}

insertText = function(appName, instanceName) {
	var div = document.getElementById('instances');
	var a = document.createTextNode('Application: ' + appName + ' - Instance: ' + instanceName);
	div.appendChild(a);
	
	var p = document.createElement('p');
	div.appendChild(p);
}

openInspectorWindow = function(url) {
	window.open(url, undefined, 'location=0');
}
