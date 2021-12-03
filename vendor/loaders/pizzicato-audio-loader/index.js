// Vendor
import Pizzicato from 'pizzicato';

// Utils
import { Loader } from '../../resource-loader';
import AudioManager from '@/utils/AudioManager';

class PizzicatoAudioLoader extends Loader {
    /**
     * Public
     */
    load({ path, name }) {
        const promise = new Promise((resolve, reject) => {
            const sound = new Pizzicato.Sound(
                {
                    source: 'file',
                    options: { path },
                },
                () => {
                    resolve(sound);
                },
            );
        });

        return promise;
    }
}

export default PizzicatoAudioLoader;
