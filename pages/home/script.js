// Mixins
import seo from '@/mixins/seo';
import pageTransitions from '@/mixins/pageTransitions';
import utils from '@/mixins/utils';

// Components
import SettlersCard from '@/components/SettlersCard';


export default {
    mixins: [seo, pageTransitions, utils],
    components: {
        SettlersCard
    },
    data: () => ({
        settlers: [
            {
                name: "pellatarte",
                colorActive: "#AC79B3",
                score: 0,
                picture: "pictures/ressources/bois.png",
                borderConflict : false,
                active : true
            },
            {
                name: "prespuré",
                colorActive: "#5FB26E",
                score: 0,
                picture: "pictures/ressources/betail.png",
                borderConflict : true,
                active : false
            },
            {
                name: "moulacake",
                colorActive: "#DF8C5D",
                score: 0,
                picture: "pictures/ressources/minerais.png",
                borderConflict : true,
                active : false
            },
            {
                name: "spatulia",
                colorActive: "#989FE1",
                score: 0,
                picture: "pictures/ressources/agriculture.png",
                borderConflict : false,
                active : false
            }
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

        onClickSettlers(val){
            this.settlers.forEach(element => {
               element.active = false 
            });
            val.active = true;
        }
    },
    mounted() {}
};
