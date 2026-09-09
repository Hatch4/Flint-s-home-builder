class Camera {
    constructor(tileW, tileH) {
        this.tileW = tileW;
        this.tileH = tileH;

        this.x = 480;   // center offset (tweak as needed)
        this.y = 360;
        this.zoom = 1;
    }

    // SCREEN → ISO
    screenToIso(screenX, screenY) {
        const x = (screenX - this.x) / this.zoom;
        const y = (screenY - this.y) / this.zoom;

        const isoX = (y / this.tileH) + (x / this.tileW);
        const isoY = (y / this.tileH) - (x / this.tileW);

        return { x: isoX, y: isoY };
    }

    // ISO → SCREEN
    isoToScreen(isoX, isoY) {
        const x = (isoX - isoY) * (this.tileW / 2);
        const y = (isoX + isoY) * (this.tileH / 2);

        return {
            x: x * this.zoom + this.x,
            y: y * this.zoom + this.y
        };
    }
}
