// Data
import data from '@/configs/data';

// Entities
import Settler from '@/webgl/entities/Settler';
import Resource from '@/webgl/entities/Resource';
import Population from '@/webgl/entities/Population';

const MAX_TERRITORIES = 3;

export default class MapManager {
    constructor() {
        this._settlers = this._createSettlers();
        this._resources = this._createResources();
        this._populations = this._createPopulations();

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

        // if (settler.territories.length >= MAX_TERRITORIES) {
        //     console.error(`This settler already has a ${MAX_TERRITORIES} territories`);
        //     return;
        // }

        settler.addChunk(chunk);

        // chunk.settler = settler;
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
