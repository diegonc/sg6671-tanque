ShaderPrograms = {};

ShaderPrograms.createInstance = function(shader){
    if (shader.instance === undefined) {
        shader.instance = shader.getInstance();
    }
    return shader.instance;
};

ShaderPrograms.SimpleShader = {};

ShaderPrograms.SimpleShader.CreateProgram = function () {
    return ShaderPrograms.createInstance(ShaderPrograms.SimpleShader);
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
      name: "SimpleShader",
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

ShaderPrograms.SimpleShader.DrawContext = function(gl, pM, mM) {
    this.gl = gl;
    this.pMatrix = pM;
    this.mvMatrix = mM;
};

ShaderPrograms.SimpleShader.DrawContext.prototype.draw = function(obj) {
    var gl = this.gl;

    obj.program.prepare(this.gl,
        this.pMatrix, this.mvMatrix,
        obj.vertexBuffer, obj.colorBuffer);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.indexBuffer);
    gl.drawElements(gl.TRIANGLE_STRIP, obj.indices.length, gl.UNSIGNED_SHORT, 0);  
};

ShaderPrograms.SimpleIllumination = {};

ShaderPrograms.SimpleIllumination.CreateProgram = function () {
    return ShaderPrograms.createInstance(ShaderPrograms.SimpleIllumination);
};

ShaderPrograms.SimpleIllumination.getInstance = function() {
    var vertexSrc = "                                                       \
       attribute vec3 aVertexPosition;                                      \
       attribute vec3 aVertexNormal;                                        \
       attribute vec4 aVertexColor;                                         \
                                                                            \
       uniform mat4 uMVMatrix;                                              \
       uniform mat4 uPMatrix;                                               \
       uniform mat3 uNMatrix;                                               \
                                                                            \
       /* Variables utilizadas para la iluminación */                       \
       uniform vec3 uAmbientColor;                                          \
       uniform vec3 uLightPosition;                                         \
       uniform vec3 uDirectionalColor;                                      \
       uniform bool uUseLighting;                                           \
                                                                            \
       varying highp vec4 vColor;                                           \
       varying vec3 vLightIntensity;                                        \
                                                                            \
       void main(void) {                                                    \
           vec3 vertice = aVertexPosition;                                  \
           vec4 pos_camera_view = uMVMatrix * vec4(vertice, 1.0);           \
           gl_Position = uPMatrix * pos_camera_view;                        \
           vColor = aVertexColor;                                           \
           vec3 light_dir =  uLightPosition - vec3( pos_camera_view );      \
           vec3 n_light_dir = normalize(light_dir);                         \
           if (!uUseLighting) {                                             \
               vLightIntensity = vec3(1.0, 1.0, 1.0);                       \
           } else {                                                         \
               vec3 transformedNormal = normalize(uNMatrix * aVertexNormal);\
               float directionalLightWeighting = max(                       \
                       dot(transformedNormal, n_light_dir), 0.0);           \
               vLightIntensity = uAmbientColor                              \
                       + uDirectionalColor * directionalLightWeighting;     \
           }                                                                \
       }                                                                    ";

    var fragmentSrc = "                                                \
        precision mediump float;                                       \
        varying vec3 vLightIntensity;                                  \
        varying highp vec4 vColor;                                     \
        void main(void) {                                              \
            vec4 fcolor = vec4(vColor.rgb * vLightIntensity, vColor.a);\
            gl_FragColor = fcolor;                                     \
        }                                                              ";
    
    return {
      name: "SimpleIllumination",
      /**
       * @param {type} gl - WebGL context
       * @param {type} pM - Projection matrix
       * @param {type} mvM - Model/View matrix
       * @param {type} nM - Normal matrix
       * @param {type} v - Vertices position
       * @param {type} n - Vertices normal
       * @param {type} c - Vertices color
       * @param {type} ac - Ambient light color
       * @param {type} lp - Light position
       * @param {type} dc - Directional color
       * @param {type} ul - Whether lighting is used or not
       */
      prepare: function (gl, pM, mvM, nM, v, n, c, ac, lp, dc, ul ) {
          this.activate(gl);
          this.bindMatrices(gl, pM, mvM, nM);
          this.bindPosition(gl, v);
          this.bindNormal(gl, n);
          this.bindColors(gl, c);
          this.bindLightning(gl, ac, lp, dc, ul);
      },
      activate: function (gl) {
          gl.useProgram(this.program.prg);
      },
      bindMatrices: function (gl, pM, mvM, nM) {
          gl.uniformMatrix4fv(this.program.uPMatrix, false, pM);
          gl.uniformMatrix4fv(this.program.uMVMatrix, false, mvM);
          gl.uniformMatrix3fv(this.program.uNMatrix, false, nM);
      },
      bindPosition: function (gl, vertexBuffer) {
          gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
          gl.vertexAttribPointer(this.program.aVertexPosition, 3,
                    gl.FLOAT, false, 0, 0);
      },
      bindNormal: function (gl, normalBuffer) {
          gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
          gl.vertexAttribPointer(this.program.aVertexNormal, 3,
                    gl.FLOAT, false, 0, 0);
      },
      bindColors: function (gl, colorBuffer) {
          gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
          gl.vertexAttribPointer(this.program.aVertexColor, 4,
                    gl.FLOAT, false, 0, 0);
      },
      bindLightning: function (gl, ambColor, lightPos, dirColor, useLight) {
          gl.uniform3f(this.program.uAmbientColor,
            ambColor[0], ambColor[1], ambColor[2]);
          gl.uniform3f(this.program.uLightPosition,
            lightPos[0], lightPos[1], lightPos[2]);
          gl.uniform3f(this.program.uDirectionalColor,
            dirColor[0], dirColor[1], dirColor[2]);
          gl.uniform1i(this.program.uUseLighting, useLight);
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
          
          this.program.aVertexNormal = gl.getAttribLocation(
                  this.program.prg, "aVertexNormal");
          gl.enableVertexAttribArray(this.program.aVertexNormal);
          
          this.program.aVertexColor = gl.getAttribLocation(
                  this.program.prg, "aVertexColor");
          gl.enableVertexAttribArray(this.program.aVertexColor);
          
          this.program.uPMatrix = gl.getUniformLocation(
                  this.program.prg, "uPMatrix");
          this.program.uMVMatrix = gl.getUniformLocation(
                  this.program.prg, "uMVMatrix");
          this.program.uNMatrix = gl.getUniformLocation(
                  this.program.prg, "uNMatrix");
          this.program.uAmbientColor = gl.getUniformLocation(
                  this.program.prg, "uAmbientColor");
          this.program.uLightPosition = gl.getUniformLocation(
                  this.program.prg, "uLightPosition");
          this.program.uDirectionalColor = gl.getUniformLocation(
                  this.program.prg, "uDirectionalColor");
          this.program.uUseLighting = gl.getUniformLocation(
                  this.program.prg, "uUseLighting");
          this._initialized = true;
      }
  };
};

ShaderPrograms.SimpleIllumination.DrawContext = function(gl, pM, mvM, nM, light, ul) {
    this.gl = gl;
    this.pMatrix = pM;
    this.mvMatrix = mvM;
    this.nMatrix = nM;
    this.light = light;
    this.useLightning = ul;
};

ShaderPrograms.SimpleIllumination.DrawContext.prototype.draw = function(obj) {
    var prg = obj.program;

    prg.prepare(this.gl, this.pMatrix, this.mvMatrix, this.nMatrix,
        obj.vertexBuffer, obj.normalBuffer, obj.colorBuffer,
        this.light.ambientColor, this.light.position,
        this.light.directionalColor, this.useLightning);

    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, obj.indexBuffer);
    this.gl.drawElements(this.gl.TRIANGLE_STRIP, obj.indices.length,
            this.gl.UNSIGNED_SHORT, 0);
};
