function RuedaDrawContext(gl, pM, mM, light) {
    this.gl = gl;
    this.pM = pM;
    this.mM = mM;
    this.light = light;
}

function Rueda(color) {
    var shader = ShaderPrograms.SimpleIllumination.CreateProgram();
    this.ladoIzq = Primitivas.cono(64, 10, 0.2, color, shader);
    this.centro = Primitivas.cilindro(64, 10, color, shader);
    this.ladoDer = Primitivas.cono(64, 10, 0.2, color, shader);
    
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
    var nM = mat3.create();

    mat4.set(dc.mM, mvM);
    mat4.multiply(mvM, this.matIzq);
    mat4.toInverseMat3(mvM, nM);
    mat3.transpose(nM);
    
    this.ladoIzq.draw(
            new ShaderPrograms.SimpleIllumination.DrawContext(
                    gl, dc.pM, mvM, nM, dc.light, true));

    mat4.set(dc.mM, mvM);
    mat4.multiply(mvM, this.matCen);
    mat4.toInverseMat3(mvM, nM);
    mat3.transpose(nM);
    this.centro.draw(
            new ShaderPrograms.SimpleIllumination.DrawContext(
                    gl, dc.pM, mvM, nM, dc.light, true));
    
    mat4.set(dc.mM, mvM);
    mat4.multiply(mvM, this.matDer);
    mat4.toInverseMat3(mvM, nM);
    mat3.transpose(nM);
    this.ladoDer.draw(
            new ShaderPrograms.SimpleIllumination.DrawContext(
                    gl, dc.pM, mvM, nM, dc.light, true));
};
