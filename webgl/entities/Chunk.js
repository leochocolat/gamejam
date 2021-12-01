export default class Chunk {
    constructor({
        row,
        column,
        resource,
        population,
        mesh
    }) {
        this._row = row;
        this._column = column;
        this._resource = resource;
        this._population = population;

        this._mesh = mesh;

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

    get mesh() {
        return this._mesh;
    }

    get settler() {
        return this._settler;
    }

    set settler(settler) {
        this._settler = settler;
        this._mesh.setColor(this._settler.color);
    }

    /**
     * Public
     */
    isNeighbourOf(chunk) {
        if (chunk.row <= (this.row + 1) || chunk.row >= (this.row - 1)) {
            if (chunk.row % 2 === 0) {

            } else {

            }
        }
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
