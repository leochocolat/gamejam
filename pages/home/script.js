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
import ResultsModal from '@/components/Results'; '';

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
            diplomatic: 1,
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
        onClickSettlers(val) {
            this.settlers.forEach((element) => {
                element.active = false;
            });
            val.active = true;
        },

        onMouseEnter() {
            gsap.to('.btn-line', { opacity: 1, duration: 0.8 });
        },

        onMouseLeave() {
            gsap.to('.btn-line', { opacity: 0, duration: 0.8 });
        },

        showWar() {
            gsap.to('.settlers', { opacity: 0, duration: 1.5 });
            gsap.to('.population', { opacity: 0, duration: 1.5 });
            gsap.to('.ressource', { opacity: 0, duration: 1.5 });
            gsap.to('.btn', { opacity: 0, duration: 1.5 });

            setTimeout(() => {
                this.notClick = false;
            }, 1600);
        },

        showResults(val) {
            if (val === true) {
                this.results = val;
            }
        },
    },
    mounted() {
        console.log(this.$mapManager);
    },
};
