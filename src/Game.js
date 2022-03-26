const Game = (function () {
    class Game {
        constructor() {
            // view
            this.field = new Field();
            this.fpsDisplay = new FPSDisplay();
            this.optionsPanel = new OptionsPanel();
            this.editModePanel = new EditModePanel(this.optionsPanel.editMode);
            this.userEvents = new UserEvents(this.field.getCanvasElement());
            //
            this.balls = new Balls();
            
            this.frameRates = new FrameRates([
                this.displayFrames,
                this.field.clearRect,
                this.userEvents.tick,
                this.viewElements,
                this.forEachBalls,
            ]);
            this.userEvents.onMouseClick = this.onFieldClick;

            this.init();
        }

        init() {
            const ball = {
                height: 10,
                width: 10,
                r: 80,
                x: 180,
                y: 290,
                vx: 0,
                vy: 0,
                mass: 1,
            };

            const ball2 = {
                height: 10,
                width: 10,
                r: 80,
                x: 380,
                y: 420,
                vx: 0,
                vy: 0,
                mass: 1,
            };
            const ball3 = {
                height: 10,
                width: 10,
                r: 60,
                x: 900,
                y: 340,
                vx: -2,
                vy: 0,
                mass: 100,
            };

            this.balls.addBall(ball);
            // this.balls.addBall(ball2);
            this.balls.addBall(ball3);
            
            this.frameRates.start();
        }
           
        onFieldClick = ({x,  y}) => {
            if (this.optionsPanel.editMode) {
                const { mass, radious, vx, vy, isRandom } = this.editModePanel;

                if (isRandom) return void this.balls.addRandomBall(x, y);

                for (const ball of this.balls.getBalls()) if (this.detectIntersection({x, y, r: radious}, ball)) return;

                this.balls.addBall({
                    x, y, mass, r: radious, vx, vy
                })

                return
            }
            this.field.setCursor('auto');
        }

        viewElements = () => {
            this.editModePanel.setVisibility(this.optionsPanel.editMode);
          
            if (this.optionsPanel.editMode) this.field.setCursor('cell');
        }

        forEachBalls = () => {
            const balls = this.balls.getBalls();
    
            for (const ball of balls) {
                if (this.optionsPanel.grabbing && this.detectGrabbing(ball)) {
                    this.grabBall(ball, balls)
                } else {
                    this.moveBall(ball);
                    this.reboundWalls(ball)
                }

                this.reboundBalls(ball, balls);

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
                    this.field.setCursor('auto');
                    
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
                    this.balls.grabbedId = ball.id;
                }

                if (this.balls.grabbedId === ball.id) {
                    this.field.setCursor('grabbing');
               
                    return true
                };
            }
        }

        grabBall = (ball) => { 
            const { x, y, vx, vy } = this.userEvents.getPressedSyncCords();
            
            ball.x = x;
            ball.y = y;
            ball.vx = vx;
            ball.vy = vy;

            ball.x -= this.getWallIntersectionX2(ball) - this.getWallIntersectionX1(ball);
            ball.y -= this.getWallIntersectionY2(ball) - this.getWallIntersectionY1(ball);
        }

        checkWallX1 = ({x, r}) => x <= r;
        checkWallX2 = ({x, r}) => x + r >= this.field.width;
        checkWallY1 = ({y, r}) => y <= r;
        checkWallY2 = ({y, r}) => y + r >= this.field.height;


        getWallIntersectionX1 = ({x, r}) => +this.checkWallX1({x, r}) && Math.abs(x - r);
        getWallIntersectionX2 = ({x, r}) => +this.checkWallX2({x, r}) && x + r - this.field.width;
        getWallIntersectionY1 = ({y, r}) => +this.checkWallY1({y, r}) && Math.abs(y - r);
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
                   
                    let trueOx = (vxNorm) * (r1 + r2);
                    let trueOy = (vyNorm) * (r1 + r2);

                    // trueOx = trueOx - Math.abs(trueOx - oX) - vx1;
                    // trueOy = trueOy - Math.abs(trueOy - oY) - vy1;

                    let oXSign = 0;
                    let oYSign = 0;

                    if (currentBall.x > otherBall.x) oXSign = 1;
                    if (currentBall.y < otherBall.y) oYSign = -1;
                    if (currentBall.x < otherBall.x) oXSign = -1;
                    if (currentBall.y > otherBall.y) oYSign = 1;

                    let rx = 0
                    let ry = 0

                    rx = currentBall.x + trueOx*oXSign + oX*(-oXSign);
                    ry = currentBall.y + trueOy*oYSign + oY*(-oYSign);

                    const wallOffsetX = this.getWallIntersectionX1({x: rx, r: currentBall.r}) - this.getWallIntersectionX2({x: rx, r: currentBall.r});
                    const wallOffsetY = this.getWallIntersectionY1({y: ry, r: currentBall.r}) + this.getWallIntersectionY2({y: ry, r: currentBall.r});
                    
                    if (wallOffsetX && currentBall.id === this.balls.grabbedId) {
                        const oxCentersAngle = Math.acos(oX/(r1+r2));
                        const trueY1Y2 = Math.sin(oxCentersAngle) * (r1+r2);
                        const offsetY = trueY1Y2 - trueOy;

                        rx += wallOffsetX;
                        ry += offsetY * oYSign;
                    }

                    if (wallOffsetY && currentBall.id === this.balls.grabbedId) {
                        const oyCentersAngle = Math.acos(oY/(r1+r2));
                        const trueX1X2 = Math.sin(oyCentersAngle) * (r1+r2);
                        const offsetX = trueX1X2 - trueOx;

                        rx += offsetX * oXSign;
                        ry += wallOffsetY * (-oYSign);
                    }

                    currentBall.x = rx;
                    currentBall.y = ry;
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
})();