/*  
	XCuseMe - Proof of Concept
	Author: Troy Grant
*/

(function($){

	var apiKey = "xvien5ya8rh538ryt5kh",
		conceptList = $("#conceptList"),
		callServerBtn = $("#callServerBtn")
	;


	function fetchMongoData(url, query, doc, method, callback){
		console.log('fuck');
		var mongoDataObj = {}; //creating the mongoData Object
  		//var url =  https://api.mongohq.com/databases/xcusemedb/collections/xcusemedata
  		/*
  		http://support.mongohq.com/api/documents/index.html
		The base API end point is https://api.mongohq.com and you will pass your key as a params named _apikey for authentication.
		*/
		mongoDataObj._apikey = apiKey;
 		mongoDataObj.q = JSON.stringify(query);
  		mongoDataObj.document = doc;

  		$.ajax({
      		url: url,
      		type: method,
		    dataType: 'json',
		    data: mongoDataObj,
		    success: callback,
		    error: mongoError
   		 });

	};

	function mongoError(e){
  		console.log("Mongo Error: ",e);
	}

	function processInformation(response){
		//this runs on the ajax success
		console.log("Mongo Was Successful, here's what it's getting back: ", response[0].needsAssistance); 
		//the response is an array of objects so an index of 0 has to be specified

		//letting the status of the table be displayed
		var tableStatus = (response[0].needsAssistance == "true") ? "Server Requested" : "Normal";
		conceptList.append('<li>Table Status: '+ tableStatus +'</li>');
	};


	$(document).ready(function(){

		//first state the query to run on the Mongo Database. This is to be stated as an object.
		var mongoQuery = {
			"type": "table" //get the data where the table is number 5
		};
		fetchMongoData("https://api.mongohq.com/databases/xcusemedb/collections/xcusemedata/documents",mongoQuery,{},"GET",processInformation);
		//documents is only at the end of this because it was on the example
		//url, query, doc, method, callback
		
	}); // end document ready
	
})(jQuery); // end private scope




