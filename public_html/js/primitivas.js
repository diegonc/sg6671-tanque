Primitivas = {};
Primitivas.registro = {};

Primitivas.cono = function(cortes, franjas, zmax, color, shader) {
    var shaderName;
    if (shader !== undefined) {
        shaderName = shader.name;
    }
    var args = [Cono, cortes, franjas, zmax, color, shaderName];
    var hash = HashCode.value(args);
    var instance = this.registro[hash];
    if (instance === undefined) {
        instance = new Cono(cortes, franjas, zmax, color, shader);
        this.registro[hash] = instance;
    }
    return instance;
};

Primitivas.cilindro = function(cortes, franjas, color, shader) {
    var shaderName;
    if (shader !== undefined) {
        shaderName = shader.name;
    }
    var args = [Cilindro, cortes, franjas, color, shaderName];
    var hash = HashCode.value(args);
    var instance = this.registro[hash];
    if (instance === undefined) {
        instance = new Cilindro(cortes, franjas, color, shader);
        this.registro[hash] = instance;
    }
    return instance;
};

Primitivas.caja = function(cortes, franjas, color, shader) {
    var shaderName;
    if (shader !== undefined) {
        shaderName = shader.name;
    }
    var args = [Caja, cortes, franjas, color, shaderName];
    var hash = HashCode.value(args);
    var instance = this.registro[hash];
    if (instance === undefined) {
        instance = new Caja(cortes, franjas, color, shader);
        this.registro[hash] = instance;
    }
    return instance;
};
