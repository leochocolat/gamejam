import BackgroundButton from '@/assets/icons/background-btn-1.svg?inline';
import BilanUnderline from '@/assets/icons/bilanUnderline.svg?inline';

export default {
    props: ['war'],

    mounted() {
        console.log(this.war);
    },

    methods: {
        clickHandler() {
            window.location.reload();
        }
    },

    components: {
        BackgroundButton,
        BilanUnderline
    }
}