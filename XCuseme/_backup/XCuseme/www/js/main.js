//main js
(function($){
	$(document).ready(function(){
	
		function preventBehavior(e) 
		{ 
		  e.preventDefault(); 
		};
		document.addEventListener("touchmove", preventBehavior, false);
	
		
		
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
		};
		
		
		
		
		
		
		
	
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
			//alert("ajax call here to the server's computer");
			callBtnClick(11);
		}
	
		// Show a custom alert
		function callStaffAlert() {
			navigator.notification.alert(
				'Please wait, a staff member will be with you shortly.',  // message
				callStaffCallback,         // callback
				'Request Sent',            // title
				'Okay'                  // buttonName
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
		
			// todo : take this callBtnClick(11); function out, the reason why its here its so Troy and I can test it on the mac browser since the desktop doesnt have navigator.notification is undefined
			callBtnClick(11);
			
			
			callStaffAlert();
			playBeep();
			vibrate();
			
			return false;
		});
		
		$(".testBtn").click(function(){
			
			return false;
		});
		// ================================== ALERTS END ===================================== //
		
	
	
				
		// ================================== CALCULATOR ===================================== //
		var billCalculation = function(){
			// ============== Bill Prices before Taking off $ to calculate ===========
			var totalPrice = $("#totalPrice").text(),
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
			$("#total-per-person").text("$"+totalPerPersonNew);
			
			//console.log("tipPerPersonNew " + tipPerPersonNew);
			$("#tip-per-person").text("");
			$("#tip-per-person").text("$"+tipPerPersonNew);
			
			//console.log("totalPlusTipNew " + totalPlusTipNew);
			$("#total-plus-tip").text("");
			$("#total-plus-tip").text("$"+totalPlusTipNew);
			
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
		
		$("#number-of-person").change(function(){
			billCalculation();
		});
		
		$("#tip-percentage").change(function(){
			billCalculation();
		});
		
		$(".billMenuClick").click(function(){
			billCalculation();
		});
		// ================================== CALCULATOR END ===================================== //
		
		
		
		$("#checkTotalPrice").click(function(){
			var itemPrices = $(".cartItemPrice");
 			var arr = $.makeArray($itemPrices)

			alert("total price : " + arr);
		});
		
		$(".submitFormBtn").click(function(){
			
			window.location = "#thankyou-page";
			
		});
		
		
		
		/* ============================= DEALS SLIDER ======================== */
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
	
	});	//close document ready
	
	$(document).delegate('.menuListItem', 'click', function(e) {
		var self = this;
		var itemName = $(this).find(".menuItemName").text();
		var itemPrice = $(this).find(".menuItemPrice").text();
		var itemId = $(this).find(".menuItemNumber").val();
		var cartItems = $("#stringselect");
		var cartStatus = 0;
		var currentCartPrice = $("#totalPrice");
		var itemPriceFixed = itemPrice.replace('$', "");
		
		$(self).simpledialog2({
			'mode' : 'button',
			'showModal' : true,
			'shadow' : true,
			'headerText' : itemName + " ?",
			'buttonPrompt' : itemPrice + " <br /> <img src='images/menu/"+itemId+".png' height='110'/> <br />",
			'width' : '100%',
			'buttons' : 
			{
				'Place this order' : 
				{
					click: function () 
					{ 
						console.log("item "+itemName+" added");
						
						//alert("We will bring it to you right away, please wait.");
						
						$(
							'<li class="itemOrdered" >'
									+ itemName + 
								'<span class="cartItemPrice">'
									+itemPrice+
								'</span>'+
							'</li>'
						).appendTo(cartItems);
						
						//$(.cartItemPrice)each()
						// todo : fix the total price calculation
						var currentValue = itemPriceFixed;
						var newValue = currentValue;
						currentCartPrice.text("$"+newValue);
						
						
						
						// todo: this is redundant, because this function exists outside but i cannot call it in here for some reason. Fix it so i can call the same billCalculation function.
						
						// ================================== CALCULATOR ===================================== //
						var billCalculation = function(){
							// ============== Bill Prices before Taking off $ to calculate ===========
							var totalPrice = $("#totalPrice").text(),
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
							$("#total-per-person").text("$"+totalPerPersonNew);
							
							//console.log("tipPerPersonNew " + tipPerPersonNew);
							$("#tip-per-person").text("");
							$("#tip-per-person").text("$"+tipPerPersonNew);
							
							//console.log("totalPlusTipNew " + totalPlusTipNew);
							$("#total-plus-tip").text("");
							$("#total-plus-tip").text("$"+totalPlusTipNew);
							
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
						
						
						
						
						
						
						billCalculation();
					},
					'theme' : 'c'
				},
				'Cancel' : 
				{
					click: function () 
					{ 
						console.log("item canceled");
					},
					'icon' : 'delete',
					'theme' : 'a'
				}
			}//close simpledialog options
		})//close simpledialog
	});//close delgate
	

})(jQuery); //close private scope
		