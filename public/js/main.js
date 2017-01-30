jQuery(document).ready(function ($) {

    $("#user-signup").on("click", function() {
        $("#user-signup-form").submit();
    });

    $("#user-signin").on("click", function() {
        $("#user-signin-form").submit();
    });
});