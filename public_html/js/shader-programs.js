ShaderPrograms = {};
ShaderPrograms.SimpleShader = {};

ShaderPrograms.SimpleShader.CreateProgram = function () {
    if (ShaderPrograms.SimpleShader.instance === undefined) {
        ShaderPrograms.SimpleShader.instance
            = ShaderPrograms.SimpleShader.getInstance();
    }
    return ShaderPrograms.SimpleShader.instance;
};

ShaderPrograms.SimpleShader.getInstance = function () {
  var vertexSrc = "                             \
        attribute vec3 aVertexPosition;         \
        attribute vec4 aVertexColor;            \
                                                \
        uniform mat4 uMVMatrix;                 \
        uniform mat4 uPMatrix;                  \
                                                \
        varying highp vec4 vColor;              \
                                                \
        void main(void) {                       \
          vec4 pos = vec4(aVertexPosition, 1.0);\
          vec4 mpos = uMVMatrix * pos;          \
          gl_Position = uPMatrix * mpos;        \
          vColor = aVertexColor;                \
        }                                       ";

  var fragmentSrc = "                           \
        varying highp vec4 vColor;              \
                                                \
        void main(void) {                       \
          gl_FragColor = vColor;                \
        }                                       ";
    
  return {
      prepare: function (gl, pM, mvM, v, c) {
          this.activate(gl);
          this.bindMatrices(gl, pM, mvM);
          this.bindPosition(gl, v);
          this.bindColors(gl, c);
      },
      activate: function (gl) {
          gl.useProgram(this.program.prg);
      },
      bindMatrices: function (gl, pM, mvM) {
          gl.uniformMatrix4fv(this.program.uPMatrix, false, pM);
          gl.uniformMatrix4fv(this.program.uMVMatrix, false, mvM);          
      },
      bindPosition: function (gl, vertexBuffer) {
          gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
          gl.vertexAttribPointer(this.program.aVertexPosition, 3,
                    gl.FLOAT, false, 0, 0);
      },
      bindColors: function (gl, colorBuffer) {
          gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
          gl.vertexAttribPointer(this.program.aVertexColor, 4,
                    gl.FLOAT, false, 0, 0);
      },
      initGL: function (gl) {
          if (this._initialized === true) {
              return;
          }
          this.id = Math.random();
          this.vertexShader = ShaderUtils.getShader(
                  gl, gl.VERTEX_SHADER, vertexSrc);
          this.fragmentShader = ShaderUtils.getShader(
                  gl, gl.FRAGMENT_SHADER, fragmentSrc);
          this.program = ShaderUtils.getProgram(
                  gl, this.vertexShader, this.fragmentShader);
          
          gl.useProgram(this.program.prg);
          this.program.aVertexPosition = gl.getAttribLocation(
                  this.program.prg, "aVertexPosition");
          gl.enableVertexAttribArray(this.program.aVertexPosition);
          
          this.program.aVertexColor = gl.getAttribLocation(
                  this.program.prg, "aVertexColor");
          gl.enableVertexAttribArray(this.program.aVertexColor);
          
          this.program.uPMatrix = gl.getUniformLocation(
                  this.program.prg, "uPMatrix");
          this.program.uMVMatrix = gl.getUniformLocation(
                  this.program.prg, "uMVMatrix");

          this._initialized = true;
      }
  };
};
