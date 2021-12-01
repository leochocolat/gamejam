import Territory from './Territory';

export default class Settler {
    constructor({ id, targetResourceId, targetResourceAmount, enemy, color }) {
        this._id = id;
        this._targetResourceId = targetResourceId;
        this._targetResourceAmount = targetResourceAmount;
        this._enemy = enemy;
        this._color = color;

        this._territories = [];
    }

    /**
     * Getters & Getters
     */
    get id() {
        return this._id;
    }

    get color() {
        return this._color;
    }

    get territories() {
        return this._territories;
    }

    /**
     * Public
     */
    addChunk(chunk) {
        if (this._territories.length > 0) {
            for (let i = 0; i < this._territories.length; i++) {
                const territory = this._territories[i];
                territory.addChunk(chunk);
            }
        } else {
            const territory = new Territory();
            territory.addChunk(chunk);
            this._territories.push(territory);
        }
    }

    // addTerritory(territory) {
    //     this._territories.push(territory);
    // }

    // removeTerritory(territory) {
    //     const index = this._territories.indexOf(territory);
    //     this._territories.splice(index, 1);

    //     return this._territories;
    // }
}
