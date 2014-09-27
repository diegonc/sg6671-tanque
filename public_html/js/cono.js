function ConoDrawContext(gl, pM, mM) {
    // GL Context
    this.gl = gl;
    // Projection matrix
    this.pM = pM;
    // Model/View matrix
    this.mM = mM;
}

function Cono(cortes, franjas, zmax) {
    console.assert(zmax === undefined || zmax <= 1.0, "zmax > 1");

    var CORTES = cortes;
    var FRANJAS = franjas;
    var PASO = (Math.PI * 2) / (CORTES - 1);
    var RADIO_MAX = 1;
    var Z_MAX = zmax || 1;

    this.zmax = zmax;

    this.cono = [];
    this.indices = [];

    // El cono se define como una grilla de
    // CORTES x (FRANJAS + 1 + 1)
    this.indices = generarIndexBuffer(CORTES, (FRANJAS + 2));

    var z = Z_MAX;
    var radio = (1 - z) * RADIO_MAX;
    var PASO_Z = Z_MAX / (FRANJAS - 1);

    // La primera fila de la grilla corresponde al
    // vertice central de la tapa superior.
    for (var i=0; i < CORTES; i++) {
        this.cono.push(0.0);
        this.cono.push(0.0);
        this.cono.push(z);
    }

    // La siguientes FRANJAS filas de
    //  la grilla corresponden
    // al cuerpo del cono
    // El radio sigue la siguiente recta:
    //     z = 1 - 1 / RADIO_MAX * r
    // despejando r:
    //     r = (1 - z) * RADIO_MAX
    for (var i=0; i < (FRANJAS); i++) {
        for (var j=0; j < CORTES; j++) {
            var a = j * PASO;
            this.cono.push(radio * Math.cos(a));
            this.cono.push(radio * Math.sin(a));
            this.cono.push(z);
        }
    
        z -= PASO_Z;
        radio = (1 - z) * RADIO_MAX;
    }

    // La ultima fila de la grilla corresponde al
    // vertice central de la tapa inferior.
    for (var i=0; i < CORTES; i++) {
        this.cono.push(0.0);
        this.cono.push(0.0);
        this.cono.push(0.0);
    }

    this.colors = [];
    // Colores de los vertices del cono
    for (var i = 0; i < (FRANJAS + 2); i++) {
      for (var j = 0; j < CORTES; j++) {
        if (i % 2 === 0) {
            this.colors.push(0.7);
            this.colors.push(0.7);
            this.colors.push(0.7);
            this.colors.push(1.0);
        } else {
            this.colors.push(0.65);
            this.colors.push(0.65);
            this.colors.push(0.65);
            this.colors.push(1.0);
        }
      }
    }
    this.program = ShaderPrograms.SimpleShader.CreateProgram();
}

Cono.prototype.getRadioMin = function() {
    // r = (1 - z) * RADIO_MAX
    return (1 - this.zmax);
};

Cono.prototype.initGL = function(gl) {
    this.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.cono), gl.STATIC_DRAW);

    this.colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.colors), gl.STATIC_DRAW);

    this.indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), 
                  gl.STATIC_DRAW);

    this.program.initGL(gl);
};

Cono.prototype.draw = function(dc) {
    var gl = dc.gl;

    this.program.prepare(gl,
        dc.pM, dc.mM,
        this.vertexBuffer, this.colorBuffer);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.drawElements(gl.TRIANGLE_STRIP, this.indices.length, gl.UNSIGNED_SHORT, 0);
};
