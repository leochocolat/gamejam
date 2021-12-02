import Bowser from 'bowser';

class Browser {
    constructor() {
        if (process.client) {
            this._browser = Bowser.getParser(window.navigator.userAgent);
        }
    }

    isFirefox() {
        return this._browser.isBrowser('Firefox');
    }

    isSafari() {
        return this._browser.isBrowser('Safari');
    }

    isEdge() {
        return this._browser.isBrowser('Microsoft Edge');
    }

    isInternetExplorer() {
        return this._browser.isBrowser('Internet explorer');
    }

    getClassName() {
        switch (this._browser.getBrowserName()) {
            case 'Firefox':
                return 'firefox';
            case 'Chrome':
                return 'chrome';
            case 'Safari':
                return 'safari';
            case 'Internet Explorer':
                return 'ie';
        }
    }

    isValidBrowser() {
        return this._browser.satisfies({
            // Test
            // chrome: '>118.01.1322',
            chrome: '>20',

            // declare browsers per OS
            // windows: {
            //     'internet explorer': '>10',
            // },

            // macos: {
            //     safari: '>10.1',
            // },

            // per platform (mobile, desktop or tablet)
            // mobile: {
            //     safari: '>=9',
            //     'android browser': '>3.10',
            // },

            // or in general
            // chrome: '~20.1.1432',
            // firefox: '>31',
            // opera: '>=22',

            // also supports equality operator
            // chrome: '=20.1.1432', // will match particular build only

            // and loose-equality operator
            // chrome: '~20', // will match any 20.* sub-version
            // chrome: '~20.1', // will match any 20.1.* sub-version (20.1.19 as well as 20.1.12.42-alpha.1)
        });
    }
}

export default new Browser();
