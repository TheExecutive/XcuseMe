/*JS Template
*Written by Troy Grant
*/

/*
	XCuseMe - Employee View
*/

(function($){

	var apiKey = "xvien5ya8rh538ryt5kh";

	function dismissAlertClick(clickedButton, tableId){
		$.ajax({
			url: "https://api.mongohq.com/databases/xcusemedb/collections/xcusemedata/documents",
			type: "PUT",
		    dataType: 'json',
		    data: {
				"_apikey" : apiKey,
				//criteria
				"criteria" : { //Only need to stringify queries, don't have to stringify PUTS.
					"type" : "table",
					"tableId" : tableId //requesting the mongo object representing the table I clicked
				},
				"object" : {
					"$set" : {
						"needsAssistance" : "false" //setting the table I clicked to no longer need assistance.
					}
				},
				"document" : {} //just an empty object
		    },
		    success : function(response){
				$(clickedButton).removeClass('assistance');
				console.log("Mongo update successful", response);
		    },
		    error : function(error){
				console.log("Mongo update buttons error", error);
		    }
		});

	}

	function testInsert(tableId){
		$.ajax({
			url: "https://api.mongohq.com/databases/xcusemedb/collections/xcusemedata/documents",
			type: "PUT",
			headers: {"Content-Type": "application/json"}, //this must be here to ensure the object is treated as json.
		    dataType: 'json',
		    data: JSON.stringify({
				"_apikey" : apiKey,
				//criteria
				"criteria" : { //Only need to stringify queries, don't have to stringify PUTS.
					"type" : "table"
					//"tableId" : tableId //requesting the mongo object representing the table I clicked
				},
				"object" : {
					"$set" : {
						//"available" : false,
						//"hasBeenServed" : false,
						"authCode" : null //setting the table I clicked to no longer need assistance.
					}
				},
				multi : true, //WARNING, multi is set to true, will update anything that matches.
				"document" : {} //just an empty object
		    }),
		    success : function(response){
				console.log("Mongo update successful", response);
		    },
		    error : function(error){
				console.log("Mongo update buttons error", error);
		    }
		});

	}

	function fillMongo(url, method, number){
		//this is a dirty function to quickly fill the mongo server with some data.
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
		//testInsert();
		
	}); // end document ready
	
})(jQuery); // end private scope