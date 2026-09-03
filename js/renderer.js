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

    // ---------------------------------------------------------
    // MAIN RENDER LOOP
    // ---------------------------------------------------------
    render() {
        this.clear();

        this.ctx.save();

        // Apply camera transform ONCE
        this.ctx.translate(this.camera.x, this.camera.y);
        this.ctx.scale(this.camera.zoom, this.camera.zoom);

        this.drawGrid();
        this.drawTiles();

        if (window.placementpreview) {
            window.placementpreview.draw(this.ctx, this.camera);
        }

        if (window.animation) {
            window.animation.draw(this.ctx, this.camera);
        }

        this.drawGhost();
        this.drawDeletePreview();
        this.drawSelection();

        this.ctx.restore();
    }

    // ---------------------------------------------------------
    // DRAW GRID (debug)
    // ---------------------------------------------------------
    drawGrid() {
        this.ctx.save();
        this.ctx.strokeStyle = "rgba(0, 255, 0, 0.25)";
        this.ctx.lineWidth = 1;
        this.ctx.font = "12px Arial";
        this.ctx.fillStyle = "rgba(255,255,255,0.6)";

        for (let y = 0; y < this.grid.height; y++) {
            for (let x = 0; x < this.grid.width; x++) {
                const pos = this.grid.isoToScreen(x, y);

                const w = this.tileW / 2;
                const h = this.tileH / 2;

                this.ctx.beginPath();
                this.ctx.moveTo(pos.x, pos.y - h);
                this.ctx.lineTo(pos.x + w, pos.y);
                this.ctx.lineTo(pos.x, pos.y + h);
                this.ctx.lineTo(pos.x - w, pos.y);
                this.ctx.closePath();
                this.ctx.stroke();

                this.ctx.fillText(`${x},${y}`, pos.x - 12, pos.y + 4);
            }
        }

        this.ctx.restore();
    }

    // ---------------------------------------------------------
    // DRAW ALL TILE STACKS
    // ---------------------------------------------------------
    drawTiles() {
        for (let y = 0; y < this.grid.height; y++) {
            for (let x = 0; x < this.grid.width; x++) {
                const cell = this.grid.tiles[y][x];
                this.drawTileStack(x, y, cell);
            }
        }
    }

    drawTileStack(x, y, cell) {
        const pos = this.grid.isoToScreen(x, y);

        const drawItem = (item) => {
            if (!item) return;
            const img = window.assets[item.icon];
            if (!img) return;

            this.ctx.save();
            this.ctx.translate(pos.x, pos.y);
            this.ctx.rotate((item.rotation || 0) * Math.PI / 180);
            this.ctx.drawImage(img, -img.width / 2, -img.height / 2);
            this.ctx.restore();
        };

        // Correct draw order
        drawItem(cell.floor);
        drawItem(cell.wall);
        drawItem(cell.roof);

        cell.decor.forEach(drawItem);

        drawItem(cell.door);
        drawItem(cell.window);
    }

    // ---------------------------------------------------------
    // DRAG GHOST
    // ---------------------------------------------------------
    drawGhost() {
        if (!window.input || !window.input.draggingItem) return;

        const draggingItem = window.input.draggingItem;
        const mouse = window.input.mouse;

        const iso = this.camera.screenToIso(mouse.x, mouse.y);
        const tile = this.grid.snap(iso.x, iso.y);
        const pos = this.grid.isoToScreen(tile.x, tile.y);

        const img = window.assets[draggingItem.icon];
        if (!img) return;

        this.ctx.save();
        this.ctx.translate(pos.x, pos.y);
        this.ctx.rotate((draggingItem.rotation || 0) * Math.PI / 180);
        this.ctx.globalAlpha = 0.6;
        this.ctx.drawImage(img, -img.width / 2, -img.height / 2);
        this.ctx.restore();
    }

    // ---------------------------------------------------------
    // DELETE PREVIEW
    // ---------------------------------------------------------
    drawDeletePreview() {
        if (!window.input || !window.input.deleteMode) return;

        const mouse = window.input.mouse;
        const iso = this.camera.screenToIso(mouse.x, mouse.y);
        const tile = this.grid.snap(iso.x, iso.y);

        const pos = this.grid.isoToScreen(tile.x, tile.y);

        const w = this.tileW / 2;
        const h = this.tileH / 2;

        this.ctx.save();
        this.ctx.strokeStyle = "rgba(255, 0, 0, 0.9)";
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
    // SELECTION OUTLINE
    // ---------------------------------------------------------
    drawSelection() {
        if (!this.grid.selectedTile) return;

        const { x, y } = this.grid.selectedTile;
        const pos = this.grid.isoToScreen(x, y);

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
}
