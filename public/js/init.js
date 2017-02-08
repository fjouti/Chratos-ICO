$(document).ready(function () {
    var winHeight = window.innerHeight;

    $(".top-baner-block").height(winHeight);
    $(".site-menu").height(winHeight);

    $(window).resize(function () {
        var winHeight = window.innerHeight;
        $(".top-baner-block").height(winHeight);
        $(".site-menu").height(winHeight);
    });


    $('.carousel2').owlCarousel({
        loop: true,
        margin: 0,
        nav: true,
        navText: ["<img src='images/left-arrow.png'>", "<img src='images/right-arrow.png'>"],
        responsive: {
            0: {
                items: 1
            },
            500: {
                items: 1
            },
            1000: {
                items: 5
            },
            1711: {
                items: 7
            },
        }
    });

    if ($(".site-content div").hasClass("profile-page")){
        $(".site-header ").css("background-color", "#141414");
    }

    $(".site-header .cont .right-block .burger-block").on("click", function () {
        $(".site-menu").toggleClass("show");
    });

    $(".close-burger").on("click", function () {
        $(".site-menu").removeClass("show");
    });
});