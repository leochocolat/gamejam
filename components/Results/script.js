import BackgroundButton1 from '@/assets/icons/background-btn-1.svg?inline';
import BackgroundButton2 from '@/assets/icons/background-btn-2.svg?inline';
import gsap from 'gsap';

export default {
    props: {
        war : {
            type: Object,
            default:() =>({})
        }
    },
    components: {
        BackgroundButton1,
        BackgroundButton2
    },
    data: () => ({
        notClick:true,
    }),
    computed: {},
    methods: {
        onMouseEnter(){
            gsap.to(".results-modal-btn-line", {opacity: 1, duration: .8});
        },
        onMouseLeave(){
            gsap.to(".results-modal-btn-line", {opacity: 0, duration: .8});
        },
        closeModal(){
            gsap.to(".results-modal", {opacity: 0, duration: 1.5});

            setTimeout(() => {
                this.notClick=false;
            }, 1600);
        }
    },
    watch: {},
    mounted() {}
}