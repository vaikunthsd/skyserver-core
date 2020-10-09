"use strict";

/**
* optical bands and gatactic => ra- 177, lat- 8.47, rad- 3, u,g,r,i,z
* optical bands and equatorial => ra- 93.91, dec- 34.90, rad- 3, u,g,r,i,z
* infrared bands and gatatic => ra- 177, lat- 8.47, rad- 3, r,j,h,ks
* infrared bands and equatorial => ra- 93.91, dec- 34.90, rad- 3, u,g,r,i,z
*/
var check_j;
var check_h;
var check_k;
var check_u;
var check_g;
var check_r;
var check_i;
var check_z;

var ra;
var dec;
var radius;
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
    ra = document.getElementById("min_ra");
    dec = document.getElementById("dec");
    radius = document.getElementById("radius");
    // * desc Changes search type based on user selection
    // * param string new- User selected type
    // * return void type - manipulates ra,dec labels and numbers
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
    changeSearchType('equatorial');
});

function changeSearchType(newtype) {
  if (newtype === 'galactic') {
      document.getElementById("min_ra").value = "93.87192837119196";
      document.getElementById("max_ra").value = "93.95426297902819";
      document.getElementById("min_dec").value = "34.860258371439414";
      document.getElementById("max_dec").value = "34.94602132762521";
  } else {
      document.getElementById("min_ra").value = "258.1266479093075";
      document.getElementById("max_ra").value = "258.37225794612516";
      document.getElementById("min_dec").value = "64.0403313896339";
      document.getElementById("max_dec").value = "64.05940229740509";
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
//# sourceMappingURL=rectangularsearch.js.map


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
