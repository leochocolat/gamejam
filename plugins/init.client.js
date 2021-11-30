// Utils
import device from '@/utils/device';
import Browser from '@/utils/Browser';

export default ({ app }) => {
    /**
     * Device
     */
    if (!device.isTouch()) document.body.classList.add('no-touch');
    else document.body.classList.add('is-touch');

    /**
     * Compatibility
     */
    const isValidBrowser = Browser.isValidBrowser();
    const inferiorRoute = 'not-supported';

    app.router.beforeEach((to, from, next) => {
        if (app.getRouteBaseName(to) === inferiorRoute) {
            next();

            return;
        };

        if (!isValidBrowser) {
            next(app.localePath(`/${inferiorRoute}`));
        } else {
            next();
        }
    });
};
