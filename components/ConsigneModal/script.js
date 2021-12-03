import BackgroundButton from '@/assets/icons/background-btn-2.svg?inline';
import BorderConflict from '@/assets/icons/borderConflict.svg?inline';
import SettlersMiniCard from '@/components/SettlersMiniCard';
import gsap from 'gsap';

export default {
    props: {
        settlers : {
            type: Object,
            default:() =>({})
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
            gsap.to(".consigne-btn-line", {opacity: 1, duration: .8});
        },
        onMouseLeave(){
            gsap.to(".consigne-btn-line", {opacity: 0, duration: .8});
        },
        closeModal(){
            gsap.to(".consigne", {opacity: 0, duration: 1.5});

            setTimeout(() => {
                this.notClick=false;
            }, 1600);
        }
    },
    watch: {},
    mounted() {}
}