// camera.js
class Camera {
    constructor() {
        this.angle = 0;              // 0, 90, 180, 270
        this.targetAngle = 0;        // for tweening
        this.rotationSpeed = 0.15;   // tween factor

        this.interiorMode = false;   // roof hidden, interior walls shown

        this.swipeStartX = null;
        this.swipeThreshold = 40;    // minimum swipe distance
    }

    // Called every frame from renderer or main loop
    update() {
        // Smooth tweening toward target angle
        if (this.angle !== this.targetAngle) {
            const diff = this.targetAngle - this.angle;

            if (Math.abs(diff) < 1) {
                this.angle = this.targetAngle;
            } else {
                this.angle += diff * this.rotationSpeed;
            }
        }
    }

    // Rotate camera 90° clockwise
    rotateRight() {
        this.targetAngle = (this.targetAngle + 90) % 360;
    }

    // Rotate camera 90° counter‑clockwise
    rotateLeft() {
        this.targetAngle = (this.targetAngle - 90 + 360) % 360;
    }

    // Toggle interior/exterior mode
    toggleInterior() {
        this.interiorMode = !this.interiorMode;
    }

    // Touchstart handler for swipe detection
    startSwipe(x) {
        this.swipeStartX = x;
    }

    // Touchend handler for swipe detection
    endSwipe(x) {
        if (this.swipeStartX === null) return;

        const dx = x - this.swipeStartX;

        if (dx > this.swipeThreshold) {
            this.rotateLeft();
        } else if (dx < -this.swipeThreshold) {
            this.rotateRight();
        }

        this.swipeStartX = null;
    }
}
