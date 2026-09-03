// main.js
let canvas, ctx;

window.onload = () => {
    canvas = document.getElementById("gameCanvas");
    ctx = canvas.getContext("2d");

    resizeCanvas();

    // ---------------------------------------------------------
    // CORE GAME OBJECTS
    // ---------------------------------------------------------
    window.grid = new Grid(5, 4);
    window.camera = new Camera(window.grid, canvas);
    window.renderer = new Renderer(canvas, window.grid, window.camera);
    window.input = new Input(canvas, window.grid, window.camera);

    // Items are already global via Items.js
    window.items = window.Items;

    // Save system (optional)
    window.save = new Save(window);

    // Requirements system (optional)
    window.requirements = new Requirements(window);

    // ---------------------------------------------------------
    // PLACEMENT RULES (IMPORTANT)
    // DO NOT USE "new" — PlacementRules.js defines a plain object
    // ---------------------------------------------------------
    // PlacementRules.js already did:
    // window.placementrules = { isValid(...) }
    // So we do NOT instantiate anything here.

    // ---------------------------------------------------------
    // LOAD SAVE (if any)
    // ---------------------------------------------------------
    if (window.save && window.save.load) {
        window.save.load();
    }

    // ---------------------------------------------------------
    // DEBUG OVERLAY (optional)
    // ---------------------------------------------------------
    window.debug = new DebugOverlay(window);

    // ---------------------------------------------------------
    // START GAME LOOP
    // ---------------------------------------------------------
    requestAnimationFrame(loop);
};

function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    window.renderer.render();
    window.debug.draw(ctx);

    requestAnimationFrame(loop);
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.onresize = resizeCanvas;
