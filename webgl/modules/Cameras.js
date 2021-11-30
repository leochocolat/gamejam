// Vendor
import { PerspectiveCamera } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

class Cameras {
    constructor(options) {
        this._renderer = options.renderer;
        this._width = options.width;
        this._height = options.height;
        this._debugFolder = options.debugFolder;

        this._mainCamera = this._createMainCamera();
        this._debugCamera = this._createDebugCamera();

        this._isDebug = !!this._debugFolder;

        this._active = this._isDebug ? this._debugCamera : this._mainCamera;
        this._orbitControls = this._createOrbitControls();

        this._setupDebug();
    }

    /**
     * Getters & Setters
     */
    get active() {
        return this._active;
    }

    get main() {
        return this._mainCamera;
    }

    get debug() {
        return this._debugCamera;
    }

    get isDebug() {
        return this._isDebug;
    }

    set isDebug(isDebug) {
        this._isDebug = isDebug;
    }

    /**
     * Private
     */
    _createMainCamera() {
        const camera = new PerspectiveCamera(75, this._width / this._height, 0.01, 10000);
        camera.position.z = 5;

        return camera;
    }

    _createDebugCamera() {
        const camera = new PerspectiveCamera(75, this._width / this._height, 0.01, 10000);
        camera.position.z = 5;

        return camera;
    }

    _createOrbitControls() {
        const orbitControls = new OrbitControls(this._debugCamera, this._renderer.domElement);
        orbitControls.enabled = this._isDebug && this._isActive;

        return orbitControls;
    }

    _setActiveCamera() {
        this._active = this._isDebug ? this._debugCamera : this._mainCamera;
        this._orbitControls.enabled = this._isDebug;
    }

    /**
     * Resize
     */
    resize({ width, height }) {
        this._width = width;
        this._height = height;

        this._mainCamera.aspect = this._width / this._height;
        this._mainCamera.updateProjectionMatrix();

        this._debugCamera.aspect = this._width / this._height;
        this._debugCamera.updateProjectionMatrix();
    }

    /**
     * Debug
     */
    _setupDebug() {
        if (!this._debugFolder) return;

        const debugFolder = this._debugFolder.addFolder({ title: 'Cameras', expanded: true });
        debugFolder.addInput(this, 'isDebug', { label: 'isDebug' }).on('change', () => {
            this._setActiveCamera();
        });

        return debugFolder;
    }
}

export default Cameras;
