const View = (function() {
    return class View extends Canvas {
        constructor() {
            super({
                width: CANVAS_WIDTH,
                height: CANVAS_HEIGHT,
            });
            this.FPSDisplay = new FPSDisplay();

            this.fieldElements = {
                balls: []
            }
        }

        drawFieldElements = () =>{
            this.clearRect();

            this.#drawBalls();
        }

        #drawBalls() {
            for (const ball of this.fieldElements.balls) {
                this.drawPoint({
                    x: ball.x,
                    y: ball.y,
                    r: ball.r,
                })
            }
        }

        setFieldBalls = (balls) => {
            this.fieldElements.balls = balls;
        }
    }
})()