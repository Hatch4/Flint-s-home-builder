// renderer.js
class Renderer {
    constructor(canvas, grid, camera) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.grid = grid;
        this.camera = camera;

        // Tile size (must match camera)
        this.tileW = 96;
        this.tileH = 48;

        // Preload simple colors or images if needed
        this.colors = {
            floor: "#c8c8c8",
            wall: "#8b5a2b",
            roof: "#b8860b",
            decor: "#ff66cc",
            door: "#663300",
            window: "#99ccff"
        };
    }

    // ---------------------------------------------------------
    // MAIN RENDER ENTRY POINT
    // ---------------------------------------------------------
    render() {
        const ctx = this.ctx;

        ctx.save();

        // Apply camera transform once
        ctx.translate(this.camera.x, this.camera.y);
        ctx.scale(this.camera.zoom, this.camera.zoom);

        // Draw tiles in correct isometric order
        for (let y = 0; y < this.grid.height; y++) {
            for (let x = 0; x < this.grid.width; x++) {
                const tile = this.grid.tiles[y][x];
                const pos = this.grid.isoToScreen(x, y);

                ctx.save();
                ctx.translate(pos.x, pos.y);

                this.drawFloor(tile);
                this.drawWall(tile);
                this.drawDoor(tile);
                this.drawWindow(tile);
                this.drawRoof(tile);
                this.drawDecor(tile);

                ctx.restore();
            }
        }

        ctx.restore();

        // Draw placement preview (screen space)
        window.placementpreview.draw(ctx, this.camera);

        // Draw animations (screen space)
        window.animation.draw(ctx, this.camera);
    }

    // ---------------------------------------------------------
    // DRAW FLOOR
    // ---------------------------------------------------------
    drawFloor(tile) {
        if (!tile.floor) return;

        const w = this.tileW / 2;
        const h = this.tileH / 2;

        this.ctx.fillStyle = this.colors.floor;
        this.ctx.beginPath();
        this.ctx.moveTo(0, -h);
        this.ctx.lineTo(w, 0);
        this.ctx.lineTo(0, h);
        this.ctx.lineTo(-w, 0);
        this.ctx.closePath();
        this.ctx.fill();
    }

    // ---------------------------------------------------------
    // DRAW WALL
    // ---------------------------------------------------------
    drawWall(tile) {
        if (!tile.wall || tile.wall.type !== "wall") return;

        this.drawWallShape(this.colors.wall);
    }

    // ---------------------------------------------------------
    // DRAW DOOR
    // ---------------------------------------------------------
    drawDoor(tile) {
        if (!tile.wall || tile.wall.type !== "door") return;

        this.drawWallShape(this.colors.door);
    }

    // ---------------------------------------------------------
    // DRAW WINDOW
    // ---------------------------------------------------------
    drawWindow(tile) {
        if (!tile.wall || tile.wall.type !== "window") return;

        this.drawWallShape(this.colors.window);
    }

    // ---------------------------------------------------------
    // WALL SHAPE (shared by wall/door/window)
    // ---------------------------------------------------------
    drawWallShape(color) {
        const ctx = this.ctx;
        const w = this.tileW / 2;
        const h = this.tileH / 2;

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(-w, 0);
        ctx.lineTo(-w, -40);
        ctx.lineTo(w, -40);
        ctx.lineTo(w, 0);
        ctx.closePath();
        ctx.fill();
    }

    // ---------------------------------------------------------
    // DRAW ROOF
    // ---------------------------------------------------------
    drawRoof(tile) {
        if (!tile.roof) return;

        const ctx = this.ctx;
        const w = this.tileW / 2;
        const h = this.tileH / 2;

        ctx.fillStyle = this.colors.roof;
        ctx.beginPath();
        ctx.moveTo(0, -h - 40);
        ctx.lineTo(w, -40);
        ctx.lineTo(0, h - 40);
        ctx.lineTo(-w, -40);
        ctx.closePath();
        ctx.fill();
    }

    // ---------------------------------------------------------
    // DRAW DECOR
    // ---------------------------------------------------------
    drawDecor(tile) {
        if (!tile.decor || tile.decor.length === 0) return;

        const ctx = this.ctx;

        for (const d of tile.decor) {
            ctx.fillStyle = this.colors.decor;
            ctx.beginPath();
            ctx.arc(0, -20, 12, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

window.Renderer = Renderer;
