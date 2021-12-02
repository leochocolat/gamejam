import {
    Color,
    LinearFilter,
    RawShaderMaterial,
    RGBAFormat,
    ShaderMaterial,
    UniformsUtils,
    Vector2,
    WebGLRenderTarget,
} from 'three';
import { Pass, FullScreenQuad } from '@/webgl/vendor/Pass.js';
import { CopyShader } from 'three/examples/jsm/shaders/CopyShader.js';
import { LuminosityHighPassShader } from 'three/examples/jsm/shaders/LuminosityHighPassShader.js';

/**
 * UnrealBloomPass is inspired by the bloom pass of Unreal Engine. It creates a
 * mip map chain of bloom textures and blurs them with different radii. Because
 * of the weighted combination of mips, and because larger blurs are done on
 * higher mips, this effect provides good quality and performance.
 *
 * Reference:
 * - https://docs.unrealengine.com/latest/INT/Engine/Rendering/PostProcessEffects/Bloom/
 */
class UnrealFogBloomPass extends Pass {
    constructor(renderer, resolution, strength, radius, threshold, resolutionScale) {
        super();

        this.renderer = renderer;
        this.strength = (strength !== undefined) ? strength : 1;
        this.radius = radius;
        this.threshold = threshold;
        this.resolution = (resolution !== undefined) ? new Vector2(resolution.x, resolution.y) : new Vector2(256, 256);
        this.resolutionScale = resolutionScale || 0.25;

        this.inputTexture = null;

        // create color only once here, reuse it later inside the render function
        this.clearColor = new Color(0, 0, 0);

        // render targets
        const pars = { minFilter: LinearFilter, magFilter: LinearFilter, format: RGBAFormat };
        this.renderTargetsHorizontal = [];
        this.renderTargetsVertical = [];
        this.nMips = 5;
        let resx = Math.round(this.resolution.x / 2);
        let resy = Math.round(this.resolution.y / 2);

        this.renderTargetBright = new WebGLRenderTarget(resx, resy, pars);
        this.renderTargetBright.texture.name = 'UnrealBloomPass.bright';
        this.renderTargetBright.texture.generateMipmaps = false;

        for (let i = 0; i < this.nMips; i++) {
            const renderTargetHorizonal = new WebGLRenderTarget(resx, resy, pars);

            renderTargetHorizonal.texture.name = 'UnrealBloomPass.h' + i;
            renderTargetHorizonal.texture.generateMipmaps = false;

            this.renderTargetsHorizontal.push(renderTargetHorizonal);

            const renderTargetVertical = new WebGLRenderTarget(resx, resy, pars);

            renderTargetVertical.texture.name = 'UnrealBloomPass.v' + i;
            renderTargetVertical.texture.generateMipmaps = false;

            this.renderTargetsVertical.push(renderTargetVertical);

            resx = Math.round(resx / 2);
            resy = Math.round(resy / 2);
        }

        // luminosity high pass material

        if (LuminosityHighPassShader === undefined) { console.error('THREE.UnrealBloomPass relies on LuminosityHighPassShader'); }

        const highPassShader = LuminosityHighPassShader;
        this.highPassUniforms = UniformsUtils.clone(highPassShader.uniforms);

        this.highPassUniforms.luminosityThreshold.value = threshold;
        this.highPassUniforms.smoothWidth.value = 0.01;

        this.materialHighPassFilter = new ShaderMaterial({
            uniforms: this.highPassUniforms,
            vertexShader: highPassShader.vertexShader,
            fragmentShader: highPassShader.fragmentShader,
            defines: {},
        });

        // Gaussian Blur Materials
        this.separableBlurMaterials = [];
        const kernelSizeArray = [3, 5, 7, 9, 11];
        resx = Math.round(this.resolution.x / 2);
        resy = Math.round(this.resolution.y / 2);

        for (let i = 0; i < this.nMips; i++) {
            this.separableBlurMaterials.push(this.getSeperableBlurMaterial(kernelSizeArray[i]));
            this.separableBlurMaterials[i].uniforms.texSize.value = new Vector2(resx, resy);
            resx = Math.round(resx / 2);
            resy = Math.round(resy / 2);
        }

        // Composite material
        this.compositeMaterial = this.getCompositeMaterial(this.nMips);
        this.compositeMaterial.uniforms.blurTexture1.value = this.renderTargetsVertical[0].texture;
        this.compositeMaterial.uniforms.blurTexture2.value = this.renderTargetsVertical[1].texture;
        this.compositeMaterial.uniforms.blurTexture3.value = this.renderTargetsVertical[2].texture;
        this.compositeMaterial.uniforms.blurTexture4.value = this.renderTargetsVertical[3].texture;
        this.compositeMaterial.uniforms.blurTexture5.value = this.renderTargetsVertical[4].texture;
        this.compositeMaterial.uniforms.bloomStrength.value = strength;
        this.compositeMaterial.uniforms.bloomRadius.value = 0.1;
        this.compositeMaterial.needsUpdate = true;

        const bloomFactors = [1.0, 0.8, 0.6, 0.4, 0.2];
        this.compositeMaterial.uniforms.bloomFactors.value = bloomFactors;

        this.enabled = true;
        this.needsSwap = false;

        this._oldClearColor = new Color();
        this.oldClearAlpha = 1;

        this.fsQuad = new FullScreenQuad(null);

        // Compile shaders
        for (let i = 0; i < this.nMips; i++) {
            this.fsQuad.material = this.separableBlurMaterials[i];
            this.fsQuad.compile(this.renderer);
        }
        this.fsQuad.material = this.compositeMaterial;
        this.fsQuad.compile(this.renderer);
    }

    dispose() {
        for (let i = 0; i < this.renderTargetsHorizontal.length; i++) {
            this.renderTargetsHorizontal[i].dispose();
        }

        for (let i = 0; i < this.renderTargetsVertical.length; i++) {
            this.renderTargetsVertical[i].dispose();
        }

        this.renderTargetBright.dispose();
    }

    setSize(width, height) {
        let resx = Math.round(width * this.resolutionScale);
        let resy = Math.round(height * this.resolutionScale);

        this.renderTargetBright.setSize(resx, resy);

        for (let i = 0; i < this.nMips; i++) {
            this.renderTargetsHorizontal[i].setSize(resx, resy);
            this.renderTargetsVertical[i].setSize(resx, resy);
            this.separableBlurMaterials[i].uniforms.texSize.value = new Vector2(resx, resy);

            resx = Math.round(resx / 2);
            resy = Math.round(resy / 2);
        }
    }

    render(renderer, writeBuffer, readBuffer, deltaTime, maskActive) {
        renderer.getClearColor(this._oldClearColor);
        this.oldClearAlpha = renderer.getClearAlpha();
        const oldAutoClear = renderer.autoClear;
        renderer.autoClear = false;

        // renderer.setClearColor(this.clearColor, 0);

        if (maskActive) renderer.state.buffers.stencil.setTest(false);

        // Blur All the mips progressively

        let inputRenderTarget = this.inputTexture;

        for (let i = 0; i < this.nMips; i++) {
            this.fsQuad.material = this.separableBlurMaterials[i];

            this.separableBlurMaterials[i].uniforms.colorTexture.value = inputRenderTarget.texture;
            this.separableBlurMaterials[i].uniforms.direction.value = UnrealFogBloomPass.BlurDirectionX;
            renderer.setRenderTarget(this.renderTargetsHorizontal[i]);
            // renderer.clear();
            this.fsQuad.render(renderer);

            this.separableBlurMaterials[i].uniforms.colorTexture.value = this.renderTargetsHorizontal[i].texture;
            this.separableBlurMaterials[i].uniforms.direction.value = UnrealFogBloomPass.BlurDirectionY;
            renderer.setRenderTarget(this.renderTargetsVertical[i]);
            // renderer.clear();
            this.fsQuad.render(renderer);

            inputRenderTarget = this.renderTargetsVertical[i];
        }

        // Composite All the mips

        this.fsQuad.material = this.compositeMaterial;
        this.compositeMaterial.uniforms.bloomStrength.value = this.strength;
        this.compositeMaterial.uniforms.bloomRadius.value = this.radius;

        renderer.setRenderTarget(this.renderTargetsHorizontal[0]);
        // renderer.clear();
        this.fsQuad.render(renderer);

        // if (maskActive) renderer.state.buffers.stencil.setTest(true);

        // Restore renderer settings

        renderer.setClearColor(this._oldClearColor, this.oldClearAlpha);
        renderer.autoClear = oldAutoClear;
    }

    getSeperableBlurMaterial(kernelRadius) {
        return new RawShaderMaterial({

            type: 'SeperableBlurMaterial',

            defines: {
                'KERNEL_RADIUS': kernelRadius,
                'SIGMA': kernelRadius,
            },

            uniforms: {
                'colorTexture': { value: null },
                'texSize': { value: new Vector2(0.5, 0.5) },
                'direction': { value: new Vector2(0.5, 0.5) },
            },

            vertexShader:
                `precision highp float;
                precision highp int;

                attribute vec3 position;
                attribute vec2 uv;

                uniform mat4 modelViewMatrix;
                uniform mat4 projectionMatrix;

                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
                }`,

            fragmentShader:
                `precision highp float;
                precision highp int;

                #include <common>
                varying vec2 vUv;
                uniform sampler2D colorTexture;
                uniform vec2 texSize;
                uniform vec2 direction;

                float gaussianPdf(in float x, in float sigma) {
                    return 0.39894 * exp( -0.5 * x * x/( sigma * sigma))/sigma;
                }
                void main() {
                    vec2 invSize = 1.0 / texSize;
                    float fSigma = float(SIGMA);
                    float weightSum = gaussianPdf(0.0, fSigma);
                    vec3 diffuseSum = texture2D( colorTexture, vUv).rgb * weightSum;
                    for( int i = 1; i < KERNEL_RADIUS; i ++ ) {
                        float x = float(i);
                        float w = gaussianPdf(x, fSigma);
                        vec2 uvOffset = direction * invSize * x;
                        vec3 sample1 = texture2D( colorTexture, vUv + uvOffset).rgb;
                        vec3 sample2 = texture2D( colorTexture, vUv - uvOffset).rgb;
                        diffuseSum += (sample1 + sample2) * w;
                        weightSum += 2.0 * w;
                    }
                    gl_FragColor = vec4(diffuseSum/weightSum, 1.0);
                }`,
        });
    }

    getCompositeMaterial(nMips) {
        return new RawShaderMaterial({

            defines: {
                'NUM_MIPS': nMips,
            },

            uniforms: {
                'blurTexture1': { value: null },
                'blurTexture2': { value: null },
                'blurTexture3': { value: null },
                'blurTexture4': { value: null },
                'blurTexture5': { value: null },
                'bloomStrength': { value: 1.0 },
                'bloomFactors': { value: null },
                'bloomRadius': { value: 0.0 },
            },

            vertexShader:
                `precision highp float;
                precision highp int;

                attribute vec3 position;
                attribute vec2 uv;

                uniform mat4 modelViewMatrix;
                uniform mat4 projectionMatrix;

                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
                }`,

            fragmentShader:
                `precision highp float;
                precision highp int;

                varying vec2 vUv;
                uniform sampler2D blurTexture1;
                uniform sampler2D blurTexture2;
                uniform sampler2D blurTexture3;
                uniform sampler2D blurTexture4;
                uniform sampler2D blurTexture5;
                uniform float bloomStrength;
                uniform float bloomRadius;
                uniform float bloomFactors[NUM_MIPS];

                float lerpBloomFactor(const in float factor) {
                    float mirrorFactor = 1.2 - factor;
                    return mix(factor, mirrorFactor, bloomRadius);
                }

                void main() {
                    gl_FragColor = bloomStrength * (
                        lerpBloomFactor(bloomFactors[0]) * texture2D(blurTexture1, vUv) +
                        lerpBloomFactor(bloomFactors[1]) * texture2D(blurTexture2, vUv) +
                        lerpBloomFactor(bloomFactors[2]) * texture2D(blurTexture3, vUv) +
                        lerpBloomFactor(bloomFactors[3]) * texture2D(blurTexture4, vUv) +
                        lerpBloomFactor(bloomFactors[4]) * texture2D(blurTexture5, vUv)
                    );
                }`,
        });
    }
}

UnrealFogBloomPass.BlurDirectionX = new Vector2(1.0, 0.0);
UnrealFogBloomPass.BlurDirectionY = new Vector2(0.0, 1.0);

export { UnrealFogBloomPass };
