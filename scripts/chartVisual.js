let buttonsShifted = false;

function getDimensions() {
    const chartWrapper = document.getElementById("chart-wrapper");
    width = Math.ceil($(chartWrapper).width());
    height = Math.ceil($(chartWrapper).height());
    return { width: width, height: height };
}

function popup() {
    let s = PRINTCHARTURL + qstring() + "&opt=GI";
    let w = window.open(s, "_blank", "width=700,height=840,resizable=yes,scrollbars=auto,menubar=yes");
    w.focus();
}

/* finding chart specific initialization, empty for now but need for
 * compatibilty with sharedVisual.js
 * */
function init() {}