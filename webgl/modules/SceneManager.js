// Scenes
import sceneFactory from '../scenes/sceneFactory';

export default class SceneManager {
    constructor(options = {}) {
        this._sceneName = options.sceneName || 'main';
        this._nuxtRoot = options.nuxtRoot;
        this._renderer = options.renderer;
        this._width = options.width;
        this._height = options.height;
        this._debugger = options.debugger;
        this._activeScene = this._createScene();
    }

    /**
     * Getters
     */
    get activeScene() {
        return this._activeScene;
    }

    /**
     * Private
     */
    _createScene() {
        const constructor = sceneFactory[this._sceneName] || sceneFactory.main;

        if (!sceneFactory[this._sceneName]) {
            console.warn(`Couldn't find any scene with name "${this._sceneName}", now using main scene`);
        }

        const scene = new constructor({
            root: this._nuxtRoot,
            renderer: this._renderer,
            width: this._width,
            height: this._height,
            debugger: this._debugger,
        });

        return scene;
    }
}
