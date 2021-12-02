import { Color, FrontSide, LinearFilter, LinearMipmapLinearFilter, MathUtils, Matrix4, Mesh, PerspectiveCamera, Plane, RGBAFormat, RGBFormat, ShaderMaterial, UniformsLib, UniformsUtils, Vector2, Vector3, Vector4, WebGLRenderTarget } from 'three';

// Modules
import { TYPE_LINEAR, TYPE_EXP, TYPE_EXP2, TYPE_GROUND, TYPE_COMBINED } from '@/webgl/modules/Fog';

// Shaders
import vertexShader from '@/webgl/shaders/river/vertex.glsl';
import fragmentShader from '@/webgl/shaders/river/fragment.glsl';

/**
 * Work based on :
 * http://slayvin.net : Flat mirror for three.js
 * http://www.adelphi.edu/~stemkoski : An implementation of water shader based on the flat mirror
 * http://29a.ch/ && http://29a.ch/slides/2012/webglwater/ : Water shader explanations in WebGL
 */

class RiverWater extends Mesh {
    constructor(geometry, options = {}) {
        super(geometry);

        const scope = this;

        const textureWidth = options.textureWidth !== undefined ? options.textureWidth : 512;
        const textureHeight = options.textureHeight !== undefined ? options.textureHeight : 512;

        const clipBias = options.clipBias !== undefined ? options.clipBias : 0.0;
        const normalSampler = options.waterNormals !== undefined ? options.waterNormals : null;
        const sunDirection = options.sunDirection !== undefined ? options.sunDirection : new Vector3(0.70707, 0.70707, 0.0);
        const sunColor = new Color(options.sunColor !== undefined ? options.sunColor : 0xffffff);
        const uWaterColor = new Color(options.waterColor !== undefined ? options.waterColor : 0x7F7F7F);
        const eye = options.eye !== undefined ? options.eye : new Vector3(0, 0, 0);
        const distortionScale = options.distortionScale !== undefined ? options.distortionScale : 20.0;
        const side = options.side !== undefined ? options.side : FrontSide;
        const fog = options.fog !== undefined ? options.fog : false;
        const size = options.size !== undefined ? options.size : false;
        const glowColor = new Color(options.glowColor !== undefined ? options.glowColor : 0x7F7F7F);

        //

        const mirrorPlane = new Plane();
        const normal = new Vector3();
        const mirrorWorldPosition = new Vector3();
        const cameraWorldPosition = new Vector3();
        const rotationMatrix = new Matrix4();
        const lookAtPosition = new Vector3(0, 0, -1);
        const clipPlane = new Vector4();

        const view = new Vector3();
        const target = new Vector3();
        const q = new Vector4();

        const textureMatrix = new Matrix4();

        const mirrorCamera = new PerspectiveCamera();

        const parameters = {
            minFilter: LinearMipmapLinearFilter,
            magFilter: LinearFilter,
            format: RGBFormat,
            stencilBuffer: false,
            generateMipmaps: true,
        };

        const renderTarget = new WebGLRenderTarget(textureWidth, textureHeight, parameters);
        this.renderTarget = renderTarget;

        if (!MathUtils.isPowerOfTwo(textureWidth) || !MathUtils.isPowerOfTwo(textureHeight)) {
            renderTarget.texture.generateMipmaps = false;
        }

        const mirrorShader = {
            uniforms: UniformsUtils.merge([
                UniformsLib.fog,
                // UniformsLib.lights,
                {
                    'uNormalSampler': { value: null },
                    'uMirrorSampler': { value: null },
                    'uTime': { value: 0.0 },
                    'uSize': { value: size },
                    'uDistortionScale': { value: 7.0 },
                    'uTextureMatrix': { value: new Matrix4() },
                    'uSunColor': { value: new Color(0x7F7F7F) },
                    'uSunDirection': { value: new Vector3(0.70707, 0.70707, 0) },
                    'uEye': { value: new Vector3() },
                    'uWaterColor': { value: new Color(0x555555) },
                    'uRoughnessStrength': { value: 0.37 },
                    'uSunShiny': { value: 326 },
                    'uSunSpecular': { value: 0.09 },
                    'uSunDiffuse': { value: 0 },
                    'uBrightness': { value: 0.002 },
                    'uGlowColor': { value: null },
                    'uGlowStrength': { value: 0 },
                    'uResolution': { value: new Vector2(textureWidth, textureHeight) },
                },
            ]),
            vertexShader,
            fragmentShader,
        };

        const material = new ShaderMaterial({
            fragmentShader: mirrorShader.fragmentShader,
            vertexShader: mirrorShader.vertexShader,
            uniforms: UniformsUtils.clone(mirrorShader.uniforms),
            lights: false,
            side,
            fog,
            extensions: {
                shaderTextureLOD: true,
            },
        });

        material.uniforms.uMirrorSampler.value = renderTarget.texture;
        material.uniforms.uTextureMatrix.value = textureMatrix;
        material.uniforms.uNormalSampler.value = normalSampler;
        material.uniforms.uSunColor.value = sunColor;
        material.uniforms.uWaterColor.value = uWaterColor;
        material.uniforms.uSunDirection.value = sunDirection;
        material.uniforms.uDistortionScale.value = distortionScale;
        material.uniforms.uGlowColor.value = glowColor;

        material.uniforms.uEye.value = eye;

        scope.material = material;

        // Fog
        scope.fog = fog;
        material.defines.DISTANCE = '';
        material.uniforms.fogTime = { value: 0 };

        this.bindHandlers();
        this.setupEventListeners();
        this.updateDefines(fog);
        this.updateUniforms(fog);

        scope.onBeforeRender = function(renderer, scene, camera) {
            // NOTE: Don't render bloom for water reflection
            if (this.userData.originalVisibilityState) {
                return;
            }

            mirrorWorldPosition.setFromMatrixPosition(scope.matrixWorld);
            cameraWorldPosition.setFromMatrixPosition(camera.matrixWorld);

            rotationMatrix.extractRotation(scope.matrixWorld);

            normal.set(0, 1, 0);
            normal.applyMatrix4(rotationMatrix);

            view.subVectors(mirrorWorldPosition, cameraWorldPosition);

            // Avoid rendering when mirror is facing away
            if (view.dot(normal) > 0) return;

            view.reflect(normal).negate();
            view.add(mirrorWorldPosition);

            rotationMatrix.extractRotation(camera.matrixWorld);

            lookAtPosition.set(0, 0, -1);
            lookAtPosition.applyMatrix4(rotationMatrix);
            lookAtPosition.add(cameraWorldPosition);

            target.subVectors(mirrorWorldPosition, lookAtPosition);
            target.reflect(normal).negate();
            target.add(mirrorWorldPosition);

            mirrorCamera.position.copy(view);
            mirrorCamera.up.set(0, 1, 0);
            mirrorCamera.up.applyMatrix4(rotationMatrix);
            mirrorCamera.up.reflect(normal);
            mirrorCamera.lookAt(target);

            mirrorCamera.far = camera.far; // Used in WebGLBackground

            mirrorCamera.updateMatrixWorld();
            mirrorCamera.projectionMatrix.copy(camera.projectionMatrix);

            // Update the texture matrix
            textureMatrix.set(
                0.5, 0.0, 0.0, 0.5,
                0.0, 0.5, 0.0, 0.5,
                0.0, 0.0, 0.5, 0.5,
                0.0, 0.0, 0.0, 1.0,
            );
            textureMatrix.multiply(mirrorCamera.projectionMatrix);
            textureMatrix.multiply(mirrorCamera.matrixWorldInverse);

            // Now update projection matrix with new clip plane, implementing code from: http://www.terathon.com/code/oblique.html
            // Paper explaining this technique: http://www.terathon.com/lengyel/Lengyel-Oblique.pdf
            mirrorPlane.setFromNormalAndCoplanarPoint(normal, mirrorWorldPosition);
            mirrorPlane.applyMatrix4(mirrorCamera.matrixWorldInverse);

            clipPlane.set(mirrorPlane.normal.x, mirrorPlane.normal.y, mirrorPlane.normal.z, mirrorPlane.constant);

            const projectionMatrix = mirrorCamera.projectionMatrix;

            q.x = (Math.sign(clipPlane.x) + projectionMatrix.elements[8]) / projectionMatrix.elements[0];
            q.y = (Math.sign(clipPlane.y) + projectionMatrix.elements[9]) / projectionMatrix.elements[5];
            q.z = -1.0;
            q.w = (1.0 + projectionMatrix.elements[10]) / projectionMatrix.elements[14];

            // Calculate the scaled plane vector
            clipPlane.multiplyScalar(2.0 / clipPlane.dot(q));

            // Replacing the third row of the projection matrix
            projectionMatrix.elements[2] = clipPlane.x;
            projectionMatrix.elements[6] = clipPlane.y;
            projectionMatrix.elements[10] = clipPlane.z + 1.0 - clipBias;
            projectionMatrix.elements[14] = clipPlane.w;

            eye.setFromMatrixPosition(camera.matrixWorld);

            // Render

            const currentRenderTarget = renderer.getRenderTarget();

            const currentXrEnabled = renderer.xr.enabled;
            const currentShadowAutoUpdate = renderer.shadowMap.autoUpdate;

            scope.visible = false;

            renderer.xr.enabled = false; // Avoid camera modification and recursion
            renderer.shadowMap.autoUpdate = false; // Avoid re-computing shadows

            renderer.setRenderTarget(renderTarget);

            renderer.state.buffers.depth.setMask(true); // make sure the depth buffer is writable so it can be properly cleared, see #18897

            scene.traverse((object) => {
                if (object.type === 'Mesh' || object.type === 'Points') {
                    if (object.material && object.material.fog) {
                        if (typeof object.material.disableFog === 'function') object.material.disableFog();
                    }

                    if (object.userData && object.visible && object.userData.renderReflection === false) {
                        object.visible = false;
                        object.userData.invisibleForReflection = true;
                    }
                }
            });

            if (renderer.autoClear === false) renderer.clear();
            renderer.render(scene, mirrorCamera);

            scene.traverse((object) => {
                if (object.type === 'Mesh' || object.type === 'Points') {
                    if (object.material && object.material.fog) {
                        if (typeof object.material.enableFog === 'function') object.material.enableFog();
                    }
                }

                if (object.userData && object.userData.invisibleForReflection) {
                    object.visible = true;
                    object.userData.invisibleForReflection = false;
                }
            });

            scope.visible = true;

            renderer.xr.enabled = currentXrEnabled;
            renderer.shadowMap.autoUpdate = currentShadowAutoUpdate;

            renderer.setRenderTarget(currentRenderTarget);

            // Restore viewport

            const viewport = camera.viewport;

            if (viewport !== undefined) {
                renderer.state.viewport(viewport);
            }
        };
    }

    destroy() {
        this.renderTarget.dispose();
        this.material.dispose();
        this.geometry.dispose();
    }

    bindHandlers() {
        this.fogChangeHandler = this.fogChangeHandler.bind(this);
    }

    setupEventListeners() {
        if (this.fog) this.fog.addEventListener('change', this.fogChangeHandler);
    }

    removeEventListeners() {
        if (this.fog) this.fog.removeEventListener('change', this.fogChangeHandler);
    }

    updateDefines(fog) {
        delete this.material.defines.USE_CUSTOM_FOG;
        delete this.material.defines.FOG_LINEAR;
        delete this.material.defines.FOG_EXP;
        delete this.material.defines.FOG_EXP2;
        delete this.material.defines.FOG_GROUND;
        delete this.material.defines.FOG_COMBINED;
        delete this.material.defines.FOG_ANIMATE;
        delete this.material.defines.FOG_USE_SUN;
        delete this.material.defines.DISTANCE;

        if (fog && fog.visible) {
            this.material.defines.USE_CUSTOM_FOG = '';
            this.material.defines.DISTANCE = '';

            switch (fog.type) {
                case TYPE_LINEAR:
                    this.material.defines.FOG_LINEAR = '';
                    break;
                case TYPE_EXP:
                    this.material.defines.FOG_EXP = '';
                    break;
                case TYPE_EXP2:
                    this.material.defines.FOG_EXP2 = '';
                    break;
                case TYPE_GROUND:
                    this.material.defines.FOG_GROUND = '';
                    break;
                case TYPE_COMBINED:
                    this.material.defines.FOG_COMBINED = '';
                    break;
            }

            if (fog.animation) {
                this.material.defines.FOG_ANIMATE = '';
            }

            if (fog.sun) {
                this.material.defines.FOG_USE_SUN = '';
            }
        }

        this.material.needsUpdate = true;
    };

    updateUniforms(fog) {
        this.material.uniforms.fogActive = { value: fog.visible };
        this.material.uniforms.fogColor = { value: fog.color };
        this.material.uniforms.fogDensity = { value: fog.density };
        this.material.uniforms.fogHeight = { value: fog.height };
        this.material.uniforms.fogGlobalStrength = { value: fog.globalStrength };
        this.material.uniforms.fogNear = { value: fog.near };
        this.material.uniforms.fogFar = { value: fog.far };

        if (fog.animation) {
            this.material.uniforms.fogAnimationScale = { value: fog.animationScale };
            this.material.uniforms.fogAnimationSpeed = { value: fog.animationSpeed };
            this.material.uniforms.fogAnimationDepth = { value: fog.animationDepth };
        }

        if (fog.sun) {
            this.material.uniforms.sunPosition = { value: fog.sun.position };
            this.material.uniforms.uSunColor = { value: fog.sun.color };
            this.material.uniforms.sunStrength = { value: fog.sun.strength };
        }
    }

    fogChangeHandler(fog) {
        this.updateDefines(fog);
        this.updateUniforms(fog);
    }
}

// RiverWater.prototype.isWater = true;

export { RiverWater };
