import gsap from 'gsap';

export default {
    props: {},
    components: {},
    data: () => ({
        notFinish: true,
    }),
    computed: {},
    methods: {

        init() {
            const interval = 100;
            let cpt = 0;
            const wars = {
                war: this.$mapManager.getSettlersWars(),
                bombe: this.$mapManager.getPopulationsWars(),
                revolution: this.$mapManager.getSettlersIndependenceWar(),
            };

            Object.keys(wars).forEach((w) => {
                let index = -1;
                const loopInterval = setInterval(() => {
                    index++;
                    if (wars[w][index]) {
                        wars[w][index].mesh.playPin(w);
                    }

                    if (index === wars[w].length) {
                        clearInterval(loopInterval);
                    }
                }, (interval * 100) / wars[w].length);
            });

            setInterval(() => {
                if (cpt < 100) {
                    ++cpt;
                    document.getElementById('timer').innerHTML = '' + cpt + '';
                } else {
                    this.$emit('on-ended', true);
                    setTimeout(() => {
                        this.notFinish = false;
                    }, 600);
                }
            }, interval);
        },

    },
    watch: {},
    mounted() {
        this.init();
    },
};
