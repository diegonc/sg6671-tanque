function CilindroDrawContext(gl, pM, mM) {
    // GL Context
    this.gl = gl;
    // Projection matrix
    this.pM = pM;
    // Model/View matrix
    this.mM = mM;
}

function Cilindro(cortes, franjas) {
    var CORTES = cortes;
    var FRANJAS = franjas;
    var PASO = (Math.PI * 2) / (CORTES - 1);
    var RADIO = 1;
    var Z_MAX = 1;

    this.cilindro = [];
    this.indices = [];

    // El cilindro se define como una grilla de
    // CORTES x (FRANJAS + 1 + 2)
    this.indices = generarIndexBuffer(CORTES, (FRANJAS + 3));
    
    // La primer fila de la grilla corresponde al
    // vertice central de la tapa superior.
    for (var i=0; i < CORTES; i++) {
        this.cilindro.push(0.0);
        this.cilindro.push(0.0);
        this.cilindro.push(Z_MAX);
    }
    // Las (FRANJAS + 1) filas intermedias corresponden
    // al cuerpo del cilindro.
    var PASO_Z = Z_MAX / FRANJAS;
    for (var i=0; i < (FRANJAS + 1); i++) {
        var z = Z_MAX - i * PASO_Z;
        for (var j=0; j < CORTES; j++) {
            var a = j * PASO;
            this.cilindro.push(RADIO * Math.cos(a));
            this.cilindro.push(RADIO * Math.sin(a));
            this.cilindro.push(z);
        }
    }
    // La ultima fila de la grilla corresponde al
    // vertice central de la tapa inferior.
    for (var i=0; i < CORTES; i++) {
        this.cilindro.push(0.0);
        this.cilindro.push(0.0);
        this.cilindro.push(0.0);
    }

    this.colors = [];
    // Colores de los vertices del cilindro
    for (var i = 0; i < (FRANJAS + 3); i++) {
      for (var j = 0; j < CORTES; j++) {
        if (j % 2 === 0) {
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

Cilindro.prototype.initGL = function(gl) {
    this.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.cilindro), gl.STATIC_DRAW);

    this.colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.colors), gl.STATIC_DRAW);

    this.indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), 
                  gl.STATIC_DRAW);

    this.program.initGL(gl);
};

Cilindro.prototype.draw = function(dc) {
    var gl = dc.gl;
    
    this.program.prepare(gl,
        dc.pM, dc.mM,
        this.vertexBuffer, this.colorBuffer);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.drawElements(gl.TRIANGLE_STRIP, this.indices.length, gl.UNSIGNED_SHORT, 0);
};
