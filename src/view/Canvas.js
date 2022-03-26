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
            // this.#ctx.lineWidth = width;
            this.#ctx.fillStyle = color;
            this.#ctx.fill();
            this.#ctx.closePath();
        }

        drawCircle(xyr, opts) {
            const { x, y, r } = xyr;
            const { color } = opts || { color: 'black' };
    
            this.#ctx.beginPath();
            this.#ctx.arc(x, y, r, 0, Math.PI*2);
            this.#ctx.lineWidth = 1;
            this.#ctx.strokeStyle = color; 

            this.#ctx.stroke();
            this.#ctx.closePath();
        }

        drawLine(fromX, fromY, toX, toY, width, color) {
            this.#ctx.beginPath(); 
            // this._ctx.lineCap = 'round'
            this.#ctx.lineWidth = width;
            this.#ctx.strokeStyle = color; 
            this.#ctx.moveTo(fromX, fromY); 
            this.#ctx.lineTo(toX, toY); 
            
            this.#ctx.stroke(); 
            
            this.#ctx.closePath();
        }


        writeText(x, y, text, opts = {}) {
            const size = opts.size || 12;

            this.#ctx.font = `${size}px monospace`;
            this.#ctx.textAlign = opts.textAlign;
            this.#ctx.fillStyle = opts.color;
            this.#ctx.fillText(text, x, y);
        } 

        clearRect = () => {
            this.#ctx.clearRect(0, 0, this.#canvas.width, this.#canvas.height);
        }
    
        changeWidth(width) {
            this.#canvas.width = width;
        }
    
        changeHeight(height) {
            this.#canvas.height = height;
        }

        getCanvasElement() {
            return this.#canvas;
        }
        
        get width() {
            return this.#canvas.width;
        }
        
        get height() {
            return this.#canvas.height;
        }

        /**
         * 
         * @param {state: boolean} 
         */
        setCursor = (cursor) => {
            this.#canvas.style.cursor = cursor;
        }
    }
})();