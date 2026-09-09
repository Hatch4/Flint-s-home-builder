// placementrules.js
window.placementrules = {

    // ---------------------------------------------------------
    // MAIN VALIDATION ENTRY POINT
    // ---------------------------------------------------------
    isValid(tileX, tileY, item) {
        const cell = window.game.grid.get(tileX, tileY);
        if (!cell) return false;

        switch (item.category) {

            case "floor":
                return this.canPlaceFloor(cell);

            case "wall":
                return this.canPlaceWall(cell);

            case "roof":
                return this.canPlaceRoof(cell);

            case "decor":
                return this.canPlaceDecor(cell);

            case "door":
                return this.canPlaceDoor(cell);

            case "window":
                return this.canPlaceWindow(cell);

            default:
                return false;
        }
    },

    // ---------------------------------------------------------
    // FLOOR RULES
    // ---------------------------------------------------------
    canPlaceFloor(cell) {
        return !cell.floor;
    },

    // ---------------------------------------------------------
    // WALL RULES
    // ---------------------------------------------------------
    canPlaceWall(cell) {
        return cell.floor && !cell.wall;
    },

    // ---------------------------------------------------------
    // ROOF RULES
    // ---------------------------------------------------------
    canPlaceRoof(cell) {
        return cell.wall && !cell.roof;
    },

    // ---------------------------------------------------------
    // DECOR RULES
    // ---------------------------------------------------------
    canPlaceDecor(cell) {
        return true; // decor always allowed
    },

    // ---------------------------------------------------------
    // DOOR RULES
    // ---------------------------------------------------------
    canPlaceDoor(cell) {
        return cell.wall && !cell.door;
    },

    // ---------------------------------------------------------
    // WINDOW RULES
    // ---------------------------------------------------------
    canPlaceWindow(cell) {
        return cell.wall && !cell.window;
    }
};
