// debug.js
class DebugOverlay {
    constructor(game) {
        this.game = game;

        this.fps = 0;
        this.lastTime = performance.now();
        this.frameCount = 0;

        this.mouseIso = { x: 0, y: 0 };
        this.mouseTile = { x: 0, y: 0 };

        this.bindMouseTracking();
    }

    // ---------------------------------------------------------
    // Track mouse → iso → tile
    // ---------------------------------------------------------
    bindMouseTracking() {
        window.addEventListener("pointermove", (e) => {
            const iso = this.game.camera.screenToIso(e.clientX, e.clientY);
            this.mouseIso = iso;

            const snapped = this.game.grid.snap(iso.x, iso.y);
            this.mouseTile = snapped;
        });
    }

    // ---------------------------------------------------------
    // FPS CALCULATION
    // ---------------------------------------------------------
    updateFPS() {
        const now = performance.now();
        this.frameCount++;

        if (now - this.lastTime >= 1000) {
            this.fps = this.frameCount;
            this.frameCount = 0;
            this.lastTime = now;
        }
    }

    // ---------------------------------------------------------
    // DRAW DEBUG OVERLAY
    // ---------------------------------------------------------
    draw(ctx) {
        this.updateFPS();

        ctx.save();

        ctx.fillStyle = "rgba(0,0,0,0.55)";
        ctx.fillRect(10, 10, 220, 110);

        ctx.fillStyle = "#00ff00";
        ctx.font = "14px Arial";

        ctx.fillText(`FPS: ${this.fps}`, 20, 35);

        ctx.fillText(
            `ISO: ${this.mouseIso.x.toFixed(2)}, ${this.mouseIso.y.toFixed(2)}`,
            20,
            60
        );

        ctx.fillText(
            `Tile: ${this.mouseTile.x}, ${this.mouseTile.y}`,
            20,
            85
        );

        ctx.fillText(
            `Camera: x=${this.game.camera.x.toFixed(2)} y=${this.game.camera.y.toFixed(2)} zoom=${this.game.camera.zoom.toFixed(2)}`,
            20,
            110
        );

        ctx.restore();
    }
}

window.DebugOverlay = DebugOverlay;
