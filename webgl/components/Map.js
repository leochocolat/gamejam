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
import ResourceLoader from '@/vendor/resource-loader';

export default class Map extends component(Object3D) {
    init(options) {
        // Props
        this._scene = options.scene;
        this._renderer = options.renderer;
        this._width = options.width;
        this._height = options.height;
        this._debugFolder = options.debugFolder;

        // Setup
        this._centeredMousePosition = { x: null, y: null };
        this._activeSettler = '';

        // Entities
        this._mapManager = this._createMapManager();
        this._model = this._createModel();
        this._chunks = this._createChunkFromModel();
        // this._chunks = this._createChunk();

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

    _createModel() {
        const model = ResourceLoader.get('gamejam_test');

        this.add(model.scene);

        return model.scene;
    }

    _createChunkFromModel() {
        const chunks = [];
        this._chunkMeshes = [];

        for (let i = 0; i < this._model.children.length; i++) {
            const line = this._model.children[i];

            for (let j = 0; j < line.children.length; j++) {
                const row = line.children[j];
                const chunk = new Chunk({
                    row: i,
                    column: j,
                    resource: this._mapManager.resources[Math.round(Math.random() * (this._mapManager.resources.length - 1))],
                    population: this._mapManager.populations[Math.round(Math.random() * (this._mapManager.populations.length - 1))],
                    mesh: new ChunkMesh({ mesh: row }),
                });
                chunks.push(chunk);
                this._chunkMeshes.push(row);
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
        const intersects = this._raycaster.intersectObjects(this.children);

        for (let i = 0; i < this._chunks.length; i++) {
            const mesh = this._chunks[i].mesh;
            if (intersects.length > 0 && mesh === intersects[0].object.parent) {
                mesh.isHovered = true;
            } else {
                mesh.isHovered = false;
            }
        }
    }

    onClick({ centeredMousePosition }) {
        this._centeredMousePosition = centeredMousePosition;

        this._raycaster.setFromCamera(this._centeredMousePosition, this._scene.camera);
        const intersects = this._raycaster.intersectObjects(this.children);

        const getSettlerById = (id) => {
            for (let i = 0; i < this._mapManager.settlers.length; i++) {
                const element = this._mapManager.settlers[i];
                if (element.id === id) return element;
            }
        };

        for (let i = 0; i < this._chunks.length; i++) {
            const mesh = this._chunks[i].mesh.mesh;
            // const mesh = this._chunks[i].mesh;
            if (intersects.length > 0 && mesh === intersects[0].object.parent) {
                this._mapManager.setChunkSettler(this._chunks[i], getSettlerById(this._activeSettler));
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
