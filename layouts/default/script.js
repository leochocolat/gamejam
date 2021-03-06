// Vendor
import { mapGetters } from 'vuex';

// Components
import WebGLApplication from '@/components/WebGLApplication';
import Preloader from '@/components/Preloader';
import Logo from '@/assets/icons/logo-v3.svg?inline';

export default {
    watch: {
        $route(to, from) {
            // Store routing history for page transitions
            this.$store.dispatch('router/setCurrent', to);
            this.$store.dispatch('router/setPrevious', from);
        },
    },

    mounted() {
        this.$store.dispatch('router/setCurrent', this.$route);
    },

    components: {
        WebGLApplication,
        Preloader,
        Logo,
    },
};

/**
 * Clears console on reload
 */
if (module.hot) {
    module.hot.accept();
    module.hot.addStatusHandler((status) => {
        if (status === 'prepare') console.clear();
    });
}
