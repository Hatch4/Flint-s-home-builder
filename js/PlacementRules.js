// PlacementRules.js
window.PlacementRules = {
    isValid(tileX, tileY, item) {
        const cell = window.grid.get(tileX, tileY);
        if (!cell) return false;

        switch (item.category) {
            case "floor":
                return !cell.floor;

            case "wall":
                return cell.floor && !cell.wall;

            case "roof":
                return cell.wall && !cell.roof;

            case "decor":
                return true;

            case "door":
                return cell.wall && !cell.door;

            case "window":
                return cell.wall && !cell.window;

            default:
                return false;
        }
    }
};
