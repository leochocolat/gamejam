import BackgroundButton from '@/assets/icons/background-btn-1.svg?inline';
import Logo from '@/assets/icons/logo-2.svg?inline';
import gsap from 'gsap';

export default {
    props: {},
    components: {
        BackgroundButton,
        Logo
    },
    data: () => ({
        notClick:true,
    }),
    computed: {},
    methods: {
        onMouseEnter(){
            gsap.to(".home-btn", {opacity: .6, duration: 0.3});
        },
        onMouseLeave(){
            gsap.to(".home-btn", {opacity: 1, duration: 0.3});
        },
        closeModal(){
            gsap.to(".home", {opacity: 0, duration: 1.5});

            setTimeout(() => {
                this.notClick=false;
            }, 1600);
        }
    },
    watch: {},
    mounted() {}
}