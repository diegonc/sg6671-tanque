function TanqueDrawContext(gl, pM, mM, light) {
    this.gl = gl;
    this.pM = pM;
    this.mM = mM;
    this.light = light;
}

function Tanque() {
    this.carroceria = new Carroceria([0.525, 0.318, 0.741, 1.0]);
    this.baseTorreta = new BaseTorreta();
    this.ruedaTraseraIzq = new Rueda([0.616, 0.451, 0.263, 1.0]);
    this.ruedaTraseraDer = new Rueda([0.616, 0.451, 0.263, 1.0]);
    this.ruedaDelanteraIzq = new Rueda([0.616, 0.451, 0.263, 1.0]);
    this.ruedaDelanteraDer = new Rueda([0.616, 0.451, 0.263, 1.0]);

    function calcularMatrizCarroceria() {
        var m = mat4.create();
        mat4.identity(m);
        mat4.translate(m, [0, 0, -15/2]);
        return m;
    }
    this.matCarroceria = calcularMatrizCarroceria();
    
    function calcularMatrizBaseTorreta() {
        var m = mat4.create();
        mat4.identity(m);
        mat4.translate(m, [0, 3.68, -3.18]);
        mat4.scale(m, [1.5, 1.5, 1.5]);
        return m;
    }
    this.matBaseTorreta = calcularMatrizBaseTorreta();
    
    this.separacionRuedas = 0.1;
    
    // Rotación de ruedas
    this.rotacionRTI = 0;
    this.rotacionRTD = 0;
    this.rotacionRDI = 0;
    this.rotacionRDD = 0;
    this.direccionRDI = 0;
    this.direccionRDD = 0;
    this.eulerRotDI = [0, 0, 0];
    this.eulerRotDD = [0, 0, 0];
}

Tanque.prototype.initGL = function(gl) {
    this.carroceria.initGL(gl);
    this.baseTorreta.initGL(gl);
    this.ruedaTraseraIzq.initGL(gl);
    this.ruedaTraseraDer.initGL(gl);
    this.ruedaDelanteraIzq.initGL(gl);
    this.ruedaDelanteraDer.initGL(gl);
};

Tanque.prototype.calcularMatrizRTI = function() {
    var m = mat4.create();
    mat4.identity(m);
    var tx = this.carroceria.ancho / 2 + this.separacionRuedas;
    mat4.translate(m, [tx, -0.58, -4.54]);
    mat4.rotateY(m, Math.PI/2);
    mat4.rotateZ(m, this.rotacionRTI);
    return m;
};

Tanque.prototype.calcularMatrizRTD = function() {
    var m = mat4.create();
    mat4.identity(m);
    var tx = -this.carroceria.ancho / 2 -  this.separacionRuedas;
    mat4.translate(m, [tx, -0.58, -4.54]);
    mat4.rotateY(m, Math.PI/2);
    mat4.rotateZ(m, this.rotacionRTD);
    return m;
};

Tanque.prototype.calcularMatrizRDI = function() {
    var m = mat4.create();
    mat4.identity(m);
    var tx = this.carroceria.ancho / 2 +  this.separacionRuedas;
    mat4.translate(m, [tx, -0.58, 1.23]);
    mat4.rotateY(m, this.direccionRDI);
    mat4.rotateY(m, Math.PI/2);
    mat4.rotateZ(m, this.rotacionRDI);
    return m;
};

Tanque.prototype.calcularMatrizRDD = function() {
    var m = mat4.create();
    mat4.identity(m);
    var tx = -this.carroceria.ancho / 2 -  this.separacionRuedas;
    mat4.translate(m, [tx, -0.58, 1.23]);
    mat4.rotateY(m, this.direccionRDD);
    mat4.rotateY(m, Math.PI/2);
    mat4.rotateZ(m, this.rotacionRDD);
    return m;
};

Tanque.prototype.setRuedaIDRotation = function(cannonVec) {
    this.rotacionRDI = cannonVec.y;
    this.direccionRDI = cannonVec.z;
    this.eulerRotDI = [cannonVec.x, cannonVec.y, cannonVec.z];
};

Tanque.prototype.setRuedaDDRotation = function(cannonVec) {
    this.rotacionRDD = cannonVec.y;
    this.direccionRDD = cannonVec.z;
    this.eulerRotDD = [cannonVec.x, cannonVec.y, cannonVec.z];
};

Tanque.prototype.draw = function(dc) {
    var gl = dc.gl;
    var pM = dc.pM;
    var mM = mat4.create();
    
    mat4.set(dc.mM, mM);
    mat4.multiply(mM, this.matCarroceria);
    this.carroceria.draw(new CarroceriaDrawContext(gl, pM, mM, dc.light));

    mat4.set(dc.mM, mM);
    mat4.multiply(mM, this.matBaseTorreta);
    this.baseTorreta.draw(new BaseTorretaDrawContext(gl, pM, mM));
    
    var rdc = new RuedaDrawContext(gl, pM, undefined, dc.light);
    mat4.set(dc.mM, mM);
    mat4.multiply(mM, this.calcularMatrizRTI());
    rdc.mM = mM;
    this.ruedaTraseraIzq.draw(rdc);

    mat4.set(dc.mM, mM);
    mat4.multiply(mM, this.calcularMatrizRTD());
    rdc.mM = mM;
    this.ruedaTraseraDer.draw(rdc);
    
    mat4.set(dc.mM, mM);
    mat4.multiply(mM, this.calcularMatrizRDI());
    rdc.mM = mM;
    this.ruedaDelanteraIzq.draw(rdc);
    
    mat4.set(dc.mM, mM);
    mat4.multiply(mM, this.calcularMatrizRDD());
    rdc.mM = mM;
    this.ruedaDelanteraDer.draw(rdc);
};
