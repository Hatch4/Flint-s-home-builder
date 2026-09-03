// input.js
class Input {
    constructor(canvas, grid, camera) {
        this.canvas = canvas;
        this.grid = grid;
        this.camera = camera;

        this.draggingItem = null;
        this.dragX = 0;
        this.dragY = 0;

        canvas.addEventListener("pointerdown", (e) => this.onPointerDown(e));
    }

    onPointerDown(e) {
        // Canvas click (not tray)
        const tile = this.camera.screenToIso(e.clientX, e.clientY);
        if (!tile) return;

        this.grid.selected = tile;
    }

    handleDragMove(x, y, item) {
        this.draggingItem = item;
        this.dragX = x;
        this.dragY = y;
    }

    handleDragEnd(x, y, item) {
        this.draggingItem = item;

        this.attemptPlacementAtScreen(x, y, item);

        this.draggingItem = null;
    }

    attemptPlacementAtScreen(screenX, screenY, item) {
        const tile = this.camera.screenToIso(screenX, screenY);
        if (!tile) return;

        this.grid.selected = tile;

        this.grid.placeItem(tile.x, tile.y, item);
    }
}
