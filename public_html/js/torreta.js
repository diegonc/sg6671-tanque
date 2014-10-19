function TorretaDrawContext(gl, pM, mvM) {
    this.gl = gl;
    this.pM = pM;
    this.mvM = mvM;
}

function Torreta(color) {
    this.caniones = [
        new Canion(color),
        new Canion(color),
        new Canion(color),
        new Canion(color)
    ];
    this.eje = Primitivas.cilindro(64, 10, color);
    this.laterales = [
        Primitivas.caja(4, 5, color),
        Primitivas.caja(4, 5, color)
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
    var ctx = new CanionDrawContext(gl, dc.pM, dc.mvM);
    for (var i=0; i < this.caniones.length; i++) {
        m = mat4.create(dc.mvM);
        mat4.multiply(m, this.matricesCaniones[i]);
        ctx.mvM = m;
        this.caniones[i].draw(ctx);
    }

    m = mat4.create(dc.mvM);
    mat4.multiply(m, this.matrizEje);
    ctx = new CilindroDrawContext(gl, dc.pM, m);
    this.eje.draw(ctx);
    
    ctx = new CajaDrawContext(gl, dc.pM);
    for (var i=0; i < this.laterales.length; i++) {
        m = mat4.create(dc.mvM);    
        mat4.multiply(m, this.matricesLaterales[i]);
        ctx.mM = m;
        this.laterales[i].draw(ctx);
    }
};
