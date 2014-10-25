function Cilindro(cortes, franjas, color, shader) {
    var CORTES = cortes;
    var FRANJAS = franjas;
    var PASO = (Math.PI * 2) / (CORTES - 1);
    var RADIO = 1;
    var Z_MAX = 1;

    this.cilindro = [];
    this.normales = [];
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
        
        this.normales.push(0);
        this.normales.push(0);
        this.normales.push(1);
    }
    // Las (FRANJAS + 1) filas intermedias corresponden
    // al cuerpo del cilindro.
    var PASO_Z = Z_MAX / FRANJAS;
    for (var i=0; i < (FRANJAS + 1); i++) {
        var z = Z_MAX - i * PASO_Z;
        for (var j=0; j < CORTES; j++) {
            var a = j * PASO;
            var cosa = Math.cos(a);
            var sina = Math.sin(a);
            this.cilindro.push(RADIO * cosa);
            this.cilindro.push(RADIO * sina);
            this.cilindro.push(z);
            
            this.normales.push(cosa);
            this.normales.push(sina);
            this.normales.push(0);
        }
    }
    // La ultima fila de la grilla corresponde al
    // vertice central de la tapa inferior.
    for (var i=0; i < CORTES; i++) {
        this.cilindro.push(0.0);
        this.cilindro.push(0.0);
        this.cilindro.push(0.0);
        
        this.normales.push(0);
        this.normales.push(0);
        this.normales.push(-1);
    }

    this.colors = [];
    // Colores de los vertices del cilindro
    for (var i = 0; i < (FRANJAS + 3); i++) {
      for (var j = 0; j < CORTES; j++) {
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

Cilindro.prototype.initGL = function(gl) {
    if (this._initialized === true) {
        return;
    }
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
    this._initialized = true;
};

Cilindro.prototype.draw = function(dc) {
    dc.draw(this);
};
