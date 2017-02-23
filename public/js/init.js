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
            }
        }
    });

    // if ($(".site-content div").hasClass("profile-page") || $(".site-content div").hasClass("error-page")){
    //     $(".site-header ").css("background-color", "#127cc6");
    // }

    // $(".site-header .cont .right-block .burger-block").on("click", function () {
    //     $(".site-menu").toggleClass("show");
    // });

    // $(".close-burger").on("click", function () {
    //     $(".site-menu").removeClass("show");
    // });

    if($(".error-not").length !== 0) {
        $(".error-not").addClass("show");

        function explode(){
            $(".error-not").removeClass("show");
        }
        setTimeout(explode, 5000);
    }

    $("#create-wallet").on("click", function() {
        createWallet();
        $("#create-wallet").remove();
    });

    getBalance();
    $("#get-balance").on("click", function() {
        getBalance();
    });
    setInterval(getBalance, 20000);

    function getBalance() {
        $.ajax({
            url: "/wallet/getbalance",
            type: "post",
            success: function(data) {
                console.log(data);
                if(data.status == "success") {
                    $("#balance").text(data.statusMsg);
                }
            }
        });
    }

    var createWallet = function() {
        $.ajax({
            url: "/wallet/createwallet",
            type: "post",
            success: function(data) {
                console.log(data);
                if(data.status = "success") {
                    $("#wallet").text(data.statusMsg);
                    getBalance();
                }
            }
        });
    }
});