const Canvas = (function(){
    const defaultOptions = {
        width: 900,
        height: 600,
    }

    return class Canvas {
        #ctx = null;
        #canvas = null;
        /**
         * 
         * @param {{width?: string, height?: string}=} options 
         */
        constructor(options) {
            this.options = Object.assign(defaultOptions, options);
            this.#canvas = document.getElementById('canvas');
            
            this.#canvas.width = this.options.width;
            this.#canvas.height = this.options.height;
            this.#ctx = this.#canvas.getContext('2d');
        }
        /**
         * 
         * @param {{x: number, y: number, r: number}}  xyr 
         * @param {{color: string}} opts 
         */
        drawPoint(xyr, opts) {
            const { x, y, r } = xyr;
            const { color } = opts || { color: 'black' };
    
            this.#ctx.beginPath()
            this.#ctx.arc(x, y, r, 0, Math.PI*2);
            this.#ctx.fillStyle = color;
            this.#ctx.fill();
            this.#ctx.closePath();
        }

        clearRect() {
            this.#ctx.clearRect(0, 0, this.#canvas.width, this.#canvas.height);
        }
    
        changeWidth(width) {
            this.#canvas.width = width;
        }
    
        changeHeight(height) {
            this.#canvas.height = height;
        }
        
        getSize() {
            return {
                width: this.#canvas.width,
                height: this.#canvas.height,
            }
        }
    }
})();