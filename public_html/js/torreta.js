function TorretaDrawContext(gl, pM, mvM) {
    this.gl = gl;
    this.pM = pM;
    this.mvM = mvM;
}

function Torreta() {
    this.caniones = [
        new Canion(),
        new Canion(),
        new Canion(),
        new Canion()
    ];
    this.eje = Primitivas.cilindro(64, 10);
    this.despX = 0.45;
    this.despY = 0.20;
    this.zdesp = -2.5;
    this.matricesCaniones = this.createMatricesCaniones();
    this.matrizEje = this.createMatrixEje();
}

Torreta.prototype.createMatricesCaniones = function() {
    var am = [];
    var m;
    var despX = this.despX;
    var despY = this.despY;

    m = mat4.create();
    mat4.identity(m);
    mat4.translate(m, [-despX-1, despY, this.zdesp]);
    am.push(m);
    
    m = mat4.create();
    mat4.identity(m);
    mat4.translate(m, [-despX-1, -despY-1, this.zdesp]);
    am.push(m);
    
    m = mat4.create();
    mat4.identity(m);
    mat4.translate(m, [despX, despY, this.zdesp]);
    am.push(m);
    
    m = mat4.create();
    mat4.identity(m);
    mat4.translate(m, [despX, -despY-1, this.zdesp]);
    am.push(m);

    return am;
};

Torreta.prototype.createMatrixEje = function() {
    var m = mat4.create();
    mat4.identity(m);
    mat4.translate(m, [-this.despX-0.5, 0, 0]);  
    mat4.rotateY(m, Math.PI / 2);
    mat4.scale(m, [0.15, 0.15, 2*this.despX+1]);
    return m;
};

Torreta.prototype.initGL = function(gl) {
    for (var i=0; i < this.caniones.length; i++) {
        this.caniones[i].initGL(gl);
    }
    this.eje.initGL(gl);
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
};
