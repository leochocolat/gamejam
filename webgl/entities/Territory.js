export default class Territory {
    constructor() {
        this._chunks = [];
    }

    /**
     * Getters & Setters
     */
    get chunks() {
        return this._chunks;
    }

    /**
     * Public
     */
    addChunk(chunk) {
        this._chunks.push(chunk);

        return this._chunks;
    }

    removeChunk(chunk) {
        const index = this._chunks.indexOf(chunk);
        this._chunks.splice(index, 1);

        return this._chunks;
    }
}
