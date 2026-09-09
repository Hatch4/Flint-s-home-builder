// input.js
class Input {
    constructor(canvas, grid, camera) {
        this.canvas = canvas;
        this.grid = grid;
        this.camera = camera;

        this.draggingItem = null;
        this.mouse = { x: 0, y: 0 };

        this.touchStartTime = 0;

        this.deleteMode = false;
        this.interiorMode = false;

        // ⭐ FIX: make input globally available immediately
        window.input = this;

        this.bindEvents();
    }

    // ---------------------------------------------------------
    // EVENT BINDING
    // ---------------------------------------------------------
    bindEvents() {

        /* -----------------------------
           DESKTOP MOUSE
        ----------------------------- */

        this.canvas.addEventListener("pointermove", (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;

            if (!this.draggingItem) return;

            const iso = this.camera.screenToIso(this.mouse.x, this.mouse.y);
            const tile = this.grid.snap(iso.x, iso.y);

            const valid = window.placementrules.isValid(tile.x, tile.y, this.draggingItem);
            window.placementpreview.update(tile.x, tile.y, valid);
        });

        this.canvas.addEventListener("pointerdown", (e) => {
    // Prevent canvas clicks from starting a new drag
    if (!this.draggingItem) {
        return;
    }
});

        this.canvas.addEventListener("pointerup", () => {
    if (!this.draggingItem) return;

    const iso = this.camera.screenToIso(this.mouse.x, this.mouse.y);
    const tile = this.grid.snap(iso.x, iso.y);

    const success = window.game.placement.attempt(tile.x, tile.y, this.draggingItem);

    if (success) {
        // placement.js already spawns dust + updates requirements
    }

    this.draggingItem = null;
    window.placementpreview.clear();
});


        /* -----------------------------
           KEYBOARD
        ----------------------------- */

        window.addEventListener("keydown", (e) => {
            if (!this.draggingItem) return;

            if (e.key === "r" || e.key === "R") {
                this.rotateCurrentItem();
            }
        });

        /* -----------------------------
           MOUSE WHEEL ROTATE
        ----------------------------- */

        window.addEventListener("wheel", (e) => {
            if (!this.draggingItem) return;

            const delta = e.deltaY > 0 ? 90 : -90;
            this.draggingItem.rotation = (this.draggingItem.rotation + delta + 360) % 360;
        });

        /* -----------------------------
           MOBILE TOUCH
        ----------------------------- */

        this.canvas.addEventListener("touchstart", (e) => {
            this.touchStartTime = Date.now();

            const touch = e.touches[0];
            this.mouse.x = touch.clientX;
            this.mouse.y = touch.clientY;

            const itemKey = window.uiPickItemTouch?.(touch);
            if (itemKey) {
                this.startDraggingItem(Items[itemKey]);
            }
        });

        this.canvas.addEventListener("touchmove", (e) => {
            const touch = e.touches[0];
            this.mouse.x = touch.clientX;
            this.mouse.y = touch.clientY;

            if (!this.draggingItem) return;

            // Two‑finger rotate
            if (e.touches.length === 2) {
                this.rotateCurrentItem();
                return;
            }

            const iso = this.camera.screenToIso(this.mouse.x, this.mouse.y);
            const tile = this.grid.snap(iso.x, iso.y);

            const valid = window.placementrules.isValid(tile.x, tile.y, this.draggingItem);
            window.placementpreview.update(tile.x, tile.y, valid);
        });

        this.canvas.addEventListener("touchend", () => {
    if (!this.draggingItem) return;

    const duration = Date.now() - this.touchStartTime;

    if (duration > 400) {
        this.rotateCurrentItem();
        return;
    }

    const iso = this.camera.screenToIso(this.mouse.x, this.mouse.y);
    const tile = this.grid.snap(iso.x, iso.y);

    const success = window.game.placement.attempt(tile.x, tile.y, this.draggingItem);

    if (success) {
        // placement.js already handles dust + requirements
    }

    this.draggingItem = null;
    window.placementpreview.clear();
});
    }

    // ---------------------------------------------------------
    // START DRAGGING ITEM
    // ---------------------------------------------------------
    startDraggingItem(item) {
        this.draggingItem = { ...item, rotation: 0 };
    }

    // ---------------------------------------------------------
    // ROTATE ITEM
    // ---------------------------------------------------------
    rotateCurrentItem() {
        if (!this.draggingItem) return;
        this.draggingItem.rotation = (this.draggingItem.rotation + 90) % 360;
    }

    // ---------------------------------------------------------
    // DELETE MODE
    // ---------------------------------------------------------
    toggleDeleteMode() {
        this.deleteMode = !this.deleteMode;
    }

    // ---------------------------------------------------------
    // INTERIOR MODE (placeholder)
    // ---------------------------------------------------------
    toggleInteriorMode() {
        this.interiorMode = !this.interiorMode;
    }
}
