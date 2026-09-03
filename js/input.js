// input.js
class Input {
    constructor(canvas, grid, camera) {
        this.canvas = canvas;
        this.grid = grid;
        this.camera = camera;

        this.mouse = { x: 0, y: 0 };
        this.draggingItem = null;
        this.deleteMode = false;

        this.touchStartTime = 0;

        this.bindEvents();
    }

    bindEvents() {
        // DESKTOP POINTER EVENTS
        this.canvas.addEventListener("pointerdown", (e) => this.onPointerDown(e));
        this.canvas.addEventListener("pointermove", (e) => this.onPointerMove(e));
        this.canvas.addEventListener("pointerup", (e) => this.onPointerUp(e));

        // ROTATE BUTTON
        const rotateBtn = document.getElementById("rotateBtn");
        if (rotateBtn) {
            rotateBtn.addEventListener("click", () => this.rotateItem());
        }

        // DELETE BUTTON
        const deleteBtn = document.getElementById("delete-btn");
        if (deleteBtn) {
            deleteBtn.addEventListener("click", () => {
                this.deleteMode = !this.deleteMode;
                deleteBtn.classList.toggle("active", this.deleteMode);
            });
        }

        // RIGHT‑CLICK DELETE
        this.canvas.addEventListener("contextmenu", (e) => this.onRightClick(e));

        // KEYBOARD
        window.addEventListener("keydown", (e) => this.onKeyDown(e));

        // MOUSE WHEEL ROTATE
        window.addEventListener("wheel", (e) => this.onWheel(e));

        // MOBILE TOUCH
        this.canvas.addEventListener("touchstart", (e) => this.onTouchStart(e));
        this.canvas.addEventListener("touchmove", (e) => this.onTouchMove(e));
        this.canvas.addEventListener("touchend", (e) => this.onTouchEnd(e));

        this.canvas.style.touchAction = "none";
    }

    // ---------------------------------------------------------
    // POINTER DOWN
    // ---------------------------------------------------------
    onPointerDown(e) {
        this.updateMouse(e);

        // UI drag takes priority
        if (window.ui && window.ui.dragging) return;

        // DELETE MODE
        if (this.deleteMode) {
            this.deleteAtMouse();
            return;
        }

        // SELECT TILE
        const iso = this.camera.screenToIso(this.mouse.x, this.mouse.y);
        const tile = this.grid.snap(iso.x, iso.y);

        if (!tile) return;

        if (this.grid.isValidTile(tile.x, tile.y)) {
            this.grid.selectedTile = tile;
        }
    }

    // ---------------------------------------------------------
    // POINTER MOVE
    // ---------------------------------------------------------
    onPointerMove(e) {
        this.updateMouse(e);

        if (!this.draggingItem) return;

        const iso = this.camera.screenToIso(this.mouse.x, this.mouse.y);
        const tile = this.grid.snap(iso.x, iso.y);

        if (!tile) {
            window.placementpreview.clear();
            return;
        }

        const valid = window.placementrules.isValid(tile.x, tile.y, this.draggingItem);
        window.placementpreview.update(tile.x, tile.y, valid);
    }

    // ---------------------------------------------------------
    // POINTER UP
    // ---------------------------------------------------------
    onPointerUp(e) {
        this.updateMouse(e);

        if (window.ui && window.ui.dragging) return;
        if (!this.draggingItem) return;

        const iso = this.camera.screenToIso(this.mouse.x, this.mouse.y);
        const tile = this.grid.snap(iso.x, iso.y);

        if (!tile) {
            this.draggingItem = null;
            window.placementpreview.clear();
            return;
        }

        const valid = window.placementrules.isValid(tile.x, tile.y, this.draggingItem);

        if (valid) {
            this.grid.saveState();
            this.grid.place(tile.x, tile.y, this.draggingItem);
            window.animation.spawnDust(tile.x, tile.y);
        }

        this.draggingItem = null;
        window.placementpreview.clear();
    }

    // ---------------------------------------------------------
    // UI DRAG SUPPORT
    // ---------------------------------------------------------
    handleDragMove(x, y, item) {
        this.mouse.x = x;
        this.mouse.y = y;

        this.draggingItem = item;

        const iso = this.camera.screenToIso(x, y);
        const tile = this.grid.snap(iso.x, iso.y);

        if (!tile) {
            window.placementpreview.clear();
            return;
        }

        const valid = window.placementrules.isValid(tile.x, tile.y, item);
        window.placementpreview.update(tile.x, tile.y, valid);
    }

    handleDragEnd(x, y, item) {
        const iso = this.camera.screenToIso(x, y);
        const tile = this.grid.snap(iso.x, iso.y);

        if (tile && window.placementrules.isValid(tile.x, tile.y, item)) {
            this.grid.saveState();
            this.grid.place(tile.x, tile.y, item);
            window.animation.spawnDust(tile.x, tile.y);
        }

        this.draggingItem = null;
        window.placementpreview.clear();
    }

    // ---------------------------------------------------------
    // DELETE
    // ---------------------------------------------------------
    deleteAtMouse() {
        const iso = this.camera.screenToIso(this.mouse.x, this.mouse.y);
        const tile = this.grid.snap(iso.x, iso.y);

        if (!tile) return;
        if (!this.grid.isValidTile(tile.x, tile.y)) return;

        this.grid.saveState();
        this.grid.removeTopItem(tile.x, tile.y);
        window.animation.spawnDust(tile.x, tile.y);
        window.assets.deleteSound?.play();
    }

    onRightClick(e) {
        e.preventDefault();
        if (!this.deleteMode) return;

        const iso = this.camera.screenToIso(e.clientX, e.clientY);
        const tile = this.grid.snap(iso.x, iso.y);

        if (!tile) return;
        if (!this.grid.isValidTile(tile.x, tile.y)) return;

        this.grid.saveState();
        this.grid.removeTopItem(tile.x, tile.y);
        window.animation.spawnDust(tile.x, tile.y);
        window.assets.deleteSound?.play();

        window.placementpreview.clear();
        this.draggingItem = null;
    }

    // ---------------------------------------------------------
    // KEYBOARD
    // ---------------------------------------------------------
    onKeyDown(e) {
        // Undo / Redo
        if (e.ctrlKey && e.key === "z") {
            this.grid.undo();
            return;
        }
        if (e.ctrlKey && e.key === "y") {
            this.grid.redo();
            return;
        }

        // Rotate
        if (this.draggingItem && (e.key === "r" || e.key === "R")) {
            this.rotateItem();
        }
    }

    // ---------------------------------------------------------
    // MOUSE WHEEL ROTATE
    // ---------------------------------------------------------
    onWheel(e) {
        if (!this.draggingItem) return;

        const delta = e.deltaY > 0 ? 90 : -90;
        this.draggingItem.rotation = (this.draggingItem.rotation + delta + 360) % 360;
    }

    // ---------------------------------------------------------
    // MOBILE TOUCH
    // ---------------------------------------------------------
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

        if (e.touches.length === 2) {
            this.rotateItem();
            return;
        }

        const iso = this.camera.screenToIso(this.mouse.x, this.mouse.y);
        const tile = this.grid.snap(iso.x, iso.y);

        if (!tile) {
            window.placementpreview.clear();
            return;
        }

        const valid = window.placementrules.isValid(tile.x, tile.y, this.draggingItem);
        window.placementpreview.update(tile.x, tile.y, valid);
    }

    onTouchEnd(e) {
        const duration = Date.now() - this.touchStartTime;

        // Long‑press delete
        if (duration > 400 && this.deleteMode) {
            const iso = this.camera.screenToIso(this.mouse.x, this.mouse.y);
            const tile = this.grid.snap(iso.x, iso.y);

            if (tile && this.grid.isValidTile(tile.x, tile.y)) {
                this.grid.saveState();
                this.grid.removeTopItem(tile.x, tile.y);
                window.animation.spawnDust(tile.x, tile.y);
                window.assets.deleteSound?.play();
            }

            window.placementpreview.clear();
            this.draggingItem = null;
            return;
        }

        // Long‑press rotate
        if (duration > 400 && this.draggingItem) {
            this.rotateItem();
            return;
        }

        // Normal tap placement
        if (this.draggingItem) {
            const iso = this.camera.screenToIso(this.mouse.x, this.mouse.y);
            const tile = this.grid.snap(iso.x, iso.y);

            if (tile) {
                const valid = window.placementrules.isValid(tile.x, tile.y, this.draggingItem);

                if (valid) {
                    this.grid.saveState();
                    this.grid.place(tile.x, tile.y, this.draggingItem);
                    window.animation.spawnDust(tile.x, tile.y);
                }
            }

            this.draggingItem = null;
            window.placementpreview.clear();
        }
    }

    // ---------------------------------------------------------
    // ROTATION
    // ---------------------------------------------------------
    rotateItem() {
        if (!this.draggingItem) return;
        this.draggingItem.rotation = (this.draggingItem.rotation + 90) % 360;
    }

    // ---------------------------------------------------------
    // MOUSE POSITION
    // ---------------------------------------------------------
    updateMouse(e) {
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.x = e.clientX - rect.left;
        this.mouse.y = e.clientY - rect.top;
    }
}
