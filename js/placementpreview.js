// placementpreview.js
window.placementpreview = {
    tile: null,
    valid: false,

    init(game) {
        this.grid = game.grid;
        this.camera = game.camera;
    },

    update(x, y, isValid) {
        this.tile = { x, y };
        this.valid = isValid;
    },

    clear() {
        this.tile = null;
    },

    draw(ctx) {
        if (!this.tile) return;
        if (!this.camera || !this.grid) return; // prevent early crash

        const { x, y } = this.tile;

        // Convert tile → screen using the REAL camera
        const pos = this.camera.isoToScreen(x, y);

        const w = this.grid.tileW / 2;
        const h = this.grid.tileH / 2;

        ctx.save();
        ctx.translate(pos.x, pos.y);

        ctx.fillStyle = this.valid
            ? "rgba(0,255,0,0.35)"
            : "rgba(255,0,0,0.35)";

        ctx.beginPath();
        ctx.moveTo(0, -h);
        ctx.lineTo(w, 0);
        ctx.lineTo(0, h);
        ctx.lineTo(-w, 0);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
    }
};
