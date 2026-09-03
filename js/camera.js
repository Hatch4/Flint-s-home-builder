// camera.js
class Camera {
    constructor(grid) {
        this.grid = grid;       // ⭐ store grid locally
        this.angle = 0;
        this.swipeStartX = null;
        this.swipeThreshold = 40;
    }

    startSwipe(x) {
        this.swipeStartX = x;
    }

    endSwipe(x) {
        if (this.swipeStartX === null) return;

        const dx = x - this.swipeStartX;

        if (dx > this.swipeThreshold) this.rotateClockwise();
        else if (dx < -this.swipeThreshold) this.rotateCounterClockwise();

        this.swipeStartX = null;
    }

    rotateClockwise() {
        this.angle = (this.angle + 90) % 360;
    }

    rotateCounterClockwise() {
        this.angle = (this.angle + 270) % 360;
    }

    isoToScreen(x, y) {
        const tileWidth = 96;
        const tileHeight = 48;

        let rx = x;
        let ry = y;

        // rotation
        if (this.angle === 90) {
            rx = this.grid.height - y - 1;
            ry = x;
        } else if (this.angle === 180) {
            rx = this.grid.width - x - 1;
            ry = this.grid.height - y - 1;
        } else if (this.angle === 270) {
            rx = y;
            ry = this.grid.width - x - 1;
        }

        // ⭐ center grid WITHOUT window.game
        const totalHeight = this.grid.height * tileHeight / 2;
        const offsetX = window.innerWidth / 2;
        const offsetY = window.innerHeight / 2 - totalHeight / 2;

        const screenX = (rx - ry) * (tileWidth / 2) + offsetX;
        const screenY = (rx + ry) * (tileHeight / 2) + offsetY;

        return { x: screenX, y: screenY };
    }
}
