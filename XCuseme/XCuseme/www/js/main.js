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
		staffCallDialogBtn = $('.staffCallDialogBtn')
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
			callBtnClick(11);
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
		
		function onOrderConfirm(button) {
			if(button == 2){
				console.log("after use confirm item purchase, do a ajax call");
				
				callStaffAlert();
			}else{
				console.log("user canceled the order");
			}
		}
	
		// Show a custom alert
		function quickItemOrder(itemName) {
			navigator.notification.confirm(
				'Would you like to order '+itemName+' ?',  // message
				onOrderConfirm,              // callback to invoke with index of button pressed
				'Place Order',            // title
				'No,Yes Please'          // buttonLabels
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
		disableFunctions();
		
// =============================== TABLE VERIFICATION ======================//		
		//this is the button where the user clicks to check if the code is valid so they can check into a table. If the code is valid then it will enable the functionality that the app has disabled as default, else if the code is wrong it will disable those funcitons
		$(".verifyTable").click(function(){
			var tableCodeInput = $("#tableCodeInput").val(),
				tableCodeOutput = $("#tableCodeOutput"),
				tableCodeFont = $(".quickFlipPanel.front"),
				tableCodeBack = $(".quickFlipPanel.back"),
				callStaffBtn = $(".staffCallDialogBtn"),
				dataBaseTableCode = 123
			;
			
			if(tableCodeInput == dataBaseTableCode){
				$("#tableCodeInput").removeClass("wrongCode");
				
				tableCodeFont.fadeOut();
				tableCodeBack.fadeIn();
				
				tableCodeOutput.text(tableCodeInput);
				
				enableFunctions();
				
				console.log("table code is correct");
			}else if(tableCodeInput != dataBaseTableCode){
				$("#tableCodeInput").addClass("wrongCode");
				
				$(this).fadeOut();
				$(this).fadeIn();
				
				disableFunctions();
				
				console.log("table code is incorrect");
			};
		});
		
		//this is where the user will click if they want to check off that table, so they clear out the table data and can check in later on, we will set a timeout so that after 12-24 hours the code will no longe be available.
		$(".tableCheckOut").click(function(){
			var tableCodeInput = $("#tableCodeInput"),
				tableCodeOutput = $("#tableCodeOutput"),
				tableCodeFont = $(".quickFlipPanel.front"),
				tableCodeBack = $(".quickFlipPanel.back")
			;
			
			tableCodeInput.val("Table Code");
			tableCodeOutput.text("");
			
			tableCodeFont.fadeIn();
			tableCodeBack.fadeOut();
			
			
			//window.confirm("you sure you want to check out")
		});
		
		$("#tableCodeInput").focusin(function(){
			$(this).val("");
		});
		
		$("#tableCodeInput").focusout(function(){
			if($(this).val() == ""){
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
				detailPhoto = $("#productDetail-page .productImage img")
			;//close variables
			
			$.mobile.changePage("#productDetail-page");
			
			
			// todo : fix item order description
			detailDescription.html("");
			detailDescription.html(itemDesc);
			
			// todo : fix item order button name
			detailName.html("");
			detailName.html(itemName);
			
			
			// todo : fix the photo so that if there is no photo available then set a default photo.
			
			// if there is no item ID then the attribute will be undefined so it will have a default photo
			if(detailPhoto.attr('src') == "images/menu/undefined-big.png"){
				detailPhoto.attr('src', "images/menu/noBeerLogo-big.png");
			}else{
			//else it will grab the correct item id and grab the photo from the images/menu/ folder
				detailPhoto.attr('src', "images/menu/"+itemId+"-big.png");
			};
			
			console.log("Button Name -> " + detailName.html());
			console.log("Product Description -> " + detailDescription.html());
		
		});
	
	
		
		$(".quickPurchase").live("click", function(){
			var itemName = $(this).parent().find(".productName").text();
			
			quickItemOrder(itemName);
		});
		
		
		
		$("#productDetail-page .orderButton").live("click", function(){
			var itemName = $(this).parent().find(".productName").text();
			
			quickItemOrder(itemName);
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
		}
		
		
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
		