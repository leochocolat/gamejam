import Territory from './Territory';

const MAX_TERRITORIES = 3;

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

    get enemy() {
        return this._enemy;
    }

    get color() {
        return this._color;
    }

    get territories() {
        return this._territories;
    }

    get resources() {
        return this.territories.map(territory => territory.resources).flat();
    }

    get targetResourceCount() {
        return this.resources.filter(resource => resource.id === this._targetResourceId).length;
    }

    /**
     * Public
     */
    addChunk(chunk) {
        let territory = null;
        let isChunkAdded = false;
        const error = null;

        // Try to add the chunk to an existing territory
        // If no territories, create a new one
        if (this._territories.length > 0) {
            for (let i = 0; i < this._territories.length; i++) {
                if (isChunkAdded) continue;
                territory = this._territories[i];
                isChunkAdded = territory.addChunk(chunk);
            }

            if (!isChunkAdded) {
                territory = new Territory();
                territory.addChunk(chunk);
                this._territories.push(territory);
                isChunkAdded = true;
            }
        } else {
            territory = new Territory();
            territory.addChunk(chunk);
            this._territories.push(territory);
            isChunkAdded = true;
        }

        // Check mergeable territories
        for (let i = 0; i < this._territories.length; i++) {
            if (territory === this._territories[i]) continue;

            // If territories are neighbours, merge them
            // Otherwise check if the max length is reached and then remove it
            if (territory.isNeighbourOf(this._territories[i])) {
                this._mergeTerritories(territory, this._territories[i]);
            } else if (this._territories.length > MAX_TERRITORIES) {
                isChunkAdded = false;
                error.id = 1;
                error.message = 'This settler already has 3 territories';
                console.error('This settler already has 3 territories');
                const index = this._territories.indexOf(territory);
                this._territories.splice(index, 1);
            }
        }

        // Assign settler to chunk
        if (isChunkAdded) chunk.settler = this;

        return { success: isChunkAdded, error };
    }

    isInWarWith(settler) {
        if (settler.id === this.id || settler.id !== this.enemy)
            return false;

        if (this.targetResourceCount < this._targetResourceAmount)
            return !!this.getWarChunks(settler).length;
        else
            return false;
    }

    getWarChunks(settler) {
        const chunks = [];

        for (let i = 0; i < this.territories.length; i++) {
            const curr = this.territories[i];
            for (let j = 0; j < settler.territories.length; j++) {
                const other = settler.territories[j];
                // CHECK ONLY IF TERRITORY NEIGHBOUR
                // if (curr.isNeighbourOf(other)) {
                // CHECK IF TERRITORY NEIGHBOUR && HAS TARGET RESOURCE
                if (curr.isNeighbourOf(other) && !!other.resources.filter(r => r.id === this._targetResourceId).length) {
                    chunks.push(curr.getNeighbourChunks(other));
                }
            }
        }

        return chunks;
    }

    /**
     * Private
     */
    _mergeTerritories(territory1, territory2) {
        const indexOf2 = this._territories.indexOf(territory2);
        territory1.mergeChunks(territory2.chunks);
        this._territories.splice(indexOf2, 1);
    }
}
