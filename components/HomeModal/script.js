import BackgroundButton from '@/assets/icons/background-btn-1.svg?inline';
import Logo from '@/assets/icons/logo-v3.svg?inline';
import gsap from 'gsap';
import AudioManager from '@/utils/AudioManager';
import ResourceLoader from '@/vendor/resource-loader';

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
            // gsap.to(".home-btn", {opacity: .6, duration: 0.2});
        },
        onMouseLeave(){
            // gsap.to(".home-btn", {opacity: 1, duration: 0.2});
        },
        closeModal(){
            gsap.to(".home", {opacity: 0, duration: 0.3});

            AudioManager.add('background-sound', ResourceLoader.get('background-sound'));
            AudioManager.play('background-sound', { loop: true });

            setTimeout(() => {
                this.notClick=false;
            }, 1600);
        }
    },
    watch: {},
    mounted() {
        const timeline = new gsap.timeline();
        timeline.fromTo(this.$refs.logo, { alpha: 0 }, { duration: 0.5, alpha: 1, ease: 'sine.inOut' }, 0);
        timeline.fromTo(this.$refs.logo, { alpha: 0 }, { duration: 0.5, alpha: 1, ease: 'sine.inOut' }, 0.2);
    }
}