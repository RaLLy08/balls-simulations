const UserEvents = (function () {

    return class UserEvents {
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
})()