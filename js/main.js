// main.js

let canvas, ctx;
let game = {};

window.onload = () => {
    canvas = document.getElementById("gameCanvas");
    ctx = canvas.getContext("2d");

    resizeCanvas();

   // Core game objects
game.tileW = 64;   // match your art
game.tileH = 32;

game.grid = new Grid(game.tileW, game.tileH);
game.camera = new Camera(game.tileW, game.tileH);

game.renderer = new Renderer(canvas, game.grid, game.camera);
game.input = new Input(canvas, game.grid, game.camera);
game.items = Items;
game.ui = new UI(game);
game.save = new Save(game);
game.requirements = new Requirements(game);

// NEW placement engine
placementpreview.init(game);
placementrules.init(game);
window.game.placement.init(game);

window.game = game; // keep global


    game.save.load();
    game.debug = new DebugOverlay(game);

    requestAnimationFrame(loop);
};

function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    game.renderer.render();
    game.debug.draw(ctx);

    requestAnimationFrame(loop);
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.onresize = resizeCanvas;
