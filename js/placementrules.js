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

    canPlaceFloor(cell) {
        return !cell.floor;
    },

    canPlaceWall(cell) {
        return cell.floor && !cell.wall;
    },

    canPlaceRoof(cell) {
        return cell.wall && !cell.roof;
    },

    canPlaceDecor(cell) {
        return true;
    },

    canPlaceDoor(cell) {
        return cell.wall && !cell.door;
    },

    canPlaceWindow(cell) {
        return cell.wall && !cell.window;
    }
};
