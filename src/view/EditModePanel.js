const EditModePanel = function() { 
    return class EditModePanel {
        #root = document.getElementById('editMode-panel');
        radious = 10;
        mass = 1;
        vx = 0;
        vy = 0;
        isRandom = false;
        constructor(isVisible) {
            this.onInputChange(this.setInputElement('Radious:'), (value) => {
                this.radious = value;
            });

            this.onInputChange(this.setInputElement('Mass:'), (value) => {
                this.mass = value;
            });

            this.onInputChange(this.setInputElement('VX:'), (value) => {
                this.vx = value;
            });

            this.onInputChange(this.setInputElement('VY:'), (value) => {
                this.vy = value;
            });

            this.onCheckboxChange(this.setCheckboxElement('Random:'), (value) => {
                this.isRandom = value;
            });
            
            this.setVisibility(isVisible);
        }

        /**
         * 
         * @param {boolean} isVisible 
         */
        setVisibility(isVisible) {
            if (isVisible) this.#root.style.display = 'block';
            else this.#root.style.display = 'none';
        }

        setInputElement = (title) => {
            const span = document.createElement('span');
            span.innerText = title;

            const input = document.createElement('input');
            const box = document.createElement('div');
            input.type = 'number';

            box.appendChild(span);
            box.appendChild(input);

            this.#root.appendChild(box)

            return input;
        }

        setCheckboxElement = (title, checked = false) => {
            const span = document.createElement('span');
            span.innerText = title;

            const label = document.createElement('label');

            label.className = 'switch';
            label.innerHTML = `
                <input type="checkbox" ${checked ? 'checked' : ''} >
                <span class="slider"></span>
            `

            const box = document.createElement('div');

            box.appendChild(span);
            box.appendChild(label);

            this.#root.appendChild(box)

            return box;
        }

        onInputChange = (el, listener) => {
            el.onchange = (e) => void listener(+e.target.value);
        }

        onCheckboxChange = (el, listener) => {
            el.onchange = (e) => void listener(+e.target.checked);
        }
    }   
}();