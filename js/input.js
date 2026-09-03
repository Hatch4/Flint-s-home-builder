// input.js
class Input {
    constructor(canvas, grid, camera) {
        this.canvas = canvas;
        this.grid = grid;
        this.camera = camera;

        this.draggingItem = null;
        this.dragX = 0;
        this.dragY = 0;

        this.pointerDown = false;

        this.bindEvents();
    }

    bindEvents() {
        // Use pointer events for both mouse + touch
        this.canvas.addEventListener("pointerdown", (e) => this.onPointerDown(e));
        this.canvas.addEventListener("pointermove", (e) => this.onPointerMove(e));
        this.canvas.addEventListener("pointerup", (e) => this.onPointerUp(e));
        this.canvas.addEventListener("pointercancel", (e) => this.onPointerUp(e));
    }

    getPos(e) {
        return {
            x: e.clientX,
            y: e.clientY
        };
    }

    onPointerDown(e) {
        this.pointerDown = true;

        const pos = this.getPos(e);

        // Start swipe detection
        this.camera.startSwipe(pos.x);

        // Check tile hit
        const tile = this.getTileAt(pos.x, pos.y);
        if (tile) {
            document.dispatchEvent(new CustomEvent("tile-hover", { detail: tile }));
            this.grid.selectTile(tile.x, tile.y);
            return;
        }

        // Check tray hit
        const trayItem = this.checkTrayHit(pos.x, pos.y);
        if (trayItem) {
            this.draggingItem = Items[trayItem];
            this.dragX = pos.x;
            this.dragY = pos.y;
            return;
        }

        // Clear selection
        this.grid.clearSelection();
    }

    onPointerMove(e) {
        if (!this.pointerDown) return;

        const pos = this.getPos(e);

        // Tile hover
        const tile = this.getTileAt(pos.x, pos.y);
        if (tile) {
            document.dispatchEvent(new CustomEvent("tile-hover", { detail: tile }));
        }

        // Dragging item
        if (this.draggingItem) {
            this.dragX = pos.x;
            this.dragY = pos.y;
        }
    }

    onPointerUp(e) {
        const pos = this.getPos(e);

        // End swipe
        this.camera.endSwipe(pos.x);

        // Placement
        if (this.draggingItem) {
            const tile = this.getTileAt(pos.x, pos.y);

            if (tile) {
                Placement.attemptPlacement(
                    this.grid,
                    tile.x,
                    tile.y,
                    this.draggingItem
                );
            }

            this.draggingItem = null;
        }

        this.pointerDown = false;
    }

    // Convert screen → tile
    getTileAt(screenX, screenY) {
        const tileWidth = 96;
        const tileHeight = 48;

        for (let y = 0; y < this.grid.height; y++) {
            for (let x = 0; x < this.grid.width; x++) {

                const pos = this.isoToScreen(x, y);

                const dx = screenX - pos.x;
                const dy = screenY - pos.y;

                // Correct diamond hit detection
                const inside =
                    Math.abs(dx) / (tileWidth / 2) +
                    Math.abs(dy) / (tileHeight / 2) <= 1;

                if (inside) {
                    return { x, y };
                }
            }
        }

        return null;
    }

    isoToScreen(x, y) {
        return this.camera.isoToScreen(x, y);
    }

    // Bottom tray hit detection
    checkTrayHit(x, y) {
        const tray = document.getElementById("bottom-tray");
        const rect = tray.getBoundingClientRect();

        if (y < rect.top || y > rect.bottom) return null;

        for (let el of tray.children) {
            const r = el.getBoundingClientRect();
            if (x >= r.left && x <= r.right) {
                return el.dataset.item;
            }
        }

        return null;
    }
}
