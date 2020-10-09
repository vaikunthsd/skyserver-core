// max image width 2048 - min padding + side bar (250)
let width = 1998;
// max image height 2048 - min navbar space (144)
let height = 1904;

var slider = document.getElementById("myRange");

function initParams(def) {
    if (def === "0") {	// the opt came from the caller, set the checkboxes
        setoptstr(0);
    }
    slider.value = INITSCALE;
    document.getElementById('ra').value = INITRA;
    document.getElementById('dec').value = INITDEC;
    document.getElementById('scale').value = INITSCALE;
    setDimensions();
}

function setDimensions() {
    let dim = getDimensions();
    width = dim.width;
    height = dim.height;
}

function adjustButtons() {
    if ((!buttonsShifted) && document.getElementById("Label").checked) {
        document.getElementById("controls").style.bottom = '-60px';
        buttonsShifted = true;
    } else if (buttonsShifted && !document.getElementById("Label").checked) {
        document.getElementById("controls").style.bottom = '0px';
        buttonsShifted = false;
    }
}

function qstring() {
    setDimensions();
    let s = `?ra=${getRa()}&dec=${getDec()}`;
    s += `&scale=${getScale()}&width=${width}`;
    s += `&height=${height}&opt=${document.getElementById("opt").value}`;
    return s;
}

function appendToImageUrl() {
    setDimensions();
    return IMAGEJPEGURL + qstring();
}

function getImage() {
    document.getElementById('chart-image').src = appendToImageUrl();
    document.getElementById('spinner').style.display = 'block';
}

$(window).resize(function () {
    getImage();
});

$(document).ready(function () {
    initParams('0');
    init();
    getImage();
});

/* redraws the canvas image when the image src is changed */
$("img.chart-image").on('load', function () {
    document.getElementById('spinner').style.display = 'none';
});

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function () {
    setZoombar(this.value);
}