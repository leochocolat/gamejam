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

    methods: {
        setupWebGL() {
            this.$root.webGLApplication = new WebGLApplication({
                canvas: this.$el,
                nuxtRoot: this.$root,
                isDebug: this.$root,
                isDevelopment: this.$root,
            });
        },
    },
};
