import IconStain from '@/components/IconStain';
import BorderConflict from '@/assets/icons/borderConflict.svg?inline';
import { mapActions, mapGetters } from 'vuex';
import { gsap } from 'gsap';

export default {
    props: {
        settler: {
            type: Object,
            default: () => ({}),
        },
        activeSettler: {
            type: Object,
            default: () => ({}),
        },
        index: {
            type: Number,
            default: () => ({}),
        },
    },
    components: {
        IconStain,
        BorderConflict,
    },
    methods: {
        onClick(settler) {
            this.$mapManager.activeSettler = settler;
        },

        show() {
            console.log('show');
            const timeline = new gsap.timeline();
            timeline.to(this.$el, { duration: 1, x: '0%', ease: 'power4.out' });
            return timeline;
        }
    },
    watch: {},
    mounted() {
        
    },
};
