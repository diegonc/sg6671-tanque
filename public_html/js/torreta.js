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
    this.desp = 0.8;
    this.zdesp = -2.5;
    this.matrices = this.createMatrices();
}

Torreta.prototype.createMatrices = function() {
    var am = [];
    var m;
    var desp = this.desp;
    
    m = mat4.create();
    mat4.identity(m);
    mat4.translate(m, [-desp, desp, this.zdesp]);
    am.push(m);
    
    m = mat4.create();
    mat4.identity(m);
    mat4.translate(m, [-desp, -desp, this.zdesp]);
    am.push(m);
    
    m = mat4.create();
    mat4.identity(m);
    mat4.translate(m, [desp, desp, this.zdesp]);
    am.push(m);
    
    m = mat4.create();
    mat4.identity(m);
    mat4.translate(m, [desp, -desp, this.zdesp]);
    am.push(m);
    
    return am;
};

Torreta.prototype.initGL = function(gl) {
    for (var i=0; i < this.caniones.length; i++) {
        this.caniones[i].initGL(gl);
    }
};

Torreta.prototype.draw = function (dc) {
    var gl = dc.gl;
    var ctx = new CanionDrawContext(gl, dc.pM, dc.mvM);
    for (var i=0; i < this.caniones.length; i++) {
        var m = mat4.create(dc.mvM);
        mat4.multiply(m, this.matrices[i]);
        ctx.mvM = m;
        this.caniones[i].draw(ctx);
    }
};
