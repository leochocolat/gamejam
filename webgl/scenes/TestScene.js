// Vendor
import { component } from '../vendor/bidello';
import { BoxBufferGeometry, BoxGeometry, Color, InstancedMesh, Matrix4, Mesh, MeshBasicMaterial, MeshNormalMaterial, Object3D, Raycaster, Scene, Vector2, Vector3 } from 'three';

// Modules
import Cameras from '../modules/Cameras';

// Components
import Map from '../components/Map';

export default class TestScene extends component(Scene) {
    init(options = {}) {
        // Props
        this._renderer = options.renderer;
        this._width = options.width;
        this._height = options.height;
        this._debugger = options.debugger;

        // Setup
        this._debugFolder = this._createDebugFolder();
        this._cameras = this._createCameras();
    }

    destroy() {
        super.destroy();
        this._map.destroy();
    }

    /**
     * Getters
     */
    get camera() {
        return this._cameras.active;
    }

    /**
     * Public
     */

    /**
     * This is called when all resources are available
     */
    setup() {
        this._map = this._createMap();
    }

    _createCameras() {
        const cameras = new Cameras({
            renderer: this._renderer,
            width: this._width,
            height: this._height,
            debugFolder: this._debugFolder,
        });

        // cameras.active.rotation.x = Math.PI * 0.5;
        cameras.active.position.y = 3;
        cameras.active.lookAt(0, 0, 0);
        cameras.active.position.y = 6;

        return cameras;
    }

    _createMap() {
        const map = new Map({
            renderer: this._renderer,
            scene: this,
            width: this._width,
            height: this._height,
            debugFolder: this._debugFolder,
        });

        this.add(map);

        return map;
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
        this._width = width;
        this._height = height;

        this._cameras.resize({ width, height });
    }

    /**
     * Debug
     */
    _createDebugFolder() {
        if (!this._debugger) return;

        const folder = this._debugger.addFolder({ title: 'Scene' });

        return folder;
    }
}
