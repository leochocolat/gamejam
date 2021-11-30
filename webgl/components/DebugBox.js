// Vendor
import { component } from '../vendor/bidello';
import { MeshBasicMaterial, PlaneGeometry, Mesh, Object3D } from 'three';

export default class DebugBox extends component(Object3D) {
    init() {
        const geometry = new PlaneGeometry(1, 1, 1);
        const material = new MeshBasicMaterial({ color: 'red' });
        const mesh = new Mesh(geometry, material);
        this.add(mesh);
    }
}
