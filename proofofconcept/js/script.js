/*  
	XCuseMe - Proof of Concept
	Author: Troy Grant
*/

(function($){

	var apiKey = "xvien5ya8rh538ryt5kh",
		conceptList = $("#conceptList"),
		callServerBtn = $("#callServerBtn"),
		needsAssistanceToggle = "false"
	;


	function fetchMongoData(url, query, doc, method, callback){
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

		//change the local boolean to know what's up
		needsAssistanceToggle = response[0].needsAssistance;
		console.log("WHAT DOES THE SERVER SAY: ",needsAssistanceToggle);
		//letting the status of the table be displayed
		//for whatever reason, if true isn't a string, it doesn't work.
		var tableStatus = (needsAssistanceToggle === "true") ? "Server Requested" : "Normal";
		console.log("NeedsAssistanceToggle is: " + needsAssistanceToggle + " The table status is: " + tableStatus);
		conceptList.append('<li>Table Status: '+ tableStatus +'</li>');
	};

	function notifyServer(url, query, doc, method, callback){
		var mongoDataObj = {}; //creating the mongoData Object
  		//var url =  https://api.mongohq.com/databases/xcusemedb/collections/xcusemedata
  		/*
  		http://support.mongohq.com/api/documents/index.html
		The base API end point is https://api.mongohq.com and you will pass your key as a params named _apikey for authentication.
		*/
		//PARAMS USED FOR A PUT REQUEST (aka update by criteria, bulk update)
		
		//_apikey Your MongoHQ account’s secret key.
		mongoDataObj._apikey = apiKey;
		//db The database name. (in the URL)
		//col The collection name. (in the URL)

		//criteria The JSON criteria used to match which documents to update
		mongoDataObj.criteria = {
			"type" : "table" //this is temporary, have it select by unique tableId later
		};
		/*object The JSON document update command (called objNew in the MongoDB docs. 
		Accepts standard MongoDB update directives, like $set or $inc).*/
		//This is pretty much a shitty way of saying what the fuck you wanna update
		mongoDataObj.object = {
			//toggle the needsAssistance boolean in mongo. 
			//If it's false, make it true, if true make it false.
			//this is updating as a string for some reason
			"$set" : {"needsAssistance" : needsAssistanceToggle === "true" ? "false" : "true"} //objects within objects, mofos
		};

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

	function processServerRequest(response){
		var tableStatus; //setting up this var
		//this runs on the ajax success
		console.log("The Request Has Been Made: ", response);
		//letting the status of the table be displayed
		if(response.ok == 1){
			//if the response.ok is 1, the data was sucessfully changed in mongo.
			//No need to grab the new data, we already have it in our local variable.
			//since this is a toggle, it'll be the opposite of whatever it was.
			console.log('BEFORE THE CHANGE: ', needsAssistanceToggle)
			needsAssistanceToggle = (needsAssistanceToggle === "true") ? "false" : "true";
			console.log('AFTER THE CHANGE: ', needsAssistanceToggle)
			tableStatus = (needsAssistanceToggle === "true") ? "Server Requested" : "Normal";
			conceptList.append('<li>Table Status: '+ tableStatus +'</li>');
		}else{
			console.log("Something's up with the response.ok");
		};
		
	};


	$(document).ready(function(){

		//first state the query to run on the Mongo Database. This is to be stated as an object.
		var mongoQuery = {
			"type": "table" //get the data where the table is number 5
		};
		fetchMongoData("https://api.mongohq.com/databases/xcusemedb/collections/xcusemedata/documents",mongoQuery,{},"GET",processInformation);
		//url, query, doc, method, callback

		//listener for the button
		callServerBtn.on("click", function(event){
			alert("Your server will be with you shortly.");
			notifyServer("https://api.mongohq.com/databases/xcusemedb/collections/xcusemedata/documents",mongoQuery,{},"PUT", processServerRequest);
			//PUT is used here because we're altering the database
		});

		
	}); // end document ready
	
})(jQuery); // end private scope




