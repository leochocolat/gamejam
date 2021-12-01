export default class Chunk {
    constructor({ row, column, resource, population }) {
        this._row = row;
        this._column = column;
        this._resource = resource;
        this._population = population;

        this._settler = null;
    }

    /**
     * Getters & Setters
     */
    get row() {
        return this._row;
    }

    get column() {
        return this._column;
    }

    get resource() {
        return this._resource;
    }

    get population() {
        return this._population;
    }

    get settler() {
        return this._settler;
    }

    set settler(settler) {
        this._settler = settler;
    }

    /**
     * Private
     */
    compareChunk(chunk) {
        return {
            populationWar: chunk.population.comparePopulation(this._population),
        };
    }
}
