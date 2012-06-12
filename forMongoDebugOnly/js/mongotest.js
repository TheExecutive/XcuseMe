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
						"locationId" : null
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

	function xmlParseTest(){
		//http://www.xcusemeapp.com/tapandgrind/menuxml.xml
		$.ajax({
			url: "js/menuxml.xml",
			dataType: "xml",
			success: function(responseXML){
				console.log(responseXML);
			}
		});
	}

	function xmlParseTest1(){
		$.get("js/menuxml.xml", function(xml){
			console.log(xml);
		});
	}

	function xmlParseTest2(){
		//var url =  https://api.mongohq.com/databases/xcusemedb/collections/xcusemedata
		/*
		http://support.mongohq.com/api/documents/index.html
		The base API end point is https://api.mongohq.com and you will pass your key as a params named _apikey for authentication.
		*/
		$.ajax({
			url: "https://api.mongohq.com/databases/xcusemedb/collections/xcusemedata/documents",
			type: "GET",
			headers: {"Content-Type": "application/json"}, //this must be here to ensure the object is treated as json.
		    dataType: 'json',
		    data: {
				"_apikey" : apiKey,
				"q" : JSON.stringify({ //the query must be stringified in JSON in order to be passed succesfully.
					"type" : "xml" //requesting all objects with the type of "table"

				}),
				"document" : {} //just an empty object
		    },
		    success: function(response){
				//console.log(response);
				var xml = $(response[0].xml);
				var menuitems = xml.find('menuitem');
				
				menuitems.each(function(index){
					that = $(this);
					console.log(that.children('menuitemname').html());
				});
		    },
		    error: function(error){
				console.log("Mongo Error: ", error);
		    }
		});
		

	}

	$(document).ready(function(){
		//fetch the table data from mongo.
		//testInsert();
		//xmlParseTest2();
		
	}); // end document ready
	
})(jQuery); // end private scope