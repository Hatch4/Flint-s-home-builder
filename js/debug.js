// debug.js
class DebugOverlay {
    constructor(game) {
        this.game = game;
        this.enabled = true;
        this.highlightTile = null;

        // Listen for tile selection updates
        document.addEventListener("tile-hover", (e) => {
            this.highlightTile = e.detail;
        });
    }

    draw(ctx) {
        if (!this.enabled) return;

        const tileWidth = 96;
        const tileHeight = 48;
        const w = tileWidth / 2;
        const h = tileHeight / 2;

        // Draw tile boundaries
        for (let y = 0; y < this.game.grid.height; y++) {
            for (let x = 0; x < this.game.grid.width; x++) {

                // Use camera for correct isometric projection
                const pos = this.game.camera.isoToScreen(x, y);

                ctx.strokeStyle = "rgba(0,255,0,0.4)";
                ctx.lineWidth = 2;

                // MATCH renderer.js diamond geometry EXACTLY
                ctx.beginPath();
                ctx.moveTo(pos.x, pos.y - h);
                ctx.lineTo(pos.x + w, pos.y);
                ctx.lineTo(pos.x, pos.y + h);
                ctx.lineTo(pos.x - w, pos.y);
                ctx.closePath();
                ctx.stroke();

                // Draw coordinates
                ctx.fillStyle = "rgba(0,255,0,0.7)";
                ctx.font = "14px Arial";
                ctx.fillText(`${x},${y}`, pos.x - 10, pos.y + h + 16);
            }
        }

        // Highlight hovered tile
        if (this.highlightTile) {
            const { x, y } = this.highlightTile;
            const pos = this.game.camera.isoToScreen(x, y);

            ctx.strokeStyle = "rgba(255,0,0,0.8)";
            ctx.lineWidth = 3;

            ctx.beginPath();
            ctx.moveTo(pos.x, pos.y - h);
            ctx.lineTo(pos.x + w, pos.y);
            ctx.lineTo(pos.x, pos.y + h);
            ctx.lineTo(pos.x - w, pos.y);
            ctx.closePath();
            ctx.stroke();
        }
    }
}
