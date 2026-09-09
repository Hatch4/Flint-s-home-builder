class Input {
    constructor(canvas, grid, camera) {
        this.canvas = canvas;
        this.grid = grid;
        this.camera = camera;

        this.draggingItem = null;
        this.mouse = { x: 0, y: 0 };

        this.deleteMode = false;
        this.interiorMode = false;

        window.input = this;

        // Prevent scrolling during drag on mobile
        this.canvas.style.touchAction = "none";

        this.bindEvents();
    }

    bindEvents() {

        // -----------------------------
        // POINTER MOVE (desktop + mobile)
        // -----------------------------
        this.canvas.addEventListener("pointermove", (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;

            if (!this.draggingItem) return;

            const iso = this.camera.screenToIso(this.mouse.x, this.mouse.y);
            const tile = this.grid.snap(iso.x, iso.y);

            const valid = window.placementrules.isValid(tile.x, tile.y, this.draggingItem);
            window.placementpreview.update(tile.x, tile.y, valid);
        });

        // -----------------------------
        // POINTER DOWN (canvas NEVER starts drag)
        // -----------------------------
        this.canvas.addEventListener("pointerdown", (e) => {
            if (!this.draggingItem) {
                // Prevent accidental drag restart
                e.preventDefault();
                e.stopImmediatePropagation();
            }
        });

        // -----------------------------
        // POINTER UP (place item)
        // -----------------------------
        this.canvas.addEventListener("pointerup", () => {
            if (!this.draggingItem) return;

            const iso = this.camera.screenToIso(this.mouse.x, this.mouse.y);
            const tile = this.grid.snap(iso.x, iso.y);

            const success = window.game.placement.attempt(tile.x, tile.y, this.draggingItem);

            this.draggingItem = null;
            window.placementpreview.clear();
        });

        // -----------------------------
        // KEYBOARD ROTATE
        // -----------------------------
        window.addEventListener("keydown", (e) => {
            if (!this.draggingItem) return;
            if (e.key === "r" || e.key === "R") this.rotateCurrentItem();
        });

        // -----------------------------
        // MOUSE WHEEL ROTATE
        // -----------------------------
        window.addEventListener("wheel", (e) => {
            if (!this.draggingItem) return;
            const delta = e.deltaY > 0 ? 90 : -90;
            this.draggingItem.rotation = (this.draggingItem.rotation + delta + 360) % 360;
        });
    }

    // -----------------------------
    // START DRAGGING
    // -----------------------------
    startDraggingItem(item) {
        this.draggingItem = { ...item, rotation: 0 };
    }

    // -----------------------------
    // ROTATE ITEM
    // -----------------------------
    rotateCurrentItem() {
        if (!this.draggingItem) return;
        this.draggingItem.rotation = (this.draggingItem.rotation + 90) % 360;
    }

    toggleDeleteMode() {
        this.deleteMode = !this.deleteMode;
    }

    toggleInteriorMode() {
        this.interiorMode = !this.interiorMode;
    }
}
