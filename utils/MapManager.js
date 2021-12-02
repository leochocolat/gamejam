// Data
import data from '@/configs/data';

// Utils
import EventDispatcher from './EventDispatcher';

// Entities
import Settler from '@/webgl/entities/Settler';
import Resource from '@/webgl/entities/Resource';
import Population from '@/webgl/entities/Population';

export default class MapManager extends EventDispatcher {
    constructor() {
        super();

        this._settlers = this._createSettlers();
        this._resources = this._createResources();
        this._populations = this._createPopulations();

        this._activeSettler = this._settlers[0];

        this._chunks = [];
    }

    /**
     * Getters & Setters
     */
    get settlers() {
        return this._settlers;
    }

    get resources() {
        return this._resources;
    }

    get populations() {
        return this._populations;
    }

    get chunks() {
        return this._chunks;
    }

    set chunks(chunks) {
        this._chunks = chunks;
    }

    /**
     * Public
     */
    setChunkSettler(chunk, settler) {
        if (chunk.settler) {
            console.error('This chunk already has a settler');

            return;
        }

        const isChunkAdded = settler.addChunk(chunk);

        if (isChunkAdded) {
            this.dispatchEvent('change', {
                settlers: this._settlers,
                resources: this._resources,
                populations: this._populations,
                chunks: this._chunks,
            });
        }
    }

    getSettlersWars() {
        const wars = {};
        for (let i = 0; i < this.settlers.length; i++) {
            const curr = this.settlers[i];
            wars[curr.id] = {};
            for (let j = 0; j < this.settlers.length; j++) {
                const other = this.settlers[j];
                if (curr.isInWarWith(other)) {
                    wars[curr.id][other.id] = curr.getWarChunks(other);
                }
            }
        }

        return wars;
    }

    /**
     * Private
     */
    _createSettlers() {
        const settlers = [];
        for (let i = 0; i < data.settlers.length; i++) {
            const settlerData = data.settlers[i];
            const settler = new Settler({
                ...settlerData,
            });
            settlers.push(settler);
        }

        return settlers;
    }

    _createResources() {
        const resources = [];

        for (let i = 0; i < data.resources.length; i++) {
            const resourceData = data.resources[i];
            const resource = new Resource({ id: resourceData.id });
            resources.push(resource);
        }

        return resources;
    }

    _createPopulations() {
        const populations = [];

        for (let i = 0; i < data.populations.length; i++) {
            const populationData = data.populations[i];
            const population = new Population({
                id: populationData.id,
                properties: populationData.properties,
            });
            populations.push(population);
        }

        return populations;
    }
}
