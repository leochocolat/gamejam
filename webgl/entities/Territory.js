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
        let isChunkAdded = false;

        if (this._chunks.length > 0) {
            for (let i = 0; i < this._chunks.length; i++) {
                if (isChunkAdded) continue;
                if (chunk.isNeighbourOf(this._chunks[i])) {
                    this._chunks.push(chunk);
                    isChunkAdded = true;
                }
            }
        } else {
            this._chunks.push(chunk);
            isChunkAdded = true;
        }

        // Return success of operation
        return isChunkAdded;
    }

    mergeChunks(chunks) {
        for (let i = 0; i < chunks.length; i++) {
            this._chunks.push(chunks[i]);
        }
    }

    isNeighbourOf(territory) {
        return true;
    }
}
