function CamaraFija(zoom) {
    this.zoom = zoom;
}

CamaraFija.prototype.getMatrix = function() {
    var eye = [0, 0, this.zoom];
    var up = [0, 1, 0];
    var at = [0, 0, 0];
    return mat4.lookAt(eye, at, up);
};
