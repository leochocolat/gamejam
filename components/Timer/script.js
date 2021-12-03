import gsap from 'gsap';

export default {
    props: {},
    components: {},
    data: () => ({
        notFinish:true,
    }),
    computed: {},
    methods: {

        init(){
            var cpt = 0;
 
            setInterval(() => {
            if(cpt<100){
                ++cpt; 
                document.getElementById("timer").innerHTML = "" + cpt + "" ;
            }
            else
            {
                this.$emit('on-ended', true)
                setTimeout(() => {
                    this.notFinish=false;
                }, 600);
            }}, 100);
        },

    },
    watch: {},
    mounted() {
        this.init()
    }
}