// renderer.js
class Renderer {
    constructor(ctx, grid, camera) {
        this.ctx = ctx;
        this.grid = grid;
        this.camera = camera;

        this.tileWidth = 96;
        this.tileHeight = 48;

        this.offsetX = 0;
        this.offsetY = 0;

        this.calculateOffsets();
    }

    calculateOffsets() {
        // Center the grid on screen
        const totalWidth = this.grid.width * this.tileWidth;
        const totalHeight = this.grid.height * this.tileHeight / 2;

        this.offsetX = (window.innerWidth / 2);
        this.offsetY = (window.innerHeight / 2) - totalHeight / 2;
    }

    draw() {
        this.calculateOffsets();

        // Draw in correct order:
        // 1. Floor
        // 2. Walls
        // 3. Roof (exterior only)
        // 4. Decorations
        // 5. UI overlays (selection highlight)
        this.drawFloor();
        this.drawWalls();
        if (!this.camera.interiorMode) {
            this.drawRoof();
        }
        this.drawDecor();
        this.drawSelectionHighlight();
    }

    // Convert grid coordinates to isometric screen coordinates
    isoToScreen(x, y) {
        const angle = this.camera.angle;

        // Rotate grid coordinates based on camera angle
        let rx = x;
        let ry = y;

        if (angle === 90) {
            rx = this.grid.height - y - 1;
            ry = x;
        } else if (angle === 180) {
            rx = this.grid.width - x - 1;
            ry = this.grid.height - y - 1;
        } else if (angle === 270) {
            rx = y;
            ry = this.grid.width - x - 1;
        }

        const screenX = (rx - ry) * (this.tileWidth / 2) + this.offsetX;
        const screenY = (rx + ry) * (this.tileHeight / 2) + this.offsetY;

        return { x: screenX, y: screenY };
    }

    drawFloor() {
        for (let y = 0; y < this.grid.height; y++) {
            for (let x = 0; x < this.grid.width; x++) {
                const tile = this.grid.tiles[y][x];
                const pos = this.isoToScreen(x, y);

                // Draw stone slab floor
                this.drawTileBase(pos.x, pos.y, "#d0d0d0", "#b0b0b0");
            }
        }
    }

    drawTileBase(x, y, colorTop, colorSide) {
        const ctx = this.ctx;

        // Top diamond
        ctx.fillStyle = colorTop;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + this.tileWidth / 2, y + this.tileHeight / 2);
        ctx.lineTo(x, y + this.tileHeight);
        ctx.lineTo(x - this.tileWidth / 2, y + this.tileHeight / 2);
        ctx.closePath();
        ctx.fill();

        // Soft shadow
        ctx.fillStyle = "rgba(0,0,0,0.15)";
        ctx.beginPath();
        ctx.moveTo(x, y + this.tileHeight);
        ctx.lineTo(x + this.tileWidth / 2, y + this.tileHeight / 2);
        ctx.lineTo(x + this.tileWidth / 2, y + this.tileHeight / 2 + 6);
        ctx.lineTo(x, y + this.tileHeight + 6);
        ctx.closePath();
        ctx.fill();
    }

    drawWalls() {
        for (let y = 0; y < this.grid.height; y++) {
            for (let x = 0; x < this.grid.width; x++) {
                const tile = this.grid.tiles[y][x];
                if (!tile.wall) continue;

                const pos = this.isoToScreen(x, y);

                this.drawWallTile(pos.x, pos.y, tile.wall);
            }
        }
    }

    drawWallTile(x, y, wallData) {
        const ctx = this.ctx;

        // Simple hybrid cartoony wall
        ctx.fillStyle = "#c89f72"; // wood color
        ctx.fillRect(x - 20, y - 60, 40, 60);

        // Outline
        ctx.strokeStyle = "#8a6a4f";
        ctx.lineWidth = 2;
        ctx.strokeRect(x - 20, y - 60, 40, 60);

        // Door
        if (wallData.type === "door") {
            ctx.fillStyle = "#a67c52";
            ctx.fillRect(x - 15, y - 40, 30, 40);

            ctx.fillStyle = "#000";
            ctx.beginPath();
            ctx.arc(x + 10, y - 20, 4, 0, Math.PI * 2);
            ctx.fill();
        }

        // Window
        if (wallData.type === "window") {
            ctx.fillStyle = "rgba(180,220,255,0.8)";
            ctx.fillRect(x - 12, y - 45, 24, 24);

            ctx.strokeStyle = "#6fa0c8";
            ctx.strokeRect(x - 12, y - 45, 24, 24);
        }
    }

    drawRoof() {
        for (let y = 0; y < this.grid.height; y++) {
            for (let x = 0; x < this.grid.width; x++) {
                const tile = this.grid.tiles[y][x];
                if (!tile.roof) continue;

                const pos = this.isoToScreen(x, y);

                this.drawRoofTile(pos.x, pos.y);
            }
        }
    }

    drawRoofTile(x, y) {
        const ctx = this.ctx;

        ctx.fillStyle = "#b7d38a"; // reed color
        ctx.beginPath();
        ctx.moveTo(x, y - 40);
        ctx.lineTo(x + this.tileWidth / 2, y);
        ctx.lineTo(x, y + this.tileHeight);
        ctx.lineTo(x - this.tileWidth / 2, y);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = "#7a9b5c";
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    drawDecor() {
        for (let y = 0; y < this.grid.height; y++) {
            for (let x = 0; x < this.grid.width; x++) {
                const tile = this.grid.tiles[y][x];
                if (!tile.decor) continue;

                const pos = this.isoToScreen(x, y);

                this.drawDecorItem(pos.x, pos.y, tile.decor);
            }
        }
    }

    drawDecorItem(x, y, decor) {
        const ctx = this.ctx;

        if (decor.type === "mushroom") {
            ctx.fillStyle = "#ff66cc";
            ctx.beginPath();
            ctx.arc(x, y - 20, 12, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = "#fff";
            ctx.fillRect(x - 4, y - 20, 8, 20);
        }

        if (decor.type === "lantern") {
            ctx.fillStyle = "#ffd966";
            ctx.beginPath();
            ctx.arc(x, y - 30, 14, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = "#ffef99";
            ctx.beginPath();
            ctx.arc(x, y - 30, 20, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    drawSelectionHighlight() {
        if (!this.grid.selectedTile) return;

        const { x, y } = this.grid.selectedTile;
        const pos = this.isoToScreen(x, y);

        const ctx = this.ctx;
        ctx.strokeStyle = "#00ffcc";
        ctx.lineWidth = 3;

        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
        ctx.lineTo(pos.x + this.tileWidth / 2, pos.y + this.tileHeight / 2);
        ctx.lineTo(pos.x, pos.y + this.tileHeight);
        ctx.lineTo(pos.x - this.tileWidth / 2, pos.y + this.tileHeight / 2);
        ctx.closePath();
        ctx.stroke();
    }
}
