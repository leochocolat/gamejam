// Mixins
import seo from '@/mixins/seo';
import pageTransitions from '@/mixins/pageTransitions';
import utils from '@/mixins/utils';
import gsap from 'gsap';

// Components
import SettlersCard from '@/components/SettlersCard';
import PopulationCard from '@/components/PopulationCard';
import RessourceCard from '@/components/RessourceCard';
import HomeModal from '@/components/HomeModal';
import ConsigneModal from '@/components/ConsigneModal';
import Timer from '@/components/Timer';
import BackgroundButton from '@/assets/icons/background-btn-2.svg?inline';
import ResultsModal from '@/components/Results';

export default {
    mixins: [seo, pageTransitions, utils],
    components: {
        SettlersCard,
        PopulationCard,
        RessourceCard,
        HomeModal,
        ConsigneModal,
        BackgroundButton,
        Timer,
        ResultsModal,
    },
    data: () => ({
        settlers: [],
        activeSettler: null,
        population: null,
        resource: null,
        populationPictures: [
            {
                picture: 'pictures/population/choucremien.png',
            },
            {
                picture: 'pictures/population/baklavien.png',
            },
            {
                picture: 'pictures/population/crumblien.png',
            },
            {
                picture: 'pictures/population/flaonien.png',
            },
            {
                picture: 'pictures/population/kouignien.png',
            },
            {
                picture: 'pictures/population/loukoumien.png',
            },
            {
                picture: 'pictures/population/panettien.png',
            },
            {
                picture: 'pictures/population/spéculien.png',
            },
            {
                picture: 'pictures/population/tartatien.png',
            },
        ],
        ressourcePictures: [
            {
                picture: 'pictures/ressources/bois.png',
            },
            {
                picture: 'pictures/ressources/betail.png',
            },
            {
                picture: 'pictures/ressources/minerais.png',
            },
            {
                picture: 'pictures/ressources/agriculture.png',
            },
        ],
        notClick: true,
        war: {
            diplomatic: 0,
            population: 2,
            strike: 3,
        },
        results: false,
    }),
    methods: {
        transitionIn(done, routeInfos) {
            // console.log('transition in');
            if (done) done();
        },

        transitionOut(done, routeInfos) {
            // console.log('transition out');
            if (done) done();
        },

        onMouseEnter() {
            gsap.to('.btn-line', { opacity: 1, duration: 0.2, ease: 'sine.inOut' });
        },

        onMouseLeave() {
            gsap.to('.btn-line', { opacity: 0, duration: 0.2, ease: 'sine.inOut' });
        },

        showWar() {
            gsap.to('.settlers', { opacity: 0, duration: 0.5 });
            gsap.to('.population', { opacity: 0, duration: 0.5 });
            gsap.to('.ressource', { opacity: 0, duration: 0.5 });
            gsap.to('.btn', { opacity: 0, duration: 0.2 });

            this.war = {
                diplomatic: this.$mapManager.getSettlersWars().length,
                population: this.$mapManager.getPopulationsWars().length,
                strike: this.$mapManager.getSettlersIndependenceWar().length,
            };

            setTimeout(() => {
                this.notClick = false;
            }, 500);
        },

        showResults(val) {
            if (val === true) {
                this.results = val;
            }
        },
    },
    mounted() {
        this.settlers = this.$mapManager.settlers;
        this.activeSettler = this.$mapManager.activeSettler;

        if (this.$mapManager.hover) {
            this.population = this.$mapManager.hover.population || null
            this.resource = this.$mapManager.hover.resource || null
        }

        this.$mapManager.addEventListener('change', (e) => {
            this.settlers = e.settlers;
            this.activeSettler = e.activeSettler;
            const resources = e.resources;
            const populations = e.populations;
            const chunks = e.chunks;
        });

        this.$mapManager.addEventListener('hover', (e) => {
            if (e.hover) {
                this.population = e.hover.population || null
                this.resource = e.hover.resource || null
            } else {
                this.population = null
                this.resource = null
            }
        });

        console.log();
    },
};
