// placement.js
class placement {
   static attemptPlacement(grid, x, y, item) {
    if (!item) return false;

    // Validate placement based on item type
    if (!this.validate(grid, x, y, item)) {
        this.triggerWiggle(x, y);
        return false;
    }

    // Place item
    this.place(grid, x, y, item);

    // Check build requirements
    if (window.game && window.game.requirements) {
        window.game.requirements.update();
    }

    return true;
}

    static validate(grid, x, y, item) {
        const tile = grid.tiles[y][x];

        switch (item.category) {

            case "floor":
                // Floor can be placed anywhere
                return true;

            case "wall":
                // Walls must be on perimeter
                return this.isPerimeterTile(grid, x, y);

            case "door":
                // Door must be on perimeter AND tile must not already have a wall
                return this.isPerimeterTile(grid, x, y) && !tile.wall;

            case "window":
                // Window must be on perimeter AND tile must not already have a wall
                return this.isPerimeterTile(grid, x, y) && !tile.wall;

            case "roof":
                // Roof must be placed on any tile that has floor
                return tile.floor;

            case "decor":
                // Decor can be placed anywhere except roof tiles
                return !tile.roof;

            case "lantern":
                // Lantern must be placed on exterior perimeter
                return this.isPerimeterTile(grid, x, y);

            default:
                return false;
        }
    }

    static place(grid, x, y, item) {
        const tile = grid.tiles[y][x];

        switch (item.category) {

            case "floor":
                grid.placeFloor(x, y);
                break;

            case "wall":
                grid.placeWall(x, y, { type: "wall" });
                break;

            case "door":
                grid.placeWall(x, y, { type: "door" });
                break;

            case "window":
                grid.placeWall(x, y, { type: "window" });
                break;

            case "roof":
                grid.placeRoof(x, y);
                break;

            case "decor":
                grid.placeDecor(x, y, { type: item.type });
                break;

            case "lantern":
                grid.placeDecor(x, y, { type: "lantern" });
                break;
        }
    }

    static isPerimeterTile(grid, x, y) {
        return (
            x === 0 ||
            y === 0 ||
            x === grid.width - 1 ||
            y === grid.height - 1
        );
    }

    // Wiggle animation hook (renderer can animate this visually)
    static triggerWiggle(x, y) {
        // For now, just log — renderer can animate later
        console.log(`Invalid placement at (${x}, ${y}) — wiggle!`);
    }
}
