"use strict";
var zWarning;
var score_field;

$(document).ready(function () {
    score_field = document.getElementById("retValue");
    score_field.style.display = "none";
    zWarning = document.getElementById("zWarningFlags");
    zWarning.style.display = "";

    $.ajax({
        url: WSURL + "?query=imgparams&format=json",
        success: function (result) {
            var imgparams_select = document.getElementById("imgparams");
            add_option(imgparams_select, "none", "none");
            add_option(imgparams_select, "minimal", "minimal");
            add_option(imgparams_select, "typical", "typical");
            add_option(imgparams_select, "radec", "radec");
            add_option(imgparams_select, "blankSpec", null);
            for (var i = 0; i < result[0].Rows.length; i++) {
                add_option(
                    imgparams_select,
                    result[0].Rows[i].name,
                    result[0].Rows[i].name
                );
            }
        },
        error: function (xhr, status, error) {
            alert("Cannot retrieve specparams options from web service.");
        },
    });

    $.ajax({
        url: WSURL + "?query=specparams&format=json",
        success: function (result) {
            var imgparams_select = document.getElementById("specparams");
            add_option(imgparams_select, "minimal", "minimal");
            add_option(imgparams_select, "typical", "typical");
            add_option(imgparams_select, "radec", "radec");
            for (var i = 0; i < result[0].Rows.length; i++) {
                add_option(
                    imgparams_select,
                    result[0].Rows[i].name,
                    result[0].Rows[i].name
                );
            }
        },
        error: function (xhr, status, error) {
            alert("Cannot retrieve specparams options from web service.");
        },
    });

    $.ajax({
        url: SQLURL + "?cmd=Select%20*%20from%20PrimTarget&format=json",
        success: function (result) {
            var imgparams_select = document.getElementById("priFlagsOnList");
            var imgparams_select2 = document.getElementById("priFlagsOffList");
            for (var i = 0; i < result[0].Rows.length; i++) {
                add_option(
                    imgparams_select,
                    result[0].Rows[i].name,
                    result[0].Rows[i].name
                );
                add_option(
                    imgparams_select2,
                    result[0].Rows[i].name,
                    result[0].Rows[i].name
                );
            }
        },
        error: function (xhr, status, error) {
            alert("Cannot retrieve specparams options from web service.");
        },
    });

    $.ajax({
        url: SQLURL + "?cmd=Select%20*%20from%20SecTarget&format=json",
        success: function (result) {
            var imgparams_select = document.getElementById("secFlagsOnList");
            var imgparams_select2 = document.getElementById("secFlagsOffList");
            for (var i = 0; i < result[0].Rows.length; i++) {
                add_option(
                    imgparams_select,
                    result[0].Rows[i].name,
                    result[0].Rows[i].name
                );
                add_option(
                    imgparams_select2,
                    result[0].Rows[i].name,
                    result[0].Rows[i].name
                );
            }
        },
        error: function (xhr, status, error) {
            alert("Cannot retrieve specparams options from web service.");
        },
    });

    $.ajax({
        url: SQLURL + "?cmd=Select%20*%20from%20BossTarget1&format=json",
        success: function (result) {
            var imgparams_select = document.getElementById("bossFlagsOnList");
            var imgparams_select2 = document.getElementById("bossFlagsOffList");
            for (var i = 0; i < result[0].Rows.length; i++) {
                add_option(
                    imgparams_select,
                    result[0].Rows[i].name,
                    result[0].Rows[i].name
                );
                add_option(
                    imgparams_select2,
                    result[0].Rows[i].name,
                    result[0].Rows[i].name
                );
            }
        },
        error: function (xhr, status, error) {
            alert("Cannot retrieve specparams options from web service.");
        },
    });

    $.ajax({
        url: SQLURL + "?cmd=Select%20*%20from%20EBossTarget0&format=json",
        success: function (result) {
            var imgparams_select = document.getElementById("ebossFlagsOnList");
            var imgparams_select2 = document.getElementById("ebossFlagsOffList");
            for (var i = 0; i < result[0].Rows.length; i++) {
                add_option(
                    imgparams_select,
                    result[0].Rows[i].name,
                    result[0].Rows[i].name
                );
                add_option(
                    imgparams_select2,
                    result[0].Rows[i].name,
                    result[0].Rows[i].name
                );
            }
        },
        error: function (xhr, status, error) {
            alert("Cannot retrieve specparams options from web service.");
        },
    });

    $.ajax({
        url: SQLURL + "?cmd=Select%20*%20from%20PhotoFlags&format=json",
        success: function (result) {
            var imgparams_select = document.getElementById("flagsOnList");
            var imgparams_select2 = document.getElementById("flagsOffList");
            for (var i = 0; i < result[0].Rows.length; i++) {
                add_option(
                    imgparams_select,
                    result[0].Rows[i].name,
                    result[0].Rows[i].name
                );
                add_option(
                    imgparams_select2,
                    result[0].Rows[i].name,
                    result[0].Rows[i].name
                );
            }
        },
        error: function (xhr, status, error) {
            alert("Cannot retrieve specparams options from web service.");
        },
    });
});

function add_option(select_element, option_value, option_innerHTML) {
    var opt = document.createElement("option");
    opt.value = option_value;
    if (option_innerHTML != null) {
        opt.innerHTML = option_innerHTML;
    }
    select_element.appendChild(opt);
}

function toggleWarningFlags() {
    if (
        zWarning.style.display == "" &&
        document.getElementById("zWarning").checked == true
    ) {
        zWarning.style.display = "none";
    } else {
        zWarning.style.display = "";
    }
}

function changeQueryType(newtype) {
    if (newtype === "Return Value") {
        score_field.style.display = "";
    }
}

function changePositionType(type) {
    switch (type) {
        case "rectangular":
            $(".rectangular-group").show();
            $(".cone-group").hide();
            $(".proximity-group").hide();
            break;

        case "cone":
            $(".cone-group").show();
            $(".rectangular-group").hide();
            $(".proximity-group").hide();
            break;

        case "proximity":
            $(".proximity-group").show();
            $(".cone-group").hide();
            $(".rectangular-group").hide();
            break;

        case "none":
            $(".cone-group").hide();
            $(".rectangular-group").hide();
            $(".proximity-group").hide();
            break;
    }
}
