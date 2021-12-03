// Vendor
import { MeshBasicMaterial, Object3D, Raycaster, Vector3 } from 'three';
import { component } from '@/webgl/vendor/bidello';

// data
import data from '@/configs/data';

// Components
import ChunkMesh from '@/webgl/components/ChunkMesh';

// Entities
import Chunk from '@/webgl/entities/Chunk';
import MapManager from '@/utils/MapManager';

export default class Map extends component(Object3D) {
    init(options) {
        // Props
        this._nuxtRoot = options.nuxtRoot;
        this._scene = options.scene;
        this._renderer = options.renderer;
        this._width = options.width;
        this._height = options.height;
        this._debugFolder = options.debugFolder;
        this._model = options.model;

        // Setup
        this._centeredMousePosition = { x: null, y: null };

        // Entities
        this._mapManager = this._nuxtRoot.$mapManager;
        this._filteredChunks = this._filterChunks();
        this._chunks = this._createChunkFromModel();
        // this._chunks = this._createChunk();

        this._activeSettler = this._mapManager.settlers[0].id;

        this._raycaster = this._createRaycaster();

        this._debugFolder = this._createDebugFolder();
    }

    destroy() {
        super.destroy();
    }

    /**
     * Getters & Setters
     */
    get activeSettler() {
        return this._activeSettler;
    }

    set activeSettler(activeSettler) {
        this._activeSettler = activeSettler;
    }

    /**
     * Private
     */
    _createMapManager() {
        const mapManager = new MapManager();

        return mapManager;
    }

    _filterChunks() {
        const rows = [...this._model.children];

        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];

            const filteredCols = row.children.sort((colA, colB) => {
                const idA = parseInt(colA.name.split('_')[2]);
                const idB = parseInt(colB.name.split('_')[2]);

                return idA - idB;
                // return 1;
            });

            row.filteredCols = filteredCols;
        }

        return rows;
    }

    _createChunkFromModel() {
        const chunks = [];
        this._chunkMeshes = [];

        const modelPosition = new Vector3(this._model.position.x, this._model.position.y, this._model.position.z);
        const scale = this._model.parent.scale.x;

        const container = new Object3D();
        container.scale.set(scale, scale, scale);
        this._scene.add(container);

        for (let i = 0; i < this._model.children.length; i++) {
            const line = this._model.children[i];
            const linePosition = new Vector3(line.position.x, line.position.y, line.position.z);
            linePosition.add(modelPosition);

            for (let j = 0; j < line.children.length; j++) {
                const row = line.children[j];
                const rowPosition = new Vector3(row.position.x, row.position.y, row.position.z);
                rowPosition.add(linePosition);
                const language = row.userData.language !== undefined ? row.userData.language : row.userData.langue;
                const culture = row.userData.culture !== undefined ? row.userData.culture : row.userData.coutume;
                const populationData = { religion: row.userData.religion, language, culture };
                const chunk = new Chunk({
                    row: i,
                    column: j,
                    resource: this._mapManager.resources[Math.round(Math.random() * (this._mapManager.resources.length - 1))],
                    population: this._mapManager.getPopulationWithData(populationData),
                    isWater: row.userData.state === 0,
                    mesh: new ChunkMesh({ mesh: row, container, position: rowPosition, scale }),
                });
                chunks.push(chunk);
                const tailMesh = row.isMesh ? row : row.children[0];
                this._chunkMeshes.push(row.isMesh ? row : row.children[0]);
            }
        }

        return chunks;
    }

    _createChunk() {
        const chunks = [];

        const rows = 15;
        const cols = 15;

        const size = new Vector3(1, 100, 1);
        const padding = 0.15;

        const container = new Object3D();
        container.position.x = -((cols - 1) * size.x + padding * (cols - 1)) / 2;
        container.position.y = -size.y / 2;
        container.position.z = -1;
        this.add(container);

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                const chunk = new Chunk({
                    row: i,
                    column: j,
                    resource: this._mapManager.resources[Math.round(Math.random() * (this._mapManager.resources.length - 1))],
                    population: this._mapManager.populations[Math.round(Math.random() * (this._mapManager.populations.length - 1))],
                    mesh: new ChunkMesh({ size }),
                });
                chunk.mesh.position.x = j * size.x + padding * j + ((i % 2) * (size.x / 2));
                chunk.mesh.position.z = (i * size.z + padding * i) * -1;
                chunks.push(chunk);
                container.add(chunk.mesh);
            }
        }

        return chunks;
    }

    _createRaycaster() {
        const raycaster = new Raycaster();

        return raycaster;
    }

    /**
     * Debug
     */
    _createDebugFolder() {
        if (!this._debugFolder) return;

        const getSettlersOptions = () => {
            const options = {};
            for (let i = 0; i < this._mapManager.settlers.length; i++) {
                const settler = this._mapManager.settlers[i];
                options[settler.id] = settler.id;
            }

            return options;
        };

        const folder = this._debugFolder.addFolder({ title: 'Map' });
        folder.addInput(this, 'activeSettler', {
            options: {
                ...getSettlersOptions(),
            },
        });

        return folder;
    }

    /**
     * Mousemove
     */
    onMousemove({ centeredMousePosition }) {
        this._centeredMousePosition = centeredMousePosition;

        this._raycaster.setFromCamera(this._centeredMousePosition, this._scene.camera);
        const intersects = this._raycaster.intersectObjects(this._chunkMeshes);

        for (let i = 0; i < this._chunkMeshes.length; i++) {
            const chunkMesh = this._chunkMeshes[i];
            const mesh = this._chunks[i].mesh;
            const isWater = intersects[0] && intersects[0].object.userData.state === 0;
            if (intersects.length > 0 && chunkMesh === intersects[0].object && !isWater) {
                mesh.isHovered = true;
            } else {
                mesh.isHovered = false;
            }
        }
    }

    onClick({ centeredMousePosition }) {
        this._centeredMousePosition = centeredMousePosition;

        this._raycaster.setFromCamera(this._centeredMousePosition, this._scene.camera);
        const intersects = this._raycaster.intersectObjects(this._chunkMeshes);

        const getSettlerById = (id) => {
            for (let i = 0; i < this._mapManager.settlers.length; i++) {
                const element = this._mapManager.settlers[i];
                if (element.id === id) return element;
            }
        };

        if (!intersects[0]) return;

        if (intersects[0] && intersects[0].object.userData.state === 0) return;

        for (let i = 0; i < this._chunkMeshes.length; i++) {
            const chunkMesh = this._chunkMeshes[i];
            if (intersects.length > 0 && chunkMesh === intersects[0].object && this._mapManager.activeSettler) {
                this._mapManager.setChunkSettler(this._chunks[i], getSettlerById(this._mapManager.activeSettler.id));
            }
        }
    }

    /**
     * Update cycle
     */
    onUpdate({ time, delta }) {

    }

    /**
     * Resize
     */
    onResize({ width, height }) {

    }
}
