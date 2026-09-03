window.assets = {
    floor: null,
    wall: null,
    roof: null,
    decor_mushroom: null,
    decor_lantern: null,

    deleteSound: new Audio("assets/sounds/pop.mp3"),

    load(callback) {
        const list = {
            floor: "assets/items/floor.png",
            wall: "assets/items/wall.png",
            roof: "assets/items/roof.png",
            decor_mushroom: "assets/items/mushroom.png",
            decor_lantern: "assets/items/lantern.png"
        };

        let loaded = 0;
        const keys = Object.keys(list);

        keys.forEach(key => {
            const img = new Image();
            img.src = list[key];
            img.onload = () => {
                window.assets[key] = img;
                loaded++;
                if (loaded === keys.length) callback();
            };
        });
    }
};
