/*	Main JavaScript
	Marcos DeSousa
	May 25, 2012
*/

$(document).ready(function() {

	//fade toggle login dropdown
	var showLoginDropdown = function(){
		var dropdown = $(".banner .loginDropdown");
		dropdown.fadeToggle();
	};

	//fade toggle language dropdown
	var showLangDropdown = function(){
		var dropdown = $(".banner .langDropdown");
		dropdown.fadeToggle();
	};
	
	//on login click run the function showLoginDropdown();
	$(".banner .signin a").click(function(){
		var login = $(".banner .signin"),
			lang = $(".banner .language"),
			loginDropdown = $(".banner .loginDropdown"),
			lanDropdown = $(".banner .langDropdown")
		;//close variables
		
		lanDropdown.fadeOut();
		showLoginDropdown();	
	});
	
	//on language click run the function showLangDropdown();
	$(".banner .language").click(function(){
		var login = $(".banner .signin"),
			lang = $(".banner .language"),
			loginDropdown = $(".banner .loginDropdown"),
			lanDropdown = $(".banner .langDropdown")
		;//close variables
		
		loginDropdown.fadeOut();
		showLangDropdown();
	});
	
	
	
	
	$(".detail-table .titles .first").click(function(){
		var 	arrow =	$(".detail-table .triangle"),
			items = $(".detail-table .titles li")
		;
		
		items.removeClass("active");
		$(this).addClass("active");
		
		arrow.animate({"top" : "0"});
	});
	
	$(".detail-table .titles .second").click(function(){
		var 	arrow =	$(".detail-table .triangle"),
			items = $(".detail-table .titles li")
		;
		
		items.removeClass("active");
		$(this).addClass("active");
		
		arrow.animate({"top" : "60px"});
	});
	
	$(".detail-table .titles .third").click(function(){
		var 	arrow =	$(".detail-table .triangle"),
			items = $(".detail-table .titles li")
		;
		
		items.removeClass("active");
		$(this).addClass("active");
		
		arrow.animate({"top" : "120"});
	});
	
	$(".detail-table .titles .forth").click(function(){
		var 	arrow =	$(".detail-table .triangle"),
			items = $(".detail-table .titles li")
		;
		
		items.removeClass("active");
		$(this).addClass("active");
		
		arrow.animate({"top" : "180"});
	});
	
	$(".detail-table .titles .fifth").click(function(){
		var 	arrow =	$(".detail-table .triangle"),
			items = $(".detail-table .titles li")
		;
		
		items.removeClass("active");
		$(this).addClass("active");
		
		arrow.animate({"top" : "240"});
	});
	
	$(".detail-table .titles .sixth").click(function(){
		var 	arrow =	$(".detail-table .triangle"),
			items = $(".detail-table .titles li")
		;
		
		items.removeClass("active");
		$(this).addClass("active");
		
		arrow.animate({"top" : "300"});
	});
	
	$(".detail-table .titles .seventh").click(function(){
		var 	arrow =	$(".detail-table .triangle"),
			items = $(".detail-table .titles li")
		;
		
		items.removeClass("active");
		$(this).addClass("active");
		
		arrow.animate({"top" : "360"});
	});
	
	
	
	//when the page scrolls the table title div will more along with the window
	var scrollTableTitle = function(){
		var 	$sidebar   = $(".table-title"),
			$window    = $(window),
			offset     = $sidebar.offset(),
			topPadding = 0;
		
		$window.scroll(function() {
			if ($window.scrollTop() > offset.top) {
				$sidebar.stop().animate({
					marginTop: $window.scrollTop() - offset.top + topPadding
				});
			}else{
				$sidebar.stop().animate({
					marginTop: 0
				});
			}
		});
	};scrollTableTitle();


	
});