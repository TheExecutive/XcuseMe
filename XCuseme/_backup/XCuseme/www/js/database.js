/*
	Database Ajax JS File
	Written by: Troy Grant
*/
(function($){

	var apiKey = "xvien5ya8rh538ryt5kh",
		staffCallDialogBtn = $('.staffCallDialogBtn')
	;

	function callBtnClick(tableId){
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
						"needsAssistance" : "true" //setting the table I clicked to no longer need assistance.
					}
				},
				"document" : {} //just an empty object
		    },
		    success : function(response){
				console.log("Mongo update successful", response);
		    },
		    error : function(error){
				console.log("Mongo update buttons error", error);
		    }
		});

	}

	$(staffCallDialogBtn).live("click", function(evt){
		callBtnClick(11); //testing table 11
	});
		
	
})(jQuery); // end private scope





