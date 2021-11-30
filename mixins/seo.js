export default {
    computed: {
        seo() {
            // if (!this.data) return;
            // return this.data.seo.fields;
        },
    },

    head() {
        // if (!this.seo) return;
        // return {
        //     title: this.seo.seoMetaTitle,
        //     meta: [
        //         { hid: 'description', name: 'description', property: 'description', content: this.seo.seoMetaDescription },
        //         { hid: 'og:title', name: 'og:title', property: 'og:title', content: this.seo.seoMetaTitle },
        //         { hid: 'og:description', name: 'og:description', property: 'og:description', content: this.seo.seoMetaDescription },
        //         { hid: 'og:type', name: 'og:type', property: 'og:type', content: 'website' },
        //         { hid: 'og:url', name: 'og:url', property: 'og:url', content: '' },
        //         { hid: 'og:image', name: 'og:image', property: 'og:image', content: this.seo.seoShareImage ? this.seo.seoShareImage.fields.file.url : '' },
        //         { hid: 'og:image:width', name: 'og:image:width', property: 'og:image:width', content: this.seo.seoShareImage ? this.seo.seoShareImage.fields.file.details.image.width : '' },
        //         { hid: 'og:image:height', name: 'og:image:height', property: 'og:image:height', content: this.seo.seoShareImage ? this.seo.seoShareImage.fields.file.details.image.height : '' },
        //         { hid: 'twitter:card', name: 'twitter:card', property: 'twitter:card', content: 'summary_large_image' },
        //         { hid: 'twitter:title', name: 'twitter:title', property: 'twitter:title', content: this.seo.seoMetaTitle },
        //         { hid: 'twitter:description', name: 'twitter:description', property: 'twitter:description', content: this.seo.seoMetaDescription },
        //         { hid: 'twitter:image', name: 'twitter:image', property: 'twitter:image', content: this.seo.seoShareImage ? this.seo.seoShareImage.fields.file.url : '' },
        //     ],
        // };
    },
};
