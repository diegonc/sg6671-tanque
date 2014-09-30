Primitivas = {};
Primitivas.registro = {};

Primitivas.cono = function(cortes, franjas, zmax) {
    var args = [Cono, cortes, franjas, zmax];
    var hash = HashCode.value(args);
    var instance = this.registro[hash];
    if (instance === undefined) {
        instance = new Cono(cortes, franjas, zmax);
        this.registro[hash] = instance;
    }
    return instance;
};

Primitivas.cilindro = function(cortes, franjas) {
    var args = [Cilindro, cortes, franjas];
    var hash = HashCode.value(args);
    var instance = this.registro[hash];
    if (instance === undefined) {
        instance = new Cilindro(cortes, franjas);
        this.registro[hash] = instance;
    }
    return instance;
};

Primitivas.caja = function(cortes, franjas) {
    var args = [Caja, cortes, franjas];
    var hash = HashCode.value(args);
    var instance = this.registro[hash];
    if (instance === undefined) {
        instance = new Caja(cortes, franjas);
        this.registro[hash] = instance;
    }
    return instance;
};
