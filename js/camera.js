// camera.js
class Camera {
    constructor(grid, canvas) {
        this.grid = grid;
        this.canvas = canvas;

        this.angle = 0;
        this.swipeStartX = null;
        this.swipeThreshold = 40;

        this.tileWidth = 96;
        this.tileHeight = 48;
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
        let rx = x;
        let ry = y;

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

        const w = this.tileWidth / 2;
        const h = this.tileHeight / 2;

        const gridPixelHeight = (this.grid.width + this.grid.height) * h;

        const offsetX = this.canvas.width / 2;
        const offsetY = (this.canvas.height - gridPixelHeight) / 2;

        const screenX = (rx - ry) * w + offsetX;
        const screenY = (rx + ry) * h + offsetY;

        return { x: screenX, y: screenY };
    }

    screenToIso(screenX, screenY) {
        const w = this.tileWidth / 2;
        const h = this.tileHeight / 2;

        const gridPixelHeight = (this.grid.width + this.grid.height) * h;

        const offsetX = this.canvas.width / 2;
        const offsetY = (this.canvas.height - gridPixelHeight) / 2;

        const x = screenX - offsetX;
        const y = screenY - offsetY;

        const isoX = Math.floor((y / h + x / w) / 2);
        const isoY = Math.floor((y / h - x / w) / 2);

        if (
            isoX < 0 ||
            isoY < 0 ||
            isoX >= this.grid.width ||
            isoY >= this.grid.height
        ) return null;

        return { x: isoX, y: isoY };
    }
}
