// placementrules.js
window.placementrules = {

    isValid(tileX, tileY, item) {
        const cell = window.game.grid.get(tileX, tileY);
        if (!cell) return false;

        switch (item.category) {
            case "floor": return !cell.floor;
            case "wall": return cell.floor && !cell.wall;
            case "roof": return cell.wall && !cell.roof;
            case "decor": return true;
            case "door": return cell.wall && !cell.door;
            case "window": return cell.wall && !cell.window;
            default: return false;
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
