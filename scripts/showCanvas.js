let canvasState;

function raDec2xy(newRa, newDec, prevRa, prevDec, scale, center) {
    const deg2rad = Math.PI / 180.0;
    const tp = raDec2ThetaPhi(newRa, newDec, prevRa, prevDec);
    const theta = tp.theta;
    const phi = tp.phi;
    const rtheta = 1. / Math.tan(theta) / deg2rad;

    const x = rtheta * Math.sin(phi);
    const y = -rtheta * Math.cos(phi);

    const xPix = -x / scale + center.x;
    const yPix = -y / scale + center.y;
    return { x: xPix, y: yPix };
}

function raDec2ThetaPhi(newRa, newDec, prevRa, prevDec) {
    // convert angles to radians
    const deg2rad = Math.PI / 180.0;
    const alpha = newRa * deg2rad;
    const delta = newDec * deg2rad;

    const prevAlpha = prevRa * deg2rad;
    const deltaPrev = prevDec * deg2rad;

    const prevPhi = 180.0 * deg2rad;

    const cd = Math.cos(delta);
    const sd = Math.sin(delta);
    const cdp = Math.cos(deltaPrev);
    const sdp = Math.sin(deltaPrev);

    const phi = prevPhi + Math.atan2((-cd * Math.sin(alpha - prevAlpha)), (sd * cdp - cd * sdp * Math.cos(alpha - prevAlpha)));
    const theta = Math.asin(sd * sdp + cd * cdp * Math.cos(alpha - prevAlpha));
    return {
        theta: theta,
        phi: phi
    };
}

/* Convert xy coordinates to ra dec */
function xy2RaDec(newCenter, prevRa, prevDec, scale, prevCenter) {
    // convert angles to radians
    const deg2rad = Math.PI / 180.0;
    const prevAlpha = prevRa * deg2rad;
    const prevDelta = prevDec * deg2rad;
    // get theta, phi
    const tp = xy2ThetaPhi(newCenter, prevCenter, scale);
    const theta = tp.theta;
    const phi = tp.phi;
    const prevPhi = 180. * deg2rad;

    const st = Math.sin(theta);
    const ct = Math.cos(theta);
    const cdp = Math.cos(prevDelta);
    const sdp = Math.sin(prevDelta);

    const newRa = prevAlpha + Math.atan2(-ct * Math.sin(phi - prevPhi), st * cdp - ct * sdp * Math.cos(phi - prevPhi));
    const newDec = Math.asin(st * sdp + ct * cdp * Math.cos(phi - prevPhi));

    return {
        ra: newRa / deg2rad,
        dec: newDec / deg2rad
    };
}

/* Gets theta, phi values */
function xy2ThetaPhi(newCenter, prevCenter, scale) {
    const xTest = -scale * (newCenter.x - prevCenter.x);
    const yTest = -scale * (newCenter.y - prevCenter.y);
    const r = Math.sqrt(xTest * xTest + yTest * yTest);
    let theta = 0;
    if (r !== 0.) {
        theta = Math.atan(180 / (Math.PI * r));
    } else {
        theta = Math.PI / 2;
    }
    const phi = Math.atan2(xTest, -yTest);
    return {
        theta: theta,
        phi: phi
    };
}

function initCanvas() {
    /* CanvasState is a singleton */
    if (typeof (canvasState) == 'undefined') {
        canvasState = new CanvasState(document.getElementById('canvas'));
        canvasState.init();
    }
}

/* Moves the center of the image in the given direction by 128 */
function stepCenter(dir) {
    let xDiff = 0;
    let yDiff = 0;
    let step = 128;
    switch (dir) {
        case 'N': yDiff = step; break;
        case 'W': xDiff = -step; break;
        case 'E': xDiff = step; break;
        case 'S': yDiff = -step; break;
    }
    canvasState.translate(xDiff, yDiff);
}

function isTouchDevice() {
    return 'ontouchstart' in window // works on most browsers 
        || 'onmsgesturechange' in window; // works on ie10
};

function initListeners(canvas) {
    if (!canvasState.listeners) {
        // fixes a problem where double clicking causes text to get selected on the canvas
        canvas.addEventListener('selectstart', function (e) { e.preventDefault(); return false; }, false);
        if (isTouchDevice()) {
            Hammer(canvas, { pre_default: true }).on('touch', function (e) { OnMouseDown(e); });
            Hammer(canvas, { pre_default: true }).on('drag', function (e) { OnMouseMove(e); });
            Hammer(canvas, { pre_default: true }).on('release', function (e) { OnMouseUp(e); });
            Hammer(canvas, { pre_default: true }).on('doubletap', function (e) { OnMouseDblClk(e); });
        } else {
            canvas.addEventListener('mousedown', function (e) { OnMouseDown(e); }, true);
            canvas.addEventListener('mousemove', function (e) { OnMouseMove(e); }, true);
            canvas.addEventListener('mouseup', function (e) { OnMouseUp(e); }, true);
            canvas.addEventListener('mouseout', function (e) { OnMouseOut(e); }, true);
            canvas.addEventListener('dblclick', function (e) { OnMouseDblClk(e); }, true);
            window.addEventListener('keyup', function (e) { OnKeyUp(e); }, true);
        }
        canvasState.listeners = true;
    }
}

function OnKeyUp(e) {
    const arrow = { east: 37, north: 38, west: 39, south: 40 };
    const zoom = { in: 189, out: 187 };

    switch (e.keyCode) {
        case arrow.east:
            stepCenter('E');
            break;
        case arrow.north:
            stepCenter('N');
            break;
        case arrow.west:
            stepCenter('W');
            break;
        case arrow.south:
            stepCenter('S');
            break;
        case zoom.in:
            stepZoom(1.1);
            updateLabelCoord();
            break;
        case zoom.out:
            stepZoom(0.9);
            updateLabelCoord();
            break;
    }
    e.preventDefault();
}

function OnMouseDown(e) {
    e.stopPropagation();
    canvasState.setMouse(canvasState.getMouse(e));
    canvasState.mouseDown = true;
    $(canvasState.canvas).css('cursor', 'grabbing');
}

function OnMouseUp(e) {
    e.stopPropagation();
    const mouse = canvasState.getMouse(e);
    canvasState.setMouse(mouse);
    canvasState.mouseDown = false;
    if (!canvasState.isDragging) {
        // Show the object nearest to the mouse click *unless* the user was dragging the image
        const raDec = xy2RaDec(mouse, getRa(), getDec(), getScale() / 3600, canvasState.getCanvasCenter());
        canvasState.showNearest(raDec);
        canvasState.setLabel(new Label(mouse, raDec));
        canvasState.redrawImage();
    }
    canvasState.isDragging = false;
    $(canvasState.canvas).css('cursor', 'grab');
}

function OnMouseMove(e) {
    e.stopPropagation();
    if (canvasState.mouseDown) {
        const mouse = canvasState.getMouse(e);
        canvasState.translate(mouse.x - canvasState.prevMouse.x, mouse.y - canvasState.prevMouse.y);
        canvasState.setMouse(mouse);
        canvasState.isDragging = true;
    }
}

function OnMouseOut() {
    // Stop dragging if the user moves the mouse off the screen
    canvasState.isDragging = canvasState.mouseDown = false;
}

function OnMouseDblClk(e) {
    e.stopPropagation();
    canvasState.centerAround(canvasState.getMouse(e));
}

function Label(coord, raDec) {
    this.coord = coord;
    this.raDec = raDec;
}

function toggleGrid() {
    canvasState.toggleGrid();
}

function toggleLabel() {
    canvasState.toggleLabel();
}

function updateLabelCoord() {
    canvasState.updateLabelCoord();
}

function reCenter() {
    canvasState.centerAround(canvasState.selObjLabel.coord);
}

/* redraws the canvas image when the image src is changed */
$("img.chart-image").on('load', function () {
    canvasState.img.src = document.getElementById("chart-image").src;
});

/* resets the canvas dimensions when the window is resized */
$(window).resize(function () {
    canvasState.setDimensions();
    canvasState.updateLabelCoord();
});