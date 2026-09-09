// animation.js
window.animation = {
    effects: [],

    // ---------------------------------------------------------
    // SPAWN DUST PUFF AT TILE
    // ---------------------------------------------------------
    spawnDust(tileX, tileY) {
        const pos = window.grid.isoToScreen(tileX, tileY);

        this.effects.push({
            x: pos.x,
            y: pos.y,
            life: 0,
            maxLife: 18,   // frames
            size: 40
        });
    },

    // ---------------------------------------------------------
    // DRAW ALL ACTIVE EFFECTS
    // ---------------------------------------------------------
    draw(ctx, camera) {
        if (this.effects.length === 0) return;

        ctx.save();

        for (let i = this.effects.length - 1; i >= 0; i--) {
            const fx = this.effects[i];

            // Fade out
            const alpha = 1 - fx.life / fx.maxLife;

            ctx.globalAlpha = alpha;

            ctx.fillStyle = "rgba(255,255,255,1)";
            ctx.beginPath();
            ctx.arc(fx.x, fx.y - 20, fx.size * alpha, 0, Math.PI * 2);
            ctx.fill();

            fx.life++;

            if (fx.life >= fx.maxLife) {
                this.effects.splice(i, 1);
            }
        }

        ctx.restore();
    }
};
