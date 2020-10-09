"use strict";

var ra;
var dec;
var rad;
var l;
var b;
var lb_rad;
var table_field;

$(document).ready(function () {
    ra = document.getElementById('ra');
    dec = document.getElementById('dec');
    rad = document.getElementById('rad');
    lb_rad = document.getElementById('lbRad');
    l = document.getElementById('l');
    b = document.getElementById('b');
    table_field = document.getElementById('table_name_group');
    changeQueryType('cone');
    hideTable();
});

function changeQueryType(newtype) {
    if (newtype === 'cone') {
        ra.style.display = '';
        dec.style.display = '';
        rad.style.display = '';
        lb_rad.style.display = 'none';
        l.style.display = 'none';
        b.style.display = 'none';
    } else if (newtype === 'conelb') {
        ra.style.display = 'none';
        dec.style.display = 'none';
        rad.style.display = 'none';
        lb_rad.style.display = '';
        l.style.display = '';
        b.style.display = '';
    } else {
        lb_rad.style.display = 'none';
        ra.style.display = 'none';
        dec.style.display = 'none';
        rad.style.display = 'none';
        l.style.display = 'none';
        b.style.display = 'none';
    }
}


function showTable() {
    table_field.style.display = '';
}

function hideTable() {
    table_field.style.display = 'none';
}
//# sourceMappingURL=IRspectrosearch.js.map
