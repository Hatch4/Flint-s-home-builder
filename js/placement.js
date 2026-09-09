window.game = window.game || {};

window.game.placement = {
    init(game) {
        this.grid = game.grid;
    },

    attempt(tileX, tileY, item) {
        const cell = this.grid.get(tileX, tileY);

        if (!window.placementrules.isValid(tileX, tileY, item)) {
            return false;
        }

        if (window.input.deleteMode) {
            // simple delete: clear everything
            this.grid.set(tileX, tileY, {
                floor: null,
                wall: null,
                roof: null,
                decor: null,
                door: null,
                window: null
            });
            return true;
        }

        switch (item.category) {
            case "floor":  cell.floor  = item; break;
            case "wall":   cell.wall   = item; break;
            case "roof":   cell.roof   = item; break;
            case "decor":  cell.decor  = item; break;
            case "door":   cell.door   = item; break;
            case "window": cell.window = item; break;
        }

        this.grid.set(tileX, tileY, cell);
        return true;
    }
};
