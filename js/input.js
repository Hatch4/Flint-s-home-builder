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

        this.canvas.style.touchAction = "none";

        this.bindEvents();
    }

    bindEvents() {
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
            if (!this.draggingItem) {
                e.preventDefault();
                e.stopImmediatePropagation();
            }
        });

        this.canvas.addEventListener("pointerup", () => {
    if (!this.draggingItem) return;

    const iso = this.camera.screenToIso(this.mouse.x, this.mouse.y);
    const tile = this.grid.snap(iso.x, iso.y);

    const success = window.game.placement.attemptPlace(tile.x, tile.y, this.draggingItem);

    this.draggingItem = null;
    window.placementpreview.clear();
});


        window.addEventListener("keydown", (e) => {
            if (!this.draggingItem) return;
            if (e.key === "r" || e.key === "R") this.rotateCurrentItem();
        });

        window.addEventListener("wheel", (e) => {
            if (!this.draggingItem) return;
            const delta = e.deltaY > 0 ? 90 : -90;
            this.draggingItem.rotation = (this.draggingItem.rotation + delta + 360) % 360;
        });
    }

    startDraggingItem(item) {
        this.draggingItem = { ...item, rotation: 0 };
    }

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
