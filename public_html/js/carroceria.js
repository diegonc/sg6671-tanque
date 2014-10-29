function CarroceriaDrawContext(gl, pM, mM, light) {
    this.gl = gl;
    this.pM = pM;
    this.mM = mM;
    this.light = light;
}

function Carroceria(color) {
//                y
//                |
//        -2,59   |     2,59
//          |     |      |
// 1,75-----*-----|-----*------- 1,75
// 0,64--*        |        *---- 0,64
//       |--------+--------|------------- x
// -0,64-*                 *---- -0,64
// -0,89-|*---------------*|---- -0,89
//       ||               ||
//       |-2,83       2,83 |
//  -3,06                   3,06
    this.ancho = 8;
    this.alto = 6;
    this.poligono = new Poligono(
    // Puntos
    [
        [-3.06, 0.64, 0],
        [-2.59, 1.75, 0],
        [ 2.59, 1.75, 0],
        [ 3.06, 0.64, 0],
        [ 3.06,-0.64, 0],
        [ 2.83,-0.89, 0],
        [-2.83,-0.89, 0],
        [-3.06,-0.64, 0],
        [-3.06, 0.64, 0]
    ],
    // Normales
    [
        [-1, 0, 0],
        [ 0, 1, 0],
        [ 0, 1, 0],
        [ 1, 0, 0],
        [ 1, 0, 0],
        [ 0,-1, 0],
        [ 0,-1, 0],
        [-1, 0, 0],
        [-1, 0, 0]
    ]);

    function agregarPoligono(poligono, vertices, normales) {
        for (var i=0; i < poligono.puntos.length; i++) {
            var p = poligono.puntos[i];
            for (var j=0; j < p.length; j++) {
                vertices.push(p[j]);    
            }
            var n = poligono.normales[i];
            for (var j=0; j < n.length; j++) {
                normales.push(n[j]);    
            }
        }
    }
    
    this.vertices = [];
    this.normales = [];
    
    var cortes = this.poligono.puntos.length;
    var franjas = 0;
    var m = mat4.create();
    var tmpPol;
    
    // Tapa trasera de la carrocería
    franjas++;
    tmpPol = this.poligono.transformar(m);
    for (var i=0; i < tmpPol.normales.length; i++) {
        tmpPol.normales[i] = [0, 0, -1];
    }
    agregarPoligono(tmpPol, this.vertices, this.normales);

    function postProcesarPoligono(indice, pol) {
        if (indice === 0) {
            for (var i=0; i < pol.normales.length; i++) {
                pol.normales[i] = [0, 0, -1];
            }
        }
        if (indice === 8) {
            for (var i=0; i < pol.normales.length; i++) {
                pol.normales[i] = [0, 0, 1];
            }
        }
    }

    // Franjas intermedias que van desde la parte trasera a la delantera
    var posZfranja = [0, 0, 1.75, 4.32, 6.90, 9.49, 12.40, 15, 15];
    var intermedias = posZfranja.length;
    var z;
    for (var i=0; i < intermedias; i++) {
        z = posZfranja[i];
        mat4.identity(m);
        mat4.translate(m, [0, 0, z]);
        tmpPol = this.poligono.transformar(m);
        postProcesarPoligono(i, tmpPol);
        franjas++;
        agregarPoligono(tmpPol, this.vertices, this.normales);
    }
    
    // Tapa delantera de la carrocería
    franjas++;
    mat4.identity(m);
    mat4.translate(m, [0, 0, z]);
    mat4.scale(m, [0, 0, 1]);
    tmpPol = this.poligono.transformar(m);
    for (var i=0; i < tmpPol.normales.length; i++) {
        tmpPol.normales[i] = [0, 0, 1];
    }
    agregarPoligono(tmpPol, this.vertices, this.normales);

    // Indices
    this.indices = [];
    this.indices = generarIndexBuffer(cortes, franjas);
    
    // Colores
    var numVert = this.vertices.length / 3;
    this.colors = [];
    for (var i=0; i < numVert; i++) {
        var factorR = 1 /*Math.random() * (1.0 - 0.8) + 0.8*/;
        var factorG = 1 /*Math.random() * (1.0 - 0.8) + 0.8*/;
        var factorB = 1 /*Math.random() * (1.0 - 0.8) + 0.8*/;
        this.colors.push(color[0] * factorR);
        this.colors.push(color[1] * factorG);
        this.colors.push(color[2] * factorB);
        this.colors.push(color[3]);
    }

    // Shader
    this.program = ShaderPrograms.SimpleIllumination.CreateProgram();
}

Carroceria.prototype.initGL = function(gl) {
    if (this._initialized === true) {
        return;
    }
    this.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);

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

Carroceria.prototype.draw = function(dc) {
    var gl = dc.gl;
    var nM = mat3.create();
    mat4.toInverseMat3(dc.mM, nM);
    mat3.transpose(nM);
    var ctx = new ShaderPrograms.SimpleIllumination.DrawContext(
            gl, dc.pM, dc.mM, nM, dc.light, true);
    ctx.draw(this);
};
