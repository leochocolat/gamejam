// Utils
import WindowResizeObserver from '@/utils/WindowResizeObserver';

// CSS Variables
import { fontSizeSmall, fontSizeMedium, fontSizeLarge, viewportWidthSmall, viewportWidthLarge } from '@/assets/styles/resources/_variables.scss';

class Breakpoints {
    constructor() {
        if (!process.client) return;

        this._active = null;
        this._bindHandlers();
        this._setupEventListeners();
        this._resize();
    }

    destroy() {
        this._removeEventListeners();
    }

    /**
     * Getters
     */
    get current() {
        return this._active;
    }

    /**
     * Public
     */
    active() {
        for (let i = 0, len = arguments.length; i < len; i++) {
            if (arguments[i] === this._active) return true;
        }
        return false;
    }

    rem(value) {
        const viewportWidth = parseInt(viewportWidthSmall);
        const fontSize = parseFloat(this._active === 'medium' ? fontSizeMedium : fontSizeSmall);
        return (value / (viewportWidth / 100) / 100) * fontSize * WindowResizeObserver.width;
    }

    reml(value) {
        const viewportWidth = parseInt(viewportWidthLarge);
        const fontSize = parseFloat(fontSizeLarge);
        return (value / (viewportWidth / 100) / 100) * fontSize * WindowResizeObserver.width;
    }

    /**
     * Private
     */
    _bindHandlers() {
        this._resizeHandler = this._resizeHandler.bind(this);
    }

    _setupEventListeners() {
        WindowResizeObserver.addEventListener('resize', this._resizeHandler);
    }

    _removeEventListeners() {
        WindowResizeObserver.removeEventListener('resize', this._resizeHandler);
    }

    _getNameFromDocumentElement() {
        const before = window.getComputedStyle(document.documentElement, ':before');
        const name = before.content.replace(/"/g, '');
        return name;
    }

    /**
     * Resize
     */
    _resize() {
        this._active = this._getNameFromDocumentElement();
    }

    /**
     * Handlers
     */
    _resizeHandler() {
        this._resize();
    }
}

export default new Breakpoints();
