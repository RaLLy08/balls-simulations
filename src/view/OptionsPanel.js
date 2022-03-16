const OptionsPanel = function() { 
    class OptionsPanel {
        #grabbingCheckbox = null;
        #projectionsCheckbox = null;

        constructor() {
            this.grabbing = +localStorage.getItem('grabbing') || false;
            this.friction = +localStorage.getItem('friction') || 0;
            this.gravitation = +localStorage.getItem('gravitation') || false;
            this.projections = +localStorage.getItem('projections') || false;

            this.#grabbingCheckbox = document.getElementById('grabbing-checkbox');
            this.#grabbingCheckbox.checked = this.grabbing;

            this.#grabbingCheckbox.onchange = (e) => {
                this.grabbing = e.target.checked;
                localStorage.setItem('grabbing', e.target.checked);
            };

            this.#projectionsCheckbox = document.getElementById('projections-checkbox');
            this.#projectionsCheckbox.checked = this.projections;

            this.#projectionsCheckbox.onchange = (e) => {
                this.projections = e.target.checked;
                localStorage.setItem('projections', e.target.checked);
            };
        }

    }

    return OptionsPanel;
}()