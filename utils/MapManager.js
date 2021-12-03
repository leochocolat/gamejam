// Data
// import data from '@/configs/data';
import data from '@/configs/data-daria';

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

        this._activeSettler = null;

        this._chunks = [];

        // PLAY
        // this._mapManager.getSettlersWars()
        // this._mapManager.getSettlersIndependenceWar()
        // this._mapManager.getPopulationsWars()
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

    get activeSettler() {
        return this._activeSettler;
    }

    set activeSettler(activeSettler) {
        this._activeSettler = activeSettler;
    }

    /**
     * Public
     */
    getResourceByColor(color) {
        for (let i = 0; i < this._resources.length; i++) {
            if (this._resources[i].color === color) {
                return this._resources[i];
            };
        }
    }

    getResourceById(index) {
        if (index === undefined) return;
        
        for (let i = 0; i < this._resources.length; i++) {
            if (this._resources[i].index === index) {
                return this._resources[i];
            };
        }
    }

    getPopulationWithData(data) {
        for (let i = 0; i < this._populations.length; i++) {
            const population = this._populations[i];
            if (
                population.properties.religion.id === data.religion &&
                population.properties.language.id === data.language &&
                population.properties.culture.id === data.culture
            ) {
                return population;
            }
        }
    }

    // getCultureById(id) {
    //     for (let i = 0; i < this._resources.length; i++) {
    //         if (this._resources[i].id === id) return this._resources[i];
    //     }
    // }

    // getPopulationById(id) {
    // for (let i = 0; i < this._resources.length; i++) {
    //     if (this._resources[i].id === id) return this._resources[i];
    // }
    // }

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
        let wars = [];

        for (let i = 0; i < this.settlers.length; i++) {
            const curr = this.settlers[i];
            for (let j = 0; j < this.settlers.length; j++) {
                const other = this.settlers[j];
                if (curr.isInWarWith(other)) {
                    const chunks = curr.getWarChunks(other);
                    wars = [...chunks.flat()];
                }
            }
        }

        return wars;
    }

    getSettlersIndependenceWar() {
        let wars = [];

        for (let i = 0; i < this.settlers.length; i++) {
            const settler = this.settlers[i];
            for (let j = 0; j < settler.territories.length; j++) {
                const territory = settler.territories[j];
                const majorProps = territory.majorProperties;
                const independentists = [];

                for (let k = 0; k < territory.chunks.length; k++) {
                    const chunk = territory.chunks[k];
                    if (
                        chunk.population &&
                        chunk.population.religion.name === majorProps.religion &&
                        chunk.population.language.name === majorProps.language &&
                        chunk.population.culture.name === majorProps.culture
                    )
                        independentists.push(territory.chunks[k]);
                }

                if (independentists.length > Math.floor(territory.chunks.length * 0.5)) {
                    wars = [...independentists.flat()];
                }
            }
        }

        return wars;
    }

    getPopulationsWars() {
        const wars = [];

        const territories = this.settlers.map(s => s.territories).flat();

        for (let i = 0; i < territories.length; i++) {
            const curr = territories[i];
            for (let j = 0; j < territories.length; j++) {
                const other = territories[j];
                if (curr.isNeighbourOf(other)) {
                    const currProperties = curr.majorProperties;
                    const otherProperties = other.majorProperties;
                    const commonProperties = Object.values(currProperties).filter(p => Object.values(otherProperties).includes(p));
                    if (commonProperties.length <= 1) {
                        const currChunks = other.getNeighbourChunks(curr);
                        const otherChunks = curr.getNeighbourChunks(other);
                        for (let x = 0; x < currChunks.length; x++) {
                            const currChunk = currChunks[x];
                            if (currChunk.population) {
                                const currPopulationsProps = currChunk.population.propertiesName;
                                if (Object.values(currProperties).filter(p => currPopulationsProps.includes(p)).length >= 2) {
                                    for (let y = 0; y < otherChunks.length; y++) {
                                        const otherChunk = otherChunks[y];
                                        if (currChunk.compareChunk && otherChunk.population) {
                                            const { populationWar } = currChunk.compareChunk(otherChunk);
                                            if (populationWar) {
                                                wars.push(otherChunk);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
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
            const resource = new Resource({ id: resourceData.id, index: resourceData.index });
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
