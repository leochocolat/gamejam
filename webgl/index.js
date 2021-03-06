// Vendor
import { WebGLRenderer, Clock, Vector2, sRGBEncoding, GammaEncoding, LinearEncoding, RGBEEncoding, RGBM7Encoding, RGBM16Encoding, RGBDEncoding, BasicDepthPacking, RGBADepthPacking, GreaterEqualDepth } from 'three';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { GPUStatsPanel } from '@/webgl/vendor/GPUStatsPanel.js';
import bidello from './vendor/bidello';
import { gsap } from 'gsap';

// Utils
import Debugger from '@/utils/Debugger';
import WindowResizeObserver from '@/utils/WindowResizeObserver';
import device from '@/utils/device';

// Modules
import SceneManager from './modules/SceneManager';
import DragManager from '@/utils/DragManager';

// Scenes
// import MainScene from './scenes/MainScene';

export default class WebGLApplication {
    constructor(options = {}) {
        console.log('Chloé');

        // Props
        this._canvas = options.canvas;
        this._nuxtRoot = options.nuxtRoot;
        this._isDebug = options.isDebug;
        this._isDevelopment = options.isDevelopment;
        this._sceneName = options.sceneName;

        // Setup

        // THREE.LinearEncoding
        // THREE.sRGBEncoding
        // THREE.GammaEncoding
        // THREE.RGBEEncoding
        // THREE.RGBM7Encoding
        // THREE.RGBM16Encoding
        // THREE.RGBDEncoding
        // THREE.BasicDepthPacking
        // THREE.RGBADepthPacking

        this._encodings = {
            linearEncoding: LinearEncoding,
            sRGBEncoding: sRGBEncoding,
            gammaEncoding: GammaEncoding,
            RGBEEncoding: RGBEEncoding,
            RGBM7Encoding: RGBM7Encoding,
            RGBM16Encoding: RGBM16Encoding,
            RGBDEncoding: RGBDEncoding,
            BasicDepthPacking: BasicDepthPacking,
            RGBADepthPacking: RGBADepthPacking,
        }

        this._settings = { 
            encoding: 'sRGBEncoding', 
            encodingOptions: {
                LinearEncoding: 'LinearEncoding',
                sRGBEncoding: 'sRGBEncoding',
                GammaEncoding: 'GammaEncoding',
                RGBEEncoding: 'RGBEEncoding',
                RGBM7Encoding: 'RGBM7Encoding',
                RGBM16Encoding: 'RGBM16Encoding',
                RGBDEncoding: 'RGBDEncoding',
                BasicDepthPacking: 'BasicDepthPacking',
                RGBADepthPacking: 'RGBADepthPacking',
            }
        };

        this._width = WindowResizeObserver.width;
        this._height = WindowResizeObserver.height;
        this._clock = this._createClock();
        this._debugger = this._createDebugger();
        this._renderer = this._createRenderer();
        this._scene = this._createScene();
        this._dragManager = new DragManager({ el: this._canvas });

        this._allowMouseInteractions = false;
        this._mousePosition = new Vector2();
        this._normalizedMousePosition = new Vector2();
        this._centeredMousePosition = new Vector2();

        this._bindHandlers();
        this._setupEventListeners();
        this._resize();

        // Only in development
        if (this._isDevelopment) {
            this._stats = this._createStats();
            this._statsGpuPanel = this._createStatsGpuPanel();
        }
    }

    /**
     * Public
     */
    transitionIn() {
        const timeline = new gsap.timeline();
        timeline.add(this._scene.transitionIn(), 0);
        timeline.call(() => { this._allowMouseInteractions = true }, null, 2);
    }
    
    startTimelapse() {
        this._scene.startTimelapse();
    }

    /**
     * This is called when all resources are available
     */
    setup() {
        this._scene.setup();
    }

    destroy() {
        this._removeEventListeners();
        this._removeDebugger();
        this._removeStats();
        this._clock.stop();
        this._renderer.dispose();
        this._dragManager.close();
        if (this._scene.destroy) this._scene.destroy();
    }

    /**
     * Private
     */
    _createClock() {
        const clock = new Clock();

        return clock;
    }

    _createRenderer() {
        const renderer = new WebGLRenderer({
            canvas: this._canvas,
            antialias: true,
            transparent: false,
        });
        renderer.setClearColor('0xffffff');
        renderer.outputEncoding = this._encodings[this._settings.encoding];

        // renderer.outputEncoding = sRGBEncoding;
        // renderer.outputEncoding = GammaEncoding;

        return renderer;
    }

    _createScene() {
        const sceneManager = new SceneManager({
            sceneName: this._sceneName,
            root: this,
            nuxtRoot: this._nuxtRoot,
            renderer: this._renderer,
            width: this._width,
            height: this._height,
            debugger: this._debugger,
        });

        return sceneManager.activeScene;
    }

    /**
     * Update cycle
     */
    _update() {
        if (this._stats) this._stats.begin();
        this._triggerBidelloUpdate();
        this._render();
        if (this._stats) this._stats.end();
    }

    _render() {
        if (this._statsGpuPanel) this._statsGpuPanel.startQuery();
        this._renderer.render(this._scene, this._scene.camera);
        if (this._statsGpuPanel) this._statsGpuPanel.endQuery();
    }

    _triggerBidelloUpdate() {
        const delta = this._clock.getDelta();
        const time = this._clock.getElapsedTime();

        bidello.trigger(
            {
                name: 'update',
                fireAtStart: false,
            },
            {
                delta,
                time,
            },
        );
    }

    /**
     * Resize
     */
    _resize() {
        this._width = WindowResizeObserver.width;
        this._height = WindowResizeObserver.height;
        this._dpr = Math.max(1, device.dpr());

        this._resizeCanvas();
        this._resizeRenderer();
        this._triggerBidelloResize();
    }

    _resizeCanvas() {
        this._renderer.domElement.style.width = `${this._width}px`;
        this._renderer.domElement.style.height = `${this._height}px`;
    }

    _resizeRenderer() {
        this._renderer.setPixelRatio(this._dpr);
        this._renderer.setSize(this._width, this._height, false);
    }

    _triggerBidelloResize() {
        bidello.trigger(
            {
                name: 'resize',
                fireAtStart: true,
            },
            {
                width: this._width,
                height: this._height,
                dpr: this._dpr,
            },
        );
    }

    /**
     * Events
     */
    _bindHandlers() {
        this._resizeHandler = this._resizeHandler.bind(this);
        this._tickHandler = this._tickHandler.bind(this);
        this._mousemoveHandler = this._mousemoveHandler.bind(this);
        this._clickHandler = this._clickHandler.bind(this);
        this._tapHandler = this._tapHandler.bind(this);
    }

    _setupEventListeners() {
        WindowResizeObserver.addEventListener('resize', this._resizeHandler);
        gsap.ticker.add(this._tickHandler);
        this._canvas.addEventListener('mousemove', this._mousemoveHandler);
        this._canvas.addEventListener('click', this._clickHandler);
        this._dragManager.addEventListener('tap', this._tapHandler);
    }

    _removeEventListeners() {
        WindowResizeObserver.removeEventListener('resize', this._resizeHandler);
        gsap.ticker.remove(this._tickHandler);
        window.removeEventListener('mousemove', this._mousemoveHandler);
        this._canvas.removeEventListener('click', this._clickHandler);
    }

    _resizeHandler() {
        this._resize();
    }

    _tickHandler() {
        this._update();
    }

    _mousemoveHandler(e) {
        if (!this._allowMouseInteractions) return;

        this._mousePosition.x = e.clientX;
        this._mousePosition.y = e.clientY;

        this._normalizedMousePosition.x = this._mousePosition.x / this._width;
        this._normalizedMousePosition.y = 1.0 - this._mousePosition.y / this._height;

        this._centeredMousePosition.x = (this._mousePosition.x / this._width) * 2 - 1;
        this._centeredMousePosition.y = -(this._mousePosition.y / this._height) * 2 + 1;

        bidello.trigger(
            {
                name: 'mousemove',
                fireAtStart: false,
            },
            {
                mousePosition: this._mousePosition,
                normalizedMousePosition: this._normalizedMousePosition,
                centeredMousePosition: this._centeredMousePosition,
            },
        );
    }

    _clickHandler(e) {
        // this._mousePosition.x = e.clientX;
        // this._mousePosition.y = e.clientY;

        // this._normalizedMousePosition.x = this._mousePosition.x / this._width;
        // this._normalizedMousePosition.y = 1.0 - this._mousePosition.y / this._height;

        // this._centeredMousePosition.x = (this._mousePosition.x / this._width) * 2 - 1;
        // this._centeredMousePosition.y = -(this._mousePosition.y / this._height) * 2 + 1;

        // bidello.trigger(
        //     {
        //         name: 'click',
        //         fireAtStart: false,
        //     },
        //     {
        //         mousePosition: this._mousePosition,
        //         normalizedMousePosition: this._normalizedMousePosition,
        //         centeredMousePosition: this._centeredMousePosition,
        //     },
        // );
    }

    _tapHandler(e) {
        if (!this._allowMouseInteractions) return;

        this._mousePosition.x = e.position.x;
        this._mousePosition.y = e.position.y;

        this._normalizedMousePosition.x = this._mousePosition.x / this._width;
        this._normalizedMousePosition.y = 1.0 - this._mousePosition.y / this._height;

        this._centeredMousePosition.x = (this._mousePosition.x / this._width) * 2 - 1;
        this._centeredMousePosition.y = -(this._mousePosition.y / this._height) * 2 + 1;

        bidello.trigger(
            {
                name: 'click',
                fireAtStart: false,
            },
            {
                mousePosition: this._mousePosition,
                normalizedMousePosition: this._normalizedMousePosition,
                centeredMousePosition: this._centeredMousePosition,
            },
        );
    }

    /**
     * Debugger
     */
    _createDebugger() {
        if (!this._isDebug) return;

        const debug = new Debugger({
            title: 'Debugger',
        });

        debug.addInput(this._settings, 'encoding', { options: this._settings.encodingOptions }).on('change', () => {
            this._renderer.outputEncoding = this._encodings[this._settings.encoding];
        });

        return debug;
    }

    _removeDebugger() {
        this._debugger?.destroy();
    }

    _createStats() {
        if (!this._isDebug) return;
        const stats = new Stats();
        document.body.appendChild(stats.dom);

        return stats;
    }

    _removeStats() {
        if (!this._stats) return;
        document.body.removeChild(this._stats.dom);
        this._stats = null;
    }

    _createStatsGpuPanel() {
        if (!this._stats) return;
        const panel = new GPUStatsPanel(this._renderer.getContext());
        this._stats.addPanel(panel);
        this._stats.showPanel(3);

        return panel;
    }
}
