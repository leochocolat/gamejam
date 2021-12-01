export default class Population {
    constructor({ religion, language, culture }) {
        this._properties = { religion, language, culture };
    }

    /**
     * Getters & Setters
     */
    get properties() {
        return this._properties;
    }

    /**
     * Private
     */
    comparePopulation(population) {
        let diff = 0;

        for (const key in this._properties) {
            if (this._properties[key] !== population.properties[key]) diff++;
        }

        return diff > 2;
    }
}