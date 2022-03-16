const Canvas = (function(){
    class UserEvents {
        isMousePressed = false;
        /* 
        ** warn: sets null after execute
        */
        onMouseUnpress = null;
        #pressedMouse = {
            x: undefined,
            y: undefined,
            vy: undefined,
            vx: undefined,
        };

        syncPressedMouse = {
            x: undefined,
            y: undefined,
            vy: undefined,
            vx: undefined,
        };

        constructor(element) {
            element.onmousedown = (e) => {
                this.isMousePressed = true;
                this.#pressedMouse.x = e.offsetX;
                this.#pressedMouse.y = e.offsetY;
                this.syncPressedMouse.x = e.offsetX;
                this.syncPressedMouse.y = e.offsetY;
            };
            element.onmouseup  = () => {
                if (this.isMousePressed) {
                    this.#unpress();
                }
            };
            element.onmouseleave = () => {
                if (this.isMousePressed) {
                    this.#unpress();
                }
            };
            element.onmousemove = (e) => {
                if (this.isMousePressed) {
                    // this.#pressedMouse.vx = e.offsetX - this.#pressedMouse.x;
                    // this.#pressedMouse.vy = e.offsetY - this.#pressedMouse.y;
                    this.#pressedMouse.x = e.offsetX;
                    this.#pressedMouse.y = e.offsetY;
                } 
            }
        }

        tick = () => {
            this.syncPressedMouse.vx = this.#pressedMouse.x - this.syncPressedMouse.x;
            this.syncPressedMouse.vy = this.#pressedMouse.y -  this.syncPressedMouse.y;

            this.syncPressedMouse.x = this.#pressedMouse.x;
            this.syncPressedMouse.y = this.#pressedMouse.y;
        }

        onPressedMove = () => {
 
        }

        #unpress = () => {
            this.isMousePressed = false;

            this.#pressedMouse.x = undefined;
            this.#pressedMouse.y = undefined;

            if (this.onMouseUnpress) {
                this.onMouseUnpress();
                this.onMouseUnpress = null;
            }
        }

        getPressedSyncCords = () => {
            if (this.isMousePressed) return this.syncPressedMouse;
            return null;
        };
    }


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

            this.userEvents = new UserEvents(this.#canvas);
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
            this.#ctx.arc(x, y, r*2, 0, Math.PI*2);
            // this.#ctx.lineWidth = width;
            this.#ctx.fillStyle = color;
            this.#ctx.fill();
            this.#ctx.closePath();
        }

        drawCircle(xyr, opts) {
            const { x, y, r } = xyr;
            const { color } = opts || { color: 'black' };
    
            this.#ctx.beginPath()
            this.#ctx.arc(x, y, r, 0, Math.PI*2);
            // this.#ctx.lineWidth = width;
            // this.#ctx.fillStyle = color;
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
            
            this.#ctx.closePath()
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
        setCursorGrabbing = (state) => {
            this.#canvas.style.cursor = state ? "grabbing" : 'auto';
        }
    }
})();