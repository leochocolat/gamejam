import { Loader } from '../../resource-loader';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

class ThreeFBXLoader extends Loader {
    constructor(options) {
        super(options);

        this._loader = new FBXLoader();
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

export default ThreeFBXLoader;
