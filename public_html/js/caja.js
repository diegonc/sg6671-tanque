function Caja(cortesPorCara, franjas, color, shader) {
    var Z_MAX = 1;
    var PASO = 1 / (cortesPorCara - 1);

    this.caja = [];
    this.normales = [];
    this.indices = [];

    // La caja esta formada por cortesPorCara vertices en cada cara.
    // Esto se representa por una grilla de
    // 4 x cortesPorCara x (FRANJAS + 1 + 2)
    //= 4 x cortesPorCara x (FRANJAS + 1 + 2)
    var verticesPorCol = 4 * cortesPorCara;
    this.indices = generarIndexBuffer(verticesPorCol, (franjas + 3));
    
    // La primer fila de la grilla corresponde al
    // vertice central de la tapa superior.
    for (var i=0; i < verticesPorCol; i++) {
        this.caja.push(0.5);
        this.caja.push(0.5);
        this.caja.push(Z_MAX);
        
        this.normales.push(0);
        this.normales.push(0);
        this.normales.push(1);
    }
    // Las (FRANJAS + 1) filas intermedias corresponden
    // al cuerpo de la caja.
    
    // Primero se calculan la coordenadas x,y de una franja
    var verticesFranja = [];
    var normalesFranja = [];
    var x = 0;
    var y = 0;
    for (var i=0; i < verticesPorCol; i++) {
        var cara = Math.floor(i / cortesPorCara);
        if (cara === 0) {
            x = (i % cortesPorCara) * PASO;
        } else if (cara === 1) {
            y = (i % cortesPorCara) * PASO;
        } else if (cara === 2) {
            x = 1 - ((i % cortesPorCara) * PASO);
        } else if (cara === 3) {
            y = 1 - ((i % cortesPorCara) * PASO);
        }
        verticesFranja.push([x, y]);
        if (cara === 0)
            normalesFranja.push([0, -1]);
        else if (cara === 1)
            normalesFranja.push([1, 0]);
        else if (cara === 2)
            normalesFranja.push([0, 1]);
        else if (cara === 3)
            normalesFranja.push([-1, 0]);
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
            
            var norm = normalesFranja[j];
            this.normales.push(norm[0]);
            this.normales.push(norm[1]);
            this.normales.push(0);
        }
    }
    // La ultima fila de la grilla corresponde al
    // vertice central de la tapa inferior.
    for (var i=0; i < verticesPorCol; i++) {
        this.caja.push(0.5);
        this.caja.push(0.5);
        this.caja.push(0.0);
        
        this.normales.push(0);
        this.normales.push(0);
        this.normales.push(-1);
    }

    this.colors = [];
    // Colores de los vertices del cilindro
    for (var i = 0; i < (franjas + 3); i++) {
      for (var j = 0; j < verticesPorCol; j++) {
        this.colors.push(color[0]);
        this.colors.push(color[1]);
        this.colors.push(color[2]);
        this.colors.push(color[3]);
      }
    }

    if (shader === undefined) {
        this.program = ShaderPrograms.SimpleShader.CreateProgram();
    } else {
        this.program = shader;
    }
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
    
    this.normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normales), gl.STATIC_DRAW);

    this.indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), 
                  gl.STATIC_DRAW);

    this.program.initGL(gl);
    this._initialized = true;
};

Caja.prototype.draw = function(dc) {
    dc.draw(this);
};
