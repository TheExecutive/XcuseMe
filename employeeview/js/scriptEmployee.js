/*
	XCuseMe - Employee View
*/

(function($){

	var apiKey = "xvien5ya8rh538ryt5kh",
		buttonContainerUL = $("#buttonContainer ul"),
		tableButtons //declaring
	;


	function fetchMongoTableData(){
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
					"type" : "table" //requesting all objects with the type of "table"

				}),
				"sort" : JSON.stringify({
					"tableId" : 1 //sort acsending
				}),
				"document" : {} //just an empty object
		    },
		    success: processInformation,
		    error: function(error){
				console.log("Mongo Error: ", error);
		    }
		});
		

	}
	function processInformation(response){
		//this runs on the ajax success
		//remove the loading graphic.
		buttonContainerUL.parent().css({
			"background" : "none"
		});

		//clear out the html from the ul before beginning.
		buttonContainerUL.html('');

		//first, make a loop for each of the returned objects.
		$(response).each(function(index){
			var tableDisplay = this.tableId,
				tableClass = "",
				tableStatus = "",
				tableServed = "" //declaring
			;
			var stringTableDisplay = tableDisplay + "";
			if (stringTableDisplay.length < 2){
				//if the number only has one digit, add a leading zero to the display
				tableDisplay = "0" + tableDisplay;
			}

			if (this.available === true){
				tableClass = "vacant";
				tableStatus = "vacant";
			}else{
				tableStatus = "occupied";
			}

			if (this.hasBeenServed === true){
				tableServed = "served";
			}

			if (this.needsAssistance === true){
				tableClass = "assistance";
			}

			//make a link for each of the avialible tables.
			buttonContainerUL.append(
				'<li><a class="tableButton '+tableClass+'" data-tableid="'+tableDisplay+'">'+
					'<span class="tableNumber">'+tableDisplay+'</span>'+
					'<span class="tableIcon '+tableServed+'">'+'Icon'+'</span>'+
					'<span class="tableStatus">'+tableStatus+'</span>'+
				'</a></li>'
			);
		});
		
		//after all that is complete, then run the set up links function.
		setUpControlPanel();
	}

	function setUpControlPanel(){
		tableButtons = buttonContainerUL.find('.tableButton'); //grabbing all table buttons

		//click events to dismiss alerts.
		tableButtons.on("click", function(event){
			that = $(this); //do I need this?
			tableId = that.data('tableid');
			dismissAlertClick(that, tableId);
		});

		//run this every 8 seconds.
		setInterval( monitorRemoteApp, 8000);
		//monitorRemoteApp();
		
	}

	function monitorRemoteApp(){
		//this function will run an ajax call that will run continuously.
		$.ajax({
			url: "https://api.mongohq.com/databases/xcusemedb/collections/xcusemedata/documents",
			timeout: 80000,
			headers: {"Content-Type": "application/json"}, //this must be here to ensure the object is treated as json.
			type: "GET",
		    dataType: 'json',
		    data: {
				"_apikey" : apiKey,
				"q" : JSON.stringify({ //the query must be stringified in JSON in order to be passed succesfully.
					"type" : "table" //requesting all objects with the type of "table"
				}),
				"document" : {} //just an empty object
		    },
		    success: function(response){
				//now that we have the data, check to see if any of the data has changed.
				$(response).each(function(index){
					if(this.needsAssistance === true){
						//if this is true, get the corresponding id for the link and light it up.
						var assistTableId = this.tableId; //save the table id of the table that needs asstance.
						tableButtons.each(function(){ //now run through all the table buttons
							that = $(this);
							if(that.data('tableid') === assistTableId){ //if the tableId of the one that needs assistance matches the data attribute
								that.addClass('assistance'); //then add that class.
							}
						});
					}else{
						//if this.needsAssistance is false
						var clearTableId = this.tableId; //get table id of this false one
						tableButtons.each(function(){
							that = $(this);
							if(that.data('tableid') === clearTableId && that.hasClass('assistance')){ //clear out assistance if they do have it
								that.removeClass('assistance'); //remove assistance from anything that doesn't need it.
							}
						});
					}
				});
		    },
		    error: function(error){
				console.log("Mongo Error when updating: ", error);
		    }
		});
	}

	function dismissAlertClick(clickedButton, tableId){
		$.ajax({
			url: "https://api.mongohq.com/databases/xcusemedb/collections/xcusemedata/documents",
			type: "PUT",
			headers: {"Content-Type": "application/json"}, //this must be here to ensure the object is treated as json.
		    dataType: 'json',
		    data: JSON.stringify({
				"_apikey" : apiKey,
				//criteria
				"criteria" : { //Only need to stringify queries, don't have to stringify PUTS.
					"type" : "table",
					"tableId" : tableId //requesting the mongo object representing the table I clicked
				},
				"object" : {
					"$set" : {
						"needsAssistance" : false //setting the table I clicked to no longer need assistance.
					}
				},
				"document" : {} //just an empty object
		    }),
		    success : function(response){
				$(clickedButton).removeClass('assistance');
				
				console.log("Mongo update successful", response);
		    },
		    error : function(error){
				console.log("Mongo update buttons error", error);
		    }
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
			needsAssistanceToggle = (needsAssistanceToggle === true) ? false : true;
			console.log('AFTER THE CHANGE: ', needsAssistanceToggle);
			tableStatus = (needsAssistanceToggle === true) ? "Server Requested" : "Normal";
			conceptList.append('<li>Table Status: '+ tableStatus +'</li>');
			conceptList.listview('refresh'); //you must call this method any time you make
			//updates to a listview
		}else{
			console.log("Something's up with the response.ok");
		}
	}
	
	
	
	
	
	
	
	// when you click on the table item, the pop up menu will appear according to the status of the table, if the table status is set to need assistance then the content in that pop up should and will be different from the table status of occupied or vacant.
	$(".tableButton").live("click", function(){
		var 	
			tableNumber = $(this).find(".tableNumber").text(),//this is the table number for the clicked table
			
			tableStatus = $(this).find(".tableStatus").text()//this is the table status for the clicked table
		;//close variables
		
		if(tableStatus == "occupied"){
			// a workaround for a flaw in the demo system (http://dev.jqueryui.com/ticket/4375), ignore!
			$(".registerPopUp").dialog("destroy");
			
			//setting the dialog window
			$(".registerPopUp").dialog({
				height: 550,
				width: 650,
				modal: true,
				show: { effect: 'drop', direction: "down" },
				draggable: false,
				resizable: false,
				title: 'Table '+tableNumber+' is occupied',
				buttons: {
					//this is the function that it will run when the window is closed
					close: function() {
						$(this).dialog("destroy");
						
					},
					//this is the function that it will run when the window is confirmed
					"Update this table": function() {
						
					}
				}
			});//close dialog window
		}else if(tableStatus == "vacant"){
			// a workaround for a flaw in the demo system (http://dev.jqueryui.com/ticket/4375), ignore!
			$(".registerPopUp").dialog("destroy");
			
			//setting the dialog window
			$(".registerPopUp").dialog({
				height: 550,
				width: 650,
				modal: true,
				show: { effect: 'drop', direction: "down" },
				draggable: false,
				resizable: false,
				title: 'Register Table ' + tableNumber,
				buttons: {
					//this is the function that it will run when the window is closed
					close: function() {
						$(this).dialog("destroy");
						
					},
					//this is the function that it will run when the window is confirmed
					"Update this table": function() {
						
					}
				}
			});//close dialog window
		}else if(tableStatus == "assistance"){
			// a workaround for a flaw in the demo system (http://dev.jqueryui.com/ticket/4375), ignore!
			$(".registerPopUp").dialog("destroy");
			
			//setting the dialog window
			$(".registerPopUp").dialog({
				height: 550,
				width: 650,
				modal: true,
				show: { effect: 'drop', direction: "down" },
				draggable: false,
				resizable: false,
				title: 'Table '+tableNumber+' need assistance',
				buttons: {
					//this is the function that it will run when the window is closed
					close: function() {
						$(this).dialog("destroy");
						
					},
					//this is the function that it will run when the window is confirmed
					"Update this table": function() {
						
					}
				}
			});//close dialog window
		}//close if statement

		
		return false;
	});



	$(document).ready(function(){
		//fetch the table data from mongo.
		fetchMongoTableData();
		
		//setting these radio buttons to style with the jquery ui plugin
		$( "#radio" ).buttonset();
	}); // end document ready
	
})(jQuery); // end private scope