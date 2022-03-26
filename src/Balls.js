const Balls = (function() {
    const getId = (() => {
        function* inc() {
            let i = 0;
            for (;;) yield i++;
        }

        const gen = inc();

        return () => gen.next().value;
    })()

    const getRandomValue = (min, max) => Math.trunc((Math.random() * (max - min + 1)) + min);
    const getRandomColor = () => "#" + Math.floor(Math.random()*16777215).toString(16);
    const getRandomSign = () => Math.sign(Math.random() - 0.5);
  
    class Ball {
        constructor(options = {}) {
            this.width = options.width || 10;
            this.height = options.height || 10;
            this.r = options.r || 1;
            this.x = options.x || 1;
            this.y = options.y || 1;
            this.vx = options.vx || 0;
            this.vy = options.vy || 0;
            this.mass = options.mass || 1;
            this.color = options.color || 'transparent';
            this.id = getId();
            this.restitution = options.restitution;
        }
    }

    return class Balls {
        #balls = [];
        grabbedId = null;

        addBall = (options) => void this.#balls.push(new Ball(options));
        /**
         * 
         * @returns {[Ball]}
         */
        addRandomBall = (x, y) => 
        void this.addBall({ 
            x, 
            y, 
            r: getRandomValue(6, 80), 
            color: getRandomColor(),
            vx: getRandomSign() * getRandomValue(0, 7),
            vy: getRandomSign() * getRandomValue(0, 7),
            mass: getRandomValue(1, 5)
        })
        
        

        getBalls = () => this.#balls;
        getTotalMass = () => {
            let totalMass = 0;

            for (const ball of this.#balls) {
                totalMass += ball.mass;
            }
            return totalMass;
        }
        getTotalSpeed = () => {
            let totalSpeed = 0;

            for (const ball of this.#balls) {
                totalSpeed += Math.hypot(ball.vx, ball.vy);
            }
            return totalSpeed;
        }

        getTotalEnergy = () => {
            let totalEnergy = 0;

            for (const ball of this.#balls) {
                totalEnergy += (ball.mass * ( (Math.hypot(ball.vx, ball.vy))**2 ) ) / 2;
            }
            return totalEnergy;
        }
    }
})();