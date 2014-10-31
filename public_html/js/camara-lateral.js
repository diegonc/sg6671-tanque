function CamaraLateral(mundo) {
    this.mundo = mundo;
    this.activated = false;
}

CamaraLateral.prototype.activate = function() {
    this.activated = true;
};
    
CamaraLateral.prototype.deactivate = function() {
    this.activated = false;
};

CamaraLateral.prototype.getMatrix = function() {
    var direccion = [1, 0, 0];
    var up = [0, 0, 1];
    var derecha = [0, 1, 0];

    // Se calcula la dirección en la que apuntar
    // el tanque, el vector up y derecha.
    var rx = this.mundo.tanque.rotation[0];
    var ry = this.mundo.tanque.rotation[1];
    var rz = this.mundo.tanque.rotation[2];
    var rotaciones = mat4.create();
    mat4.identity(rotaciones);
    mat4.rotateX(rotaciones, rx);
    mat4.rotateZ(rotaciones, rz);
    mat4.rotateY(rotaciones, ry);
    mat4.multiplyVec3(rotaciones, direccion);
    mat4.multiplyVec3(rotaciones, up);
    mat4.multiplyVec3(rotaciones, derecha);
    
    // Posicion del tanque
    var posTanque = this.mundo.tanque.position;
    
    // A partir de la dirección y la posición del tanque
    // se calcula el punto donde se ubica la camara...
    var pos = vec3.create(posTanque);
    var deltaD = vec3.create(derecha);
    //var deltaUp = vec3.create(up);
    vec3.scale(deltaD, -40);
    vec3.add(pos, deltaD);
    //vec3.scale(deltaUp, 10);
    //vec3.add(pos, deltaUp);
    
    //... y el punto hacia el que mira
    var at = vec3.create(posTanque);
    //vec3.set(direccion, deltaD);
    //vec3.scale(deltaD, 7.5);
    //vec3.add(at, deltaD);
    
    return mat4.lookAt(pos, at, up);
};
