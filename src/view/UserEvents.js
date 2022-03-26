const UserEvents = (function () {

    return class UserEvents {
        isMousePressed = false;
        isClicked = false;
        /* 
        ** warn: sets null after execute
        */
        onMouseUnpress = null;
        onMouseClick = null;
        #mousePosition = {
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
            };
            element.onmouseup  = () => {
                if (this.isMousePressed) {
                    this.isClicked = true;
                    this.#unpress();
                }
            };
            element.onmouseleave = () => {
                if (this.isMousePressed) {
                    this.#unpress();
                }
            };
            element.onmousemove = (e) => {
                this.#mousePosition.x = e.offsetX;
                this.#mousePosition.y = e.offsetY;
            }
        }

        tick = () => {
            this.syncPressedMouse.vx = this.#mousePosition.x - this.syncPressedMouse.x;
            this.syncPressedMouse.vy = this.#mousePosition.y -  this.syncPressedMouse.y;

            this.syncPressedMouse.x = this.#mousePosition.x;
            this.syncPressedMouse.y = this.#mousePosition.y;

            if (this.isClicked && this.onMouseClick) {
                this.onMouseClick({
                    x: this.#mousePosition.x,
                    y: this.#mousePosition.y,
                });
                this.isClicked = false;
            }
        }

        #unpress = () => {
            this.isMousePressed = false;

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
})();