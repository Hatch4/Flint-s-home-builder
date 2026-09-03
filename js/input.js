// input.js
class Input {
    constructor(canvas, grid, camera) {
        this.canvas = canvas;
        this.grid = grid;
        this.camera = camera;

        this.draggingItem = null;

        canvas.addEventListener("pointerdown", (e) => this.onPointerDown(e));
    }

    onPointerDown(e) {
        const tile = this.camera.screenToIso(e.clientX, e.clientY);
        if (!tile) return;

        this.grid.selected = tile;
    }

    handleDragMove(x, y, item) {
        this.draggingItem = item;
    }

    handleDragEnd(x, y, item) {
        const tile = this.camera.screenToIso(x, y);
        if (!tile) return;

        Placement.attemptPlacement(this.grid, tile.x, tile.y, item);

        this.draggingItem = null;
    }
}
