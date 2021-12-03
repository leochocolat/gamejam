// Vendor
import ResourceLoader from '@/vendor/resource-loader';
import ThreeTextureLoader from '@/vendor/loaders/three-texture-loader';
import ThreeGLTFLoader from '@/vendor/loaders/three-gltf-loader';
import ThreeFBXLoader from '@/vendor/loaders/three-fbx-loader';
import PizzicatoAudioLoader from '@/vendor/loaders/pizzicato-audio-loader';

// Utils
import AudioManager from '@/utils/AudioManager';

// Resources
import globalResources from '@/configs/globalResources';

export default {
    mounted() {
        this.registerLoaders();
        this.setupResourceLoader();
        this.setupEventListeners();
        this.loadResources();
    },

    beforeDestroy() {
        this.removeEventListeners();
    },

    methods: {
        transitionOut() {
            this.$el.style.display = 'none';
        },

        registerLoaders() {
            ResourceLoader.registerLoader(ThreeTextureLoader, 'texture');
            ResourceLoader.registerLoader(ThreeGLTFLoader, 'gltf');
            ResourceLoader.registerLoader(ThreeFBXLoader, 'fbx');
            ResourceLoader.registerLoader(PizzicatoAudioLoader, 'audio');
        },

        setupResourceLoader() {
            this.resourceLoader = new ResourceLoader();

            // Global resources
            this.resourceLoader.add({
                resources: globalResources,
                preload: true,
            });
        },

        loadResources() {
            this.resourceLoader.preload();
        },

        /**
         * Events
         */
        setupEventListeners() {
            this.resourceLoader.addEventListener('complete', this.loadResourcesCompleteHandler);
        },

        removeEventListeners() {
            this.resourceLoader.removeEventListener('complete', this.loadResourcesCompleteHandler);
        },

        loadResourcesCompleteHandler() {
            this.$store.dispatch('preloader/setLoadingCompleted');
            this.$store.dispatch('preloader/setCompleted');
            this.transitionOut();
        },
    },
};
