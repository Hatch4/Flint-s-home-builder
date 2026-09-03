// Input.js
class Input {
    constructor(canvas, grid, camera) {
        this.canvas = canvas;
        this.grid = grid;
        this.camera = camera;

        this.mouse = { x: 0, y: 0 };
        this.draggingItem = null;
        this.deleteMode = false;

        this.bindEvents();
        this.canvas.style.touchAction = "none";
    }

    // ---------------------------------------------------------
    // EVENT BINDINGS
    // ---------------------------------------------------------
    bindEvents() {
        this.canvas.addEventListener("pointerdown", (e) => this.onPointerDown(e));
        this.canvas.addEventListener("pointermove", (e) => this.onPointerMove(e));
        this.canvas.addEventListener("pointerup", (e) => this.onPointerUp(e));

        this.canvas.addEventListener("contextmenu", (e) => this.onRightClick(e));

        window.addEventListener("keydown", (e) => this.onKeyDown(e));
        window.addEventListener("wheel", (e) => this.onWheel(e));

        // Rotate button
        const rotateBtn = document.getElementById("rotateBtn");
        if (rotateBtn) {
            rotateBtn.addEventListener("pointerdown", () => this.rotateItem());
        }

        // Delete button
        const deleteBtn = document.getElementById("delete-btn");
        if (deleteBtn) {
            deleteBtn.addEventListener("pointerdown", () => {
                this.deleteMode = !this.deleteMode;
                deleteBtn.classList.toggle("active", this.deleteMode);
            });
        }
    }

    // ---------------------------------------------------------
    // UI DRAG START
    // ---------------------------------------------------------
    startDraggingItem(item) {
        this.draggingItem = { ...item, rotation: 0 };
    }

    // ---------------------------------------------------------
    // POINTER DOWN
    // ---------------------------------------------------------
    onPointerDown(e) {
        this.updateMouse(e);

        // If dragging from UI, skip tile selection
        if (this.draggingItem) return;

        // Delete mode
        if (this.deleteMode) {
            this.deleteAtMouse();
            return;
        }

        // Select tile
        const iso = this.camera.screenToIso(this.mouse.x, this.mouse.y);
        const tile = this.grid.snap(iso.x, iso.y);

        this.grid.selectedTile = tile;
    }

    // ---------------------------------------------------------
    // POINTER MOVE
    // ---------------------------------------------------------
    onPointerMove(e) {
        this.updateMouse(e);

        if (!this.draggingItem) return;

        const iso = this.camera.screenToIso(this.mouse.x, this.mouse.y);
        const tile = this.grid.snap(iso.x, iso.y);

        const valid = window.placementrules.isValid(tile.x, tile.y, this.draggingItem);
        window.placementpreview.update(tile.x, tile.y, valid);
    }

    // ---------------------------------------------------------
    // POINTER UP (DROP ITEM)
    // ---------------------------------------------------------
    onPointerUp(e) {
        this.updateMouse(e);

        if (!this.draggingItem) return;

        const iso = this.camera.screenToIso(this.mouse.x, this.mouse.y);
        const tile = this.grid.snap(iso.x, iso.y);

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
    // DELETE
    // ---------------------------------------------------------
    deleteAtMouse() {
        const iso = this.camera.screenToIso(this.mouse.x, this.mouse.y);
        const tile = this.grid.snap(iso.x, iso.y);

        this.grid.saveState();
        this.grid.removeTopItem(tile.x, tile.y);
        window.animation.spawnDust(tile.x, tile.y);
    }

    onRightClick(e) {
        e.preventDefault();
        if (!this.deleteMode) return;

        const iso = this.camera.screenToIso(e.clientX, e.clientY);
        const tile = this.grid.snap(iso.x, iso.y);

        this.grid.saveState();
        this.grid.removeTopItem(tile.x, tile.y);
        window.animation.spawnDust(tile.x, tile.y);

        window.placementpreview.clear();
        this.draggingItem = null;
    }

    // ---------------------------------------------------------
    // ROTATION
    // ---------------------------------------------------------
    rotateItem() {
        if (!this.draggingItem) return;
        this.draggingItem.rotation = (this.draggingItem.rotation + 90) % 360;
    }

    onWheel(e) {
        if (!this.draggingItem) return;

        const delta = e.deltaY > 0 ? 90 : -90;
        this.draggingItem.rotation = (this.draggingItem.rotation + delta + 360) % 360;
    }

    onKeyDown(e) {
        if (this.draggingItem && (e.key === "r" || e.key === "R")) {
            this.rotateItem();
        }

        if (e.ctrlKey && e.key === "z") this.grid.undo();
        if (e.ctrlKey && e.key === "y") this.grid.redo();
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
