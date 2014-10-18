function Poligono(puntos, normales) {
    this.puntos = puntos;
    this.normales = normales;
}

Poligono.prototype.transformar = function(mat) {
    var nuevosPuntos = [];
    var nuevasNormales = [];
    var mN = mat4.create();
    mat4.inverse(mat, mN);
    mat4.transpose(mN);
    
    for (var i=0; i < this.puntos.length; i++) {
        var p = vec3.create(this.puntos[i]);
        var n = vec3.create(this.normales[i]);
        
        mat4.multiplyVec3(mat, p);
        mat4.multiplyVec3(mN, n);
        nuevosPuntos.push(p);
        nuevasNormales.push(n);
    }
    return new Poligono(nuevosPuntos, nuevasNormales);
};
