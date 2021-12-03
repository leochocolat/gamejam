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
            const interval = 50;
            let cpt = 0;
            const wars = {
                war: this.$mapManager.getSettlersWars(),
                bombe: this.$mapManager.getPopulationsWars(),
                revolution: this.$mapManager.getSettlersIndependenceWar(),
            };

            Object.keys(wars).forEach((w) => {
                let index = -1;
                const arr = wars[w]
                const loopInterval = setInterval(() => {
                    index++;
                    if (arr[index]) {
                        arr[index].mesh.playPin(w);
                    }

                    if (index === arr.length) {
                        clearInterval(loopInterval);
                    }
                }, (interval * 100) / arr.length);
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
