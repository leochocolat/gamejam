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
                ++cpt; // décrémente le compteur
                document.getElementById("timer").innerHTML = "" + cpt + "" ;
            }
            else
            {
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