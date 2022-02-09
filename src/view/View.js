const View = (function() {
    return class View extends Canvas {
        constructor() {
            super({
                width: CANVAS_WIDTH,
                height: CANVAS_HEIGHT,
            });
            this.FPSDisplay = new FPSDisplay();
        }
    
    }
})()