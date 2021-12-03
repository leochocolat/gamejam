// Vendor
import { component } from '../vendor/bidello';
import { AnimationMixer, BoxGeometry, Color, DoubleSide, Mesh, MeshBasicMaterial, MeshNormalMaterial, Object3D, ShaderMaterial, Vector3 } from 'three';
import { gsap } from 'gsap';

// Shaders
import vertex from '@/webgl/shaders/chunk-material/vertex.glsl';
import fragment from '@/webgl/shaders/chunk-material/fragment.glsl';
import ResourceLoader from '@/vendor/resource-loader';

// Utils
import AnimationManager from '@/utils/AnimationManager';

export default class ChunkMesh extends component(Object3D) {
    init(options) {
        this._container = options.container;
        this._position = options.position;
        this._scale = options.scale;
        this._size = options.size;

        this._isHovered = false;

        this._settings = {
            hover: {
                translateY: 0.5,
            },
        };

        this._material = this._createMaterial();
        this._mesh = options.mesh || this._createMesh();
        this._pins = this._createPins();
        this._initialPosition = new Vector3(this._mesh.position.x, this._mesh.position.y, this._mesh.position.z);

        this._mesh.traverse((child) => {
        //     if (child.material && names.includes(child.material.name)) child.material = this._material;
            if (child.isMesh) child.material = child.material.clone();
        });

        // this.playPin('war');
        // this.playPin('revolution');
        // this.playPin('bombe');
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
        this._mesh.traverse((child) => {
            if (child.isMesh) {
                child.material.color.set(color);
            }
        });
    }

    playPin(name) {
        const pin = this._pins[name];

        for (let i = 0; i < pin.animationManager.animations.length; i++) {
            const animation = pin.animationManager.animations[i];
            pin.animationManager.playAnimation({ animation: animation.name, loop: false });
        }
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

    _createPins() {
        const pins = {
            war: this._createPinWar(),
            revolution: this._createPinRevolution(),
            bombe: this._createPinBombe(),
        };

        // console.log(pins);

        return pins;
    }

    _createPinWar() {
        const model = { ...ResourceLoader.get('pin-guerre-anim') };
        model.scene = model.scene.clone();
        model.animationManager = new AnimationManager({ model, animations: model.animations });

        model.scene.position.set(this._position.x + (1 / 3), this._position.y, this._position.z + (1 / 3));
        this._container.add(model.scene);

        return model;
    }

    _createPinRevolution() {
        const model = { ...ResourceLoader.get('pin-revolution-anim') };
        model.scene = model.scene.clone();
        model.animationManager = new AnimationManager({ model, animations: model.animations });

        model.scene.position.set(this._position.x - (1 / 3), this._position.y, this._position.z + (1 / 3));
        this._container.add(model.scene);

        return model;
    }

    _createPinBombe() {
        const model = { ...ResourceLoader.get('pin-bombe-anim') };
        model.scene = model.scene.clone();
        model.animationManager = new AnimationManager({ model, animations: model.animations });

        model.scene.position.set(this._position.x, this._position.y, this._position.z - (1 / 3));
        this._container.add(model.scene);

        return model;
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
        // this.rotation.y = Math.atan2( ( camera.position.x - obj.position.x ), ( camera.position.z - obj.position.z ) );
    }

    /**
     * Resize
     */
    onResize({ width, height }) {

    }
}
