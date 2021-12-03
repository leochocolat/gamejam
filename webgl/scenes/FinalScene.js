// Vendor
import { component } from '../vendor/bidello';
import { AmbientLight, Box3, BoxBufferGeometry, BoxGeometry, CanvasTexture, Color, DirectionalLight, InstancedMesh, Matrix4, Mesh, MeshBasicMaterial, MeshNormalMaterial, Object3D, Raycaster, Scene, Vector2, Vector3 } from 'three';
import ResourceLoader from '@/vendor/resource-loader';
import { gsap } from 'gsap';

// Utils
import math from '@/utils/math';

// Modules
import Cameras from '../modules/Cameras';

// Components
import CanvasBackground from '../components/CanvasBackground';
import Map from '../components/Map';

const matrix = new Matrix4();

export default class FinalScene extends component(Scene) {
    init(options = {}) {
        this._renderer = options.renderer;
        this._width = options.width;
        this._height = options.height;
        this._debugger = options.debugger;
        this._nuxtRoot = options.nuxtRoot;

        this._settings = {
            backgroundColor: '#E7DBC6',
            lights: {
                ambiant: {
                    color: '#EFEAE1',
                },
                directional: {
                    color: '#ffffff',
                },
            },
            model: {
                position: new Vector3(0, 0, 0),
                rotation: new Vector3(0, 0, 0),
                scale: 0.35,
            },
        };

        this._canvasBackground = new CanvasBackground({ width: this._width, height: this._height });
        this.background = new CanvasTexture(this._canvasBackground.canvas);

        this._lights = this._createLights();
        this._debugFolder = this._createDebugFolder();
        this._cameras = this._createCameras();
    }

    destroy() {
        this._map?.destroy();
    }

    /**
     * Getters
     */
    get camera() {
        return this._cameras.active;
    }

    /**
     * Public
     */
    transitionIn() {
        const timeline = new gsap.timeline();
        timeline.fromTo(this.position, { y: -10 }, { duration: 2, y: 0, ease: 'power3.out' }, 0);
        timeline.fromTo(this.position, { x: 10 }, { duration: 2, x: 0, ease: 'power3.out' }, 0);
        timeline.fromTo(this.rotation, { y: math.degToRad(360) }, { duration: 3, y: 0, ease: 'power3.out' }, 0);
    }

    /**
     * This is called when all resources are available
     */
    setup() {
        this._model = this._createModel();
        this._map = this._createMap();

        this._resizeModel();
    }

    /**
     * Private
     */
    _createCameras() {
        const cameras = new Cameras({
            renderer: this._renderer,
            width: this._width,
            height: this._height,
            debugFolder: this._debugFolder,
            mode: this._model,
        });

        return cameras;
    }

    _createLights() {
        const ambiant = new AmbientLight(this._settings.lights.ambiant.color);
        this.add(ambiant);

        const directional = new DirectionalLight(this._settings.lights.directional.color);
        this.add(directional);

        const lights = {
            ambiant,
            directional,
        };

        return lights;
    }

    _createModel() {
        // const model = ResourceLoader.get('gamejam_test').scene;
        // const model = ResourceLoader.get('map-test-materials').scene;
        const model = ResourceLoader.get('map').scene;
        const container = new Object3D();
        const size = this._getSize(model);
        model.position.x = -size.x / 2;
        model.position.z = size.z / 2;
        container.add(model);
        this.add(container);

        container.scale.set(this._settings.model.scale, this._settings.model.scale, this._settings.model.scale);

        return container;
    }

    _createMap() {
        const map = new Map({
            renderer: this._renderer,
            scene: this,
            camera: this.camera,
            width: this._width,
            height: this._height,
            debugFolder: this._debugFolder,
            model: this._model.children[0],
            nuxtRoot: this._nuxtRoot,
        });

        this.add(map);

        return map;
    }

    /**
     * Update cycle
     */
    onUpdate({ time, delta }) {
        this._cameras.update({ time, delta });
    }

    /**
     * Resize
     */
    onResize({ width, height }) {
        this._width = width;
        this._height = height;

        this._cameras.resize({ width, height });
    }

    _resizeModel() {
        this._model.position.x = this._settings.model.position.x;
        this._model.position.y = this._settings.model.position.y;
        this._model.position.z = this._settings.model.position.z;

        this._model.rotation.x = math.degToRad(this._settings.model.rotation.x);
        this._model.rotation.y = math.degToRad(this._settings.model.rotation.y);
        this._model.rotation.z = math.degToRad(this._settings.model.rotation.z);

        this._model.scale.set(this._settings.model.scale, this._settings.model.scale, this._settings.model.scale);
    }

    /**
     * Mousemove
     */
    onMousemove({ centeredMousePosition }) {

    }

    /**
     * Debug
     */
    _createDebugFolder() {
        if (!this._debugger) return;

        const folder = this._debugger.addFolder({ title: 'Scene' });
        folder.addButton({ title: 'Play animation' }).on('click', () => { this.transitionIn() });
        folder.addInput(this._settings, 'backgroundColor').on('change', () => { this.background.set(this._settings.backgroundColor); });
        const lights = folder.addFolder({ title: 'Lights', expanded: false });
        lights.addInput(this._lights.ambiant, 'intensity', { label: 'ambiant intensity', min: 0, max: 1 });
        lights.addInput(this._settings.lights.ambiant, 'color', { label: 'ambiant color' }).on('change', () => { this._lights.ambiant.color.set(this._settings.lights.ambiant.color); });
        lights.addInput(this._lights.directional, 'intensity', { label: 'directional intensity', min: 0, max: 10 });
        lights.addInput(this._settings.lights.directional, 'color', { label: 'directional color' }).on('change', () => { this._lights.directional.color.set(this._settings.lights.directional.color); });
        const model = folder.addFolder({ title: 'Model', expanded: false });
        const positions = model.addFolder({ title: 'Position' });
        positions.addInput(this._settings.model.position, 'x', { min: -50, max: 50 }).on('change', this._resizeModel.bind(this));
        positions.addInput(this._settings.model.position, 'y', { min: -50, max: 50 }).on('change', this._resizeModel.bind(this));
        positions.addInput(this._settings.model.position, 'z', { min: -50, max: 50 }).on('change', this._resizeModel.bind(this));
        const rotations = model.addFolder({ title: 'Rotation' });
        rotations.addInput(this._settings.model.rotation, 'x', { min: -90, max: 90 }).on('change', this._resizeModel.bind(this));
        rotations.addInput(this._settings.model.rotation, 'y', { min: -90, max: 90 }).on('change', this._resizeModel.bind(this));
        rotations.addInput(this._settings.model.rotation, 'z', { min: -90, max: 90 }).on('change', this._resizeModel.bind(this));
        const scale = model.addFolder({ title: 'Scale' });
        scale.addInput(this._settings.model, 'scale', { min: 0, max: 10 }).on('change', this._resizeModel.bind(this));

        return folder;
    }

    /**
     * Utils
     */
    _getSize(mesh) {
        const target = new Vector3();
        new Box3().setFromObject(mesh).getSize(target);

        return target;
    }
}
