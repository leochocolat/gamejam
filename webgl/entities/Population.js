export default class Population {
    constructor({ id, religion, language, culture }) {
        this._id = id;
        this._properties = { religion, language, culture };
    }

    /**
     * Getters & Setters
     */
    get id() {
        return this._id;
    }

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
