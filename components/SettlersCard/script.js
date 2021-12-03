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
    methods: {
        onMouseEnter(name,active){
            if(!active){
                gsap.to(".card-"+name, {width: 220, duration: 0.3});
            }
        },

        onMouseLeave(name,active){
            if(!active){
                gsap.to(".card-"+name, {width: 200, duration: 0.3});
            }
        },

        onClick(settler){
            gsap.to(".settlerCard", {width: 200, duration: 0.3});
            
            if(!settler.active){
                gsap.to(".card-"+settler.name, {width: 220, duration: 0.3});
            }

            this.$emit('on-click', settler)
        }
    },
    watch: {},
    mounted() {
        console.log(this.$mapManager);
        console.log(document.getElementsByClassName("settlerCard"))

    }
}