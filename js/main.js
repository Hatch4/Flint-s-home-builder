// main.js

let canvas, ctx;
let game = {};

window.onload = () => {
    canvas = document.getElementById("gameCanvas");
    ctx = canvas.getContext("2d");

    resizeCanvas();

    // Core game objects
    game.grid = new Grid(5, 4);
    game.camera = new Camera(game.grid, canvas);
    game.renderer = new Renderer(canvas, game.grid, game.camera);
    game.input = new Input(canvas, game.grid, game.camera);
    game.items = Items;
    game.ui = new UI(game);
    game.save = new Save(game);
    game.requirements = new Requirements(game);
    game.placement = new Placement(game);   // ⭐ add this

    window.game = game;                     // ⭐ make game global
    window.placementrules.init(game);
    window.placementpreview.init(game);

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
