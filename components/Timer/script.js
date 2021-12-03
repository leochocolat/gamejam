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
            gsap.to(this.$el, { duration: 0.5, y: '0%', ease: 'power3.out' });

            this.$root.webglApp.startTimelapse();

            // const interval = 10;
            const interval = 10;
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
                        this.hide();
                        this.notFinish = false;
                    }, 600);
                }
            }, interval);
        },


        hide() {
            if (!this.notFinish) return;
            gsap.to(this.$el, { duration: 0.5, y: '100%', ease: 'power3.inOut' });
        }
    },
    watch: {},
    mounted() {
        this.init();
    },
};
