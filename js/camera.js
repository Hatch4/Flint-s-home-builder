// Camera.js
class Camera {
    constructor(grid, canvas) {
        this.grid = grid;
        this.canvas = canvas;

        // Camera position in world space
        this.x = 300;     // good default center
        this.y = 150;     // good default height

        // Zoom level
        this.zoom = 0.35; // perfect for your Flint + grid

        // Tile size (must match renderer)
        this.tileW = 96;
        this.tileH = 48;

        // Dragging state
        this.dragging = false;
        this.lastX = 0;
        this.lastY = 0;

        // Touch pinch zoom
        this.touchDistance = 0;

        this.attachEvents();
    }

    // ---------------------------------------------------------
    // EVENT HANDLERS
    // ---------------------------------------------------------
    attachEvents() {
        // PAN
        this.canvas.addEventListener("pointerdown", (e) => {
            this.dragging = true;
            this.lastX = e.clientX;
            this.lastY = e.clientY;
        });

        this.canvas.addEventListener("pointermove", (e) => {
            if (!this.dragging) return;

            const dx = e.clientX - this.lastX;
            const dy = e.clientY - this.lastY;

            this.x += dx;
            this.y += dy;

            this.lastX = e.clientX;
            this.lastY = e.clientY;
        });

        this.canvas.addEventListener("pointerup", () => {
            this.dragging = false;
        });

        // ZOOM (mouse wheel)
        this.canvas.addEventListener("wheel", (e) => {
            const oldZoom = this.zoom;

            if (e.deltaY < 0) this.zoom *= 1.1;
            else this.zoom *= 0.9;

            this.zoom = Math.max(0.2, Math.min(3, this.zoom));

            // Zoom toward cursor
            const mx = e.clientX;
            const my = e.clientY;

            this.x = mx - (mx - this.x) * (this.zoom / oldZoom);
            this.y = my - (my - this.y) * (this.zoom / oldZoom);
        });

        // TOUCH PINCH ZOOM
        this.canvas.addEventListener("touchmove", (e) => {
            if (e.touches.length === 2) {
                const dx = e.touches[0].clientX - e.touches[1].clientX;
                const dy = e.touches[0].clientY - e.touches[1].clientY;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (this.touchDistance !== 0) {
                    const scale = dist / this.touchDistance;
                    this.zoom *= scale;
                    this.zoom = Math.max(0.2, Math.min(3, this.zoom));
                }

                this.touchDistance = dist;
            }
        });

        this.canvas.addEventListener("touchend", () => {
            this.touchDistance = 0;
        });
    }

    // ---------------------------------------------------------
    // ISO → SCREEN (camera transform happens in renderer)
    // ---------------------------------------------------------
    isoToScreen(ix, iy) {
        const x = (ix - iy) * (this.tileW / 2);
        const y = (ix + iy) * (this.tileH / 2);
        return { x, y };
    }

    // ---------------------------------------------------------
    // SCREEN → ISO (convert screen → camera space)
    // ---------------------------------------------------------
    screenToIso(sx, sy) {
        // Convert screen → camera space
        const cx = (sx - this.x) / this.zoom;
        const cy = (sy - this.y) / this.zoom;

        const ix = (cy / (this.tileH / 2) + cx / (this.tileW / 2)) / 2;
        const iy = (cy / (this.tileH / 2) - cx / (this.tileW / 2)) / 2;

        return { x: ix, y: iy };
    }
}
