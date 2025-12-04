// File: math/Vec3.js
class Vec3 {
    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    
    // Basic arithmetic
    add(v) {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        return this;
    }
    
    sub(v) {
        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
        return this;
    }
    
    mulScalar(s) {
        this.x *= s;
        this.y *= s;
        this.z *= s;
        return this;
    }
    
    divScalar(s) {
        return this.mulScalar(1 / s);
    }
    
    // Vector operations
    dot(v) {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }
    
    cross(v) {
        // Return NEW vector (standard behavior)
        return new Vec3(
            this.y * v.z - this.z * v.y,
            this.z * v.x - this.x * v.z,
            this.x * v.y - this.y * v.x
        );
    }
    
    // Length calculations
    lengthSq() {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    }
    
    length() {
        return Math.sqrt(this.lengthSq());
    }
    
    // Normalization with proper error handling
    normalize() {
        const lenSq = this.lengthSq();
        if (lenSq > 0) {
            return this.divScalar(Math.sqrt(lenSq));
        }
        return this;  // Zero vector stays zero
    }
    
    // Utility methods
    clone() {
        return new Vec3(this.x, this.y, this.z);
    }
    
    copy(v) {
        this.x = v.x;
        this.y = v.y;
        this.z = v.z;
        return this;
    }
    
    equals(v) {
        return (this.x === v.x) && (this.y === v.y) && (this.z === v.z);
    }
    
    // Static constants
    static ZERO = new Vec3(0, 0, 0);
    static ONE = new Vec3(1, 1, 1);
    static UP = new Vec3(0, 1, 0);
    static DOWN = new Vec3(0, -1, 0);
    static LEFT = new Vec3(-1, 0, 0);
    static RIGHT = new Vec3(1, 0, 0);
    static FORWARD = new Vec3(0, 0, 1);
    static BACK = new Vec3(0, 0, -1);
}

export { Vec3 };
