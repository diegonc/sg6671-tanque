function TorretaDrawContext(gl, pM, mvM, light) {
    this.gl = gl;
    this.pM = pM;
    this.mvM = mvM;
    this.light = light;
}

function Torreta(color) {
    var prg = ShaderPrograms.SimpleIllumination.CreateProgram();
    this.caniones = [
        new Canion(color),
        new Canion(color),
        new Canion(color),
        new Canion(color)
    ];
    this.eje = Primitivas.cilindro(64, 10, color, prg);
    this.laterales = [
        Primitivas.caja(4, 5, color, prg),
        Primitivas.caja(4, 5, color, prg)
    ];
    
    this.canionTamX = 0.25;
    this.canionTamY = 0.25;
    this.canionTamZ = 1;
    this.despX = 0.70;
    this.despY = 0.2;
    this.zdesp = -this.canionTamZ / 2;
    this.matricesCaniones = this.crearMatricesCaniones();
    this.matrizEje = this.crearMatrizEje();
    this.matricesLaterales = this.crearMatricesLaterales();
}

Torreta.prototype.crearMatricesCaniones = function() {
    var am = [];
    var m;
    var despX = this.despX;
    var despY = this.despY;
    var sx = this.canionTamX / 1;
    var sy = this.canionTamY / 1;
    var sz = this.canionTamZ / 4;    

    m = mat4.create();
    mat4.identity(m);
    mat4.translate(m, [-despX - this.canionTamX / 2,
                        despY - this.canionTamY / 2, this.zdesp]);
    mat4.scale(m, [sx, sy, sz]);
    am.push(m);
    
    m = mat4.create();
    mat4.identity(m);
    mat4.translate(m, [-despX - this.canionTamX / 2,
                       -despY - this.canionTamY / 2, this.zdesp]);
    mat4.scale(m, [sx, sy, sz]);
    am.push(m);
    
    m = mat4.create();
    mat4.identity(m);
    mat4.translate(m, [despX - this.canionTamX / 2,
                       despY - this.canionTamY / 2, this.zdesp]);
    mat4.scale(m, [sx, sy, sz]);
    am.push(m);
    
    m = mat4.create();
    mat4.identity(m);
    mat4.translate(m, [despX - this.canionTamX / 2,
                       -despY - this.canionTamY / 2, this.zdesp]);
    mat4.scale(m, [sx, sy, sz]);
    am.push(m);

    return am;
};

Torreta.prototype.crearMatrizEje = function() {
    var m = mat4.create();
    mat4.identity(m);
    mat4.translate(m, [-this.despX, 0, 0]);  
    mat4.rotateY(m, Math.PI / 2);
    mat4.scale(m, [0.10, 0.10, 2*this.despX]);
    return m;
};

Torreta.prototype.crearMatricesLaterales = function() {
    var am = [];
    var m = mat4.create();
    mat4.identity(m);
    mat4.translate(m, [-this.despX - 0.1 / 2, this.despY, -0.15]);
    mat4.rotateX(m, Math.PI / 2);
    mat4.scale(m, [0.1, 0.3, 2*this.despY]);
    am.push(m);
    
    m = mat4.create();
    mat4.identity(m);
    mat4.translate(m, [this.despX - 0.1 / 2, this.despY, -0.15]);
    mat4.rotateX(m, Math.PI / 2);
    mat4.scale(m, [0.1, 0.3, 2*this.despY]);
    am.push(m);

    return am;
};

Torreta.prototype.initGL = function(gl) {
    for (var i=0; i < this.caniones.length; i++) {
        this.caniones[i].initGL(gl);
    }
    this.eje.initGL(gl);
    for (var i=0; i < this.laterales.length; i++) {
        this.laterales[i].initGL(gl);
    }
};

Torreta.prototype.draw = function (dc) {
    var gl = dc.gl;
    var m;
    var nM = mat3.create();
    
    var ctx = new CanionDrawContext(gl, dc.pM, dc.mvM);
    for (var i=0; i < this.caniones.length; i++) {
        m = mat4.create(dc.mvM);
        mat4.multiply(m, this.matricesCaniones[i]);
        ctx.mvM = m;
        this.caniones[i].draw(ctx);
    }

    m = mat4.create(dc.mvM);
    mat4.multiply(m, this.matrizEje);
    mat4.toInverseMat3(m, nM);
    mat3.transpose(nM);
    ctx = new ShaderPrograms.SimpleIllumination.DrawContext(
                    gl, dc.pM, m, nM, dc.light, true);
    this.eje.draw(ctx);
    
    ctx = new ShaderPrograms.SimpleIllumination.DrawContext(
                    gl, dc.pM, undefined, undefined, dc.light, true);
    for (var i=0; i < this.laterales.length; i++) {
        m = mat4.create(dc.mvM);    
        mat4.multiply(m, this.matricesLaterales[i]);
        mat4.toInverseMat3(m, nM);
        mat3.transpose(nM);
        ctx.mvMatrix = m;
        ctx.nMatrix = nM;
        this.laterales[i].draw(ctx);
    }
};
