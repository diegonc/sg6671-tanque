ShaderUtils = {};

ShaderUtils.getShader = function(gl, type, src) {
    var shader = { prg: gl.createShader(type) };
    gl.shaderSource(shader.prg, src);
    gl.compileShader(shader.prg);
    if (!gl.getShaderParameter(shader.prg, gl.COMPILE_STATUS)) {
      throw "An error occurred compiling the shaders: " + 
            gl.getShaderInfoLog(shader.prg);
    }
    return shader;
}

ShaderUtils.getProgram = function(gl, vs, fs) {
    // Creamos un programa de shaders de WebGL.
    var P = { prg: gl.createProgram() };
    // Asociamos cada shader compilado al programa.
    gl.attachShader(P.prg, vs.prg);
    gl.attachShader(P.prg, fs.prg);
    // Linkeamos los shaders para generar el programa ejecutable.
    gl.linkProgram(P.prg);

    // Chequeamos y reportamos si hubo algún error.
    if (!gl.getProgramParameter(P.prg, gl.LINK_STATUS)) {
      throw "Unable to initialize the shader program: " + 
            gl.getProgramInfoLog(P.prg);
    }
    return P;
}
