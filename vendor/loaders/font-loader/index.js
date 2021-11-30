import FontFaceObserver from 'fontfaceobserver';
import { Loader } from '../../resource-loader';

class FontLoader extends Loader {
    /**
     * Public
     */
    load({ name, options }) {
        return new Promise((resolve, reject) => {
            const observer = new FontFaceObserver(name, {
                weight: options.weight,
            });

            observer
                .load()
                .then(() => {
                    resolve({});
                })
                .catch(() => {
                    reject(new Error(`Something went wrong while loading "${name}"`));
                });
        });
    }
}

export default FontLoader;
