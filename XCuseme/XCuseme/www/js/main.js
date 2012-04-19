//main js
(function($){
	$(document).ready(function(){
	
		var billCalculation = function(){
			// ============== Bill Prices before Taking off $ to calculate ===========
			var $totalPrice = $("#totalPrice").text(),
				$numberOfPerson = $("#number-of-person").val(),
				$tipPercentage = $("#tip-percentage").val(),
				$tipPerPerson = $("#tip-per-person").text(),
				$totalPerPerson = $("#total-per-person").text(),
				$totalPlusTip = $("#total-plus-tip").text(),
				$itemOrdered = $(".itemOrdered .cartItemPrice").text()
			;//close variables
			
			console.log($itemOrdered);
			
			// ============== Bill Prices Ready to calculate without the $ ===========
			var $totalPriceFixed = $totalPrice.replace('$', ""),
				$tipPerPersonFixed = $tipPerPerson.replace('$', ""),
				$totalPerPersonFixed = $totalPerPerson.replace('$', ""),
				$totalPlusTipFixed = $totalPlusTip.replace('$', "")
			;//close variables
			
			// ============== Bill Prices Calculation ===========
			var $tipPerPersonNew = (($tipPercentage * $totalPriceFixed)/100)/$numberOfPerson,
				$totalPerPersonNew = ($totalPriceFixed / $numberOfPerson) + $tipPerPersonNew,
				$totalPlusTipNew = $totalPerPersonNew * $numberOfPerson
			;//close variables
			
			// ============== After Calculations Setting the fields ===========
			//console.log("totalPerPersonNew " + $totalPerPersonNew);
			$("#total-per-person").text("");
			$("#total-per-person").text("$"+$totalPerPersonNew);
			
			//console.log("tipPerPersonNew " + $tipPerPersonNew);
			$("#tip-per-person").text("");
			$("#tip-per-person").text("$"+$tipPerPersonNew);
			
			//console.log("totalPlusTipNew " + $totalPlusTipNew);
			$("#total-plus-tip").text("");
			$("#total-plus-tip").text("$"+$totalPlusTipNew);
			
			//$("#totalPrice").text("111111");
			
			/*
			console.log("totalPrice " + $totalPrice);
			console.log("numberOfPerson " + $numberOfPerson);
			console.log("tipPercentage " + $tipPercentage);
			console.log("tipPerPerson " + $tipPerPerson);
			console.log("totalPerPerson " + $totalPerPerson);
			console.log("totalPlusTip " + $totalPlusTip);
			*/
			
			//console.log("totalPriceFixed " + $totalPriceFixed);
			//console.log("tipPerPersonFixed " + $tipPerPersonFixed);
			//console.log("totalPerPersonFixed " + $totalPerPersonFixed);
			//console.log("totalPlusTipFixed " + $totalPlusTipFixed);
		}
		
		var initFn = function(){
			var $beveragesCount = $(".ui-li-count.beverages"),
				$beveragesAmount = $("#beverages-page .menuListItem").length,
				$appetizersCount = $(".ui-li-count.appetizers"),
				$appetizersAmount = $("#appetizers-page .menuListItem").length
			;//close vasriables
			
			//dynamically setting the ammount of items in the beverages div
			$beveragesCount.html($beveragesAmount);
			$appetizersCount.html($appetizersAmount);
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
		
		$(".startService").click(function(){
			$(".setUpTable").delay(500).fadeOut();
		});
		
		$(".staffCallDialogBtn").click(function(){
			var dialog = $(".staffCallDialog");
			//dialog.fadeIn(300).delay(800).fadeOut(400);
			
			console.log("calling staff member");
			alert("A staff member will be with you shortly");
		});
		
		
		$(".nextArrow").click(function() {
 			console.log("set your table");
		});
		
		
		$("#checkTotalPrice").click(function(){
			var $itemPrices = $(".cartItemPrice");
 			var $arr = $.makeArray($itemPrices)

			alert("total price : " + $arr);
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
		var $itemName = $(this).find(".menuItemName").text();
		var $itemPrice = $(this).find(".menuItemPrice").text();
		var $itemId = $(this).find(".menuItemNumber").val();
		var $cartItems = $("#stringselect");
		var $cartStatus = 0;
	
		
		$(self).simpledialog2({
			'mode' : 'button',
			'showModal' : true,
			'shadow' : true,
			'headerText' : $itemName + " ?",
			'buttonPrompt' : $itemPrice + " <br /> <img src='images/menu/"+$itemId+".png' height='110'/> <br />",
			'width' : '100%',
			'buttons' : 
			{
				'Place this order' : 
				{
					click: function () 
					{ 
						console.log("item "+$itemName+" added");
						
						//alert("We will bring it to you right away, please wait.");
						
						$(
							'<li class="itemOrdered" >'
									+ $itemName + 
								'<span class="cartItemPrice">'
									+$itemPrice+
								'</span>'+
							'</li>'
						).appendTo($cartItems);
						
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
	

/*
	$(document).delegate('.menuListItem', 'click', function(e) {
		var self = this;
		var $itemName = $(this).find(".menuItemName").text();
		var $itemPrice = $(this).find(".menuItemPrice").text();
		var $itemId = $(this).find(".menuItemNumber").val();
		var $cartItems = $("#stringselect");
		var $cartStatus = 0;
	
		$(self).each(function(){
			//if ( $(this).attr('data-addoption') ) {
				$(self).simpledialog({
					'mode' : 'bool',
					'prompt' : "Order " + $itemName + " ?",
					'subTitle' : $itemPrice + " <br /> <img src='images/menu/"+$itemId+".png' height='110'/> <br />",
					'width' : '100%',
   					'headerClose' : true,
					'useDialogForceFalse' : true,
					'buttons' : 
					{
						'Place this order' : 
						{
							click: function () 
							{ 
								
								console.log("item added");
								
								$(
									'<li class="ui-li ui-li-static ui-body-b" >'
											+ $itemName + 
										'<span class="cartItemPrice">'
											+$itemPrice+
										'</span>'+
									'</li>'
								).appendTo($cartItems);
								
							},
							'theme' : 'c'
						},
						'Cancel' : 
						{
							click: function () 
							{ 
								console.log("item canceled");
							},
							'theme' : 'a'
						}
					}//close simpledialog options
				})//close simpledialog
			//}//close if statement
		});//close self selected
	});//close delgate

*/
		
	
})(jQuery); //close private scope
		