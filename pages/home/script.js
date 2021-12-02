// Mixins
import seo from '@/mixins/seo';
import pageTransitions from '@/mixins/pageTransitions';
import utils from '@/mixins/utils';

export default {
    mixins: [seo, pageTransitions, utils],

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
};
