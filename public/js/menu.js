$(document).ready(function () {
		    var winHeight = window.innerHeight;

		    $(".top-baner-block").height(winHeight);

		    $(".site-menu").height(winHeight);

		    $(window).resize(function () {
		        var winHeight = window.innerHeight;
		        $(".top-baner-block").height(winHeight);
		        $(".site-menu").height(winHeight);
		    });
   

		    if ($(".site-content div").hasClass("profile-page") || $(".site-content div").hasClass("error-page")){
		        $(".site-header ").css("background-color", "#141414");
		    }

		    $(".site-header .cont .right-block .burger-block").on("click", function () {
		    
		        $(".site-menu").toggleClass("show");
		    });

		    $(".close-burger").on("click", function () {
		        $(".site-menu").removeClass("show");
		    });
		});