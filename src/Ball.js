const Ball = (function() {
    return class Ball {
        /**
         * 
         * @param {{width?: number, height?: string, r?: string, x?: string, y?: string,}=} options 
         */
        constructor(options = {}) {
            this.width = options.width || 10;
            this.height = options.height || 10;
            this.r = options.r || 1;
            this.x = options.x || 1;
            this.y = options.y || 1;
            this.vx = options.vx || 0;
            this.vy = options.vy || 0;
            this.mass = options.mass || 0;
            this.id = options.id;
            this.restitution = options.restitution;
            // this.patterns = options.patterns;
        }

    }
})()