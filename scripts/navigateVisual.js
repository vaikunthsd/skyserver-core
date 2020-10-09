window.onorientationchange = function () {
    viewport = document.querySelector("meta[name=viewport]");
    if (window.orientation === 90 || window.orientation === -90) {
        viewport.setAttribute('content', 'width=device-width; initial-scale=1.0; user-scalable=1');
    } else {
        viewport.setAttribute('content', 'width=device-width; initial-scale=0.75; user-scalable=0');
    }
};

function getDimensions() {
    const naviWrapper = document.getElementById("navi-wrapper");
    width = Math.ceil($(naviWrapper).width()) * 2;
    height = Math.ceil($(naviWrapper).height()) * 2;
    return { width: width, height: height };
}

function init() {
    initCanvas();
}