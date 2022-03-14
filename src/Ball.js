const Ball = (function() {
    const defaultOptions = {
        height: 10,
        width: 10,
        r: 40,
        x: 200,
        y: 50,
        vx: 9,
        vy: 9,
    }

    return class Ball {
        /**
         * 
         * @param {{width?: number, height?: string, r?: string, x?: string, y?: string,}=} options 
         */
        constructor(options) {
            options = Object.assign(defaultOptions, options);

            this.width = options.width;
            this.height = options.height;
            this.r = options.r;
            this.x = options.x;
            this.y = options.y;
            this.vx = options.vx;
            this.vy = options.vy;
            this.id = options.id;
        }

    }
})()