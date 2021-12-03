import IconStain from '@/components/IconStain';
import BorderConflict from '@/assets/icons/borderConflict.svg?inline';
import gsap from 'gsap';

export default {
    props: {
        settler : {
            type: Object,
            default:() =>({})
        },
    },
    components: {
        IconStain,
        BorderConflict
    },
    data: () => ({
     
    }),
    computed: {},
    methods: {},
    watch: {},
    mounted() {}
}