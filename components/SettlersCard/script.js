import IconStain from '@/components/IconStain';
import BorderConflict from '@/assets/icons/borderConflict.svg?inline';
import { mapActions, mapGetters } from 'vuex';

export default {
    props: {
        settler: {
            type: Object,
            default: () => ({}),
        },
    },
    components: {
        IconStain,
        BorderConflict,
    },
    computed: {
        activeSettler() {
            return this.$mapManager.activeSettler;
        },
    },
    methods: {
        onClick(settler) {
            this.$mapManager.activeSettler = settler;
        },
    },
    watch: {},
    mounted() {},
};
