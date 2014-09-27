function CanionDrawContext(gl, pM, mvM) {
    this.gl = gl;
    this.pM = pM;
    this.mvM = mvM;
}

function Canion() {
    this.caja = new Caja(4, 5);
    this.cilindro = new Cilindro(64, 10);
    this.cilPos = 3;

    this.matCaja = this.createCajaMatrix();    
    this.matCilindro = this.createCilMatrix();
}

Canion.prototype.createCajaMatrix = function() {
    var m = mat4.create();
    mat4.identity(m);
    mat4.scale(m, [1, 1, 4]);
    return m;
};

Canion.prototype.createCilMatrix = function() {
    var m = mat4.create();
    mat4.identity(m);
    mat4.translate(m, [0.5, 0.5, this.cilPos]);
    mat4.scale(m, [0.35, 0.35, 2]);
    return m;
};

Canion.prototype.initGL = function (gl) {
    this.caja.initGL(gl);
    this.cilindro.initGL(gl);
};

Canion.prototype.draw = function(dc) {
    var mvM = mat4.create();
    var gl = dc.gl;
    
    mat4.set(dc.mvM, mvM);
    mat4.multiply(mvM, this.matCaja);
    this.caja.draw(new CajaDrawContext(gl, dc.pM, mvM));
    
    mat4.set(dc.mvM, mvM);
    this.matCilindro = this.createCilMatrix();
    mat4.multiply(mvM, this.matCilindro);
    this.cilindro.draw(new CilindroDrawContext(gl, dc.pM, mvM));
};

Canion.prototype.update = function(frameNum) {
    
};
