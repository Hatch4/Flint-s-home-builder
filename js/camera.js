// camera.js
class Camera {
    constructor() {
        this.angle = 0;          // 0, 90, 180, 270
        this.swipeStartX = null;
        this.swipeThreshold = 40; // pixels required to rotate
    }

    // Called when pointer goes down
    startSwipe(x) {
        this.swipeStartX = x;
    }

    // Called when pointer goes up
    endSwipe(x) {
        if (this.swipeStartX === null) return;

        const dx = x - this.swipeStartX;

        // Swipe right → rotate clockwise
        if (dx > this.swipeThreshold) {
            this.rotateClockwise();
        }

        // Swipe left → rotate counterclockwise
        else if (dx < -this.swipeThreshold) {
            this.rotateCounterClockwise();
        }

        this.swipeStartX = null;
    }

    rotateClockwise() {
        this.angle = (this.angle + 90) % 360;
    }

    rotateCounterClockwise() {
        this.angle = (this.angle + 270) % 360;
    }

    // Convert grid → screen using current angle
    isoToScreen(x, y) {
        const tileWidth = 96;
        const tileHeight = 48;

        let rx = x;
        let ry = y;

        // Rotation logic
        if (this.angle === 90) {
            rx = window.game.grid.height - y - 1;
            ry = x;
        } else if (this.angle === 180) {
            rx = window.game.grid.width - x - 1;
            ry = window.game.grid.height - y - 1;
        } else if (this.angle === 270) {
            rx = y;
            ry = window.game.grid.width - x - 1;
        }

        // Centering offsets
        const totalHeight = window.game.grid.height * tileHeight / 2;
        const offsetX = window.innerWidth / 2;
        const offsetY = window.innerHeight / 2 - totalHeight / 2;

        const screenX = (rx - ry) * (tileWidth / 2) + offsetX;
        const screenY = (rx + ry) * (tileHeight / 2) + offsetY;

        return { x: screenX, y: screenY };
    }
}
