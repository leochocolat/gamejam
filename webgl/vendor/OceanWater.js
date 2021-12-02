// Vendor
import { Color, DepthTexture, FrontSide, LinearEncoding, LinearFilter, MathUtils, Matrix4, Mesh, NearestFilter, NoToneMapping, PerspectiveCamera, Plane, RGBAFormat, RGBFormat, ShaderMaterial, UniformsLib, UniformsUtils, Vector3, Vector4, WebGLRenderTarget } from 'three';

// Modules
import { TYPE_LINEAR, TYPE_EXP, TYPE_EXP2, TYPE_GROUND, TYPE_COMBINED } from '@/webgl/modules/Fog';

// Shaders
import vertexShader from '@/webgl/shaders/ocean/vertex.glsl';
import fragmentShader from '@/webgl/shaders/ocean/fragment.glsl';

/**
 * Work based on :
 * http://slayvin.net : Flat mirror for three.js
 * http://www.adelphi.edu/~stemkoski : An implementation of water shader based on the flat mirror
 * http://29a.ch/ && http://29a.ch/slides/2012/webglwater/ : Water shader explanations in WebGL
 */

class OceanWater extends Mesh {
    constructor(geometry, options) {
        super(geometry, options);

        const scope = this;

        options = options || {};

        const renderer = options.renderer;

        const textureWidth = options.textureWidth !== undefined ? options.textureWidth : 512;
        const textureHeight = options.textureHeight !== undefined ? options.textureHeight : 512;

        const clipBias = options.clipBias !== undefined ? options.clipBias : 0.0;
        const alpha = options.alpha !== undefined ? options.alpha : 1.0;
        const time = options.time !== undefined ? options.time : 0.0;
        const normalSampler = options.waterNormals !== undefined ? options.waterNormals : null;
        const waterMaskSampler = options.waterMask !== undefined ? options.waterMask : null;
        const sunDirection = options.sunDirection !== undefined ? options.sunDirection : new Vector3(0.70707, 0.70707, 0.0);
        const sunColor = new Color(options.sunColor !== undefined ? options.sunColor : 0xffffff);
        const waterColor = new Color(options.waterColor !== undefined ? options.waterColor : 0x7F7F7F);
        const eye = options.eye !== undefined ? options.eye : new Vector3(0, 0, 0);
        const distortionScale = options.distortionScale !== undefined ? options.distortionScale : 20.0;
        const side = options.side !== undefined ? options.side : FrontSide;
        const fog = options.fog !== undefined ? options.fog : false;
        const sunShiny = options.sunShiny !== undefined ? options.sunShiny : false;
        const sunSpec = options.sunSpec !== undefined ? options.sunSpec : false;
        const sunDiffuse = options.sunDiffuse !== undefined ? options.sunDiffuse : false;
        const waterDepthTransitionSize = options.waterDepthTransitionSize !== undefined ? options.waterDepthTransitionSize : false;
        const waterDepthColor = options.waterDepthColor !== undefined ? options.waterDepthColor : new Vector3(0, 0, 0);
        const waterDepthMax = options.waterDepthMax !== undefined ? options.waterDepthMax : false;
        const waterMaskColor = options.waterMaskColor !== undefined ? options.waterMaskColor : new Vector3(0, 0, 0);
        const waterMaskSize = options.waterMaskSize !== undefined ? options.waterMaskSize : false;
        const waterMaskStrength = options.waterMaskStrength !== undefined ? options.waterMaskStrength : false;
        const reflectanceRf0 = options.reflectanceRf0 !== undefined ? options.reflectanceRf0 : false;
        const surfaceNormalModifier = options.surfaceNormalModifier !== undefined ? options.surfaceNormalModifier : false;
        const waterDepthStrength = options.waterDepthStrength !== undefined ? options.waterDepthStrength : 1;
        const foamColor = options.foamColor !== undefined ? options.foamColor : null;
        const foamStrength = options.foamStrength !== undefined ? options.foamStrength : null;
        const foamFalloff = options.foamFalloff !== undefined ? options.foamFalloff : null;
        const outputEncoding = options.outputEncoding !== undefined ? options.outputEncoding : null;

        //

        const mirrorPlane = new Plane();
        const refractionPlane = new Plane();
        const normal = new Vector3();
        const mirrorWorldPosition = new Vector3();
        const cameraWorldPosition = new Vector3();
        const rotationMatrix = new Matrix4();
        const lookAtPosition = new Vector3(0, 0, -1);
        const clipPlane = new Vector4();
        const refractionClipPlane = new Vector4();

        const view = new Vector3();
        const target = new Vector3();
        const q = new Vector4();

        const textureMatrix = new Matrix4();

        const mirrorCamera = new PerspectiveCamera();
        const refractionCamera = new PerspectiveCamera();

        const parameters = {
            minFilter: LinearFilter,
            magFilter: LinearFilter,
            format: RGBFormat,
            encoding: outputEncoding,
        };

        const reflectionRenderTarget = new WebGLRenderTarget(textureWidth, textureHeight, parameters);
        scope.reflectionRenderTarget = reflectionRenderTarget;

        const refractionParameters = {
            minFilter: NearestFilter,
            magFilter: NearestFilter,
            format: RGBFormat,
            encoding: outputEncoding,
        };

        // const refractionRenderTarget = new WebGLRenderTarget(textureWidth, textureHeight, refractionParameters);
        const refractionRenderTarget = new WebGLRenderTarget(0, 0, refractionParameters);
        refractionRenderTarget.depthBuffer = true;
        refractionRenderTarget.depthTexture = new DepthTexture();

        scope.refractionRenderTarget = refractionRenderTarget;

        if (!MathUtils.isPowerOfTwo(textureWidth) || !MathUtils.isPowerOfTwo(textureHeight)) {
            reflectionRenderTarget.texture.generateMipmaps = false;
            refractionRenderTarget.texture.generateMipmaps = false;
        }

        const mirrorShader = {
            uniforms: UniformsUtils.merge([
                UniformsLib.fog,
                // UniformsLib.lights,
                {
                    'normalSampler': { value: null },
                    'waterMaskSampler': { value: null },
                    'mirrorSampler': { value: null },
                    'refractionSampler': { value: null },
                    'depthSampler': { value: null },
                    'alpha': { value: 1.0 },
                    'time': { value: 0.0 },
                    'size': { value: 1.0 },
                    'distortionScale': { value: 20.0 },
                    'textureMatrix': { value: new Matrix4() },
                    'sunColor': { value: new Color(0x7F7F7F) },
                    'sunDirection': { value: new Vector3(0.70707, 0.70707, 0) },
                    'eye': { value: new Vector3() },
                    'waterColor': { value: new Color(0x555555) },
                    'sunShiny': { value: sunShiny },
                    'sunSpec': { value: sunSpec },
                    'sunDiffuse': { value: sunDiffuse },
                    'waterDepthTransitionSize': { value: waterDepthTransitionSize },
                    'waterDepthColor': { value: waterDepthColor },
                    'waterDepthMax': { value: waterDepthMax },
                    'waterDepthStrength': { value: waterDepthStrength },
                    'cameraNear': { value: 0 },
                    'cameraFar': { value: 0 },
                    'waterMaskColor': { value: waterMaskColor },
                    'waterMaskSize': { value: waterMaskSize },
                    'waterMaskStrength': { value: waterMaskStrength },
                    'reflectanceRf0': { value: reflectanceRf0 },
                    'surfaceNormalModifier': { value: surfaceNormalModifier },
                    'foamColor': { value: foamColor },
                    'foamStrength': { value: foamStrength },
                    'foamFalloff': { value: foamFalloff },
                },
            ]),
            vertexShader,
            fragmentShader,
        };

        const material = new ShaderMaterial({
            fragmentShader: mirrorShader.fragmentShader,
            vertexShader: mirrorShader.vertexShader,
            uniforms: UniformsUtils.clone(mirrorShader.uniforms),
            transparent: false,
            // lights: false,
            side,
            // fog: fog,
        });
        material.type = 'OceanWaterMaterial';
        material.depthWrite = true;
        material.depthTest = true;
        // material.extensions = {
        //     derivatives: true,
        // };

        material.uniforms.mirrorSampler.value = reflectionRenderTarget.texture;
        material.uniforms.refractionSampler.value = refractionRenderTarget.texture;
        material.uniforms.textureMatrix.value = textureMatrix;
        material.uniforms.alpha.value = alpha;
        material.uniforms.time.value = time;
        material.uniforms.normalSampler.value = normalSampler;
        material.uniforms.waterMaskSampler.value = waterMaskSampler;
        material.uniforms.sunColor.value = sunColor;
        material.uniforms.waterColor.value = waterColor;
        material.uniforms.sunDirection.value = sunDirection;
        material.uniforms.distortionScale.value = distortionScale;
        material.uniforms.waterDepthTransitionSize.value = waterDepthTransitionSize;
        material.uniforms.waterDepthColor.value = waterDepthColor;
        material.uniforms.waterDepthMax.value = waterDepthMax;
        material.uniforms.waterDepthStrength.value = waterDepthStrength;

        material.uniforms.eye.value = eye;

        scope.material = material;
        scope.clipBias = clipBias;

        // Fog
        scope.fog = fog;
        material.defines.DISTANCE = '';
        material.uniforms.fogTime = { value: 0 };
        this.bindHandlers();
        this.setupEventListeners();
        this.updateDefines(fog);
        this.updateUniforms(fog);

        scope.onBeforeRender = function(renderer, scene, camera) {
            mirrorWorldPosition.setFromMatrixPosition(scope.matrixWorld);
            cameraWorldPosition.setFromMatrixPosition(camera.matrixWorld);

            rotationMatrix.extractRotation(scope.matrixWorld);

            normal.set(0, 0, 1);
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
            projectionMatrix.elements[10] = clipPlane.z + 1.0 - scope.clipBias;
            projectionMatrix.elements[14] = clipPlane.w;

            eye.setFromMatrixPosition(camera.matrixWorld);

            // // Refraction camera
            // refractionCamera.copy(camera);

            // // Now update projection matrix with new clip plane, implementing code from: http://www.terathon.com/code/oblique.html
            // // Paper explaining this technique: http://www.terathon.com/lengyel/Lengyel-Oblique.pdf
            // refractionPlane.setFromNormalAndCoplanarPoint(normal, mirrorWorldPosition);
            // refractionPlane.applyMatrix4(mirrorCamera.matrixWorldInverse);

            // refractionClipPlane.set(refractionPlane.normal.x, refractionPlane.normal.y, refractionPlane.normal.z, refractionPlane.constant);

            // const refractionPojectionMatrix = refractionCamera.projectionMatrix;

            // q.x = (Math.sign(refractionClipPlane.x) + refractionPojectionMatrix.elements[8]) / refractionPojectionMatrix.elements[0];
            // q.y = (Math.sign(refractionClipPlane.y) + refractionPojectionMatrix.elements[9]) / refractionPojectionMatrix.elements[5];
            // q.z = -1.0;
            // q.w = (1.0 + refractionPojectionMatrix.elements[10]) / refractionPojectionMatrix.elements[14];

            // // Calculate the scaled plane vector
            // refractionClipPlane.multiplyScalar(2.0 / refractionClipPlane.dot(q));

            // // Replacing the third row of the projection matrix
            // refractionPojectionMatrix.elements[2] = refractionClipPlane.x;
            // refractionPojectionMatrix.elements[6] = refractionClipPlane.y;
            // refractionPojectionMatrix.elements[10] = refractionClipPlane.z + 1.0 - scope.clipBias;
            // refractionPojectionMatrix.elements[14] = refractionClipPlane.w;

            scope.material.uniforms.cameraNear.value = camera.near;
            scope.material.uniforms.cameraFar.value = camera.far;

            // Render
            // if (renderer.outputEncoding !== LinearEncoding) {
            //     console.warn('THREE.Water: WebGLRenderer must use LinearEncoding as outputEncoding.');
            //     scope.onBeforeRender = function() {};

            //     return;
            // }

            // if (renderer.toneMapping !== NoToneMapping) {
            //     console.warn('THREE.Water: WebGLRenderer must use NoToneMapping as toneMapping.');
            //     scope.onBeforeRender = function() {};

            //     return;
            // }

            const currentRenderTarget = renderer.getRenderTarget();

            const currentXrEnabled = renderer.xr.enabled;
            const currentShadowAutoUpdate = renderer.shadowMap.autoUpdate;

            scope.visible = false;

            renderer.xr.enabled = false; // Avoid camera modification and recursion
            renderer.shadowMap.autoUpdate = false; // Avoid re-computing shadows

            renderer.setRenderTarget(reflectionRenderTarget);

            renderer.state.buffers.depth.setMask(true); // make sure the depth buffer is writable so it can be properly cleared, see #18897

            if (renderer.autoClear === false) renderer.clear();

            scene.traverse((object) => {
                if (object.type === 'Mesh' || object.type === 'SkinnedMesh') {
                    if (object.material && object.material.fog) {
                        if (typeof object.material.disableFog === 'function') object.material.disableFog();
                    }

                    if (object.userData && object.userData.renderReflection) {
                        // object.visible = true;
                    } else if (object.visible) {
                        object.visible = false;
                        object.userData.invisibleForReflection = true;
                    }
                }
            });

            renderer.render(scene, mirrorCamera);

            scene.traverse((object) => {
                if (object.material && object.material.fog) {
                    if (typeof object.material.enableFog === 'function') object.material.enableFog();
                }

                if (object.userData) {
                    if (object.userData.invisibleForReflection) {
                        object.visible = true;
                        object.userData.invisibleForReflection = false;
                    }
                }
            });

            // Refraction
            const currentClearAlpha = renderer.getClearAlpha();
            renderer.setRenderTarget(refractionRenderTarget);
            renderer.setClearAlpha(0);
            if (renderer.autoClear === false) renderer.clear();

            scene.traverse((object) => {
                if (object.type === 'Mesh' || object.type === 'SkinnedMesh') {
                    if (object.userData && object.userData.renderRefraction) {
                        object.userData.originalVisibilityState = object.visible;
                        object.visible = true;
                    } else if (object.visible) {
                        object.visible = false;
                        object.userData.invisibleForRefraction = true;
                    }
                }
            });

            renderer.render(scene, camera);

            scope.material.uniforms.depthSampler.value = refractionRenderTarget.depthTexture;

            scene.traverse((object) => {
                if (object.userData) {
                    if (object.userData.renderRefraction) {
                        object.visible = object.userData.originalVisibilityState;
                    }

                    if (object.userData.invisibleForRefraction) {
                        object.visible = true;
                        object.userData.invisibleForRefraction = false;
                    }
                }
            });

            renderer.setClearAlpha(currentClearAlpha);

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
        this.reflectionRenderTarget.dispose();
        this.refractionRenderTarget.dispose();
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
            this.material.uniforms.sunColor = { value: fog.sun.color };
            this.material.uniforms.sunStrength = { value: fog.sun.strength };
        }
    }

    fogChangeHandler(fog) {
        this.updateDefines(fog);
        this.updateUniforms(fog);
    }

    /**
     * Resize
     */
    resize({ width, height, renderScale }) {
        const renderWidth = width * renderScale;
        const renderHeight = height * renderScale;
        this.refractionRenderTarget.setSize(renderWidth, renderHeight);
    }
};

export { OceanWater };
