//////////////////////////////////////////////////////////////////////
//
// Coord(): Client-side coordinate conversion class
//
// written by Alex Szalay, 07/07/2001
//------------------------------------------------------------------
// all angular coordinates are stored in degrees
// the conversion factor is saved as a class variable
//
//////////////////////////////////////////////////////////////////////


function Coord(ra_, dec_, scale_, size_) {
    this.scale = (scale_ / 3600.0); // degrees /pixel
    this.xoff = (size_ / 2) + 0.5;
    this.yoff = (size_ / 2) + 0.5;
    this.raCen = ra_;
    this.decCen = dec_;
    this.ra = ra_;
    this.dec = dec_;
    this.D2R = Math.PI / 180.0;
    this.x = this.xoff;
    this.y = this.yoff;
}

Coord.prototype.screenToEq = function (x_, y_) {
    this.dec = this.decCen - (y_ - this.yoff) * this.scale;
    this.ra = this.raCen - (x_ - this.xoff) * this.scale / Math.cos(this.dec * this.D2R);
    if (this.ra > 360) this.ra -= 360;
    if (this.ra < 0) this.ra += 360;
}

///////////////////////////////////////////////////////////////