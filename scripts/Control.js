//------------------------------------
// Control.js
// client side javascript to manage the cutout controls
// Alex Szalay, 2003-03-10
// Modified by Deoyani Nandrekar-Heinis 2012-10-10
//------------------------------------

//----------------------------------
// set the scale value directly
//----------------------------------
function setScale(p) {
    if (p === 0) p = parseFloat(getScale());
    if (isNaN(p)) p = 0.396127;
    setZoombar(p);
}

function getScale() {
    return document.getElementById("scale").value;
}

//----------------------------------
// adjust the zoom value up or down
//----------------------------------
function stepZoom(factor) {
    var p = parseFloat(getScale());
    if (isNaN(p)) p = 0.396127;
    p *= factor;
    setZoombar(p);
}
//----------------------------------
// set the zoom value
//----------------------------------
function setZoom(zm) {
    setZoombar(0.396127 / Math.pow(2, zm));
}

//----------------------------------
// set the scale value and the zoombar image
//----------------------------------
function setZoombar(p) {
    if (p < 0.015) p = 0.015;
    if (p > 60) p = 60;
    document.getElementById('scale').value = p;
    const limitedDrawing = document.getElementsByClassName("limitedDrawing");
    const limitedDrawingAlert = document.getElementById('limitedDrawingAlert');
    if (p > 10) {
        limitedDrawingAlert.style.display = 'block';
        setTimeout(function () {
            $(limitedDrawingAlert).fadeOut('fast');
        }, 1500); // <-- time in milliseconds
        for (const element of limitedDrawing) {
            element.disabled = true;
            element.checked = false;
        }
    } else {
        limitedDrawingAlert.style.display = 'none';
        for (const element of limitedDrawing) {
            element.disabled = false;
        }
    }
    resubmit();
}

//----------------------------------
// This is to toggle between twomass and sdss Image data
//----------------------------------
function setImageSource(c) {

    var o = document.getElementById('opt').value;
    if (c === 'Z') {
        o = 'OG';
        document.getElementById('twomass').checked = false;
    }
    else if (c === 'X') {
        o = 'OGX';
        document.getElementById('sdss').checked = false;
    }
    document.getElementById('opt').value = o;

    return resubmit();
}

//----------------------------------
// set the option string value
//----------------------------------
function setopt(t, c) {
    var o = document.getElementById('opt').value;
    if (o.indexOf('X') !== -1 && (c === 'O' || c === 'B' || c === 'F' || c === 'M' || c === 'Q')) {

    } else {
        var r = new RegExp(c);
        if (t.checked && o.indexOf(c) === -1) o += c;
        if (!t.checked) {
            var n = o.indexOf(c);
            if (n > -1) o = o.substring(0, n) + o.substring(n + 1);
        }
        document.getElementById('opt').value = o;

        return resubmit();
    }
}

//----------------------------------
// set the option checkboxes
//----------------------------------
function setoptstr(flag) {
    var v = String(document.getElementById('opt').value).toUpperCase();

    var p = ["G", "L", "P", "S", "O", "B", "F", "M", "Q", "I", "A", "X"];
    var f = ["Grid", "Label", "PhotoObjs", "SpecObjs", "Outline",
        "BoundingBox", "Fields", "Masks", "Plates", "InvertImage", "APOGEE", "2MASS Images"];

    var o = "";
    for (var i = 0; i < p.length; i++) {
        var state = v.indexOf(p[i]) > -1;
        if (state) o += p[i];
        if (document.getElementById(f[i]) !== null) {
            document.getElementById(f[i]).checked = state;
        }
    }

    document.getElementById('opt').value = o;

    if (flag === 1) {
        return resubmit();
    } else {
        return false;
    }

}

function hms2deg(s, c) {
    var numargs = arguments.length;
    if (numargs < 2)
        c = ':';
    // strip leading blanks or plus signs first
    while (s.length > 0 && (s.substring(0, 1) === ' ' || s.substring(0, 1) === '+'))
        s = s.substring(1);
    var a = s.split(c);
    return 15 * a[0] + a[1] / 4.0 + a[2] / 240.0;
}

function dms2deg(s, c) {
    var numargs = arguments.length;
    if (numargs < 2)
        c = ':';
    // strip leading blanks or plus signs first
    while (s.length > 0 && (s.substring(0, 1) === ' ' || s.substring(0, 1) === '+'))
        s = s.substring(1);
    var a = s.split(c);
    if (s.indexOf("-") === 0)
        return -(-1.0 * a[0] + a[1] / 60.0 + a[2] / 3600.0);
    else
        return 1.0 * a[0] + a[1] / 60.0 + a[2] / 3600.0;
}

//------------------------------------
// set and validate the ra value
//------------------------------------
function setRa() {
    var s_ra = String(document.getElementById('ra').value);
    var v;
    if (s_ra.lastIndexOf(":") > -1) {
        v = fmt(hms2deg(s_ra, ':'), 10, 5);
    } else {
        if (s_ra.search(/\d \d/) > -1) {
            v = fmt(hms2deg(s_ra, ' '), 10, 5);
        } else {
            v = parseFloat(s_ra);
            if (isNaN(v)) v = 180.0;
            v = v % 360;
            if (v < 0) v += 360;
        }
    }
    document.getElementById('ra').value = v;
    return false;
}

//------------------------------------
// set and validate the dec value
//------------------------------------
function setDec() {
    var s_dec = String(document.getElementById('dec').value);
    var v;
    if (s_dec.lastIndexOf(":") > -1) {
        v = fmt(dms2deg(s_dec, ':'), 10, 5);
    } else {
        if (s_dec.search(/\d \d/) > -1) {
            v = fmt(dms2deg(s_dec, ' '), 10, 5);
        } else {
            v = parseFloat(s_dec);
            if (isNaN(v)) v = 0.0;
            var OldRa = parseFloat(document.getElementById('ra').value);
            if (v < -90 || v > 90) {
                v = v % 360;					// brings dec within the circle
                if (v < 0) {
                    v = v + 360;     // only allows positive dec values
                }
                if (v > 90 & v < 270) { // if dec is at the other side of the poles
                    document.getElementById('ra').value = (OldRa + 180) % 360; // go 1/2 way around the globe
                    v = 180 - v;
                }
                if (v >= 270) { // if dec is at this side from the south pole
                    v = v - 360;
                }
            }
        }
    }
    document.getElementById('dec').value = v;
    return false;
}

function getRa() {
    return document.getElementById("ra").value;
}

function getDec() {
    return document.getElementById("dec").value;
}

//--------------------------------------
// validate all parameters
//--------------------------------------
function validate() {
    if (document.ra) setRa();
    if (document.dec) setDec();
}

//--------------------------------------
// submit the form
//--------------------------------------
function resubmit() {
    debugger;
    validate();
    getImage();
    return false;
}

function fmt(num, total, digits) {
    var n = num;
    if (n === 0) return n;
    var exp = Math.floor(Math.log(Math.abs(n)) / Math.LN10);
    var scale = Math.pow(10.0, digits);
    if (total > 0)
        scale = Math.pow(10.0, Math.min(digits, total - exp - 1));
    return Math.floor(scale * n + 0.5) / scale;
}
