// input.js
class Input {
    constructor(canvas, grid, camera) {
        this.canvas = canvas;
        this.grid = grid;
        this.camera = camera;

        this.draggingItem = null;     // item being dragged from tray
        this.dragX = 0;
        this.dragY = 0;

        this.activeTouchId = null;

        this.tileHitCache = [];       // used for fast hit detection

         // 🔥 Disable browser drag/drop so game placement works
        this.canvas.addEventListener("dragstart", (e) => e.preventDefault());
        this.canvas.addEventListener("drop", (e) => e.preventDefault());
        this.canvas.addEventListener("dragover", (e) => e.preventDefault());
        
        this.bindEvents();
    }

    bindEvents() {
        this.canvas.addEventListener("touchstart", (e) => this.onTouchStart(e), { passive: false });
        this.canvas.addEventListener("touchmove", (e) => this.onTouchMove(e), { passive: false });
        this.canvas.addEventListener("touchend", (e) => this.onTouchEnd(e), { passive: false });
    }

    getTouch(e) {
        const t = e.changedTouches[0];
        return { x: t.clientX, y: t.clientY, id: t.identifier };
    }

    onTouchStart(e) {
    e.preventDefault();
    const t = this.getTouch(e);

    this.activeTouchId = t.id;

    // Start swipe detection for camera
    this.camera.startSwipe(t.x);

    // Check if user tapped a tile
    const tile = this.getTileAt(t.x, t.y);
    if (tile) {

        // 🔥 DEBUG OVERLAY EVENT
        document.dispatchEvent(new CustomEvent("tile-hover", { detail: tile }));

        this.grid.selectTile(tile.x, tile.y);
        return;
    }

        // Check if user tapped an item in the tray
        const trayItem = this.checkTrayHit(t.x, t.y);
        if (trayItem) {
            this.draggingItem = Items[trayItem];
            this.dragX = t.x;
            this.dragY = t.y;
            return;
        }

        // Otherwise clear selection
        this.grid.clearSelection();
    }

    onTouchMove(e) {
    e.preventDefault();
    const t = this.getTouch(e);

    // Check tile under finger while moving
    const tile = this.getTileAt(t.x, t.y);
    if (tile) {

        // 🔥 DEBUG OVERLAY EVENT
        document.dispatchEvent(new CustomEvent("tile-hover", { detail: tile }));
    }

    if (this.draggingItem) {
        this.dragX = t.x;
        this.dragY = t.y;
    }
}

    onTouchEnd(e) {
        e.preventDefault();
        const t = this.getTouch(e);

        // End swipe detection for camera
        this.camera.endSwipe(t.x);

        if (this.draggingItem) {
            const tile = this.getTileAt(t.x, t.y);

            if (tile) {
                // Ask placement.js to validate and place
                Placement.attemptPlacement(
                    this.grid,
                    tile.x,
                    tile.y,
                    this.draggingItem
                );
            }

            this.draggingItem = null;
        }

        this.activeTouchId = null;
    }

    // Convert screen coordinates → tile coordinates
    getTileAt(screenX, screenY) {
        const tileWidth = 96;
        const tileHeight = 48;

        const offsetX = this.canvas.width / 2;
        const offsetY = this.canvas.height / 2;

        // Reverse isometric projection
        for (let y = 0; y < this.grid.height; y++) {
            for (let x = 0; x < this.grid.width; x++) {

                const pos = this.isoToScreen(x, y);

                // Diamond hit detection
                const dx = screenX - pos.x;
                const dy = screenY - pos.y;

                const inside =
                    Math.abs(dx) <= tileWidth / 2 &&
                    Math.abs(dy - tileHeight / 2) <= tileHeight / 2;

                if (inside) {
                    return { x, y };
                }
            }
        }

        return null;
    }

    isoToScreen(x, y) {
    const angle = this.camera.angle;
    const tileWidth = 96;
    const tileHeight = 48;

    let rx = x;
    let ry = y;

    if (angle === 90) {
        rx = this.grid.height - y - 1;
        ry = x;
    } else if (angle === 180) {
        rx = this.grid.width - x - 1;
        ry = this.grid.height - y - 1;
    } else if (angle === 270) {
        rx = y;
        ry = this.grid.width - x - 1;
    }

    // USE THE SAME OFFSETS AS THE RENDERER
    const totalHeight = this.grid.height * tileHeight / 2;
    const offsetX = window.innerWidth / 2;
    const offsetY = window.innerHeight / 2 - totalHeight / 2;

    const screenX = (rx - ry) * (tileWidth / 2) + offsetX;
    const screenY = (rx + ry) * (tileHeight / 2) + offsetY;

    return { x: screenX, y: screenY };
}

    // Check if user tapped an item in the bottom tray
    checkTrayHit(x, y) {
        const tray = document.getElementById("bottom-tray");
        const rect = tray.getBoundingClientRect();

        if (y < rect.top || y > rect.bottom) return null;

        // Find which item was tapped
        const elements = tray.children;
        for (let el of elements) {
            const r = el.getBoundingClientRect();
            if (x >= r.left && x <= r.right) {
                return el.dataset.item; // item name
            }
        }

        return null;
    }
}
