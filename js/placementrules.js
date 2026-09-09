window.placementrules = {
    init(game) {
        this.grid = game.grid;
    },

    isValid(tileX, tileY, item) {
        const cell = this.grid.get(tileX, tileY);
        if (!cell) return false;

        if (window.input.deleteMode) {
            return !!(cell.floor || cell.wall || cell.roof || cell.door || cell.window || cell.decor);
        }

        if (window.input.interiorMode && item.category !== "decor") {
            return false;
        }

        switch (item.category) {
            case "floor":  return !cell.floor;
            case "wall":   return cell.floor && !cell.wall;
            case "roof":   return cell.wall && !cell.roof;
            case "decor":  return true;
            case "door":   return cell.wall && !cell.door;
            case "window": return cell.wall && !cell.window;
            default:       return false;
        }
    }
};
