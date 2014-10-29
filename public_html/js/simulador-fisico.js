function TanqueSim(world) {
    this.anchoChassis = 8;
    this.altoChassis = 6;
    this.largoChassis = 15;
    this.radioRueda = 2;
    this.profundidadRueda = 1;
    this.segmentosRueda = 16;
    this.separacionRuedaChassis = 1;// se recomienda que no sea 0 porque choca con el chassis y no gira bien la rueda

    this.anguloVolante = 0;
    this.velocidadMotor = 0;

    this.chassisRb;
    this.ruedaIzqTraRb;
    this.ruedaDerTraRb;
    this.ruedaIzqDelRb;
    this.ruedaDerDelRb;

    var distanciaRuedaAlChassis = this.anchoChassis / 2 + this.radioRueda + this.separacionRuedaChassis;
    var _world = world;
    var constraints = [];
    var mass = 1;
    var alturaInicial = 3; // del tanque

    this.wheelMaterial = new CANNON.Material("wheelMaterial");

    this.crearCuerpoRigidosTanque = function () {
        console.log("TanqueSim.crearCuerpoRigidosTanque");
        // creamos el cuerpo rigido del chassis	
        var chassisShape = new CANNON.Box(new CANNON.Vec3(this.largoChassis / 2, this.anchoChassis / 2, this.altoChassis / 2));
        this.chassisRb = new CANNON.RigidBody(mass * 10, chassisShape);
        this.chassisRb.useQuaternion = true;
        this.chassisRb.position.set(0, 0, alturaInicial);

        //function( radiusTop, radiusBottom, height , numSegments ) 
        var wheelShape = new CANNON.Sphere(this.radioRueda);

        //new CANNON.Cylinder(auto.radioRueda,auto.radioRueda,auto.profundidadRueda,auto.segmentosRueda);

        this.ruedaIzqTraRb = new CANNON.RigidBody(mass, wheelShape, this.wheelMaterial);
        this.ruedaDerTraRb = new CANNON.RigidBody(mass, wheelShape, this.wheelMaterial);
        this.ruedaIzqDelRb = new CANNON.RigidBody(mass, wheelShape, this.wheelMaterial);
        this.ruedaDerDelRb = new CANNON.RigidBody(mass, wheelShape, this.wheelMaterial);

        this.ruedaIzqTraRb.useQuaternion = true;
        this.ruedaDerTraRb.useQuaternion = true;
        this.ruedaIzqDelRb.useQuaternion = true;
        this.ruedaDerDelRb.useQuaternion = true;

        // Position constrain wheels
        var zero = new CANNON.Vec3();

        this.ruedaIzqDelRb.position.set(this.largoChassis / 2, distanciaRuedaAlChassis, alturaInicial);
        this.ruedaDerDelRb.position.set(this.largoChassis / 2, -distanciaRuedaAlChassis, alturaInicial);
        this.ruedaIzqTraRb.position.set(-this.largoChassis / 2, distanciaRuedaAlChassis, alturaInicial);
        this.ruedaDerTraRb.position.set(-this.largoChassis / 2, -distanciaRuedaAlChassis, alturaInicial);

        var bodies = [this.chassisRb, this.ruedaDerTraRb, this.ruedaIzqTraRb, this.ruedaDerDelRb, this.ruedaIzqDelRb];

        for (var i = 0; i < bodies.length; i++)
            _world.add(bodies[i]);
    };

    this.updateContraintsTanque = function () {
        console.log("TanqueSim.updateContraints velocidadMotor:" + this.velocidadMotor + " anguloVolante:" + this.anguloVolante);
        var zero = new CANNON.Vec3();
        // remomevos los constraints

        for (var i = 0; i < constraints.length; i++)
            _world.removeConstraint(constraints[i]);

        // Hinge the wheels
        var leftAxis = new CANNON.Vec3(0, 1, 0);
        var rightAxis = new CANNON.Vec3(0, -1, 0);

        var angVolanteEnRadianes = Math.max(-45, Math.min(45, this.anguloVolante)) * Math.PI / 180;

        leftFrontAxis = new CANNON.Vec3(Math.sin(angVolanteEnRadianes), Math.cos(angVolanteEnRadianes), 0);
        rightFrontAxis = new CANNON.Vec3(Math.sin(angVolanteEnRadianes), Math.cos(angVolanteEnRadianes), 0);

        leftFrontAxis.normalize();
        rightFrontAxis.normalize();

        //tren delantero
        var frontLeftHinge = new CANNON.HingeConstraint(this.chassisRb,
                new CANNON.Vec3(this.largoChassis / 2, distanciaRuedaAlChassis, -this.altoChassis / 2), leftFrontAxis,
                this.ruedaIzqDelRb, zero, leftAxis);
        var frontRightHinge = new CANNON.HingeConstraint(this.chassisRb,
                new CANNON.Vec3(this.largoChassis / 2, -distanciaRuedaAlChassis, -this.altoChassis / 2), rightFrontAxis,
                this.ruedaDerDelRb, zero, rightAxis);
        // tren trasero
        var backLeftHinge = new CANNON.HingeConstraint(this.chassisRb,
                new CANNON.Vec3(-this.largoChassis / 2, distanciaRuedaAlChassis, -this.altoChassis / 2), leftAxis,
                this.ruedaIzqTraRb, zero, leftAxis);
        var backRightHinge = new CANNON.HingeConstraint(this.chassisRb,
                new CANNON.Vec3(-this.largoChassis / 2, -distanciaRuedaAlChassis, -this.altoChassis / 2), rightAxis,
                this.ruedaDerTraRb, zero, rightAxis);

        backLeftHinge.enableMotor();
        backRightHinge.enableMotor();

        var traccionRuedaIzq = this.velocidadMotor;
        var traccionRuedaDer = this.velocidadMotor;

        if (angVolanteEnRadianes > 0) {
            traccionRuedaDer = Math.cos(angVolanteEnRadianes) * traccionRuedaDer * 0.8;
        } else if (angVolanteEnRadianes < 0) {
            traccionRuedaIzq = Math.cos(angVolanteEnRadianes) * traccionRuedaIzq * 0.8;
        }

        backLeftHinge.motorTargetVelocity = -traccionRuedaIzq;
        backRightHinge.motorTargetVelocity = traccionRuedaDer;

        constraints = [frontLeftHinge, frontRightHinge, backLeftHinge, backRightHinge];

        for (var i = 0; i < constraints.length; i++)
            _world.addConstraint(constraints[i]);
    };

    this.incrementarVelocidad = function (incremento) {
        //console.log("incrementarVelocidad()");
        this.velocidadMotor += incremento;
        this.updateContraintsTanque();
    };

    this.incrementarAnguloVolante = function (incremento) {
        this.anguloVolante = Math.max(-45, Math.min(45, this.anguloVolante + incremento));
        this.updateContraintsTanque();
    };

    this.getOrientacionChassis = function () {
        var rotation = new CANNON.Vec3();
        this.chassisRb.quaternion.toEuler(rotation); // orden de las rotaciones YZX
        return rotation;
    };

    this.getOrientacionRuedaDerDel = function () {
        var rotation = new CANNON.Vec3();
        this.ruedaDerDelRb.quaternion.toEuler(rotation); // orden de las rotaciones YZX
        return rotation;
    };

    this.getOrientacionRuedaIzqDel = function () {
        var rotation = new CANNON.Vec3();
        this.ruedaIzqDelRb.quaternion.toEuler(rotation); // orden de las rotaciones YZX
        return rotation;
    };

    this.getOrientacionRuedaDerTra = function () {
        var rotation = new CANNON.Vec3();
        this.ruedaDerTraRb.quaternion.toEuler(rotation); // orden de las rotaciones YZX
        return rotation;
    };

    this.getOrientacionRuedaIzqTra = function () {
        var rotation = new CANNON.Vec3();
        this.ruedaIzqTraRb.quaternion.toEuler(rotation); // orden de las rotaciones YZX
        return rotation;
    };
    this.crearCuerpoRigidosTanque();
    this.updateContraintsTanque();

}

function Simulador() {
    this.tanque;

    var world;
    // inicalizacion del mundo fisico

    this.init = function () {
        world = new CANNON.World();
        world.gravity.set(0, 0, -10);
        world.broadphase = new CANNON.NaiveBroadphase();
        world.solver.iterations = 10;

        var mass = 1;
        var friccion = 1.0; // coeficiente de rosamiento
        var restitucion = 0.1; // coef de restitucion 0.0 coche plastico   1.0 coche elastico

        this.tanque = new TanqueSim(world);

        // Plano del Suelo, ubicado en z = -10
        var groundMaterial = new CANNON.Material("groundMaterial");
        var groundShape = new CANNON.Plane();
        var ground = new CANNON.RigidBody(0, groundShape, groundMaterial); // masa 0 implica que el cuerpo tiene masa infinita
        ground.position.z = -10;
        world.add(ground);

        // Loma, es un cono construido con un cilindro de radio superior casi 0

        var cylinderShape = new CANNON.Cylinder(10, 50, 10, 16);
        var cylinderBody = new CANNON.RigidBody(0, cylinderShape);
        cylinderBody.position.set(80, 0, -5);// el 0 es el centro del cilindro, 
        //world.add(cylinderBody);

        var wheelGroundContactMaterial = new CANNON.ContactMaterial(groundMaterial, this.tanque.wheelMaterial, friccion, restitucion);
        world.addContactMaterial(wheelGroundContactMaterial);
    };

    this.update = function () {
        var timeStep = 1 / 60;
        // Step the physics world
        world.step(timeStep);
    };

    this.init();
}



