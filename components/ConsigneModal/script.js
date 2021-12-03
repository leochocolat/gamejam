import BackgroundButton from '@/assets/icons/background-btn-2.svg?inline';
import BorderConflict from '@/assets/icons/borderConflict.svg?inline';
import SettlersMiniCard from '@/components/SettlersMiniCard';
import gsap from 'gsap';

export default {
    props: {
        settlers : {
            type: Array,
            default:() =>([])
        },
    },
    components: {
        BackgroundButton,
        BorderConflict,
        SettlersMiniCard
    },
    data: () => ({
        notClick:true,
    }),
    computed: {},
    methods: {
        onMouseEnter(){
            gsap.to(".consigne-btn-line", {opacity: 1, duration: 0.2});
        },
        onMouseLeave(){
            gsap.to(".consigne-btn-line", {opacity: 0, duration: 0.2});
        },
        closeModal(){
            gsap.to(".consigne", {opacity: 0, duration: 0.3});

            this.$root.startWebGL();
            this.$root.startHome();

            setTimeout(() => {
                this.notClick=false;
            }, 1600);
        }
    },
    watch: {},
    mounted() {}
}