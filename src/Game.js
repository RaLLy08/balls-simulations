const Game = (function () {
    class FrameRates {
        #prevFrame;
        #currentFrame;
        #callFns = [];
        /**
         * frame delay, default browser requestAnimationFrame ~ 60 fps
         */
        #frameDelay = 'browser';
        /**
         * callFns - which will be called every frame
         */
        constructor(callFns) {
            this.#callFns = callFns;
            this.isStarted = false;
        }

        #callFrame = () => {
            if (!this.isStarted) return;
            
            this.#timeBetweenCalls();
            for (const fn of this.#callFns) fn();

            if (this.#frameDelay === 'browser') return window.requestAnimationFrame(this.#callFrame);

            setTimeout(this.#callFrame, this.#frameDelay);
        }

        #timeBetweenCalls = () => {
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
            this.frameRates = new FrameRates([
                this.displayFrames,
                this.moveBalls,
                this.view.drawFieldElements,
            ]);

            this.view.setFieldBalls(this.balls.getBalls()); 
            
            this.init();
        }

        init() {
            const ball = new Ball({
                patters: [
                    this.moveBall,
                    this.reboundWalls
                ]
            });
   
            this.balls.addBall(ball);

            this.frameRates.start();
        }

        moveBalls = () => {
            const balls = this.balls.getBalls();

            for (const ball of balls) ball.callPatterns();
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
    
        displayFrames = () => {
            const fps = this.frameRates.getFPS();
    
            this.view.FPSDisplay.displayFPS(fps);
        }
    }

    return Game;
})()