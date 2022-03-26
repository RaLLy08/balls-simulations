const OptionsPanel = function() { 
    class OptionsPanel {
        #root = document.getElementById('options-panel');

        constructor() {
            this.grabbing = +localStorage.getItem('grabbing');
            this.friction = +localStorage.getItem('friction');
            this.gravitation = +localStorage.getItem('gravitation');
            this.projections = +localStorage.getItem('projections');
            this.editMode = +localStorage.getItem('editMode');

            this.onCheckboxChange(
                this.setOptionCheckbox('Enable grabbing:', this.grabbing), 
                checked => {
                    this.grabbing = checked;
                    localStorage.setItem('grabbing', checked);
                }
            );

            this.onCheckboxChange(this.setOptionCheckbox('Enable projections:', this.projections), checked => {
                this.projections = checked;
                localStorage.setItem('projections', checked);
            });

            this.onCheckboxChange(this.setOptionCheckbox('Edit mode:', this.editMode), checked => {
                this.editMode = checked;
                localStorage.setItem('editMode', checked);
            });
        }

        setOptionCheckbox = (title, checked = false) => {
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

        onCheckboxChange = (el, listener) => {
            el.onchange = (e) => void listener(+e.target.checked);
        }
    }

    return OptionsPanel;
}();