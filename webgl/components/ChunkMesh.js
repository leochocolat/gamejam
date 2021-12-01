// Vendor
import { component } from '../vendor/bidello';
import { BoxGeometry, Color, Mesh, MeshNormalMaterial, Object3D, ShaderMaterial } from 'three';
import { gsap } from 'gsap';

// Shaders
import vertex from '@/webgl/shaders/chunk-material/vertex.glsl';
import fragment from '@/webgl/shaders/chunk-material/fragment.glsl';

export default class ChunkMesh extends component(Object3D) {
    init(options) {
        this._size = options.size;

        this._isHovered = false;

        this._material = this._createMaterial();
        this._mesh = this._createMesh();
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

    /**
     * Public
     */
    setColor(color) {
        console.log(color);
        this._material.uniforms.color.value.set(color);
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
        gsap.to(this._mesh.position, { duration: 0.3, y: 1 });
    }

    _mouseleaveHandler() {
        gsap.to(this._mesh.position, { duration: 0.3, y: 0 });
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
