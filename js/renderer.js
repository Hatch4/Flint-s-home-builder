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

        // Placement preview (green/red diamond)
        window.placementpreview.draw(this.ctx, this.camera);

        // Dust puff animation
        window.animation.draw(this.ctx, this.camera);

        // Drag ghost
        this.drawGhost();

        // Selection highlight (optional)
        this.drawSelection();
    }

    drawGrid() {
        this.ctx.save();
        this.ctx.strokeStyle = "rgba(0, 128, 0, 0.4)";
        this.ctx.lineWidth = 1;
        this.ctx.font = "12px Arial";
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.6)";

        for (let y = 0; y < this.grid.height; y++) {
            for (let x = 0; x < this.grid.width; x++) {
                const pos = this.grid.isoToScreen(x, y, this.camera);

                const w = this.tileW / 2;
                const h = this.tileH / 2;

                // diamond outline
                this.ctx.beginPath();
                this.ctx.moveTo(pos.x, pos.y - h);
                this.ctx.lineTo(pos.x + w, pos.y);
                this.ctx.lineTo(pos.x, pos.y + h);
                this.ctx.lineTo(pos.x - w, pos.y);
                this.ctx.closePath();
                this.ctx.stroke();

                // coords label
                this.ctx.fillText(`${x},${y}`, pos.x - 12, pos.y + 4);
            }
        }

        this.ctx.restore();
    }

    drawTiles() {
        for (let y = 0; y < this.grid.height; y++) {
            for (let x = 0; x < this.grid.width; x++) {
                const cell = this.grid.tiles[y][x];
                this.drawTile(x, y, cell);
            }
        }
    }

    drawTile(x, y, cell) {
        const pos = this.grid.isoToScreen(x, y, this.camera);

        // FLOOR
        if (cell.floor) {
            const img = window.assets.floor;
            if (img) this.ctx.drawImage(img, pos.x - img.width/2, pos.y - img.height/2);
        }

        // WALL
        if (cell.wall) {
    const img = window.assets.wall;
    if (img) {
        this.ctx.save();
        this.ctx.translate(pos.x, pos.y);
        this.ctx.rotate((cell.wall.rotation || 0) * Math.PI / 180);
        this.ctx.drawImage(img, -img.width/2, -img.height/2);
        this.ctx.restore();
    }
}

        // ROOF
        if (cell.roof) {
    const img = window.assets.roof;
    if (img) {
        this.ctx.save();
        this.ctx.translate(pos.x, pos.y);
        this.ctx.rotate((cell.roof.rotation || 0) * Math.PI / 180);
        this.ctx.drawImage(img, -img.width/2, -img.height/2);
        this.ctx.restore();
    }
}

        // DECOR (multiple)
        cell.decor.forEach(decorItem => {
    const img = window.assets[decorItem.type];
    if (img) {
        this.ctx.save();
        this.ctx.translate(pos.x, pos.y);
        this.ctx.rotate((decorItem.rotation || 0) * Math.PI / 180);
        this.ctx.drawImage(img, -img.width/2, -img.height/2);
        this.ctx.restore();
    }
});

        // DOOR
        if (cell.door) {
    const img = window.assets.door;
    if (img) {
        this.ctx.save();
        this.ctx.translate(pos.x, pos.y);
        this.ctx.rotate((cell.door.rotation || 0) * Math.PI / 180);
        this.ctx.drawImage(img, -img.width/2, -img.height/2);
        this.ctx.restore();
    }
}

        // WINDOW
        if (cell.window) {
    const img = window.assets.window;
    if (img) {
        this.ctx.save();
        this.ctx.translate(pos.x, pos.y);
        this.ctx.rotate((cell.window.rotation || 0) * Math.PI / 180);
        this.ctx.drawImage(img, -img.width/2, -img.height/2);
        this.ctx.restore();
    }
}

    drawGhost() {
        if (!window.input || !window.input.draggingItem) return;

        const draggingItem = window.input.draggingItem;
        const mouse = window.input.mouse;

        const iso = this.camera.screenToIso(mouse.x, mouse.y);
        const tile = this.grid.snap(iso.x, iso.y);
        const pos = this.grid.isoToScreen(tile.x, tile.y, this.camera);

        const img =
            window.assets[draggingItem.category] ||
            window.assets[draggingItem.type];

        if (!img) return;

        this.ctx.save();
        this.ctx.translate(pos.x, pos.y);
        this.ctx.rotate((draggingItem.rotation || 0) * Math.PI / 180);
        this.ctx.globalAlpha = 0.6;
        this.ctx.drawImage(img, -img.width/2, -img.height/2);
        this.ctx.globalAlpha = 1;
        this.ctx.restore();

    }

    drawSelection() {
        if (!this.grid.selectedTile) return;

        const { x, y } = this.grid.selectedTile;
        const pos = this.grid.isoToScreen(x, y, this.camera);

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
