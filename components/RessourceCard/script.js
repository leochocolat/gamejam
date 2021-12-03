import IconLanguage from '@/assets/icons/language.svg?inline';
import IconReligion from '@/assets/icons/religion.svg?inline';
import IconCulture from '@/assets/icons/culture.svg?inline';
import LinePopulation from '@/assets/icons/line-population.svg?inline';
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
        IconLanguage,
        IconReligion,
        IconCulture,
        LinePopulation,
        LineRessource
    },
    data: () => ({
     
    }),
    computed: {},
    methods: {},
    watch: {},
    mounted() {}
}