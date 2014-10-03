function BaseTorretaDrawContext(gl, pM, mM) {
    this.gl = gl;
    this.pM = pM;
    this.mM = mM;
}

function BaseTorreta() {
    /* Partes del objeto */
    this.torreta = new Torreta();
    this.montaje = Primitivas.cilindro(64, 10);
    this.base = Primitivas.cono(64, 10, 0.5);
    
    /* Parametros constructivos */
    this.alturaTorreta = 1.3;
    this.posicionMontaje = 0.5;
    this.alturaMontaje = 1;
    this.matrizMontaje = this.crearMatrizMontaje();
    this.matrizBase = this.crearMatrizBase();
    
    /* Parametros dinámicos */
    this.cabeceo = 0;
    this.guiniada = 0;
}

BaseTorreta.prototype.initGL = function(gl) {
    this.torreta.initGL(gl);
    this.montaje.initGL(gl);
    this.base.initGL(gl);
};

BaseTorreta.prototype.crearMatrizBase = function() {
    var m = mat4.create();
    mat4.identity(m);
    mat4.rotateX(m, -Math.PI / 2);
    return m;
};

BaseTorreta.prototype.crearMatrizMontaje = function() {
    var radio = this.base.getRadioMin();
    var m = mat4.create();
    mat4.identity(m);
    mat4.translate(m, [0, this.posicionMontaje, 0]);
    mat4.rotateX(m, -Math.PI / 2);
    mat4.scale(m, [radio, radio, this.alturaMontaje]);
    return m;
};

BaseTorreta.prototype.crearMatrizTorreta = function() {
    var m = mat4.create();
    mat4.identity(m);
    mat4.translate(m, [0, this.alturaTorreta, 0]);
    mat4.rotateX(m, this.cabeceo);
    mat4.rotateY(m, this.guiniada);
    return m;
};

BaseTorreta.prototype.draw = function(dc) {
    var gl = dc.gl;
    var m;

    var baseDC = new ConoDrawContext(gl, dc.pM);
    m = mat4.create(dc.mM);
    mat4.multiply(m, this.matrizBase);
    baseDC.mM = m;
    this.base.draw(baseDC);
    
    var montajeDC = new CilindroDrawContext(gl, dc.pM);
    m = mat4.create(dc.mM);
    mat4.multiply(m, this.matrizMontaje);
    montajeDC.mM = m;
    this.montaje.draw(montajeDC);
    
    var matrizTorreta = this.crearMatrizTorreta();
    var torretaDC = new TorretaDrawContext(gl, dc.pM);
    m = mat4.create(dc.mM);
    mat4.multiply(m, matrizTorreta);
    torretaDC.mvM = m;
    this.torreta.draw(torretaDC);
};
