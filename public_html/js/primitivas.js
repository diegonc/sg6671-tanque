Primitivas = {};
Primitivas.registro = {};

Primitivas.cono = function(cortes, franjas, zmax, color) {
    var args = [Cono, cortes, franjas, zmax, color];
    var hash = HashCode.value(args);
    var instance = this.registro[hash];
    if (instance === undefined) {
        instance = new Cono(cortes, franjas, zmax, color);
        this.registro[hash] = instance;
    }
    return instance;
};

Primitivas.cilindro = function(cortes, franjas, color) {
    var args = [Cilindro, cortes, franjas, color];
    var hash = HashCode.value(args);
    var instance = this.registro[hash];
    if (instance === undefined) {
        instance = new Cilindro(cortes, franjas, color);
        this.registro[hash] = instance;
    }
    return instance;
};

Primitivas.caja = function(cortes, franjas, color) {
    var args = [Caja, cortes, franjas, color];
    var hash = HashCode.value(args);
    var instance = this.registro[hash];
    if (instance === undefined) {
        instance = new Caja(cortes, franjas, color);
        this.registro[hash] = instance;
    }
    return instance;
};
