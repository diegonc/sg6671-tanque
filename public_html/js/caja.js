function CajaDrawContext(gl, pM, mM) {
    // GL Context
    this.gl = gl;
    // Projection matrix
    this.pM = pM;
    // Model/View matrix
    this.mM = mM;
}

function Caja(cortesPorCara, franjas) {
    var Z_MAX = 1;
    var PASO = 1 / (cortesPorCara - 1);

    this.caja = [];
    this.indices = [];

    // La caja esta formada por cortesPorCara vertices en cada cara.
    // Esto se representa por una grilla de
    // (cortesPorCara + 3 x (cortesPorCara - 1) x (FRANJAS + 1 + 2)
    //= (4 x cortesPorCara - 3) x (FRANJAS + 1 + 2
    var verticesPorCol = 4 * cortesPorCara - 3;
    this.indices = generarIndexBuffer(verticesPorCol, (franjas + 3));
    
    // La primer fila de la grilla corresponde al
    // vertice central de la tapa superior.
    for (var i=0; i < verticesPorCol; i++) {
        this.caja.push(0.5);
        this.caja.push(0.5);
        this.caja.push(Z_MAX);
    }
    // Las (FRANJAS + 1) filas intermedias corresponden
    // al cuerpo de la caja.
    
    // Primero se calculan la coordenadas x,y de una franja
    var verticesFranja = [];
    var x = 0;
    var y = 0;
    verticesFranja.push([x, y]);
    for (var i=0; i < (verticesPorCol - 1); i++) {
        var cara = Math.floor(i / (cortesPorCara - 1));
        if (cara === 0) {
            x = ((i % (cortesPorCara - 1)) + 1) * PASO;
        } else if (cara === 1) {
            y = ((i % (cortesPorCara - 1)) + 1) * PASO;
        } else if (cara === 2) {
            x = 1 - (((i % (cortesPorCara - 1)) + 1) * PASO);
        } else if (cara === 3) {
            y = 1 - (((i % (cortesPorCara - 1)) + 1) * PASO);
        }
        verticesFranja.push([x, y]);
    }
    
    // Luego se añaden los vertices con la coordenada z de cada franja
    var PASO_Z = Z_MAX / franjas;
    for (var i=0; i < (franjas + 1); i++) {
        var z = Z_MAX - i * PASO_Z;
        for (var j=0; j < verticesPorCol; j++) {
            var pos = verticesFranja[j];
            this.caja.push(pos[0]);
            this.caja.push(pos[1]);
            this.caja.push(z);
        }
    }
    // La ultima fila de la grilla corresponde al
    // vertice central de la tapa inferior.
    for (var i=0; i < verticesPorCol; i++) {
        this.caja.push(0.5);
        this.caja.push(0.5);
        this.caja.push(0.0);
    }

    this.colors = [];
    // Colores de los vertices del cilindro
    for (var i = 0; i < (franjas + 3); i++) {
      for (var j = 0; j < verticesPorCol; j++) {
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

Caja.prototype.initGL = function(gl) {
    if (this._initialized === true) {
        return;
    }
    this.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.caja), gl.STATIC_DRAW);

    this.colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.colors), gl.STATIC_DRAW);

    this.indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), 
                  gl.STATIC_DRAW);

    this.program.initGL(gl);
    this._initialized = true;
};

Caja.prototype.draw = function(dc) {
    var gl = dc.gl;

    this.program.prepare(gl,
        dc.pM, dc.mM,
        this.vertexBuffer, this.colorBuffer);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.drawElements(gl.TRIANGLE_STRIP, this.indices.length, gl.UNSIGNED_SHORT, 0);
};
