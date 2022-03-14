const Field = (function() {
    return class Field extends Canvas {
        constructor() {
            super({
                width: CANVAS_WIDTH,
                height: CANVAS_HEIGHT,
            });
            
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
         * @param {{length: 'radious' | 'projection'}} options 
         */
        drawSpeedProjection = (ball, options) => {
            const defaultOptions = {
                length: 'radious',
            };
            options = Object.assign(defaultOptions, options);

            const { x, y, r, vx, vy } = ball;
            let resultVectorLength = null;

            const vxSign = Math.sign(vx);
            const vySign = Math.sign(vy); 

            // if (options.length === 'radious') {
            //     if (vxSign === 0 || vySign === 0) {
            //         resultVectorLength = r;
            //     } else {
            //         resultVectorLength = Math.hypot(r, r) / 2;
            //     }
            // }
            // if (options.length === 'projection') {
            //     const vetorRads = Math.atan(vy/vx);
            //     const xForR = Math.cos(Math.abs(vetorRads)) * (CANVAS_WIDTH - x*Math.sign(vx));


            //     resultVectorLength = xForR
            // }
          

            this.drawLine(
                x, y, 
                x + vx*10, 
                y + vy*10, 1, 'blue'
            );
        }
        
        drawAxises = (ball, opts) => {
            const { x, y, r, vx, vy } = ball;

            this.drawLine(0, y, CANVAS_WIDTH, y, 1, 'red');
            this.drawLine(x, 0, x, CANVAS_HEIGHT, 1, 'blue');
        }

        drawPositionValues = (ball) => {

        }
    }
})()

            // const rVectorRads = Math.atan(vy/vx);
            // const yForR = Math.sin(Math.abs(rVectorRads)) * r;
            // const xForR = Math.cos(Math.abs(rVectorRads)) * r;