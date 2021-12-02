// Vendor
import { component } from '../vendor/bidello';
import ResourceLoader from '@/vendor/resource-loader';
import { Object3D } from 'three';

export default class Map extends component(Object3D) {
    init(options) {
        this._map = this._createMap()
    }

    /**
     * Private
     */
    _createMap() {
        const model = ResourceLoader.get('map-test');

        //mettre .scene si c'est en gltf
        this.add(model.scene)

        return model;
    }

}
