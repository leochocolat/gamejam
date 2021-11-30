// Vendor
import { mapGetters } from 'vuex';

// WebGL
import WebGLApplication from '@/webgl';

export default {
    computed: {
        ...mapGetters({
            isDebug: 'context/isDebug',
            isDevelopment: 'context/isDevelopment',
        }),
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
                isDebug: this.$root,
                isDevelopment: this.$root,
            });
        },
    },
};
