/*
	XCuseMe - Employee View
*/

(function($){

	var apiKey = "xvien5ya8rh538ryt5kh",
		tableButtons = $(".tableButton")
	;


	function fetchMongoTableData(url, query, doc, method, callback){
		//var url =  https://api.mongohq.com/databases/xcusemedb/collections/xcusemedata
		/*
		http://support.mongohq.com/api/documents/index.html
		The base API end point is https://api.mongohq.com and you will pass your key as a params named _apikey for authentication.
		*/
		$.ajax({
			url: url,
			type: method,
		    dataType: 'json',
		    data: {
				"_apikey" : apiKey,
				"q" : JSON.stringify({ //the query must be stringified in JSON in order to be passed succesfully.
					"type" : "table" //requesting all objects with the type of "table"
				}),
				"document" : {} //just an empty object
		    },
		    success: callback,
		    error: function(error){
				console.log("Mongo Error: ", error);
		    }
		});

	}
	function processInformation(response){
		//this runs on the ajax success
		//first, make a loop for each of the returned objects.
		$(response).each(function(index){
			console.log(this.type);
		});
		
		//the response is an array of objects so an index of 0 has to be specified

	}

	function notifyServer(url, query, doc, method, callback){
		var mongoDataObj = {}; //creating the mongoData Object
		//var url =  https://api.mongohq.com/databases/xcusemedb/collections/xcusemedata
		/*
		http://support.mongohq.com/api/documents/index.html
		The base API end point is https://api.mongohq.com and you will pass your key as a params named _apikey for authentication.
		*/
		//PARAMS USED FOR A PUT REQUEST (aka update by criteria, bulk update)
		
		//_apikey Your MongoHQ accounts secret key
		mongoDataObj._apikey = apiKey;
		//db The database name. (in the URL)
		//col The collection name. (in the URL)

		//criteria The JSON criteria used to match which documents to update
		mongoDataObj.criteria = {
			"type" : "table" //this is temporary, have it select by unique tableId later
		};
		/*object The JSON document update command (called objNew in the MongoDB docs.
		Accepts standard MongoDB update directives, like $set or $inc).*/
		//This is pretty much a shitty way of saying what you wanna update
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

	}

	function processServerRequest(response){
		var tableStatus; //setting up this var
		//this runs on the ajax success
		console.log("The Request Has Been Made: ", response);
		//letting the status of the table be displayed
		if(response.ok === 1){
			//if the response.ok is 1, the data was sucessfully changed in mongo.
			//No need to grab the new data, we already have it in our local variable.
			//since this is a toggle, it'll be the opposite of whatever it was.
			console.log('BEFORE THE CHANGE: ', needsAssistanceToggle);
			needsAssistanceToggle = (needsAssistanceToggle === "true") ? "false" : "true";
			console.log('AFTER THE CHANGE: ', needsAssistanceToggle);
			tableStatus = (needsAssistanceToggle === "true") ? "Server Requested" : "Normal";
			conceptList.append('<li>Table Status: '+ tableStatus +'</li>');
			conceptList.listview('refresh'); //you must call this method any time you make
			//updates to a listview
		}else{
			console.log("Something's up with the response.ok");
		}
		
	}

	function fillMongo(url, method, number){
		var mongoDataObj = {}; //creating the mongoData Object
		mongoDataObj._apikey = apiKey;
		//criteria The JSON criteria used to match which documents to update
		mongoDataObj.document = {
			"type" : "table",
			"available" : "false",
			"hasBeenServed" : "false",
			"needsAssistance" : "false",
			"tableId" : number
		};

		$.ajax({
			url: url,
			type: method,
		    dataType: 'json',
		    data: mongoDataObj,
		    success: function(response){
				console.log("RESULT: ", response);
		    },
		    error: mongoError
		});
	}


	$(document).ready(function(){
		//fetch the table data from mongo.
		var mongoQuery = {
			"type": "table" //get the data where the type is table
		};
		fetchMongoTableData("https://api.mongohq.com/databases/xcusemedb/collections/xcusemedata/documents",mongoQuery,{},"GET",processInformation);

		
	}); // end document ready
	
})(jQuery); // end private scope