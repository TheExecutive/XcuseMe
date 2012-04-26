//main js
(function($){
	$(document).ready(function(){
		/* todo : enable this if you want the items from the menu getting added to the bill list, also make sure to change the HTML to have the list div showing and not hidden 
		
		<span class="cartItemPrice totalPrice" id="totalPrice">$100.00</span>
		
		*/
		$(".stringselect").hide();
		$(".totalPrice").show();
		$(".billTitleSection").css({'marginBottom':'50px'});
		
		
		
	
		var apiKey = "xvien5ya8rh538ryt5kh",
		staffCallDialogBtn = $('.staffCallDialogBtn'),
		menuListUL = $('.menuList ul'),
		currentTable, //declaring
		orderedItemId, //declaring
		menuitems //declaring
		;
	
		function callBtnClick(tableId){
			$.ajax({
				url: "https://api.mongohq.com/databases/xcusemedb/collections/xcusemedata/documents",
				headers: {"Content-Type": "application/json"}, //this must be here to ensure the object is treated as json.
				type: "PUT",
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
							"needsAssistance" : true //setting the table I clicked to no longer need assistance.
						}
					},
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

// ================================== ASSIGN SPECIFIC TABLE ===================================== //

		

// ================================== END ASSIGN SPECIFIC TABLE ===================================== //

// ================================== LOAD PRODUCTS ===================================== //

		function loadProducts(){
			//this function is to dynamically load in the menu.
			$.ajax({
			url: "https://api.mongohq.com/databases/xcusemedb/collections/xcusemedata/documents",
			type: "GET",
			headers: {"Content-Type": "application/json"}, //this must be here to ensure the object is treated as json.
		    dataType: 'json',
		    data: {
				"_apikey" : apiKey,
				"q" : JSON.stringify({ //the query must be stringified in JSON in order to be passed succesfully.
					"type" : "xml" //requesting the xml from mongo. There should be only one with this type.

				}),
				"document" : {} //just an empty object
		    },
		    success: function(response){
				/*This is a disgustingly dirty hack done for the sake of time. The XML
				is nothing but a gigantic string loaded into mongo. We are getting that string
				and traversing it like it is HTML.*/
				var imagePath = "images/menu/"; //declaring basepath up here, should it ever change

				var xml = $(response[0].xml); //turning the response into a jquery obj so it can be traversed.
				
				menuitems = xml.find('menuitem'); //finding all menu items. This is declared globally.

				var alphabeticalDividers = $('.menuList li[data-role="list-divider"]'); //grabbing all the dividers

				alphabeticalDividers.each(function(){
					var divider = $(this); //save every divider as a var

					menuitems.each(function(index){ //cycle through for alphabetical sorting
						that = $(this);
						//make a menu item for each table.
						if(divider.html() === that.children('menuitemname').html().charAt(0)){
							//compare the first character of the item string to the letter in the divider
							//if we're in the right spot alphabetically, put the item in place
							divider.after( //insert this after the current divider in the loop
							'<li data-filtertext="'+that.children('menuitemname').html()+'">'+
								'<a class="productItem" href="#productDetail-page" data-itemid="'+that.children('itemid').html()+'" data-itemabv="'+that.children('abv').html()+'">'+
									'<img class="productImg" src="'+imagePath+that.children('itemimage').html()+'" />'+ //the image part of this is using itemid when it should use image. fix this later
									'<h3 class="productName">'+that.children('menuitemname').html()+'</h3>'+
									'<p class="productDescription">'+that.children('description').html()+'</p>'+
								'</a>'+
								'<a class="quickPurchase" href="#" data-itemid="'+that.children('itemid').html()+'" data-rel="dialog" data-transition="slideup" data-theme="d" data-icon="custom" id="cart">Quick Purchase</a>'+
							'</li>'
							);
						}
					});
				});
				
				disableFunctions(); //make sure the purchase buttons are dead after everything has been populated
				
		    },
		    error: function(error){
				console.log("Mongo MenuError: ", error);
				disableFunctions();
		    }
		});
	}

	//running function after all this
	loadProducts();

// ================================== END LOAD PRODUCTS ===================================== //

	
		// Wait for Cordova to load
		document.addEventListener("deviceready", onDeviceReady, false);
	
		// Cordova is ready
		function onDeviceReady() {
			//device is ready
		}

// ================================== ALERTS ===================================== //
		// alert dialog dismissed
		function alertDismissed() {
			// do something
		}
		
		function callStaffCallback() {
			// do something
			console.log("ajax call here to the server's computer");
			callBtnClick(currentTable.tableId); //whatever the id is from the object
		}

	
		// Show a custom alert
		function callStaffAlert() {
			navigator.notification.alert(
				'Please wait, a staff member will be with you shortly.',  // message
				callStaffCallback(),         	// callback
				'Request sent',           	// title
				'Okay'                  	// buttonName
			);
		}

		function orderAjax(tableId, orderItem){
			//one ajax to light up the box
			callBtnClick(tableId);

			//and then another one to post the order
			$.ajax({
				url: "https://api.mongohq.com/databases/xcusemedb/collections/xcusemedata/documents",
				headers: {"Content-Type": "application/json"}, //this must be here to ensure the object is treated as json.
				type: "POST",
				dataType: 'json',
				data: JSON.stringify({
					"_apikey" : apiKey,
					"document" : {
						"type" : "order",
						"itemId" : +orderItem.find("itemid").html(), //no plus needed here since this is an attribute
						"name" : orderItem.find('menuitemname').html(),
						"tableId" : tableId
					}
				}),
				success : function(response){
					console.log('not gonna see this but doing it anyway');
				},
				error : function(error){
					console.log("Mongo post order error", error);
				}
			});
		}

		function orderSend(){
			menuitems.each(function(index){
				that = $(this);
				if(orderedItemId === +that.find("itemid").html() ){ //html as number, not string, with plush
					orderAjax(currentTable.tableId, that); //sending the tableId, and the ordered item.
				}
			});
		}
		
		function onOrderConfirm(button) {
			console.log("------> button is -> " + button);
			
			if(button === 2){ //2 means the second button, i.e. the confirm.
				console.log("after use confirm item purchase, do a ajax call");
				
				orderSend();
			}else{
				console.log("user canceled the order");
			}
		}
	
		// Show a custom alert
		function quickItemOrder(itemName) {
			navigator.notification.confirm(
				'Would you like to order '+itemName+'?',  // message
				onOrderConfirm,              // callback to invoke with index of button pressed
				'Place Order',            // title
				'No,Yes Please'          // buttonLabels
			);
		}
		
		function checkOutTableConfirm(button) {
			if(button === 2){
				var tableCodeInput = $("#tableCodeInput"),
					tableCodeOutput = $("#tableCodeOutput"),
					tableCodeFont = $(".quickFlipPanel.front"),
					tableCodeBack = $(".quickFlipPanel.back")
				;
				
				tableCodeInput.val("Table Code");
				tableCodeOutput.text("");
				
				tableCodeFont.fadeIn();
				tableCodeBack.fadeOut();
				
				disableFunctions();
			}else{
				console.log("user canceled the order");
			}
		}
		
		
	
		// Show a custom alert
		function checkOutTable() {
			navigator.notification.confirm(
				'Are you sure you want to check out of this table ?',  // message
				checkOutTableConfirm,             // callback to invoke with index of button pressed
				'Table Check Out',        // title
				'No,Check Out'         				// buttonLabels
			);

		}
		

		// Beep three times
		function playBeep() {
			navigator.notification.beep(3);
		}
	
		// Vibrate for 2 seconds
		function vibrate() {
			navigator.notification.vibrate(2000);
		}
		
		$(".staffCallDialogBtn").click(function(){
			callStaffAlert();
			playBeep();
			vibrate();
			
			return false;
		});
		
		$(".testBtn").click(function(){
			//getBarcodeFromImage("smallImage");

			//alert("before getBarcodeFromImage");
			//alert(getBarcodeFromImage('barcode'));
			//alert("after getBarcodeFromImage");
			
			return false;
		});
// ================================== ALERTS END ===================================== //
		
		
		
		
		
		
		
		//this function enables all the functionality that needs to be turned on to call for service, such as order, call button, etc...
		var enableFunctions = function(){
			var callStaffBtn = $(".staffCallDialogBtn"),
				quickPurchase = $(".quickPurchase"),
				orderButton = $(".orderButtonBg")
			;//close variables
			
			callStaffBtn.fadeIn();
			quickPurchase.fadeIn();
			orderButton.fadeIn();
		};
		
		//this function disables all the functionality that needs to be turned on to call for service, such as order, call button, etc...
		var disableFunctions = function(){
			var callStaffBtn = $(".staffCallDialogBtn"),
				quickPurchase = $(".quickPurchase"),
				orderButton = $(".orderButtonBg")
			;//close variables
				
			callStaffBtn.hide();
			quickPurchase.hide();
			orderButton.hide();
		};
		
// =============================== TABLE VERIFICATION ======================//
		//this is the button where the user clicks to check if the code is valid so they can check into a table. If the code is valid then it will enable the functionality that the app has disabled as default, else if the code is wrong it will disable those funcitons
		$(".verifyTable").click(function(){
			var tableCodeInput = $("#tableCodeInput").val(),
				tableCodeOutput = $("#tableCodeOutput"),
				tableCodeFont = $(".quickFlipPanel.front"),
				tableCodeBack = $(".quickFlipPanel.back"),
				callStaffBtn = $(".staffCallDialogBtn")
			;

			$.ajax({
				url: "https://api.mongohq.com/databases/xcusemedb/collections/xcusemedata/documents",
				type: "GET",
				headers: {"Content-Type": "application/json"}, //this must be here to ensure the object is treated as json.
			    dataType: 'json',
			    data: {
					"_apikey" : apiKey,
					"q" : JSON.stringify({ //the query must be stringified in JSON in order to be passed succesfully.
						"type" : "table",
						"authCode" : tableCodeInput
					}),
					"document" : {} //just an empty object
			    },
			    success: function(response){

					if(response.length > 0){
						currentTable = response[0]; //this is an object
						console.log(currentTable);
						$("#tableCodeInput").removeClass("wrongCode");
						
						tableCodeFont.fadeOut();
						tableCodeBack.fadeIn();
						
						tableCodeOutput.text(tableCodeInput);
						
						enableFunctions();

					}else{
						//if the response isn't greater than zero then it's the wrong code.
						$("#tableCodeInput").addClass("wrongCode");
						
						$(this).fadeOut();
						$(this).fadeIn();
						
						disableFunctions();
					}

			    },
			    error: function(error){
					console.log("Mongo Error: ", error);
			    }
			});
			
		});
		
		//this is where the user will click if they want to check off that table, so they clear out the table data and can check in later on, we will set a timeout so that after 12-24 hours the code will no longe be available.
		$(".tableCheckOut").click(function(){
			checkOutTable();
			vibrate();
			//window.confirm("you sure you want to check out")
		});
		
		$("#tableCodeInput").focusin(function(){
			$(this).val("");
		});
		
		$("#tableCodeInput").focusout(function(){
			if($(this).val() === ""){
				$(this).val("Table Code");
			}
		});
// =============================== end TABLE VERIFICATION ======================//
		
		
		
		
		

// =============================== PRODUCT ITEM ======================//
		$(".productItem").live("click", function(){
			var itemName = $(this).find(".productName").text(),
				itemDesc = $(this).find(".productDescription").text(),
				detailDescription = $("#productDetail-page .productDescription p"),
				detailName = $("#productDetail-page .productName"),
				itemId = $(this).data("itemid"),
				detailPhoto = $("#productDetail-page .productImage img"),
				itemAbv = $(this).data("itemabv"),
				detailAbv = $("#productDetail-page .productSubTitle")
			;//close variables
			
			$.mobile.changePage("#productDetail-page");
			
			
			// todo : fix item order description
			detailDescription.html("");
			detailDescription.html(itemDesc);
			
			// todo : fix item order button name
			detailName.html("");
			detailName.html(itemName);
			
			detailAbv.html("");
			detailAbv.html("ABV (alcohol by volume) is "+itemAbv+"%");
			
			//saving the item id I need, i.e. Troy, to the product link
			$("#productDetail-page .orderButton").attr('data-itemid', itemId);
			
			// todo : fix the photo so that if there is no photo available then set a default photo.
			
			// if there is no item ID then the attribute will be undefined so it will have a default photo
			if(detailPhoto.attr('src') === "images/menu/undefined-big.png"){
				detailPhoto.attr('src', "images/menu/noBeerLogo-big.png");
			}else{
			//else it will grab the correct item id and grab the photo from the images/menu/ folder
				detailPhoto.attr('src', "images/menu/"+itemId+"-big.png");
			}
			
			console.log("Button Name -> " + detailName.html());
			console.log("Product Description -> " + detailDescription.html());
		
		});
	
	
		
		$(".quickPurchase").live("click", function(){
			that = $(this);
			itemName = that.parent().find(".productName").text();
			orderedItemId = that.data('itemid');
			
			quickItemOrder(itemName);
			vibrate();
		});
		
		
		
		$("#productDetail-page .orderButton").live("click", function(){
			that = $(this);
			itemName = that.parent().find(".productName").text();
			orderedItemId = that.data('itemid');
			
			quickItemOrder(itemName);
			vibrate();
		});

// =============================== end PRODUCT ITEM ======================//
		
				
				
				
// =============================== CALCULATOR ======================//
		var billCalculation = function(){
			
			// ============== Bill Prices before Taking off $ to calculate ===========
			
			// todo : totalPrice2 is the original text span tag, where the items from the cart is being displayed.
			// todo : totalPrice is the input field where the user can manually input their bill price and get the calculation
			var totalPrice2 = $("#totalPrice").text(),
				totalPrice = $("#totalPriceInput").val(),
				numberOfPerson = $("#number-of-person").val(),
				tipPercentage = $("#tip-percentage").val(),
				tipPerPerson = $("#tip-per-person").text(),
				totalPerPerson = $("#total-per-person").text(),
				totalPlusTip = $("#total-plus-tip").text(),
				itemOrdered = $(".itemOrdered .cartItemPrice").text()
			;//close variables
			

			console.log(itemOrdered);
			
			// ============== Bill Prices Ready to calculate without the $ ===========
			var totalPriceFixed = totalPrice.replace('$', ""),
				tipPerPersonFixed = tipPerPerson.replace('$', ""),
				totalPerPersonFixed = totalPerPerson.replace('$', ""),
				totalPlusTipFixed = totalPlusTip.replace('$', "")
			;//close variables
			
			// ============== Bill Prices Calculation ===========
			var tipPerPersonNew = ((tipPercentage * totalPriceFixed)/100)/numberOfPerson,
				totalPerPersonNew = (totalPriceFixed / numberOfPerson) + tipPerPersonNew,
				totalPlusTipNew = totalPerPersonNew * numberOfPerson
			;//close variables
			
			
			// ============== After Calculations Setting the fields ===========
			//console.log("totalPerPersonNew " + totalPerPersonNew);
			$("#total-per-person").text("");
			//$("#total-per-person").text("$"+totalPerPersonNew);
			$("#total-per-person").text(totalPerPersonNew).currency();
			
			//console.log("tipPerPersonNew " + tipPerPersonNew);
			$("#tip-per-person").text("");
			//$("#tip-per-person").text("$"+tipPerPersonNew);
			$("#tip-per-person").text(tipPerPersonNew).currency();
			
			//console.log("totalPlusTipNew " + totalPlusTipNew);
			$("#total-plus-tip").text("");
			//$("#total-plus-tip").text("$"+totalPlusTipNew);
			$("#total-plus-tip").text(totalPlusTipNew).currency();
			
			//$("#totalPrice").text("111111");
			
			/*
			console.log("totalPrice " + totalPrice);
			console.log("numberOfPerson " + numberOfPerson);
			console.log("tipPercentage " + tipPercentage);
			console.log("tipPerPerson " + tipPerPerson);
			console.log("totalPerPerson " + totalPerPerson);
			console.log("totalPlusTip " + totalPlusTip);
			*/
			
			//console.log("totalPriceFixed " + totalPriceFixed);
			//console.log("tipPerPersonFixed " + tipPerPersonFixed);
			//console.log("totalPerPersonFixed " + totalPerPersonFixed);
			//console.log("totalPlusTipFixed " + totalPlusTipFixed);
		};
		
		
		$("#number-of-person").change(function(){
			billCalculation();
		});
		
		// todo : remove this when the cart is working, this will set it so when you input a number manually to the bill it calculates the tip
		$("#totalPriceInput").keyup(function(){
			billCalculation();
		});
		
		$("#tip-percentage").change(function(){
			billCalculation();
		});
		
		$(".billMenuClick").click(function(){
			billCalculation();
		});
// =============================== end CALCULATOR ======================//
		
		
		
// =============================== INIT FUNCTION ======================//
		var initFn = function(){
			var beveragesCount = $(".ui-li-count.beverages"),
				beveragesAmount = $("#beverages-page .menuListItem").length,
				appetizersCount = $(".ui-li-count.appetizers"),
				appetizersAmount = $("#appetizers-page .menuListItem").length
			;//close vasriables
			
			//dynamically setting the ammount of items in the beverages div
			beveragesCount.html(beveragesAmount);
			appetizersCount.html(appetizersAmount);
			//console.log("appetizersCount -> " + $appetizersCount);
			//console.log("appetizersAmount -> " + $appetizersAmount);
			//console.log("appetizersCount 2-> " + $appetizersCount);
			//console.log("appetizersAmount 2-> " + $appetizersAmount);
		};
		initFn();
		billCalculation();
// =============================== end INIT FUNCTION ======================//
		
		

		
// =============================== FEED BACK ======================//
		$(".submitFormBtn").click(function(){
			
			window.location = "#thankyou-page";
			
		});
// =============================== end FEED BACK ======================//
		
		
		
		
// =============================== DEALS ======================//
		$('.iosSlider').iosSlider({
			scrollbar: true,
			infiniteSlider: true,
			snapToChildren: true,
			desktopClickDrag: true,
			responsiveSlideWidth: true,
			startAtSlide: '1',
			scrollbarLocation: 'top',
			scrollbarBorderRadius: '0',
			scrollbarMargin: '10px 10px 0 10px',
			navSlideSelector: $('.iosSliderButtons .button'),
			onSlideChange: slideContentChange,
			navPrevSelector: $('.prevButton'),
			navNextSelector: $('.nextButton')
			//onSliderLoaded: slideContentLoaded,
			//onSlideComplete: slideContentComplete
		});
		
		function slideContentChange(args) {
			
			/* indicator */
			$(args.sliderObject).parent().find('.iosSliderButtons .button').removeClass('selected');
			$(args.sliderObject).parent().find('.iosSliderButtons .button:eq(' + args.currentSlideNumber + ')').addClass('selected');
		}
		
		function slideContentComplete(args) {
			
			/* animation */
			$(args.sliderObject).find('.text1, .text2').attr('style', '');
			
			$(args.currentSlideObject).children('.text1').animate({
				right: '100px',
				opacity: '.75'
			}, 400, 'easeOutQuint');
			
			$(args.currentSlideObject).children('.text2').delay(200).animate({
				right: '50px',
				opacity: '.75'
			}, 400, 'easeOutQuint');
		}
		
		function slideContentLoaded(args) {
			
			/* animation */
			$(args.sliderObject).find('.text1, .text2').attr('style', '');
			
			$(args.currentSlideObject).children('.text1').animate({
				right: '100px',
				opacity: '.75'
			}, 400, 'easeOutQuint');
			
			$(args.currentSlideObject).children('.text2').delay(200).animate({
				right: '50px',
				opacity: '.75'
			}, 400, 'easeOutQuint');
			
			/* indicator */
			$(args.sliderObject).parent().find('.iosSliderButtons .button').removeClass('selected');
			$(args.sliderObject).parent().find('.iosSliderButtons .button:eq(' + args.currentSlideNumber + ')').addClass('selected');
		}
// =============================== end DEALS ======================//
		
	});	//close document ready
})(jQuery); //close private scope
		