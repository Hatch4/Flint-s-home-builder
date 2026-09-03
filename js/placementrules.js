/// PlacementRules.js
window.placementrules = {
    isValid(tileX, tileY, item) {
        // Ensure tile is inside grid
        if (!window.grid.isValidTile(tileX, tileY)) return false;

        // Get the stack of items on this tile
        const stack = window.grid.cells[tileY][tileX];

        // Build a "cell" state from the stack
        const cell = {
            floor: stack.some(i => i.category === "floor"),
            wall: stack.some(i => i.category === "wall"),
            roof: stack.some(i => i.category === "roof"),
            decor: stack.some(i => i.category === "decor"),
            door: stack.some(i => i.category === "door"),
            window: stack.some(i => i.category === "window")
        };

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

