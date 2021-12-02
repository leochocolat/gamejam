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

    get resources() {
        return this._chunks.map(chunk => chunk.resource);
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
        return !!this.getNeighbourChunks(territory).length;
    }

    getNeighbourChunks(territory) {
        const chunks = [];

        for (let i = 0; i < this.chunks.length; i++) {
            const currChunk = this.chunks[i];
            for (let j = 0; j < territory.chunks.length; j++) {
                const territoryChunk = territory.chunks[j];
                if (currChunk.isNeighbourOf(territoryChunk) && !chunks.filter(c => c.id === territoryChunk.id).length) {
                    chunks.push(territoryChunk);
                }
            }
        }

        return chunks;
    }
}
