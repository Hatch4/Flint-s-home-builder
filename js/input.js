// input.js
class Input {
    constructor(canvas, grid, camera) {
        this.canvas = canvas;
        this.grid = grid;
        this.camera = camera;

        this.draggingItem = null;
        this.mouse = { x: 0, y: 0 };

        this.bindEvents();
    }

    bindEvents() {
        // Track mouse movement
        this.canvas.addEventListener("mousemove", (e) => this.onMouseMove(e));

        // Start dragging item
        this.canvas.addEventListener("mousedown", (e) => this.onMouseDown(e));

        // Drop item
        this.canvas.addEventListener("mouseup", (e) => this.onMouseUp(e));
    }

    onMouseMove(e) {
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;

        if (!this.draggingItem) return;

        // Convert screen → iso → snapped tile
        const iso = this.camera.screenToIso(this.mouse.x, this.mouse.y);
        const tile = this.grid.snap(iso.x, iso.y);

        // Validate placement
        const valid = window.placementrules.isValid(tile.x, tile.y, this.draggingItem);

        // Update preview
        window.placementpreview.update(tile.x, tile.y, valid);
    }

    onMouseDown(e) {
        // Check if user clicked an item in the bottom tray
        const itemKey = window.ui.pickItem(e);
        if (!itemKey) return;

        this.draggingItem = Items[itemKey];
    }

    onMouseUp(e) {
        if (!this.draggingItem) return;

        const iso = this.camera.screenToIso(this.mouse.x, this.mouse.y);
        const tile = this.grid.snap(iso.x, iso.y);

        const valid = window.placementrules.isValid(tile.x, tile.y, this.draggingItem);

        if (valid) {
            // Place item into grid
            this.grid.place(tile.x, tile.y, this.draggingItem);

            // Dust puff animation
            window.animation.spawnDust(tile.x, tile.y);
        }

        // Clear drag state
        this.draggingItem = null;
        window.placementpreview.clear();
    }
}
