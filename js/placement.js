// placement.js
class Placement {
    constructor(game) {
        this.game = game;
    }

    // ---------------------------------------------------------
    // ATTEMPT TO PLACE AN ITEM
    // ---------------------------------------------------------
    attempt(tileX, tileY, item) {
        const grid = this.game.grid;

        // Validate placement
        const valid = window.placementrules.isValid(tileX, tileY, item);
        if (!valid) {
            this.triggerWiggle(tileX, tileY);
            return false;
        }

        // Place item
        this.place(tileX, tileY, item);

        // Update requirements
        if (this.game.requirements) {
            this.game.requirements.update();
        }

        return true;
    }

    // ---------------------------------------------------------
    // PLACE ITEM INTO GRID
    // ---------------------------------------------------------
    place(tileX, tileY, item) {
        const tile = this.game.grid.get(tileX, tileY);

        switch (item.category) {

            case "floor":
                tile.floor = true;
                break;

            case "wall":
                tile.wall = { type: "wall", rotation: item.rotation };
                break;

            case "door":
                tile.wall = { type: "door", rotation: item.rotation };
                break;

            case "window":
                tile.wall = { type: "window", rotation: item.rotation };
                break;

            case "roof":
                tile.roof = true;
                break;

            case "decor":
                if (!tile.decor) tile.decor = [];
                tile.decor.push({ type: item.type, rotation: item.rotation });
                break;
        }

        // Dust puff animation
        window.animation.spawnDust(tileX, tileY);
    }

    // ---------------------------------------------------------
    // DELETE ITEM FROM TILE
    // ---------------------------------------------------------
    delete(tileX, tileY) {
        const tile = this.game.grid.get(tileX, tileY);
        if (!tile) return;

        // Delete decor first (topmost)
        if (tile.decor && tile.decor.length > 0) {
            tile.decor.pop();
            return;
        }

        // Delete roof
        if (tile.roof) {
            tile.roof = false;
            return;
        }

        // Delete wall / door / window
        if (tile.wall) {
            tile.wall = null;
            return;
        }

        // Delete floor
        if (tile.floor) {
            tile.floor = false;
            return;
        }
    }

    // ---------------------------------------------------------
    // WIGGLE ANIMATION (invalid placement)
    // ---------------------------------------------------------
    triggerWiggle(tileX, tileY) {
        console.log(`Invalid placement at (${tileX}, ${tileY}) — wiggle!`);
        // Renderer can animate this visually later
    }
}

window.Placement = Placement;
