// Mixins
import seo from '@/mixins/seo';
import pageTransitions from '@/mixins/pageTransitions';

export default {
    mixins: [seo, pageTransitions],

    methods: {
        transitionIn(done, routeInfos) {
            // console.log('transition in');
            done();
        },

        transitionOut(done, routeInfos) {
            // console.log('transition out');
            done();
        },
    },
};
