jQuery(document).ready(function ($) {

    $("#user-signup").on("click", function() {
        $("#user-signup-form").submit();
    });

    $("#user-signin").on("click", function() {
        $("#user-signin-form").submit();
    });



    $("#create-wallet").on("click", function() {
        createWallet();
    });

    getBalance();
    $("#get-balance").on("click", function() {
        getBalance();
    });
    setInterval(getBalance, 10000);

    function getBalance() {
        $.ajax({
            url: "/wallet/getbalance",
            type: "post",
            success: function(data) {
                console.log(data);
                if(data.status == "success") {
                    $("#balance").val(data.statusMsg);
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
                    $("#wallet").val(data.statusMsg);
                    getBalance();
                }
            }
        });
    }
});