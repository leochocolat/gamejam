export default {
    computed: {
        lang() {
            return this.$i18n.locale;
        },

        staticCopy() {
            return this.$t('data');
        },
    },
};
