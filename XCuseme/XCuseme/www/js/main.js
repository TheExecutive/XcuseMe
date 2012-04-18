//main js
(function($){
	$(document).ready(function(){
		
		var initFn = function(){
		
			var $beveragesCount = $(".ui-li-count.beverages"),
				$beveragesAmount = $("#beverages-page .menuListItem").length,
				$appetizersCount = $(".ui-li-count.appetizers"),
				$appetizersAmount = $("#appetizers-page .menuListItem").length
			;//close vasriables
			
			console.log("appetizersCount -> " + $appetizersCount);
			console.log("appetizersAmount -> " + $appetizersAmount);
			
			//dynamically setting the ammount of items in the beverages div
			$beveragesCount.html($beveragesAmount);
			$appetizersCount.html($appetizersAmount);
			
			console.log("appetizersCount 2-> " + $appetizersCount);
			console.log("appetizersAmount 2-> " + $appetizersAmount);
			
			
		};
		initFn();
		
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
								
								console.log("item added");
								
								$(
									'<li class="ui-li ui-li-static" >'
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
			//}//close if statement
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
		