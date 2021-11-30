// Vendor
import { component } from '../vendor/bidello';
import { BoxGeometry, Scene } from 'three';

// Components
import DebugBox from '../components/DebugBox';
import Cameras from '../modules/Cameras';

export default class MainScene extends component(Scene) {
    init(options = {}) {
        this._renderer = options.renderer;
        this._width = options.width;
        this._height = options.height;
        this._debugger = options.debugger;

        this._debugFolder = this._createDebugFolder();
        this._cameras = this._createCameras();

        const box = new DebugBox();
        this.add(box);
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

    }

    /**
     * Private
     */
    _createCameras() {
        const cameras = new Cameras({
            renderer: this._renderer,
            width: this._width,
            height: this._height,
            debugFolder: this._debugFolder,
        });

        return cameras;
    }

    _createDebugFolder() {
        if (!this._debugger) return;

        const folder = this._debugger.addFolder({ title: 'Scene' });

        return folder;
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
}
