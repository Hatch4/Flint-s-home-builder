// renderer.js
class Renderer {
    constructor(canvas, grid, camera) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.grid = grid;
        this.camera = camera;

        this.tileWidth = 96;
        this.tileHeight = 48;

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
    }

    drawGrid() {
        this.ctx.save();
        this.ctx.strokeStyle = "rgba(0, 128, 0, 0.4)";
        this.ctx.lineWidth = 1;
        this.ctx.font = "12px Arial";
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.6)";

        for (let y = 0; y < this.grid.height; y++) {
            for (let x = 0; x < this.grid.width; x++) {
                const pos = this.camera.isoToScreen(x, y);
                console.log("Grid draw:", this.camera.isoToScreen(0, 0));

                // diamond outline
                const w = this.tileWidth / 2;
                const h = this.tileHeight / 2;

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
                const tile = this.grid.tiles[y][x];
                const pos = this.camera.isoToScreen(x, y);

                // floor
                if (tile.floor) {
                    this.drawFloor(pos.x, pos.y);
                }

                // wall / door / window
                if (tile.wall) {
                    this.drawWall(pos.x, pos.y, tile.wall.type);
                }

                // roof
                if (tile.roof) {
                    this.drawRoof(pos.x, pos.y);
                }

                // decor
                if (tile.decor) {
                    this.drawDecor(pos.x, pos.y, tile.decor.type);
                }
            }
        }
    }

    drawFloor(x, y) {
        const w = this.tileWidth / 2;
        const h = this.tileHeight / 2;

        this.ctx.save();
        this.ctx.fillStyle = "#c2e0ff";
        this.ctx.beginPath();
        this.ctx.moveTo(x, y - h);
        this.ctx.lineTo(x + w, y);
        this.ctx.lineTo(x, y + h);
        this.ctx.lineTo(x - w, y);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.restore();
    }

    drawWall(x, y, type) {
        const w = this.tileWidth / 2;
        const h = this.tileHeight / 2;
        const height = 40;

        this.ctx.save();

        // simple color per type
        let color = "#8b5a2b";
        if (type === "door") color = "#b07b3b";
        if (type === "window") color = "#88cfff";

        // front face
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.moveTo(x - w, y);
        this.ctx.lineTo(x + w, y);
        this.ctx.lineTo(x + w, y - height);
        this.ctx.lineTo(x - w, y - height);
        this.ctx.closePath();
        this.ctx.fill();

        this.ctx.restore();
    }

    drawRoof(x, y) {
        const w = this.tileWidth / 2;
        const h = this.tileHeight / 2;
        const height = 30;

        this.ctx.save();
        this.ctx.fillStyle = "#d4b46a";
        this.ctx.beginPath();
        this.ctx.moveTo(x, y - h - height);
        this.ctx.lineTo(x + w, y - height);
        this.ctx.lineTo(x, y + h - height);
        this.ctx.lineTo(x - w, y - height);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.restore();
    }

    drawDecor(x, y, type) {
        this.ctx.save();
        this.ctx.fillStyle = type === "mushroom" ? "#ff66aa" : "#ffaa00";
        this.ctx.beginPath();
        this.ctx.arc(x, y - 20, 10, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
    }

    drawSelection() {
        if (!this.grid.selected) return;

        const { x, y } = this.grid.selected;
        const pos = this.camera.isoToScreen(x, y);
        const w = this.tileWidth / 2;
        const h = this.tileHeight / 2;

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
