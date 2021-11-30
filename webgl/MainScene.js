// Vendor
import { component } from './vendor/bidello';
import { PerspectiveCamera, Scene } from 'three';

// Components
import DebugBox from './components/DebugBox';

export default class MainScene extends component(Scene) {
    init() {
        this._camera = this._createCamera();

        const box = new DebugBox();
        this.add(box);
    }

    /**
     * Getters
     */
    get camera() {
        return this._camera;
    }

    /**
     * Private
     */
    _createCamera() {
        const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 5;

        return camera;
    }
}
