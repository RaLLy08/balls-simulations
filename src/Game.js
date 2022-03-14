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
        constructor() {
            this.field = new Field();
            this.fpsDisplay = new FPSDisplay();

            
            this.balls = new Balls();
            
            this.frameRates = new FrameRates([
                this.displayFrames,
                this.field.clearRect,
                this.forEachBalls,
            ]);
            // this.field.setFieldBalls(this.balls.getBalls()); 
            
            this.init();

        }

        init() {
            const ball = new Ball({
                height: 10,
                width: 10,
                r: 80,
                x: 120,
                y: 100,
                vx:4,
                vy: 4,
                id: 0,
            });

            const ball2 = new Ball({
                height: 10,
                width: 10,
                r: 80,
                x: 180,
                y: 510,
                vx: 4,
                vy: 0,
                id: 1,
            });

            this.balls.addBall(ball);
            this.balls.addBall(ball2);

            this.frameRates.start();
        }
        
        forEachBalls = () => {
            const balls = this.balls.getBalls();
            for (const ball of balls) {
                // ball.callPatterns();
                this.moveBall(ball)
                this.reboundWalls(ball)
                this.reboundBalls(ball, balls)
                this.field.drawBall(ball)
                this.field.drawAxises(ball)
                this.field.drawSpeedProjection(ball, {
                    length: 'radious'
                })
            };
        }

        moveBall = (ball) => {
            // const fpsCoef = this.getFpsCoef();
            ball.x += ball.vx;
            ball.y +=  ball.vy;
        }

        reboundWalls = (ball) => {
            const { width, height } = this.field.getSize();
            const { x, y, r } = ball;

            if(x + r > width || x < r) {  
                ball.vx *= -1;
            } 
            if (y + r > height || y < r) {
                ball.vy *= -1;
            }
        }


        reboundBalls = (currentBall, balls) => {
            for (const ball of balls) {
                if (currentBall.id === ball.id) continue;

                const collided = this.detectCollision(ball, currentBall);

                if (!collided) continue;

                const { x: xCenter1, y: yCenter1, vx: vx1, vy: vy1, r: r1 } = currentBall;
                const { x: xCenter2, y: yCenter2, vx: vx2, vy: vy2, r: r2 } = ball;

                const vxCollision  = xCenter1 - xCenter2;
                const vyCollision  = yCenter1 - yCenter2;

                const distance = Math.hypot(xCenter2-xCenter1, yCenter2-yCenter1);

                const vxCollisionNorm = vxCollision / distance;
                const vyCollisionNorm = vyCollision / distance;

                const vxRelativeVelocity = vx1 - vx2;
                const vyRelativeVelocity = vy1 - vy2;

                const speed = vxRelativeVelocity * vxCollisionNorm + vyRelativeVelocity * vyCollisionNorm;

                currentBall.vx -= speed * vxCollisionNorm;
                currentBall.vy -= speed * vyCollisionNorm;

                ball.vx += speed * vxCollisionNorm;
                ball.vy += speed * vyCollisionNorm;
            } 
        }     

        reboundBalls2 = (currentBall, balls) => {
            for (const ball of balls) {
                if (currentBall.id === 0) continue;
                if (currentBall.id === ball.id) continue;

                const collided = this.detectCollision(ball, currentBall);

                if (!collided) continue;
// alert()
                const { x: xCenter1, y: yCenter1, vx: vx1, vy: vy1, r: r1 } = currentBall;
                const { x: xCenter2, y: yCenter2, vx: vx2, vy: vy2, r: r2 } = ball;



                const vy1vx1diff = Math.atan(Math.abs(vy1/vx1));
                const vy2vx2diff = Math.atan(Math.abs(vy2/vx2));
         
    

                const v1v2diff = Math.abs(vy1vx1diff - vy2vx2diff);

                // console.log(toDegree(vy1vx1Diff), toDegree(vy2vx2Diff), toDegree(v1v2diff));

                // const center1center2vector = 
                const toDegree = (radians) => radians * (180 / Math.PI);
                const toSign = (value, sign) => {
                    if (value > 0) {
                        return value*Math.sign(sign);
                    }
                    if (value < 0) {
                        if (sign < 0) {
                            return value
                        }
                        if (sign > 0) {
                             return Math.abs(value)
                                
                        }
                    }
                    return 0
                }

                // const rVectorRads = Math.atan(vy2/vx2);
                // console.log(toDegree(rVectorRads), 'rVectorRads');

                const vx1Postion2 = xCenter1 + vx1;
                const vy1Position2 = yCenter1 + vy1;
         
                const xVectorCenter1ToV = xCenter1 - vx1Postion2;
                const yVectorCenter1ToV = yCenter1 - vy1Position2;

                const xVectorCenter1ToCenter2 = xCenter1 - xCenter2;
                const yVectorCenter1ToCenter2 = yCenter1 - yCenter2;
                // debugger
                // console.log('C:', xCenter1, yCenter1, 'A:', vx1Postion2, vy1Position2, 'B:', xCenter2, yCenter2);
                // console.log('AC:', xVectorCenter1ToV, yVectorCenter1ToV, 'BC:', xVectorCenter1ToCenter2, yVectorCenter1ToCenter2);
                // this.frameRates.stop()

                // cosinus bettween VectorCenter1ToV and VectorCenter1ToCenter2
                const cosBetween = (xVectorCenter1ToV * xVectorCenter1ToCenter2 + yVectorCenter1ToV * yVectorCenter1ToCenter2) / (Math.hypot(xVectorCenter1ToV, yVectorCenter1ToV) * Math.hypot(xVectorCenter1ToCenter2, yVectorCenter1ToCenter2))
                console.log('cosBetween:', toDegree(Math.acos(cosBetween)));
                
                // angle in radians between Vx1 and Vy1 for find V1
                const tanVx1Andv1Rad = Math.abs(vx1/vx2) || 0;
                //  Vx1 and Vy1 for find V1
                const v1 = Math.hypot(vx1, vy1);

                const newVx1Andv1Rad = Math.atan(tanVx1Andv1Rad) + Math.acos(cosBetween)
                const newVx1 = Math.cos(newVx1Andv1Rad) * v1;
                const newVy1 = Math.sin(newVx1Andv1Rad) * v1;


                // console.log(vx1, vy1, newVx1, newVy1);

                console.log('newVx1Andv1Rad:', toDegree(newVx1Andv1Rad));

                const tanVx2Andv2Rad = Math.abs(vx2/vx2) || 0;
                const v2 = Math.hypot(vx2, vy2);
                
                const newVx2Andv2Rad = Math.atan(tanVx2Andv2Rad) + Math.acos(cosBetween)
                const newVx2 = Math.cos(newVx2Andv2Rad) * v2;
                const newVy2 = Math.sin(newVx2Andv2Rad) * v2;


                // debugger
                // currentBall.vx = toSign(vx1, vx2);
                // currentBall.vy = toSign(vy1, vy2);

                // ball.vx = toSign(vx2, vx1);
                // ball.vy = toSign(vy2, vy1);


                currentBall.vx = vx2;
                currentBall.vy = vy2;

                ball.vx = vx1;
                ball.vy = vy1;
            } 
        }

        detectCollision = (current, other) => Math.pow(current.x - other.x, 2) + Math.pow(current.y - other.y, 2) <= Math.pow(current.r + other.r, 2);
        
        displayFrames = () => {
            const fps = this.frameRates.getFPS();
    
            this.fpsDisplay.displayFPS(fps);
        }
    }

    return Game;
})()