// Vendor
import { component } from '../vendor/bidello';
import { AmbientLight, Box3, Scene, Vector3} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Components
import Cameras from '../modules/Cameras';
import MapTest from '../components/MapTest';

export default class MainScene extends component(Scene) {
    init(options = {}) {
        this._renderer = options.renderer;
        this._width = options.width;
        this._height = options.height;
        this._debugger = options.debugger;

        this._debugFolder = this._createDebugFolder();
        this._cameras = this._createCameras();

        this._light = this._createLight();
    }

    /**
     * Getters
     */
    get camera() {
        return this._cameras.active;
    }

    /**
     * This is called when all resources are available
     */
    setup() {
        this._map = this._createMap();
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

        return cameras;
    }

    _createMap() {
        //ajout de la map sur la scène
        const map = new MapTest();
        this.add(map);

        //centrer le point d'ancrage de la map 
        const box = new Box3().setFromObject(map);
        const center = box.getCenter(new Vector3);

        map.position.x += (map.position.x - center.x)
        map.position.y += (map.position.y - center.y)
        map.position.z += (map.position.z - center.z)

        if (!this._debugFolder) return map;

        const mapFolder = this._debugFolder.addFolder({ title: 'Map'});
        mapFolder.addFolder({ title: 'Position'});
        mapFolder.addInput(map.position,'x', {
            step : 0.01,
            min: -10,
            max: 10,
        });
        mapFolder.addInput(map.position,'y', {
            step : 0.01,
            min: -10,
            max: 10,
        });
        mapFolder.addInput(map.position,'z', {
            step : 0.01,
            min: -10,
            max: 10,
        });
        mapFolder.addFolder({ title: 'Rotation'});
        mapFolder.addInput(map.rotation,'x', {
            step : 0.01,
            min: -2,
            max: 2,
        });
        mapFolder.addInput(map.rotation,'y', {
            step : 0.01,
            min: -2,
            max: 2,
        });
        mapFolder.addInput(map.rotation,'z', { step : 0.01, min: -1, max: 1 });

        return map;
    }

    _createDebugFolder() {
        if (!this._debugger) return;

        const folder = this._debugger.addFolder({ title: 'Scene' });

        return folder;
    }

    _createLight() {
        const light = new AmbientLight(0xFFFFFF, 1)

        this.add(light);

        return light
    }

    /**
     * Animate
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
}
