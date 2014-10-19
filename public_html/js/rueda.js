function RuedaDrawContext(gl, pM, mM) {
    this.gl = gl;
    this.pM = pM;
    this.mM = mM;
}

function Rueda(color) {
    this.ladoIzq = Primitivas.cono(64, 10, 0.2, color);
    this.centro = Primitivas.cilindro(64, 10, color);
    this.ladoDer = Primitivas.cono(64, 10, 0.2, color);
    
    function crearMatIzq() {
        var m = mat4.create();
        mat4.identity(m);
        mat4.translate(m, [0, 0, -0.3]);
        mat4.rotateY(m, Math.PI);
        return m;
    }
    
    function crearMatCentro() {
        var m = mat4.create();
        mat4.identity(m);
        mat4.translate(m, [0, 0, -0.3]);
        mat4.scale(m, [1, 1, 0.6]);
        return m;
    }
    
    function crearMatDer() {
        var m = mat4.create();
        mat4.identity(m);
        mat4.translate(m, [0, 0, 0.3]);
        return m;
    }

    this.matIzq = crearMatIzq();
    this.matCen = crearMatCentro();
    this.matDer = crearMatDer();
}

Rueda.prototype.initGL = function(gl) {
    this.ladoIzq.initGL(gl);
    this.centro.initGL(gl);
    this.ladoDer.initGL(gl);
};

Rueda.prototype.draw = function(dc) {
    var gl = dc.gl;
    var pM = dc.pM;
    var mvM = mat4.create();
    
    mat4.set(dc.mM, mvM);
    mat4.multiply(mvM, this.matIzq);
    this.ladoIzq.draw(new ConoDrawContext(gl, pM, mvM));
    
    mat4.set(dc.mM, mvM);
    mat4.multiply(mvM, this.matCen);
    this.centro.draw(new CilindroDrawContext(gl, pM, mvM));
    
    mat4.set(dc.mM, mvM);
    mat4.multiply(mvM, this.matDer);
    this.ladoDer.draw(new ConoDrawContext(gl, pM, mvM));
};
