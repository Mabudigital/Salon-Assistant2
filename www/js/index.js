/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
/*var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },
     takePicture: function() {
      navigator.camera.getPicture( function( imageURI ) {
        alert( imageURI );
		$("#picurl").val(imageURI);
		var cid = $("#piccustomerid").val();
		var purl = $("#picurl").val();
		pic.insertRecord(cid,purl);
      },
      function( message ) {
        alert( message );
      },
      { 
        quality : 50, 
        saveToPhotoAlbum: true,  
		correctOrientation: true,
		destinationType: Camera.DestinationType.FILE_URI
      });
    }
};
function getPhoto(){            
    navigator.camera.getPicture(onSuccess, onFail, 
        { quality: 70, saveToPhotoAlbum: true, correctOrientation: true, destinationType: Camera.DestinationType.FILE_URI });

	}
    function onSuccess (imageURI) {
		window.resolveLocalFileSystemURI(imageURI, resolveOnSuccess, fsFail);
		function resolveOnSuccess(entry) {
		var fileuri = entry.toURL();
		//console.log(fileuri);
		document.getElementById('image').src = fileuri;
		$("#picurl").val(fileuri);
		var cid = $("#piccustomerid").val();
		var purl = $("#picurl").val();
		//var purl = imageURI
		pic.insertRecord(cid,purl);
	}
}
function onFail (message) {
    alert('An error Occured: ' + message);
}
*/
function getPhoto(){
	navigator.camera.getPicture(onSuccess, onFail, { quality: 70,correctOrientation:true,destinationType: Camera.DestinationType.FILE_URI});

	function onSuccess(imageURI) {
		window.resolveLocalFileSystemURI(imageURI, resolveOnSuccess, resolveOnError);
		//document.getElementById('image').src = imageURI;
	}

	function onFail(message) {
		alert('Failed because: ' + message);
	}

	function resolveOnSuccess(fileEntry){
		var d = new Date(),
		n = d.getTime(),
		newFileName = n + ".jpg";
		var folderName = "Salon_Assistant";
		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSys) {      
		  fileSys.root.getDirectory(folderName, {create:true, exclusive: false},
			function(directory) {
				fileEntry.copyTo(directory, newFileName,successMove,resolveOnError);
			},
			resolveOnError);
		},resolveOnError);

	}
	function successMove(entry){
		$("#picurl").val("/storage/emulated/0"+entry.fullPath);
		var cid = $("#piccustomerid").val();
		var purl = $("#picurl").val();
		//var purl = imageURI
		pic.insertRecord(cid,purl);
		
	}
}
function onFail(message) {
alert('Failed to load picture because: ' + message);
}
function resolveOnError(error){
	alert(error.code);
}
