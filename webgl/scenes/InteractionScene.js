// Vendor
import { component } from '../vendor/bidello';
import { BoxBufferGeometry, BoxGeometry, Color, InstancedMesh, Matrix4, Mesh, MeshBasicMaterial, MeshNormalMaterial, Object3D, Raycaster, Scene, Vector2, Vector3 } from 'three';

// Components
import Cameras from '../modules/Cameras';
import Block from '../components/Block';

const matrix = new Matrix4();

export default class MainScene extends component(Scene) {
    init(options = {}) {
        this._renderer = options.renderer;
        this._width = options.width;
        this._height = options.height;
        this._debugger = options.debugger;

        this._centeredMousePosition = { x: null, y: null };

        this._debugFolder = this._createDebugFolder();
        this._cameras = this._createCameras();
        this._raycaster = this._createRaycaster();
        this._blocks = this._createBlocks();
        // this._instancedMesh = this._createBlocksWithInstances();
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
        cameras.active.position.y = 3;
        cameras.active.lookAt(0, 0, 0);
        cameras.active.position.y = 6;

        return cameras;
    }

    _createDebugFolder() {
        if (!this._debugger) return;

        const folder = this._debugger.addFolder({ title: 'Scene' });

        return folder;
    }

    _createRaycaster() {
        const raycaster = new Raycaster();

        return raycaster;
    }

    _createBlocksWithInstances() {
        const rows = 15;
        const cols = 15;

        const size = new Vector3(1, 100, 1);
        const padding = 0.15;

        const geometry = new BoxBufferGeometry(size.x, size.y, size.z);
        const material = new MeshNormalMaterial();
        // const material = new MeshBasicMaterial({ color: 'red' });
        const instancedMesh = new InstancedMesh(geometry, material, rows * cols);

        const container = new Object3D();
        container.position.x = -((cols - 1) * size.x + padding * (cols - 1)) / 2;
        container.position.y = -size.y / 2;
        container.position.z = -1;
        this.add(container);

        const matrix = new Matrix4();

        let index = 0;
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                const x = j * size.x + padding * j;
                const y = 0;
                const z = (i * size.z + padding * i) * -1;
                matrix.setPosition(x, y, z);
                instancedMesh.setMatrixAt(index, matrix);
                container.add(instancedMesh);
                index++;
            }
        }

        return instancedMesh;
    }

    _createBlocks() {
        const blocks = [];

        const rows = 15;
        const cols = 15;

        const size = new Vector3(1, 100, 1);
        const padding = 0.15;

        const container = new Object3D();
        container.position.x = -((cols - 1) * size.x + padding * (cols - 1)) / 2;
        container.position.y = -size.y / 2;
        container.position.z = -1;
        this.add(container);

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                const block = new Block({ size });
                block.position.x = j * size.x + padding * j;
                block.position.z = (i * size.z + padding * i) * -1;
                blocks.push(block);
                container.add(block);
            }
        }

        return blocks;
    }

    /**
     * Update cycle
     */
    onUpdate({ time, delta }) {
        this._updateRaycaster();
    }

    _updateRaycaster() {
        this._raycaster.setFromCamera(this._centeredMousePosition, this.camera);
        const intersects = this._raycaster.intersectObjects(this.children);

        for (let i = 0; i < this._blocks.length; i++) {
            const block = this._blocks[i];
            if (intersects.length > 0 && block === intersects[0].object.parent) {
                block.isHovered = true;
            } else {
                block.isHovered = false;
            }
        }

        // Instances
        // if (intersects.length > 0) {
        //     const instanceId = intersects[0].instanceId;
        //     this._instancedMesh.setColorAt(instanceId, new Color(0xffff00));
        //     this._instancedMesh.instanceColor.needsUpdate = true;
        // }
    }

    /**
     * Resize
     */
    onResize({ width, height }) {
        this._width = width;
        this._height = height;

        this._cameras.resize({ width, height });
    }

    /**
     * Mousemove
     */
    onMousemove({ centeredMousePosition }) {
        this._centeredMousePosition = centeredMousePosition;
    }
}
