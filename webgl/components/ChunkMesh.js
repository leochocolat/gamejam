// Vendor
import { component } from '../vendor/bidello';
import { BoxGeometry, Color, DoubleSide, Mesh, MeshBasicMaterial, MeshNormalMaterial, Object3D, ShaderMaterial, Vector3 } from 'three';
import { gsap } from 'gsap';

// Shaders
import vertex from '@/webgl/shaders/chunk-material/vertex.glsl';
import fragment from '@/webgl/shaders/chunk-material/fragment.glsl';

export default class ChunkMesh extends component(Object3D) {
    init(options) {
        this._size = options.size;

        this._isHovered = false;

        this._settings = {
            hover: {
                translateY: 0.5,
            },
        };

        this._material = this._createMaterial();
        this._mesh = options.mesh || this._createMesh();
        this._initialPosition = new Vector3(this._mesh.position.x, this._mesh.position.y, this._mesh.position.z);

        this._mesh.traverse((child) => {
            if (child.isMesh) child.material = child.material.clone();
        });
    }

    /**
     * Getters and Setters
     */
    get isHovered() {
        return this._isHovered;
    }

    set isHovered(isHovered) {
        if (!this._isHovered && isHovered) this._mouseenterHandler();
        if (this._isHovered && !isHovered) this._mouseleaveHandler();
        this._isHovered = isHovered;
    }

    get mesh() {
        return this._mesh;
    }

    /**
     * Public
     */
    setColor(color) {
        this._mesh.material.color.set(color);
        // this._material.uniforms.color.value.set(color);
    }

    /**
     * Private
     */
    _createMaterial() {
        const material = new ShaderMaterial({
            uniforms: {
                color: { value: new Color('#f1f1f1') },
            },
            vertexShader: vertex,
            fragmentShader: fragment,
        });

        return material;
    }

    _createMesh() {
        const geometry = new BoxGeometry(this._size.x, this._size.y, this._size.z);
        const material = this._material;
        const mesh = new Mesh(geometry, material);
        this.add(mesh);

        return mesh;
    }

    /**
     * Events
     */
    _mouseenterHandler() {
        gsap.to(this._mesh.position, { duration: 0.3, y: this._initialPosition.y + this._settings.hover.translateY });
    }

    _mouseleaveHandler() {
        gsap.to(this._mesh.position, { duration: 0.3, y: this._initialPosition.y });
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

    }
}
