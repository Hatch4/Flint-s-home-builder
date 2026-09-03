// renderer.js
class Renderer {
    constructor(canvas, grid, camera) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");

        this.grid = grid;
        this.camera = camera;

        this.tileW = 96;
        this.tileH = 48;

        this.resize();
        window.addEventListener("resize", () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    render() {
        this.clear();
        this.drawGrid();
        this.drawTiles();
        this.drawSelection();
        this.drawPreview();
        this.drawDraggingItem();
    }

    // ---------------------------------------------------------
    // GRID LINES
    // ---------------------------------------------------------
    drawGrid() {
        this.ctx.save();
        this.ctx.strokeStyle = "rgba(0, 128, 0, 0.4)";
        this.ctx.lineWidth = 1;

        for (let y = 0; y < this.grid.height; y++) {
            for (let x = 0; x < this.grid.width; x++) {

                const pos = this.camera.isoToScreen(x, y);

                const w = this.tileW / 2;
                const h = this.tileH / 2;

                this.ctx.beginPath();
                this.ctx.moveTo(pos.x, pos.y - h);
                this.ctx.lineTo(pos.x + w, pos.y);
                this.ctx.lineTo(pos.x, pos.y + h);
                this.ctx.lineTo(pos.x - w, pos.y);
                this.ctx.closePath();
                this.ctx.stroke();
            }
        }

        this.ctx.restore();
    }

    // ---------------------------------------------------------
    // DRAW ALL PLACED ITEMS
    // ---------------------------------------------------------
    drawTiles() {
        for (let y = 0; y < this.grid.height; y++) {
            for (let x = 0; x < this.grid.width; x++) {

                const stack = this.grid.cells[y][x];
                if (stack.length === 0) continue;

                const pos = this.camera.isoToScreen(x, y);

                for (const item of stack) {
                    this.drawItem(pos.x, pos.y, item);
                }
            }
        }
    }

    drawItem(x, y, item) {
        const img = window.assets.get(item.icon);
        if (!img) return;

        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate((item.rotation || 0) * Math.PI / 180);
        this.ctx.drawImage(img, -img.width / 2, -img.height / 2);
        this.ctx.restore();
    }

    // ---------------------------------------------------------
    // SELECTION OUTLINE
    // ---------------------------------------------------------
    drawSelection() {
        if (!this.grid.selectedTile) return;

        const { x, y } = this.grid.selectedTile;
        const pos = this.camera.isoToScreen(x, y);

        const w = this.tileW / 2;
        const h = this.tileH / 2;

        this.ctx.save();
        this.ctx.strokeStyle = "#ff0000";
        this.ctx.lineWidth = 2;

        this.ctx.beginPath();
        this.ctx.moveTo(pos.x, pos.y - h);
        this.ctx.lineTo(pos.x + w, pos.y);
        this.ctx.lineTo(pos.x, pos.y + h);
        this.ctx.lineTo(pos.x - w, pos.y);
        this.ctx.closePath();
        this.ctx.stroke();

        this.ctx.restore();
    }

    // ---------------------------------------------------------
    // PLACEMENT PREVIEW (green/red highlight)
    // ---------------------------------------------------------
    drawPreview() {
        if (!window.placementpreview.active) return;

        const { x, y, valid } = window.placementpreview;
        const pos = this.camera.isoToScreen(x, y);

        const w = this.tileW / 2;
        const h = this.tileH / 2;

        this.ctx.save();
        this.ctx.strokeStyle = valid ? "lime" : "red";
        this.ctx.lineWidth = 3;

        this.ctx.beginPath();
        this.ctx.moveTo(pos.x, pos.y - h);
        this.ctx.lineTo(pos.x + w, pos.y);
        this.ctx.lineTo(pos.x, pos.y + h);
        this.ctx.lineTo(pos.x - w, pos.y);
        this.ctx.closePath();
        this.ctx.stroke();

        this.ctx.restore();
    }

    // ---------------------------------------------------------
    // DRAGGING ITEM (ghost image)
    // ---------------------------------------------------------
    drawDraggingItem() {
        const input = window.input;
        if (!input || !input.draggingItem) return;

        const item = input.draggingItem;
        const img = window.assets.get(item.icon);
        if (!img) return;

        this.ctx.save();
        this.ctx.translate(input.mouse.x, input.mouse.y);
        this.ctx.rotate((item.rotation || 0) * Math.PI / 180);
        this.ctx.globalAlpha = 0.7;
        this.ctx.drawImage(img, -img.width / 2, -img.height / 2);
        this.ctx.restore();
    }
}

