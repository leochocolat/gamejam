export default class Population {
    constructor({ id, properties }) {
        this._id = id;
        this._properties = properties;
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

    get propertiesName() {
        return Object.values(this._properties).map(k => k.name);
    }

    get religion() {
        return this._properties.religion;
    }

    get culture() {
        return this._properties.culture;
    }

    get language() {
        return this._properties.language;
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
