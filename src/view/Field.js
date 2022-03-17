const Field = (function() {
    return class Field extends Canvas {
        constructor() {
            super({
                width: CANVAS_WIDTH,
                height: CANVAS_HEIGHT,
            });

            // this.ballOptions = new Map();
        }

        drawBall = (ball) => {
            const { x, y, r, vx, vy } = ball;

            this.drawCircle({
                x,
                y,
                r,
            })

            const toDeqree = (radians) => radians * (180 / Math.PI);
            const toRad = (deqree) => deqree * (Math.PI / 180);


            /*
            ** oX, oY projections of the ball
            */

        }

        /**
         *  Direction of move line
         * @param {Ball} ball 
         */
        drawSpeedProjection = (ball) => {
            const VY_TEXT_MARGIN_BOTTOM = 4;
            const VY_TEXT_MARGIN_LEFT = 2;
            const VX_TEXT_MARGIN_LEFT = 2;
            const VX_TEXT_MARGIN_TOP = 4;
            const SPEED_APMLIFY_COEF = 10;
            const SPEED_LINE_WIDTH = 1;
            const SPEED_LINE_COLOR = 'darkblue';

            const { x, y, r, vx, vy } = ball;

            this.writeText(x + VY_TEXT_MARGIN_LEFT, y - r - VY_TEXT_MARGIN_BOTTOM, 'vy:' + truncTo(vy, 3));
            this.writeText(x + r + VX_TEXT_MARGIN_LEFT, y - VX_TEXT_MARGIN_TOP, 'vx:' + truncTo(vx, 3));

            this.drawLine(
                x, y, 
                x + vx * SPEED_APMLIFY_COEF, 
                y + vy * SPEED_APMLIFY_COEF, SPEED_LINE_WIDTH, SPEED_LINE_COLOR
            );
        }
        /**
         *  Direction of move line
         * @param {[Ball]} balls 
         */
        drawBallsDistances = (balls) => {
            const X1X2_TEXT_MARGIN_TOP = 12;
            // !n
            for (let i = 0; i < balls.length; i++) {
                const { x: x1, y: y1 } = balls[i];

                for (let j = i + 1; j < balls.length; j++) {
                    const { x: x2, y: y2 } = balls[j];
                    
                    const distanceC1C2 = Math.hypot(x2 - x1, y2 - y1);
                    const distanceX1X2 = x2 - x1;
                    const distanceY1Y2 = y2 - y1;

                    // distance between x axes of balls
                    this.writeText(x1 + distanceX1X2/2, y2 + X1X2_TEXT_MARGIN_TOP, Math.trunc(distanceX1X2), { textAlign: 'center', color: 'blue' });
                    // distance between y axes of balls
                    this.writeText(x1, y2 - distanceY1Y2/2, Math.trunc(distanceY1Y2), { textAlign: 'center', color: 'red' });
                    // distance between centers
                    this.writeText(x1 + (distanceX1X2/2), y1 + (distanceY1Y2/ 2) - 2, Math.trunc(distanceC1C2), { textAlign: 'center', color: 'green' });
                    
                    // line between centers
                    this.drawLine(x1, y1, x2, y2, 0.25, 'green');
                }
            }
        }

        drawAxises = (ball, opts) => {
            const OY_TEXT_MARGIN_TOP = 11;
            const OY_TEXT_MARGIN_RIGHT = 3;
            const OX_TEXT_MARGIN_LEFT = 3;
            const OX_TEXT_MARGIN_BOTTOM = 2;
            const { x, y } = ball;

            this.writeText(x - OY_TEXT_MARGIN_RIGHT, OY_TEXT_MARGIN_TOP, Math.trunc(x), { textAlign: 'end'});
            this.writeText(OX_TEXT_MARGIN_BOTTOM, y - OX_TEXT_MARGIN_LEFT, Math.trunc(y), { textAlign: 'start'});

            this.drawLine(0, y, CANVAS_WIDTH, y, 1, 'blue');
            this.drawLine(x, 0, x, CANVAS_HEIGHT, 1, 'red');
        }

    }
})()
