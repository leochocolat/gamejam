// Vendor
import { component } from '../vendor/bidello';
import { BoxGeometry, Mesh, MeshNormalMaterial, Object3D } from 'three';
import { gsap } from 'gsap';

export default class Block extends component(Object3D) {
    init(options) {
        this._size = options.size;

        this._isHovered = false;

        this._mesh = this._createMesh();
    }

    /**
     * Getters and Setters
     */
    get isHovered() {
        return this._isHovered;
    }

    set isHovered(isHovered) {
        if (!this._isHovered && isHovered) this._mouseenterHandler();
        if (this._isHovered && !isHovered) this._mouseleaveHandler();
        this._isHovered = isHovered;
    }

    /**
     * Private
     */
    _createMesh() {
        const geometry = new BoxGeometry(this._size.x, this._size.y, this._size.z);
        const material = new MeshNormalMaterial();
        const mesh = new Mesh(geometry, material);
        this.add(mesh);

        return mesh;
    }

    /**
     * Events
     */
    _mouseenterHandler() {
        gsap.to(this._mesh.position, { duration: 0.3, y: 1 });
    }

    _mouseleaveHandler() {
        gsap.to(this._mesh.position, { duration: 0.3, y: 0 });
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
