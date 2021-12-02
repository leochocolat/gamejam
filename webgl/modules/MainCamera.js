// Vendor
import { Object3D, PerspectiveCamera, Box3 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { component } from '../vendor/bidello';

export default class MainCamera extends Object3D {
    constructor(options = {}) {
        super();

        this._renderer = options.renderer;
        this._width = options.width;
        this._height = options.height;
        this._debugFolder = options.debugFolder;

        this._camera = this._createCamera();
        this._controls = this._createControls();
        this._debugFolder = this._createDebugFolder();
    }

    /**
     * Getters
     */
    get camera() {
        return this._camera;
    }
    
    _createCamera() {
        const camera = new PerspectiveCamera(75, this._width / this._height, 0.01, 10000);
        camera.position.z = 5;
        return camera;
    }

    _createControls() {
        const controls = new OrbitControls(this._camera, this._renderer.domElement);
        controls.enableDamping = true;

        return controls;
    }

    _createDebugFolder() {
        if (!this._debugFolder) return;

        const mainCamera = this._debugFolder.addFolder({ title: 'Main Camera', expanded: false });

        const deplacementFolder = mainCamera.addFolder({ title: 'Deplacement' });
        deplacementFolder.addInput(this._controls,'minDistance', {
            step : 0.01,
            min: 3,
            max: 10,
        });
        deplacementFolder.addInput(this._controls,'maxDistance', {
            step : 0.01,
            min: 5,
            max: 23,
        });
        deplacementFolder.addInput(this._controls,'dampingFactor', {
            step : 0.01,
            min: 0,
            max: 5,
        });
        deplacementFolder.addInput(this._controls,'minAzimuthAngle', {
            step : 0.01,
            min: -3,
            max: 3,
        });
        deplacementFolder.addInput(this._controls,'maxAzimuthAngle', {
            step : 0.01,
            min: -3,
            max: 3,
        });
        deplacementFolder.addInput(this._controls,'maxPolarAngle', {
            step : 0.01,
            min: 0,
            max: 3,
        });

        const cameraPosition = mainCamera.addFolder({ title: 'Position'});
        cameraPosition.addInput(this._camera.position,'x', {
            step : 0.01,
            min: -3,
            max: 3,
        });
        cameraPosition.addInput(this._camera.position,'y', {
            step : 0.01,
            min: -3,
            max: 3,
        });
        cameraPosition.addInput(this._camera.position,'z', {
            step : 0.01,
            min: 0,
            max: 10,
        });

        const cameraRotation = mainCamera.addFolder({ title: 'Rotation'});

        cameraRotation.addInput(this._camera.rotation,'x', {
            step : 0.01,
            min: -0.5,
            max: 0.5,
        });
        cameraRotation.addInput(this._camera.rotation,'y', {
            step : 0.01,
            min: -0.5,
            max: 0.5,
        });
        cameraRotation.addInput(this._camera.rotation,'z', {
            step : 0.01,
            min: -0.5,
            max: 0.5,
        });

        const other = cameraRotation.addFolder({ title: 'Other'});

        other.addInput(this._camera,'fov', {
            step : 0.01,
            min: 10,
            max: 100,
        }).on('change', () => {
            this._camera.updateProjectionMatrix();
        })
    }

    /**
     * Resize
     */
    resize({ width, height }) {
        this._width = width;
        this._height = height;

        this._camera.aspect = this._width / this._height;
        this._camera.updateProjectionMatrix();
    }
    
    /**
     * Update
     */
    update() {
        this._controls.update();
    }
}