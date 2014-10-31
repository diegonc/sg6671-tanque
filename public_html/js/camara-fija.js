function CamaraFija(zoom) {
    this.zoom = zoom;
    this.zoomSpeed = 0.5;
    this.maxZoom = 600;
    this.minZoom = 70;
    this.activated = false;
}

CamaraFija.prototype.activate = function() {
    this.activated = true;
};

CamaraFija.prototype.deactivate = function() {
    this.activated = false;
};

CamaraFija.prototype.getMatrix = function() {
    var eye = [0, 0, this.zoom];
    var up = [0, 1, 0];
    var at = [0, 0, 0];
    return mat4.lookAt(eye, at, up);
};

CamaraFija.prototype.handleEvent = function(event) {
    if (!this.activated) {
        return true;
    }

    var e = event || window.event;
    var delta = (e.wheelDelta || -e.detail);
    var deltaZoom = this.zoomSpeed * delta;
    this.zoom = Math.max(this.minZoom,
                    Math.min(this.maxZoom, this.zoom + deltaZoom));

    if (e.stopPropagation) {
        // W3C standard variant
        event.stopPropagation();
    } else {
        // IE variant
        event.cancelBubble = true;
    }
    if (e.preventDefault) {
        e.preventDefault();
    }
    return false;
};

CamaraFija.prototype.bindEvents = function(canvas) {
    on(canvas, "mousewheel", this, true);
    on(canvas, "DOMMouseScroll", this, true);
};
