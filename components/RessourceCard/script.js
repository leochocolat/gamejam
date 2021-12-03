import LineRessource from '@/assets/icons/line-ressource.svg?inline';
import gsap from 'gsap';

export default {
    props: {
        picture: {
            type: String,
            default: ""
        },
        ressource: {
            type: Object,
            default:() =>({})
        },
    },
    components: {
        LineRessource
    },
    data: () => ({
     
    }),
    computed: {},
    methods: {},
    watch: {},
    mounted() {}
}