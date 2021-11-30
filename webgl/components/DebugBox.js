// Vendor
import { component } from '../vendor/bidello';
import { MeshBasicMaterial, PlaneGeometry, Mesh, Object3D, BoxGeometry, MeshNormalMaterial } from 'three';

export default class DebugBox extends component(Object3D) {
    init(options = {}) {
        this._box = this._createBox();
    }

    /**
     * Private
     */
    _createBox() {
        const geometry = new BoxGeometry(1, 1, 1);
        const material = new MeshNormalMaterial();
        const mesh = new Mesh(geometry, material);
        this.add(mesh);

        return mesh;
    }

    /**
     * Update cycle
     */
    onUpdate({ time }) {
        this.rotation.x = time;
        this.rotation.y = time;
    }

    onResize({ width, height }) {

    }
}
