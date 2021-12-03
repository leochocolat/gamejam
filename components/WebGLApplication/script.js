// Vendor
import { gsap } from 'gsap';
import { mapGetters } from 'vuex';

// WebGL
import WebGLApplication from '@/webgl';

export default {
    computed: {
        ...mapGetters({
            // Context
            isDebug: 'context/isDebug',
            isDevelopment: 'context/isDevelopment',
            // Preloader
            isLoadingCompleted: 'preloader/isLoadingCompleted',
        }),
    },

    created() {
        this.$root.startWebGL = this.start;
    },

    watch: {
        isLoadingCompleted(isCompleted) {
            if (isCompleted) this.$root.webglApp.setup();
        },
    },

    mounted() {
        this.setupWebGL();
    },

    beforeDestroy() {
        this.$root.webglApp?.destroy();
        this.$root.webglApp = null;
    },

    methods: {
        setupWebGL() {
            this.$root.webglApp = new WebGLApplication({
                canvas: this.$el,
                nuxtRoot: this.$root,
                isDebug: this.isDebug,
                isDevelopment: this.$root,
                sceneName: this.$route.query.scene,
            });

            if (this.isLoadingCompleted) this.$root.webglApp.setup();
        },

        start() {
            gsap.to(this.$el, { duration: 1, alpha: 1, ease: 'sine.inOut' });
            this.$root.webglApp.transitionIn();
        }
    },
};
