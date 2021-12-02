// Vendor
import { component } from '../vendor/bidello';
import { AmbientLight, Box3, BoxBufferGeometry, BoxGeometry, Color, DirectionalLight, InstancedMesh, Matrix4, Mesh, MeshBasicMaterial, MeshNormalMaterial, Object3D, Raycaster, Scene, Vector2, Vector3 } from 'three';

// Utils
import math from '@/utils/math';

// Components
import Cameras from '../modules/Cameras';
import ResourceLoader from '@/vendor/resource-loader';

const matrix = new Matrix4();

export default class FinalScene extends component(Scene) {
    init(options = {}) {
        this._renderer = options.renderer;
        this._width = options.width;
        this._height = options.height;
        this._debugger = options.debugger;

        this._settings = {
            backgroundColor: '#EFEAE1',
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
                rotation: new Vector3(),
                scale: 1,
            },
        };

        this.background = new Color(this._settings.backgroundColor);

        this._lights = this._createLights();
        this._debugFolder = this._createDebugFolder();
        this._cameras = this._createCameras();
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

    /**
     * This is called when all resources are available
     */
    setup() {
        this._model = this._createModel();

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
        });

        // cameras.active.rotation.x = Math.PI * 0.5;
        // cameras.active.position.y = 3;
        // cameras.active.lookAt(0, 0, 0);
        // cameras.active.position.y = 6;

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
        const model = ResourceLoader.get('map-test-materials').scene;
        const container = new Object3D();
        const size = this._getSize(model);
        model.position.x = -size.x / 2;
        model.position.z = size.z / 2;
        container.add(model);
        this.add(container);

        return container;
    }

    /**
     * Update cycle
     */
    onUpdate({ time, delta }) {

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
        folder.addInput(this._settings, 'backgroundColor').on('change', () => { this.background.set(this._settings.backgroundColor); });
        const lights = folder.addFolder({ title: 'Lights' });
        lights.addInput(this._lights.ambiant, 'intensity', { label: 'ambiant intensity', min: 0, max: 1 });
        lights.addInput(this._settings.lights.ambiant, 'color', { label: 'ambiant color' }).on('change', () => { this._lights.ambiant.color.set(this._settings.lights.ambiant.color); });
        lights.addInput(this._lights.directional, 'intensity', { label: 'directional intensity', min: 0, max: 1 });
        lights.addInput(this._settings.lights.directional, 'color', { label: 'directional color' }).on('change', () => { this._lights.directional.color.set(this._settings.lights.directional.color); });
        const model = folder.addFolder({ title: 'Model' });
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
