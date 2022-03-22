const Game = (function () {
    class FrameRates {
        #prevFrame;
        #currentFrame;
        #callFns = [];
        /**
         * frame delay, default browser requestAnimationFrame ~ 60 fps (depending on your OS settings)
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
        grabbedId = null;
        prevGrabbingXSign = null;
        prevGrabbingYSign = null;
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
            // view
            this.field = new Field();
            this.fpsDisplay = new FPSDisplay();
            this.optionsPanel = new OptionsPanel();
            this.userEvents = new UserEvents(this.field.getCanvasElement());
            //
            this.balls = new Balls();
            
            this.frameRates = new FrameRates([
                this.displayFrames,
                this.field.clearRect,
                this.userEvents.tick,
                this.forEachBalls,
            ]);

            this.init();
        }

        init() {
            const ball = new Ball({
                height: 10,
                width: 10,
                r: 80,
                x: 180,
                y: 290,
                vx: 0,
                vy: 0,
                id: 0,
                mass: 1,
            });

            const ball2 = new Ball({
                height: 10,
                width: 10,
                r: 80,
                x: 380,
                y: 420,
                vx: 0,
                vy: 0,
                id: 1,
                mass: 1,
            });
            const ball3 = new Ball({
                height: 10,
                width: 10,
                r: 60,
                x: 900,
                y: 340,
                vx: -2,
                vy: 0,
                id: 2,
                mass: 100,
            });

            this.balls.addBall(ball);
            this.balls.addBall(ball2);
            this.balls.addBall(ball3);
            // this.frameRates.setFps(10)
            this.frameRates.start();
        }
        
        forEachBalls = () => {
            const balls = this.balls.getBalls();
    
            for (const ball of balls) {
                if (this.optionsPanel.grabbing && this.detectGrabbing(ball)) {
                    this.grabBall(ball, balls)
                } else {
                    this.moveBall(ball);
                    this.reboundBalls(ball, balls)
                    this.reboundWalls(ball)
                }

                if (this.optionsPanel.projections) {
                    this.field.drawAxises(ball);
                    this.field.drawSpeedProjection(ball);
                    this.field.drawBallsDistances(balls);
                }
              
                this.field.drawBall(ball);
            };
        }

        moveBall = (ball) => {
            ball.x += ball.vx;
            ball.y += ball.vy;
        }

        detectGrabbing = (ball) => {
            const isMousePressed = this.userEvents.isMousePressed;

            if (isMousePressed) {
                const { x, y, vx, vy } = this.userEvents.getPressedSyncCords();


                this.userEvents.onMouseUnpress = () => {
                    this.field.setCursorGrabbing(false);
                    
                    this.balls.fixedBallId = null;
                    this.balls.grabbedId = null;
                };

                const canBeGrabbed = this.balls.grabbedId === null || this.balls.grabbedId === ball.id;

                if (!canBeGrabbed) return;

                const intersected = this.detectIntersection(ball, {
                    x,
                    y,
                    vx,
                    vy,
                    r: 1
                })

                if (vx === 0 && vy === 0 && this.balls.grabbedId === ball.id) {
                    this.balls.fixedBallId = ball.id;
                } else if (this.balls.grabbedId === ball.id) {
                    this.balls.fixedBallId = null;
                }
                
                if (intersected) {
                    this.balls.grabbedId = ball.id
                }

                if (this.balls.grabbedId === ball.id) {
                    this.field.setCursorGrabbing(true);
               
                    return true
                };
            }
        }

        grabBall = (ball, balls) => { 
            const { x, y, vx, vy } = this.userEvents.getPressedSyncCords();

            ball.x = x;
            ball.y = y;
            ball.vx = vx;
            ball.vy = vy;

            ball.x -= this.getWallIntersectionX2(ball) + this.getWallIntersectionX1(ball);
            ball.y -= this.getWallIntersectionY1(ball) + this.getWallIntersectionY2(ball);

     
            
            for (const otherBall of balls) {
                if (ball.id === otherBall.id) continue;

                if (this.detectIntersection(ball, otherBall)) {
                    const { x: xCenter1, y: yCenter1, vx: vx1, vy: vy1, r: r1 } = ball;
                    const { x: xCenter2, y: yCenter2, vx: vx2, vy: vy2, r: r2 } = otherBall;
                    // the sum of grabbed ball vx and applied ball vx used to prevent space between balls while rebouding
                    const oX  = Math.abs(xCenter1 - xCenter2 - (vx1 + vx2));
                    const oY  = Math.abs(yCenter1 - yCenter2 - (vy1 + vy2));

                    const distance = Math.hypot(oX, oY);

                    const vxNorm = (oX / distance) || 0;
                    const vyNorm = (oY / distance) || 0;
                   
                    const trueOx = (vxNorm) * (r1 + r2);
                    const trueOy = (vyNorm) * (r1 + r2);

                    let oXSign = 0;
                    let oYSign = 0;

                    if (ball.x > otherBall.x) oXSign = 1;
                    if (ball.y < otherBall.y) oYSign = -1;
                    if (ball.x < otherBall.x) oXSign = -1;
                    if (ball.y > otherBall.y) oYSign = 1;

                    let returnX = 0;
                    let returnY = 0;

                    if ((oXSign === 0 && oYSign === 0 )) {
                        // move to prev cords because of undefined direction 
                        returnX = ball.x + r2*2*this.balls.prevGrabbingXSign;
                        returnY = ball.y + r2*2*this.balls.prevGrabbingYSign;
                    } else {
                        returnX = ball.x + trueOx*oXSign + oX*(-oXSign) - vx2;
                        returnY = ball.y + trueOy*oYSign + oY*(-oYSign) - vy2;
                        // console.log(ball.y);
                       
                        const vyNorm2 = Math.acos(((oY - this.getWallIntersectionY2(ball)) / (r1 + r2)));

                        const trueOx2 = Math.sin(vyNorm2 ) * (r1 + r2);


                        //console.log(this.field.height - yCenter2, oY - this.getWallIntersectionY2(ball));
                        // returnY -= this.getWallIntersectionY2({y: returnY, r: r1})

                        this.balls.prevGrabbingXSign = oXSign;
                        this.balls.prevGrabbingYSign = oYSign;
                    }



                    ball.x = returnX;
                    ball.y = returnY


                        
                        // console.log(ball.y);
                       
                        // const vyNorm2 = Math.acos(((oY - this.getWallIntersectionY2(ball)) / (r1 + r2)));

                        // const trueOx2 = Math.sin(vyNorm2 ) * (r1 + r2);


                        //console.log(this.field.height - yCenter2, oY - this.getWallIntersectionY2(ball));
                        // returnY -= this.getWallIntersectionY2({y: returnY, r: r1})




                    // if (this.checkWallY2(ball)) {

                    //     const vyNorm2 = Math.acos((oY / (r1 + r2)));

                    //     const trueOx2 = Math.sin(vyNorm2) * (r1 + r2);

                    //     // console.log(trueOx2);

                    //     // ball.x -= trueOx*oXSign + oX*(-oXSign)
                    //     // ball.y -= trueOy*oYSign + oY*(-oYSign);
                    // }

                    // if (this.checkWallY2(ball)) {
                    //     const vyNorm2 = Math.acos((oY / (r1 + r2)));
                    //     const trueOx2 = Math.sin(vyNorm2) * (r1 + r2);
                    //     ball.x -= (trueOx2 - oX)
                    // }

                    if (this.checkWallX2(ball)) {
                        ball.x +=  this.field.width - (ball.x + ball.r);
                    }

                    if (this.checkWallX1(ball)) {
                        ball.x -=  (ball.x - ball.r);
                    }

                    if (this.checkWallY2(ball)) {
                        ball.y +=  this.field.height - (ball.y + ball.r);
                    }

                    if (this.checkWallY1(ball)) {
                        ball.y -=  (ball.y - ball.r);
                    }
                }

            }
        }


        checkWallX1 = ({x, r}) => x <= r;
        checkWallX2 = ({x, r}) => x + r >= this.field.width;
        checkWallY1 = ({y, r}) => y <= r;
        checkWallY2 = ({y, r}) => y + r >= this.field.height;


        getWallIntersectionX1 = ({x, r}) => +this.checkWallX1({x, r}) && x - r;
        getWallIntersectionX2 = ({x, r}) => +this.checkWallX2({x, r}) && x + r - this.field.width;
        getWallIntersectionY1 = ({y, r}) => +this.checkWallY1({y, r}) && y - r;
        getWallIntersectionY2 = ({y, r}) => +this.checkWallY2({y, r}) && Math.abs(this.field.height - y - r);
        
        reboundWalls = (ball) => {
            const { width, height } = this.field;

            if (this.checkWallX1(ball)) {
                ball.vx *= -1;
                ball.x = ball.r;
            }
            if(this.checkWallX2(ball)) {  
                ball.vx *= -1;
                ball.x = width - ball.r;
            } 
            if (this.checkWallY1(ball)) {
                ball.vy *= -1;
                ball.y = ball.r;
            }
            if (this.checkWallY2(ball)) {
                ball.vy *= -1;
                ball.y = height - ball.r;
            }
        }


        reboundBalls = (currentBall, balls) => {
            for (const otherBall of balls) {
                if (currentBall.id === otherBall.id) continue;

                const intersected = this.detectIntersection(otherBall, currentBall);

                const { x: xCenter1, y: yCenter1, vx: vx1, vy: vy1, r: r1 } = currentBall;
                const { x: xCenter2, y: yCenter2, vx: vx2, vy: vy2, r: r2 } = otherBall;
                

                if (intersected) {
                    const oX  = Math.abs(xCenter1 - xCenter2);
                    const oY  = Math.abs(yCenter1 - yCenter2);
                    const distance = Math.hypot(oX, oY);

                    const vxNorm = (oX / distance) || 0;
                    const vyNorm = (oY / distance) || 0;
                   
                    const trueOx = (vxNorm) * (r1 + r2);
                    const trueOy = (vyNorm) * (r1 + r2);
   
                    let oXSign = 0;
                    let oYSign = 0;

                    if (currentBall.x > otherBall.x) oXSign = 1;
                    if (currentBall.y < otherBall.y) oYSign = -1;
                    if (currentBall.x < otherBall.x) oXSign = -1;
                    if (currentBall.y > otherBall.y) oYSign = 1;

                    currentBall.x = currentBall.x + trueOx*oXSign + oX*(-oXSign);
                    currentBall.y = currentBall.y + trueOy*oYSign + oY*(-oYSign);
                }

                const collided = this.detectCollision(otherBall, currentBall);

                if (!collided) continue;


                const isCurrentFixed = this.balls.fixedBallId === currentBall.id;
                const isOtherFixed = this.balls.fixedBallId === otherBall.id;

                let mass1 = currentBall.mass;
                let mass2 = otherBall.mass;
               
                if (isCurrentFixed) mass2 = 0;
                if (isOtherFixed) mass1 = 0;
                

                const vxCollision  = xCenter1 - xCenter2;
                const vyCollision  = yCenter1 - yCenter2;

                const distance = Math.hypot(xCenter2-xCenter1, yCenter2-yCenter1);

                const vxCollisionNorm = vxCollision / distance;
                const vyCollisionNorm = vyCollision / distance;

                const vxRelativeVelocity = vx1 - vx2;
                const vyRelativeVelocity = vy1 - vy2;

                const speed = vxRelativeVelocity * vxCollisionNorm + vyRelativeVelocity * vyCollisionNorm;

                if (speed > 0) {
                    continue;
                }

                const impulse = 2 * speed / (mass1+ mass2);

                currentBall.vx -= (impulse * mass2 * vxCollisionNorm);
                currentBall.vy -= (impulse * mass2 * vyCollisionNorm);

                otherBall.vx += (impulse * mass1 * vxCollisionNorm);
                otherBall.vy += (impulse * mass1 * vyCollisionNorm);
            } 
        }     

        detectIntersection = (current, other) => Math.pow(current.x - other.x, 2) + Math.pow(current.y - other.y, 2) <= Math.pow(current.r + other.r, 2);

        detectCollision = (current, other) => Math.floor(Math.pow(current.x - other.x, 2) + Math.pow(current.y - other.y, 2)) === Math.floor(Math.pow(current.r + other.r, 2));

        displayFrames = () => {
            const fps = this.frameRates.getFPS();
    
            this.fpsDisplay.displayFPS(fps);
        }
    }

    return Game;
})()