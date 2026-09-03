// input.js
class Input {
    constructor(canvas, grid, camera) {
        this.canvas = canvas;
        this.grid = grid;
        this.camera = camera;

        this.draggingItem = null;
        this.mouse = { x: 0, y: 0 };

        this.touchStartTime = 0;

        this.deleteMode = false;   // ⭐ NEW

        this.bindEvents();
    }

    bindEvents() {
    // DESKTOP: mouse movement
    this.canvas.addEventListener("mousemove", (e) => this.onMouseMove(e));

    // DESKTOP: start dragging
    this.canvas.addEventListener("mousedown", (e) => this.onMouseDown(e));

    // DESKTOP: drop item
    this.canvas.addEventListener("mouseup", (e) => this.onMouseUp(e));

    // DESKTOP: rotate with R key
    window.addEventListener("keydown", (e) => this.onKeyDown(e));

    // DESKTOP: rotate with mouse wheel
    window.addEventListener("wheel", (e) => this.onWheel(e));

    // MOBILE: touch start
    this.canvas.addEventListener("touchstart", (e) => this.onTouchStart(e));

    // MOBILE: touch move (two‑finger rotate)
    this.canvas.addEventListener("touchmove", (e) => this.onTouchMove(e));

    // MOBILE: touch end (tap‑and‑hold rotate)
    this.canvas.addEventListener("touchend", (e) => this.onTouchEnd(e));

    // ROTATE BUTTON (mobile + desktop)
    const rotateBtn = document.getElementById("rotateBtn");
    if (rotateBtn) {
        rotateBtn.addEventListener("click", () => this.rotateItem());
    }

    // DELETE BUTTON — ⭐ FIXED
    const deleteBtn = document.getElementById("delete-btn");
    if (deleteBtn) {
        deleteBtn.addEventListener("click", () => {
            this.deleteMode = !this.deleteMode;
            deleteBtn.classList.toggle("active", this.deleteMode);
        });
    }

    // DESKTOP: right‑click delete
    this.canvas.addEventListener("contextmenu", (e) => this.onRightClick(e));
}


    // -----------------------------
    // DESKTOP INPUT
    // -----------------------------

    onMouseMove(e) {
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;

        if (!this.draggingItem) return;

        const iso = this.camera.screenToIso(this.mouse.x, this.mouse.y);
        const tile = this.grid.snap(iso.x, iso.y);

        const valid = window.placementrules.isValid(tile.x, tile.y, this.draggingItem);

        window.placementpreview.update(tile.x, tile.y, valid);
    }

    onMouseDown(e) {
        const itemKey = window.ui.pickItem(e);
        if (!itemKey) return;

        this.draggingItem = { ...Items[itemKey], rotation: 0 };
        window.input = this; // allow renderer to access draggingItem
    }

    onMouseUp(e) {
        if (!this.draggingItem) return;

        const iso = this.camera.screenToIso(this.mouse.x, this.mouse.y);
        const tile = this.grid.snap(iso.x, iso.y);

        const valid = window.placementrules.isValid(tile.x, tile.y, this.draggingItem);

        if (valid) {
            this.grid.place(tile.x, tile.y, this.draggingItem);
            window.animation.spawnDust(tile.x, tile.y);
        }

        this.draggingItem = null;
        window.placementpreview.clear();
    }
    
    onRightClick(e) {
        e.preventDefault(); // stop browser menu

        if (!this.deleteMode) return; // only delete when active

        const iso = this.camera.screenToIso(e.clientX, e.clientY);
        const tile = this.grid.snap(iso.x, iso.y);

        if (!this.grid.isValidTile(tile.x, tile.y)) return;

        // Delete the tile contents
        this.grid.removeItem(tile.x, tile.y);

        // Clear preview + ghost
        window.placementpreview.clear();
        this.draggingItem = null;
    }

    onKeyDown(e) {
        if (!this.draggingItem) return;

        if (e.key === "r" || e.key === "R") {
            this.rotateItem();
        }
    }

    onWheel(e) {
        if (!this.draggingItem) return;

        const delta = e.deltaY > 0 ? 90 : -90;
        this.draggingItem.rotation = (this.draggingItem.rotation + delta + 360) % 360;
    }

    // -----------------------------
    // MOBILE INPUT
    // -----------------------------

    onTouchStart(e) {
        this.touchStartTime = Date.now();

        const touch = e.touches[0];
        this.mouse.x = touch.clientX;
        this.mouse.y = touch.clientY;

        const itemKey = window.ui.pickItemTouch(touch);
        if (itemKey) {
            this.draggingItem = { ...Items[itemKey], rotation: 0 };
            window.input = this;
        }
    }

    onTouchMove(e) {
        const touch = e.touches[0];
        this.mouse.x = touch.clientX;
        this.mouse.y = touch.clientY;

        if (!this.draggingItem) return;

        // Two‑finger rotate
        if (e.touches.length === 2) {
            this.rotateItem();
            return;
        }

        const iso = this.camera.screenToIso(this.mouse.x, this.mouse.y);
        const tile = this.grid.snap(iso.x, iso.y);

        const valid = window.placementrules.isValid(tile.x, tile.y, this.draggingItem);

        window.placementpreview.update(tile.x, tile.y, valid);
    }

    onTouchEnd(e) {
        if (!this.draggingItem) return;

        const duration = Date.now() - this.touchStartTime;

        // Long press = rotate
        if (duration > 400) {
            this.rotateItem();
            return;
        }

        // Drop item
        const iso = this.camera.screenToIso(this.mouse.x, this.mouse.y);
        const tile = this.grid.snap(iso.x, iso.y);

        const valid = window.placementrules.isValid(tile.x, tile.y, this.draggingItem);

        if (valid) {
            this.grid.place(tile.x, tile.y, this.draggingItem);
            window.animation.spawnDust(tile.x, tile.y);
        }

        this.draggingItem = null;
        window.placementpreview.clear();
    }

    // -----------------------------
    // SHARED ROTATION LOGIC
    // -----------------------------

    rotateItem() {
        if (!this.draggingItem) return;
        this.draggingItem.rotation = (this.draggingItem.rotation + 90) % 360;
    }
}
