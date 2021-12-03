// Mixins
import seo from '@/mixins/seo';
import pageTransitions from '@/mixins/pageTransitions';
import utils from '@/mixins/utils';

// Components
import SettlersCard from '@/components/SettlersCard';
import PopulationCard from '@/components/PopulationCard';
import RessourceCard from '@/components/RessourceCard';

export default {
    mixins: [seo, pageTransitions, utils],
    components: {
        SettlersCard,
        PopulationCard,
        RessourceCard,
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
    },
    mounted() {
        console.log(this.$mapManager.populations[0]);
    },
};
