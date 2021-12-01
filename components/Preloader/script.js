// Vendor
import ResourceLoader from '@/vendor/resource-loader';
import ThreeTextureLoader from '@/vendor/loaders/three-texture-loader';
import ThreeGLTFLoader from '@/vendor/loaders/three-gltf-draco-loader';

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
