const FPSDisplay = function() { 
    const defaultOptions = {
        throttleFPSMs: 1000,
        initialValue: '00.00',
    }

    class FPSDisplay {
        #field = document.getElementById('fps');
        /**
         * 
         * @param {{throttleFPSMs?: number, initialValue?: string}=} options 
         */
        constructor(options) {
            this.options = Object.assign(defaultOptions, options);
  
            this.#field.innerText = this.options.initialValue;

            this.initPublicFunctions();
        }

        initPublicFunctions = () => {
            this.displayFPS = throttle(this.#displayFPS, this.options.throttleFPSMs);
        }

        /**
         * 
         * @param {fps: number} fps 
         */
        #displayFPS = (value) => {
            this.#field.innerText = String(value).substring(0,5);
        }
    }

    return FPSDisplay;
}()