// Camera.js
class Camera {
    constructor(grid, canvas) {
        this.grid = grid;
        this.canvas = canvas;

        // Camera position in screen space
        this.x = canvas.width / 2;
        this.y = 150;

        // Zoom level
        this.zoom = 1;

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

        // Mouse wheel zoom
        this.canvas.addEventListener("wheel", (e) => {
            const oldZoom = this.zoom;

            if (e.deltaY < 0) this.zoom *= 1.1;
            else this.zoom *= 0.9;

            this.zoom = Math.max(0.3, Math.min(3, this.zoom));

            // Zoom toward cursor
            const mx = e.clientX;
            const my = e.clientY;

            this.x = mx - (mx - this.x) * (this.zoom / oldZoom);
            this.y = my - (my - this.y) * (this.zoom / oldZoom);
        });

        // Touch pinch zoom
        this.canvas.addEventListener("touchmove", (e) => {
            if (e.touches.length === 2) {
                const dx = e.touches[0].clientX - e.touches[1].clientX;
                const dy = e.touches[0].clientY - e.touches[1].clientY;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (this.touchDistance !== 0) {
                    const scale = dist / this.touchDistance;
                    this.zoom *= scale;
                    this.zoom = Math.max(0.3, Math.min(3, this.zoom));
                }

                this.touchDistance = dist;
            }
        });

        this.canvas.addEventListener("touchend", () => {
            this.touchDistance = 0;
        });
    }

    // ---------------------------------------------------------
    // ISO → SCREEN
    // ---------------------------------------------------------
    isoToScreen(ix, iy) {
        const x = (ix - iy) * (this.tileW / 2);
        const y = (ix + iy) * (this.tileH / 2);

        return {
            x: this.x + x * this.zoom,
            y: this.y + y * this.zoom
        };
    }

    // ---------------------------------------------------------
    // SCREEN → ISO
    // ---------------------------------------------------------
    screenToIso(sx, sy) {
        const x = (sx - this.x) / this.zoom;
        const y = (sy - this.y) / this.zoom;

        const ix = (y / (this.tileH / 2) + x / (this.tileW / 2)) / 2;
        const iy = (y / (this.tileH / 2) - x / (this.tileW / 2)) / 2;

        return { x: ix, y: iy };
    }
}
