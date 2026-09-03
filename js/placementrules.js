// PlacementRules.js
window.placementrules = {
    isValid(tileX, tileY, item) {
        const cell = window.grid.get(tileX, tileY);
        if (!cell) return false;

        switch (item.category) {

            // -------------------------------------------------
            // FLOOR
            // -------------------------------------------------
            case "floor":
                return cell.floor === null;

            // -------------------------------------------------
            // WALL (requires floor)
            // -------------------------------------------------
            case "wall":
                return cell.floor !== null && cell.wall === null;

            // -------------------------------------------------
            // ROOF (requires wall)
            // -------------------------------------------------
            case "roof":
                return cell.wall !== null && cell.roof === null;

            // -------------------------------------------------
            // DOOR (requires wall)
            // -------------------------------------------------
            case "door":
                return cell.wall !== null && cell.door === null;

            // -------------------------------------------------
            // WINDOW (requires wall)
            // -------------------------------------------------
            case "window":
                return cell.wall !== null && cell.window === null;

            // -------------------------------------------------
            // DECOR (always allowed)
            // -------------------------------------------------
            case "decor":
                return true;

            default:
                return false;
        }
    }
};

