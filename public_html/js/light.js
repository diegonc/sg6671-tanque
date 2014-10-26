function Light(ambientColor, position, directionalColor) {
    this.ambientColor = ambientColor;
    this.worldPos = position;
    this.directionalColor = directionalColor;
    this.position = vec3.set(position, []);
}

Light.prototype.applyCamera = function(c) {
    mat4.multiplyVec3(c, this.worldPos, this.position);  
};
