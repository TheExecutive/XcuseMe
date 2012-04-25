/*
	XCuseMe - Employee View
*/

(function($){

	var apiKey = "xvien5ya8rh538ryt5kh",
		buttonContainerUL = $("#buttonContainer ul"),
		tableButtons, //declaring
		registerForm = $(".registerForm"),
		clientName = registerForm.find('#clientName'),
		additionalNote = registerForm.find('#additionalNote'),
		radioVacant = registerForm.find('#vacant'),
		radioOccupied = registerForm.find('#occupied')
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
				$(response).each(function(index){ //run through every table in mongo.

					var currentTableId = this.tableId; //save the table id of the table on this run.

					if(this.needsAssistance === true){
						//if this is true, get the corresponding id for the link and light it up.
						tableButtons.each(function(){ //now run through all the table buttons
							that = $(this);
							if(that.data('tableid') === currentTableId){ //if the tableId of the one that needs assistance matches the data attribute
								that.addClass('assistance'); //then add that class.
							}
						});
					}else{
						//if this.needsAssistance is false
						tableButtons.each(function(){
							that = $(this);
							if(that.data('tableid') === currentTableId && that.hasClass('assistance')){ //clear out assistance if they do have it
								that.removeClass('assistance'); //remove assistance from anything that doesn't need it.
							}
						});
					}

					if(this.available === true){
						//if this is true, get the corresponding id for the link and make it vacant.
						tableButtons.each(function(){ //now run through all the table buttons
							that = $(this);
							if(that.data('tableid') === currentTableId && !that.hasClass('vacant')){ //if the table does not have vacant already
								that.addClass('vacant'); //then add that class.
								that.removeClass('occupied'); //and remove occupied if it's there.
								that.find('.tableStatus').html('vacant'); //change the table status to read accordingly
							}
						});
					}else{
						//if this.available is false
						tableButtons.each(function(){
							that = $(this);
							if(that.data('tableid') === currentTableId && !that.hasClass('occupied')){ //if the table does not have occupied already
								that.addClass('occupied'); //then add that class.
								that.removeClass('vacant'); //and remove vacant if it's there.
								that.find('.tableStatus').html('occupied'); //change the table status to read accordingly
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

	function dismissAlertClick(clickedButton, tableId){
		$.ajax({
			url: "https://api.mongohq.com/databases/xcusemedb/collections/xcusemedata/documents",
			type: "PUT",
			headers: {"Content-Type": "application/json"}, //this must be here to ensure the object is treated as json.
		    dataType: 'json',
		    data: JSON.stringify({
				"_apikey" : apiKey,
				//criteria
				"criteria" : {
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

	function getSingleTable(tableId){
		$.ajax({
			url: "https://api.mongohq.com/databases/xcusemedb/collections/xcusemedata/documents",
			type: "GET",
			headers: {"Content-Type": "application/json"}, //this must be here to ensure the object is treated as json.
		    dataType: 'json',
		    data: {
				"_apikey" : apiKey,
				"q" : JSON.stringify({ //the query must be stringified in JSON in order to be passed succesfully.
					"type" : "table",
					"tableId" : tableId
				}),
				"document" : {} //just an empty object
		    },
		    success: function(response){
				var returnedTable = response[0];
				//fill the input fields from what's been gotten back from mongo.
				clientName.val(returnedTable.patronName);
				additionalNote.val(returnedTable.additionalNote);
		    },
		    error: function(error){
				console.log("Mongo Error: ", error);
		    }
		});
		

	}

	function changeTableStatus(updateObj, availability){
		$.ajax({
			url: "https://api.mongohq.com/databases/xcusemedb/collections/xcusemedata/documents",
			type: "PUT",
			headers: {"Content-Type": "application/json"}, //this must be here to ensure the object is treated as json.
		    dataType: 'json',
		    data: JSON.stringify({
				"_apikey" : apiKey,
				//criteria
				"criteria" : {
					"type" : "table",
					"tableId" : updateObj.tableNumber
				},
				"object" : {
					"$set" : {
						"available" : (availability === "vacant" ? true : false), //if it's not vacant, then no matter what else it is, it has to be false.
						"patronName" : (availability === "vacant" ? null : updateObj.patronName), //if it's vacant, then there should be no need for a name
						"additionalNote" : (availability === "vacant" ? null : updateObj.additionalNote) /// same here.
					}
				},
				"document" : {} //just an empty object
		    }),
		    success : function(response){
				thatBtn = $(updateObj.clickedTblBtn);
				//remove all three classes
				thatBtn.removeClass('vacant');
				thatBtn.removeClass('occupied');
				thatBtn.removeClass('assistance');

				//then add back the one we want.
				thatBtn.addClass(availability);
				//changing the table status of the button as well.
				thatBtn.find('.tableStatus').html(availability);
				
				console.log("Mongo update successful", response);
		    },
		    error : function(error){
				console.log("Mongo update buttons error", error);
		    }
		});

	}
	
	// when you click on the table item, the pop up menu will appear according to the status of the table, if the table status is set to need assistance then the content in that pop up should and will be different from the table status of occupied or vacant.
	buttonContainerUL.on("click", ".tableButton", function(evt){ //better to use .on as .live has been deprecated
		//when using on, specify a parent that will be always on the page then specify the class of the element that wont.
		var clickedTblBtn = $(this),
			tableNumber = clickedTblBtn.find(".tableNumber").text(),//this is the table number for the clicked table
			tableStatus = clickedTblBtn.find(".tableStatus").text(),//this is the table status for the clicked table
			tableTitle = "" //declaring
		;//close variables

		//clear out values by default.
		clientName.val('Please enter the party name.');
		additionalNote.val('Enter any additional notes about the party here.');

		if(tableStatus === "occupied"){
			tableTitle = 'Table '+tableNumber+' is occupied';
			//if the table is occupied, pull additional data from mongo.
			getSingleTable(+tableNumber); //table number string as number with plus

		}else if(tableStatus === "vacant"){
			tableTitle = 'Register Table ' + tableNumber;

		}else if(tableStatus === "assistance"){
			tableTitle = 'Table '+tableNumber+' need assistance';
		}



		// a workaround for a flaw in the demo system (http://dev.jqueryui.com/ticket/4375), ignore!
		$(".registerPopUp").dialog("destroy");
		
		//setting the dialog window
		$(".registerPopUp").dialog({
			height: 600,
			width: 650,
			modal: true,
			show: { effect: 'drop', direction: "down" },
			draggable: false,
			resizable: false,
			title: tableTitle,
			buttons: {
				//this is the function that it will run when the window is closed
				close: function() {
					$(this).dialog("destroy");
					
				},
				//this is the function that it will run when the window is confirmed
				"update this table": function() {

					//creating an update object.
					var updateObj = {
						"clickedTblBtn" : clickedTblBtn,
						"patronName" : clientName.val(),
						"additionalNote" : additionalNote.val(),
						"tableNumber" : +tableNumber //plus to convert it to a number
					};

					if(tableStatus === "vacant"){
						
						if(radioOccupied.attr("checked") === "checked"){
							changeTableStatus(updateObj, 'occupied');
						}else{
							changeTableStatus(updateObj, 'vacant');
						}

					}else if(tableStatus === "occupied"){
						if(radioVacant.attr("checked") === "checked"){
							changeTableStatus(updateObj, 'vacant');
						}else{
							changeTableStatus(updateObj, 'occupied');
						}

					}else if(tableStatus === "assistance"){
						var hi = 2; //this is a placeholder.
					}
					
					$(this).dialog("destroy"); //destroy the window after this.
				}
			}
		});//close dialog window
		
		return false;
	});
	
	
	//This function takes two parameters: integer value for password length and optional boolean value true if you want to include special characters in your generated passwords.
	function password(length, special) {
	  	var iteration = 0;
	  	var password = "";
	  	var randomNumber;
		var passWordOutput = $(".tablePassword");
	  
	 	if(special == undefined){
		  	var special = false;
	  	}
	  
	 	 while(iteration < length){
			randomNumber = (Math.floor((Math.random() * 100)) % 94) + 33;
			if(!special){
		  	if ((randomNumber >=33) && (randomNumber <=47)) { continue; }
		  	if ((randomNumber >=58) && (randomNumber <=64)) { continue; }
		  	if ((randomNumber >=91) && (randomNumber <=96)) { continue; }
		  	if ((randomNumber >=123) && (randomNumber <=126)) { continue; }
			}
			iteration++;
			password += String.fromCharCode(randomNumber);
	  	}
	  
	  	console.log("user this code to checkin on  a table -> "+password);
	  
	 	passWordOutput.val(password);
	  
	  	return password;
	  
	}
	
	$(".tablePassGen").click(function(){
		
		password(4, false);
		
		return false;
		
	});
	



	$(document).ready(function(){
		//fetch the table data from mongo.
		fetchMongoTableData();
		
        
        $( ".formSection button.tablePassGen" ).button({
            icons: {
                primary: "ui-icon-star"
            }
        });
		
		
		//setting these radio buttons to style with the jquery ui plugin
		$( "#radio" ).buttonset();
	}); // end document ready
	
})(jQuery); // end private scope