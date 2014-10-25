function MundoDrawContext(gl, pM, mM) {
    this.gl = gl;
    this.pM = pM;
    this.mM = mM;
}

function Mundo() {
    this.tanque = {
        obj: new Tanque(),
        position: vec3.create(),
        rotation: vec3.create()
    };
}

Mundo.prototype.initGL = function(gl) {
    this.tanque.obj.initGL(gl);
};

Mundo.prototype.draw = function(dc) {
    var gl = dc.gl;
    var pM = dc.pM;
    var mM = mat4.create();
    
    mat4.set(dc.mM, mM);
    
    var tx = this.tanque.position[0];
    var ty = this.tanque.position[1];
    var tz = this.tanque.position[2];
    mat4.translate(mM, [tx, ty, tz]);
    
    var rx = this.tanque.rotation[0];
    var ry = this.tanque.rotation[0];
    var rz = this.tanque.rotation[0];
    mat4.rotateX(mM, rx);
    mat4.rotateZ(mM, rz);
    mat4.rotateY(mM, ry);

    mat4.rotateZ(mM, Math.PI / 2);
    mat4.rotateX(mM, Math.PI / 2);

    this.tanque.obj.draw(new TanqueDrawContext(gl, pM, mM));
};
