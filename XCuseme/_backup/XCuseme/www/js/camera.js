//camera js
(function($){
	$(document).ready(function(){
		var pictureSource;   // picture source
		var destinationType; // sets the format of returned value 
		
		// Wait for Cordova to connect with the device
		document.addEventListener("deviceready",onDeviceReady,false);
	
		// Cordova is ready to be used!
		function onDeviceReady() {
			pictureSource=navigator.camera.PictureSourceType;
			destinationType=navigator.camera.DestinationType;
		}
	
		// Called when a photo is successfully retrieved
		function onPhotoDataSuccess(imageData) {
		  // Uncomment to view the base64 encoded image data
		  // console.log(imageData);
		  
		  // Get image handle
		  var smallImage = document.getElementById('barcode');
	
		  // Unhide image elements
		  //smallImage.style.display = 'block';
	
		  // Show the captured photo
		  // The inline CSS rules are used to resize the image
		  smallImage.src = "data:image/jpeg;base64," + imageData;
		}
	
		// A button will call this function
		function capturePhoto() {
		  // Take picture using device camera and retrieve image as base64-encoded string
		  //alert("test inside capturePhoto");
		  
		  navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 50,
			destinationType: destinationType.DATA_URL });
		}
	
		// A button will call this function
		function capturePhotoEdit() {
		  //alert("test inside capturePhotoEdit");
		  
		  // Take picture using device camera, allow edit, and retrieve image as base64-encoded string  
		  navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 50, allowEdit: true,
			destinationType: destinationType.DATA_URL });
		}
	
		// Called if something bad happens.
		function onFail(message) {
		  //alert('Failed because: ' + message);
		  
		  navigator.notification.alert(
				message,  				// message
				cameraErrorCallBack,    // callback
				'Error',         		// title
				'Okay'                  // buttonName
			);
		} 
		
		/*
		function onSuccess(imageData) {
		  navigator.notification.alert(
				message,  				// message
				cameraPassCallBack,    	// callback
				'Passed',         		// title
				'Okay'                  // buttonName
			);
		  	
			var image = document.getElementById('barcode');
			image.src = "data:image/jpeg;base64," + imageData;
			
			var	pages = $(".pages");
			pages.css({
				'background' : 'url("'+imageData+'") no-repeat'
			});
			
			alert("pages = " + pages);
		}
		*/

		$(".capturePhoto").click(function(){
			capturePhoto();
		});
		
		$(".capturePhotoEdit").click(function(){
			capturePhotoEdit();
		});
	});
})(jQuery); //close private scope