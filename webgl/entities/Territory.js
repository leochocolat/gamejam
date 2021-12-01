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
        if (this._chunks.length > 0) {
            for (let i = 0; i < this._chunks.length; i++) {
                if (chunk.isNeighbourOf(this._chunks[i])) this._chunks.push();
            }
        } else {
            this._chunks.push(chunk);
        }

        return this._chunks;
    }
}
