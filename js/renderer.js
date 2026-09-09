class Renderer {
    constructor(canvas, grid, camera) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.grid = grid;
        this.camera = camera;

        this.tileW = grid.tileW;
        this.tileH = grid.tileH;
    }

    render() {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        ctx.save();
        ctx.translate(this.camera.x, this.camera.y);
        ctx.scale(this.camera.zoom, this.camera.zoom);

        // Draw all tiles in iso space
        for (const [key, cell] of this.grid.cells.entries()) {
            const [xStr, yStr] = key.split(",");
            const x = parseInt(xStr, 10);
            const y = parseInt(yStr, 10);

            const screen = this.camera.isoToScreen(x, y);

            ctx.save();
            ctx.translate(
                (screen.x - this.camera.x) / this.camera.zoom,
                (screen.y - this.camera.y) / this.camera.zoom
            );

            this.drawFloor(cell);
            this.drawWall(cell);
            this.drawDoor(cell);
            this.drawWindow(cell);
            this.drawRoof(cell);
            this.drawDecor(cell);

            ctx.restore();
        }

        ctx.restore();

        // Draw preview AFTER camera restore
        placementpreview.draw(ctx);
    }

    drawFloor(cell) {
        if (!cell.floor) return;

        const w = this.tileW / 2;
        const h = this.tileH / 2;

        this.ctx.fillStyle = "#c8c8c8";
        this.ctx.beginPath();
        this.ctx.moveTo(0, -h);
        this.ctx.lineTo(w, 0);
        this.ctx.lineTo(0, h);
        this.ctx.lineTo(-w, 0);
        this.ctx.closePath();
        this.ctx.fill();
    }

    drawWall(cell) {
        if (!cell.wall) return;
        this.drawWallShape("#8b5a2b");
    }

    drawDoor(cell) {
        if (!cell.door) return;
        this.drawWallShape("#663300");
    }

    drawWindow(cell) {
        if (!cell.window) return;
        this.drawWallShape("#99ccff");
    }

    drawWallShape(color) {
        const ctx = this.ctx;
        const w = this.tileW / 2;

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(-w, 0);
        ctx.lineTo(-w, -40);
        ctx.lineTo(w, -40);
        ctx.lineTo(w, 0);
        ctx.closePath();
        ctx.fill();
    }

    drawRoof(cell) {
        if (!cell.roof) return;

        const ctx = this.ctx;
        const w = this.tileW / 2;
        const h = this.tileH / 2;

        ctx.fillStyle = "#b8860b";
        ctx.beginPath();
        ctx.moveTo(0, -h - 40);
        ctx.lineTo(w, -40);
        ctx.lineTo(0, h - 40);
        ctx.lineTo(-w, -40);
        ctx.closePath();
        ctx.fill();
    }

    drawDecor(cell) {
        if (!cell.decor) return;

        const ctx = this.ctx;

        ctx.fillStyle = "#ff66cc";
        ctx.beginPath();
        ctx.arc(0, -20, 12, 0, Math.PI * 2);
        ctx.fill();
    }
}

window.Renderer = Renderer;
