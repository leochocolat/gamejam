import { Loader } from '../../resource-loader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

class ThreeOBJLoader extends Loader {
    constructor(options) {
        super(options);

        this._loader = new OBJLoader();
    }

    /**
     * Public
     */
    load({ path }) {
        return new Promise((resolve, reject) => {
            this._loader.load(path, resolve, null, reject);
        });
    }
}

export default ThreeOBJLoader;
