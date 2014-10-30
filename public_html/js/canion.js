function CanionDrawContext(gl, pM, mvM, light) {
    this.gl = gl;
    this.pM = pM;
    this.mvM = mvM;
    this.light = light;
}

function Canion(color) {
    var prg = ShaderPrograms.SimpleIllumination.CreateProgram();
    this.caja = Primitivas.caja(4, 5, color, prg);
    this.cilindro = Primitivas.cilindro(64, 10, color, prg);
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
    var nM = mat3.create();
    
    mat4.set(dc.mvM, mvM);
    mat4.multiply(mvM, this.matCaja);
    mat4.toInverseMat3(mvM, nM);
    mat3.transpose(nM);
    var cajaDc = new ShaderPrograms.SimpleIllumination.DrawContext(
                    gl, dc.pM, mvM, nM, dc.light, true);
    this.caja.draw(cajaDc);
    
    mat4.set(dc.mvM, mvM);
    this.matCilindro = this.createCilMatrix();
    mat4.multiply(mvM, this.matCilindro);
    mat4.toInverseMat3(mvM, nM);
    mat3.transpose(nM);
    this.cilindro.draw(new ShaderPrograms.SimpleIllumination.DrawContext(
                    gl, dc.pM, mvM, nM, dc.light, true));
};
