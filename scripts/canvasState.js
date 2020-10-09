/* CanvasState keeps track of the canvas states and contains methods related to it */
function CanvasState(canvas) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");
    // The offset by which to translate the center of the image when drawing
    this.offset = { x: 0, y: 0 }
    this.img = new Image();
    this.grid = false;
    this.listeners = false;
}

CanvasState.prototype.init = function () {
    this.setDimensions();
    const raDec = { ra: INITRA, dec: INITDEC };
    this.setLabel(new Label({ x: this.canvas.width / 2, y: this.canvas.height / 2 }, raDec));
    this.showNearest(raDec);
    this.initImage();
    initListeners(this.canvas);
}

CanvasState.prototype.setLabel = function (label) {
    this.selObjLabel = label;
}

CanvasState.prototype.updateLabelCoord = function () {
    this.selObjLabel.coord = raDec2xy(this.selObjLabel.raDec.ra, this.selObjLabel.raDec.dec, getRa(), getDec(), getScale() / 3600, { x: this.canvas.width / 2, y: this.canvas.height / 2 });
}

CanvasState.prototype.isInverted = function () {
    return document.getElementById('InvertImage').checked;
}

CanvasState.prototype.getTopLeftX = function (offsetX) {
    return this.canvas.width / 2 - this.img.naturalWidth / 2 + offsetX;
}

CanvasState.prototype.getTopLeftY = function (offsetY) {
    return this.canvas.height / 2 - this.img.naturalHeight / 2 + offsetY;
}

CanvasState.prototype.getCanvasCenter = function () {
    return {
        x: this.canvas.width / 2,
        y: this.canvas.height / 2
    };
}

/* Set the last mouse position */
CanvasState.prototype.setMouse = function (mouseCoord) {
    this.prevMouse = mouseCoord;
}

/* Get the current mouse position */
CanvasState.prototype.getMouse = function (e) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
}

/* Move the image so that the selected point is centered on the canvas */
CanvasState.prototype.centerAround = function (point) {
    const newImage = this.translate(this.canvas.width / 2 - point.x, this.canvas.height / 2 - point.y);
    if (newImage) {
        // if we went out of bounds and fetched a new image, the ra dec used for selected object was wrong
        // and we need to show nearest based off of the new ra dec
        canvasState.showNearest({ ra: getRa(), dec: getDec() });
    }
}

/* Ensure that the display size and the dimension of pixels in the canvas is 1:1 */
CanvasState.prototype.setDimensions = function () {
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;

    if (this.canvas.width !== width || this.canvas.height !== height) {
        this.canvas.width = width;
        this.canvas.height = height;
        return true;
    }
    return false;
}

/* Draw a new canvas image */
CanvasState.prototype.initImage = function () {
    let that = this;
    this.img.onload = function () {
        that.redrawImage();
    };
    this.img.src = document.getElementById("chart-image").src;
}

/* Redraw the canvas image, as well as label, grid and ruler if selected */
CanvasState.prototype.redrawImage = function () {
    // Reset the canvas, this clears the old label
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(this.img, this.getTopLeftX(this.offset.x), this.getTopLeftY(this.offset.y));
    this.drawSelObjLabel();
    this.drawLabel();
    this.drawGrid();
}

/* Draw label for selected object. Note that this function does not clear old label(s) from the canvas */
CanvasState.prototype.drawSelObjLabel = function () {
    if (this.selObjLabel != null && this.pointInBounds(this.selObjLabel.coord)) {
        const numDecimal = 5;
        this.ctx.beginPath();
        this.ctx.lineWidth = 1;
        const inverted = this.isInverted();
        if (inverted) {
            this.ctx.strokeStyle = "#330000";
        } else {
            this.ctx.strokeStyle = "#33FF00";
        }
        this.ctx.strokeRect(this.selObjLabel.coord.x - 7, this.selObjLabel.coord.y - 7, 12, 12);
        this.ctx.stroke();
        this.drawText(`[${parseFloat(this.selObjLabel.raDec.ra).toFixed(numDecimal)},${parseFloat(this.selObjLabel.raDec.dec).toFixed(numDecimal)}]`, this.selObjLabel.coord.x + 10, this.selObjLabel.coord.y - 5);
        this.ctx.closePath();
    }
}

CanvasState.prototype.drawText = function (text, x, y) {
    this.ctx.font = "12px Arial";
    const inverted = this.isInverted();
    if (inverted) {
        this.ctx.fillStyle = "#330000";
    } else {
        this.ctx.fillStyle = "#FFFF99";
    }
    this.ctx.fillText(text, x, y);
}

CanvasState.prototype.drawLabel = function () {
    if (this.label) {
        const scale = getScale();
        let zoom = 0;
        const ppd = 3600.0 / scale;
        let imageScale = ppd / 9089;
        const max_zoom = 4;
        while (zoom < max_zoom && imageScale <= .5) {
            zoom++; 										// go higher in the pyramid
            imageScale *= 2;
        }

        let zoomRatio = "";
        if (zoom >= 1) {
            let t1 = Math.round((Math.pow(4, zoom)));
            zoomRatio = "1:" + t1;
        } else {
            let t2 = Math.round(Math.pow(imageScale, 2.0)) + .5;
            zoomRatio = "" + t2 + ":1";
        }
        const version = 'DR16';
        let x = this.canvas.width - 160
        let y = 20;
        if (this.grid) {
            y += 15;
            x -= 15;
        }
        const lineHeight = 18;
        const numDecimal = 5;
        this.drawText(`SDSS ${version}`, x, y);
        y += lineHeight;
        this.drawText(`Ra:${parseFloat(getRa()).toFixed(numDecimal)} Dec:${parseFloat(getDec()).toFixed(numDecimal)}`, x, y);
        y += lineHeight;
        this.drawText(`Scale:${parseFloat(scale).toFixed(numDecimal)} arcsec/pix`, x, y);
        y += lineHeight;
        this.drawText(`image zoom: ${zoomRatio}`, x, y);
    }
};

CanvasState.prototype.toggleGrid = function () {
    this.grid = !this.grid;
    this.redrawImage();
}

CanvasState.prototype.toggleLabel = function () {
    this.label = !this.label;
    this.redrawImage();
}

CanvasState.prototype.drawRuler = function () {
    const inverted = this.isInverted();
    const scale = getScale();
    const cFudge = 15;
    const center = this.getCanvasCenter();
    const ppd = 3600.0 / scale;
    const ppm = ppd / 60.00;
    const ruler = [["0.5''", 1.0 / 120.0], ["1''", 1.0 / 60.0], ["2''", 2.0 / 60.0], ["5''", 5.0 / 60.0],
    ["10''", 1.0 / 6.0], ["20''", 2.0 / 6.0], ["1'", 1.0], ["2'", 2.0], ["5'", 5.0], ["10'", 10.0],
    ["20'", 20.0], ["30'", 30.0], ["1deg", 60.0], ["1.5deg", 90.0], ["2deg", 120.0]];

    let ticks = 10;
    let i;
    const maxDim = Math.max(this.canvas.height, this.canvas.width);
    for (i = 0; i < ruler.length; i++) {
        ticks = Math.floor(maxDim / (ruler[i][1] * ppm));
        if ((ticks >= 4) && (ticks < 12)) {
            break;
        }
    }

    if (i === ruler.length) {
        i--;
    }

    let tickSize = ruler[i][1] * ppm;

    this.ctx.beginPath();

    let pos = 0;
    for (i = -ticks; i <= ticks; i++) {
        pos = Math.floor(i * tickSize);
        this.ctx.moveTo(0, center.y + pos);
        this.ctx.lineTo(cFudge, center.y + pos);

        this.ctx.moveTo(this.canvas.width, center.y + pos);
        this.ctx.lineTo(this.canvas.width - cFudge, center.y + pos);

        this.ctx.moveTo(center.x + pos, 0);
        this.ctx.lineTo(center.x + pos, cFudge);

        this.ctx.moveTo(center.x + pos, this.canvas.height);
        this.ctx.lineTo(center.x + pos, this.canvas.height - cFudge);
    }
    if (inverted) {
        this.ctx.strokeStyle = "#330000";
    } else {
        this.ctx.strokeStyle = "#33FF00";
    }
    this.ctx.lineWidth = 0.9;
    this.ctx.stroke();
    this.ctx.closePath();

    let xLabel = this.canvas.width - 30 - Math.floor(tickSize);
    let yLabel = this.canvas.height - 85;
    const x1 = xLabel;
    const x2 = xLabel + Math.floor(tickSize);
    const len = 4;
    const yy = yLabel + 10;

    this.ctx.beginPath();
    this.ctx.moveTo(x1, yy);
    this.ctx.lineTo(x2, yy);

    this.ctx.moveTo(x1, yy - len);
    this.ctx.lineTo(x1, yy + len);
    this.ctx.moveTo(x2, yy - len);
    this.ctx.lineTo(x2, yy + len);

    if (inverted) {
        this.ctx.strokeStyle = "#330000";
    } else {
        this.ctx.strokeStyle = "#33FF00";
    }
    this.ctx.lineWidth = 0.9;
    this.ctx.stroke();
    this.ctx.closePath();

    xLabel += (0.5 * tickSize) - cFudge;

    this.ctx.font = "12px Arial";
    if (inverted) {
        this.ctx.fillStyle = "#330000";
    } else {
        this.ctx.fillStyle = "#FFFF99";
    }
    this.ctx.fillText(ruler[i][0], xLabel, yLabel);
}

CanvasState.prototype.drawGrid = function () {
    if (this.grid) {
        const inverted = this.isInverted();
        const center = this.getCanvasCenter();
        const inner = 0.05 * Math.min(this.canvas.width, this.canvas.height);
        const outer = 0.125;
        this.ctx.beginPath();
        this.ctx.moveTo(center.x, center.y - inner);
        this.ctx.lineTo(center.x, this.canvas.height * outer);
        this.ctx.moveTo(center.x, center.y + inner);
        this.ctx.lineTo(center.x, this.canvas.height * (1.0 - outer));
        this.ctx.moveTo(center.x - inner, center.y);
        this.ctx.lineTo(this.canvas.width * outer, center.y);
        this.ctx.moveTo(center.x + inner, center.y);
        this.ctx.lineTo(this.canvas.width * (1.0 - outer), center.y);
        if (inverted) {
            this.ctx.strokeStyle = "#330000";
        } else {
            this.ctx.strokeStyle = "#33FF00";
        }
        this.ctx.lineWidth = 0.9;
        this.ctx.stroke();
        this.ctx.closePath();
        this.drawRuler();
    }
};

/* Checks whether the point is in bounds of the canvas */
CanvasState.prototype.pointInBounds = function (coord) {
    if (coord.x < 0 || coord.x > this.canvas.width || coord.y < 0 || coord.y > this.canvas.height) {
        return false;
    }
    return true;
}

/* Checks whether the canvas image is in bounds of the canvas */
CanvasState.prototype.imgInBounds = function (newOffsetX, newOffsetY) {

    // too far right
    const topLeftX = this.getTopLeftX(newOffsetX);
    if (topLeftX > 0) {
        return false;
    }

    // too far down
    const topLeftY = this.getTopLeftY(newOffsetY);
    if (topLeftY > 0) {
        return false;
    }

    // too far left
    const topRightX = this.img.naturalWidth + topLeftX;
    if (topRightX < this.canvas.width) {
        return false;
    }

    // too far up
    const topRightY = this.img.naturalHeight + topLeftY;
    if (topRightY < this.canvas.height) {
        return false;
    }

    return true;
}

/* Translates the image by the given x and y difference */
CanvasState.prototype.translate = function (xDiff, yDiff) {
    const newOffsetX = this.offset.x + xDiff;
    const newOffsetY = this.offset.y + yDiff;
    const newCenter = {
        x: this.canvas.width / 2 - newOffsetX,
        y: this.canvas.height / 2 - newOffsetY
    };
    this.updateRaDec(newCenter);
    if (this.selObjLabel != null) {
        this.selObjLabel.coord.x += xDiff;
        this.selObjLabel.coord.y += yDiff;
    }
    if (this.imgInBounds(newOffsetX, newOffsetY)) {
        this.offset.x += xDiff;
        this.offset.y += yDiff;
        this.redrawImage();
        return false;
    } else {
        this.mouseDown = false;
        this.isDragging = false;
        this.offset.x = 0;
        this.offset.y = 0;
        getImage();
        return true;
    }
}

/* Update the ra dec values based on the new center of the image */
CanvasState.prototype.updateRaDec = function (newCenter) {
    const raDec = xy2RaDec(newCenter, getRa(), getDec(), getScale() / 3600, { x: this.canvas.width / 2 - this.offset.x, y: this.canvas.height / 2 - this.offset.y });
    const newRa = raDec.ra;
    const newDec = raDec.dec;
    document.getElementById("ra").value = newRa;
    document.getElementById("dec").value = newDec;
}

/* Shows the nearest object to the ra dec values */
CanvasState.prototype.showNearest = function (raDec) {
    console.log("raDec: " + raDec);
    const closeUpImg = document.getElementById("near");
    const selectedobj = `ra=${raDec.ra}&dec=${raDec.dec}&scale=${(0.25 * getScale())}&radius=0.2`;
    console.log("selectedobj:" + selectedobj);
    closeUpImg.src = NEARESTURL + selectedobj;
    //TODO PUT REAL ENDPOINTS IN WHEN READY
    let infoURL = "http://skyserver.sdss.org/dr15/SkyServerWS/SearchTools/MetadataSearch?query=nearestobj&" + selectedobj;
    let fillPromise = $.getJSON(infoURL, fillTable);
    function fillTable(data) {
        const info = data[0].Rows[0];
        $.each(info, function (key, val) {
            key += "Near"
            const cell = document.getElementById(key);
            if (cell) {
                cell.innerHTML = val;
            }
        });
    }
    $.when(fillPromise).done(
        function getSpecObjId(data) {
            const objId = data[0].Rows[0]['objId'];
            console.log("objId: " + objId)
            const specUrl = "http://skyserver.sdss.org/dr16/SkyServerWS/SearchTools/MetadataSearch?query=nearestspecobjid&objid=" + objId;
            console.log("specUrl: " + specUrl)
            $.getJSON(specUrl, function (data) {
                const specObjId = data[0].Rows[0]['specObjId'];
                document.getElementById("SpecObjId").value = specObjId;
                if (specObjId) {
                    const url = "http://skyserver.sdss.org/dr16/SkyServerWS/SearchTools/ObjectSearch?spec=" + specObjId + "&query=SpecById&TaskName=Skyserver.SpecById";
                    $.getJSON(url, function (data) {
                        debugger;
                        const img = data[0].Rows[0]["img"];
                        let img_base64_val = hexToBase64(img.replace("0x", ""));
                        const specImgSrc = "data:image/png;base64, " + img_base64_val;
                        document.getElementById("spec").src = specImgSrc;
                        document.getElementById("spec").style.display = "block";
                        document.getElementById("spec").onclick = function () {
                            console.log("clicked");
                            document.getElementById("specModal").src = specImgSrc;
                            $('#imgModal').show();
                        }
                    });
                } else {
                    document.getElementById("spec").style.display = "none";
                }
            });
        }
    );
};

function hexToBase64(str) {
    var bString = "";
    for (var i = 0; i < str.length; i += 2) {
        bString += String.fromCharCode(parseInt(str.substr(i, 2), 16));
    }
    return btoa(bString);
}