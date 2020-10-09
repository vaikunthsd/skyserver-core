"use strict";

//$("input[type=checkbox]").change(function () {
//    $(".checkbox ~ input, .checkbox ~ label").toggle();
//});
var check_j;
var check_h;
var check_k;
var check_u;
var check_g;
var check_r;
var check_i;
var check_z;
var table_field;

$(document).ready(function () {
    check_j = document.getElementById('check_j_group');
    check_h = document.getElementById('check_h_group');
    check_k = document.getElementById('check_k_group');
    check_u = document.getElementById('check_u_group');
    check_g = document.getElementById('check_g_group');
    check_r = document.getElementById('check_r_group');
    check_i = document.getElementById('check_i_group');
    check_z = document.getElementById('check_z_group');
    table_field = document.getElementById('table_name_group');
    table_field.style.display = 'none';
    check_j.style.display = 'none';
    check_h.style.display = 'none';
    check_k.style.display = 'none';
    check_u.style.display = '';
    check_g.style.display = '';
    check_r.style.display = '';
    check_i.style.display = '';
    check_z.style.display = '';
});
// * desc Changes search type based on user selection
// * param string new- User selected type '
// * return void type - manipulates ra,dec labels and numbers


function changeSearchType(newType) {
  if (newType === 'galactic') {
    document.getElementById("ra").value = "93.91311830736582";
    document.getElementById("dec").value = "34.90300451531874";
    document.getElementById('labelRaOrL').innerHTML = "Galactic Longitude (<i>l</i>)";
    document.getElementById('labelDecOrB').innerHTML = "Galactic Latitude (<i>b</i>)";
  } else {
    document.getElementById("ra").value = "258.25";
    document.getElementById("dec").value = "64.04999999999998";
    document.getElementById('labelRaOrL').innerHTML = "RA";
    document.getElementById('labelDecOrB').innerHTML = "Dec";
  }
}

function changeQueryType(newtype) {
    if (newtype === 'optical') {
        check_j.style.display = 'none';
        check_h.style.display = 'none';
        check_k.style.display = 'none';
        check_u.style.display = '';
        check_g.style.display = '';
        check_r.style.display = '';
        check_i.style.display = '';
        check_z.style.display = '';
    } else {
        check_j.style.display = '';
        check_h.style.display = '';
        check_k.style.display = '';
        check_u.style.display = 'none';
        check_g.style.display = 'none';
        check_r.style.display = 'none';
        check_i.style.display = 'none';
        check_z.style.display = 'none';
    }
}

function showTable() {
    table_field.style.display = '';
}

function hideTable() {
    table_field.style.display = 'none';
}
//# sourceMappingURL=radialsearch.js.map


function setBands() {
    if (document.getElementById('check_u').checked == true) {
        var hmin_s = String(document.getElementById('min_u').value);
        var hmax_s = String(document.getElementById('max_u').value);
        document.getElementById('uband').value = hmin_s + "," + hmax_s;
    }
    if (document.getElementById('check_g').checked == true) {
        var hmin_s = String(document.getElementById('min_g').value);
        var hmax_s = String(document.getElementById('max_g').value);
        document.getElementById('gband').value = hmin_s + "," + hmax_s;
    }
    if (document.getElementById('check_r').checked == true) {
        var hmin_s = String(document.getElementById('min_r').value);
        var hmax_s = String(document.getElementById('max_r').value);
        document.getElementById('rband').value = hmin_s + "," + hmax_s;
    }
    if (document.getElementById('check_i').checked == true) {
        var hmin_s = String(document.getElementById('min_i').value);
        var hmax_s = String(document.getElementById('max_i').value);
        document.getElementById('iband').value = hmin_s + "," + hmax_s;
    }
    if (document.getElementById('check_z').checked == true) {
        var hmin_s = String(document.getElementById('min_z').value);
        var hmax_s = String(document.getElementById('max_z').value);
        document.getElementById('zband').value = hmin_s + "," + hmax_s;
    }
    if (document.getElementById('check_j').checked == true) {
        var hmin_s = String(document.getElementById('min_j').value);
        var hmax_s = String(document.getElementById('max_j').value);
        document.getElementById('jband').value = hmin_s + "," + hmax_s;
    }
    if (document.getElementById('check_h').checked == true) {
        var hmin_s = String(document.getElementById('min_h').value);
        var hmax_s = String(document.getElementById('max_h').value);
        document.getElementById('hband').value = hmin_s + "," + hmax_s;
    }
    if (document.getElementById('check_k').checked == true) {
        var hmin_s = String(document.getElementById('min_k').value);
        var hmax_s = String(document.getElementById('max_k').value);
        document.getElementById('kband').value = hmin_s + "," + hmax_s;
    }
}
