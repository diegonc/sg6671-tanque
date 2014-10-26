function BaseTorretaDrawContext(gl, pM, mM, light) {
    this.gl = gl;
    this.pM = pM;
    this.mM = mM;
    this.light = light;
}

function BaseTorreta() {
    var prg = ShaderPrograms.SimpleIllumination.CreateProgram();
    /* Partes del objeto */
    this.torreta = new Torreta([0.161, 0.498, 0.549, 1.0]);
    this.montaje = Primitivas.cilindro(64, 10, [0.573, 0.188, 0.514, 1.0], prg);
    this.base = Primitivas.cono(64, 10, 0.5, [0.573, 0.188, 0.514, 1.0], prg);
    
    /* Parametros constructivos */
    this.alturaTorreta = 1.3;
    this.posicionMontaje = 0.5;
    this.alturaMontaje = 1;
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
    mat4.rotateY(m, this.guiniada);
    mat4.rotateX(m, -Math.PI / 2);
    mat4.scale(m, [radio, radio, this.alturaMontaje]);
    return m;
};

BaseTorreta.prototype.crearMatrizTorreta = function() {
    var m = mat4.create();
    mat4.identity(m);
    mat4.translate(m, [0, this.alturaTorreta, 0]);
    mat4.rotateY(m, this.guiniada);
    mat4.rotateX(m, this.cabeceo);
    return m;
};

BaseTorreta.prototype.draw = function(dc) {
    var gl = dc.gl;
    var m;
    var nM = mat3.create();

    m = mat4.create(dc.mM);
    mat4.multiply(m, this.matrizBase);
    mat4.toInverseMat3(m, nM);
    mat3.transpose(nM);
    this.base.draw(
            new ShaderPrograms.SimpleIllumination.DrawContext(
                    gl, dc.pM, m, nM, dc.light, true));
    
    var matrizMontaje = this.crearMatrizMontaje();
    m = mat4.create(dc.mM);

    mat4.multiply(m, matrizMontaje);
    mat4.toInverseMat3(m, nM);
    mat3.transpose(nM);
    this.montaje.draw(
            new ShaderPrograms.SimpleIllumination.DrawContext(
                    gl, dc.pM, m, nM, dc.light, true));
    
    var matrizTorreta = this.crearMatrizTorreta();
    var torretaDC = new TorretaDrawContext(gl, dc.pM);
    m = mat4.create(dc.mM);
    mat4.multiply(m, matrizTorreta);
    torretaDC.mvM = m;
    this.torreta.draw(torretaDC);
};
