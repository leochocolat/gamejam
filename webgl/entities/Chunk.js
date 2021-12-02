export default class Chunk {
    constructor({
        row,
        column,
        resource,
        population,
        mesh,
    }) {
        this._id = `${row}_${column}`;
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
    get id() {
        return this._id;
    }

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
        if (this.row === (chunk.row + 1) || this.row === (chunk.row - 1)) {
            if (chunk.column === this.column)
                return true;

            return (chunk.row % 2 === 0) ? chunk.column === (this.column + 1) : chunk.column === (this.column - 1);
        } else if (this.row === chunk.row)
            return this.column === (chunk.column + 1) || this.column === (chunk.column - 1);

        return false;
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
