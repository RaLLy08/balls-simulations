const Game = (function () {
    class FrameRates {
        #prevFrame;
        #currentFrame;
        /**
         * frame delay, default browser requestAnimationFrame ~ 60 fps
         */
        #frameDelay = 'browser';
        /**
         * frameFn - which will be called every frame
         */
        constructor(frameFn) {
            this.callFn = frameFn;
            this.isStarted = false;
        }

        #callFrame = () => {
            if (!this.isStarted) return;
            
            this.#callsMeasure();
            this.callFn();

            if (this.#frameDelay === 'browser') return window.requestAnimationFrame(this.#callFrame);

            setTimeout(this.#callFrame, this.#frameDelay);
        }

        #callsMeasure = () => {
            const newFrame = performance.now();
            this.#currentFrame = newFrame - this.#prevFrame;
    
            this.#prevFrame = newFrame;
        }


        setFps = (fps) => {
            this.#frameDelay = 1000 / fps;
        }

        /**
         * default browser requestAnimationFrame ~ 60 fps
         */
        setFpsByDefault = () => {
            this.#frameDelay = 'browser'
        }
        
        /**
         * start frame calling
         */
        start = () => {
            this.isStarted = true
            this.#callFrame();
        }
        /**
         * stop frame calling
         */
        stop = () => {
            this.isStarted = false;
        }
        /**
         * get fps
         */
        getFPS = () => {
            if (!this.#currentFrame) return  Number.MAX_SAFE_INTEGER;

            return 1000 / this.#currentFrame;
        }
    }
    
    class Balls {
        #balls = [];
        /**
         * @param {Ball} ball 
         */
        addBall = (ball) => {
            this.#balls.push(ball);
        }
        /**
         * 
         * @returns {[Ball]}
         */
        getBalls = () => this.#balls;
    }



    class Game {
        /**
         * @param {View} view 
         */
        constructor(view) {
            this.view = view;
            this.balls = new Balls();
            this.frameRates = new FrameRates(this.frame);

            this.init();

            this.frameRates.start();
        }

        init() {
            const ball = new Ball({
                patters: [
                    this.moveBall,
                    this.reboundWalls
                ]
            });
   
            this.balls.addBall(ball);
        }

        frame = () => {
            this.view.clearRect();

            this.showFrames();

            this.animateBalls();
        }

        animateBalls() {
            const balls = this.balls.getBalls();

            for (const ball of balls) {
                ball.callPatterns();

                this.drawBall(ball);
            }
        }

        moveBall = (ball) => {
            // const fpsCoef = this.getFpsCoef();
      
            ball.x += ball.vx;
            ball.y +=  ball.vy;
        }


        reboundWalls = (ball) => {
            const { width, height } = this.view.getSize();
            const { x, y, r } = ball;

            if(x + r > width || x < r) {  
                ball.vx *= -1;
            } 
            if (y + r > height || y < r) {
                ball.vy *= -1;
            }
        }

        drawBall(ball) {
            this.view.drawPoint({
                x: ball.x,
                y: ball.y,
                r: ball.r,
            })
        }
    
        showFrames() {
            const fps = this.frameRates.getFPS();
    
            this.view.FPSDisplay.displayFPS(fps);
        }
    }

    return Game;
})()