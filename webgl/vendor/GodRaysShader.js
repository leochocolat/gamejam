// Vendor
import { Color, Vector2, Vector3 } from 'three';

// Shaders
import godraysDepthMaskVertexShader from '@/webgl/shaders/godrays-depth-mask/vertex.glsl';
import godraysDepthMaskFragmentShader from '@/webgl/shaders/godrays-depth-mask/fragment.glsl';
import godraysGenerateVertexShader from '@/webgl/shaders/godrays-generate/vertex.glsl';
import godraysGenerateFragmentShader from '@/webgl/shaders/godrays-generate/fragment.glsl';
import godraysCombineVertexShader from '@/webgl/shaders/godrays-combine/vertex.glsl';
import godraysCombineFragmentShader from '@/webgl/shaders/godrays-combine/fragment.glsl';

/**
 * God-rays (crepuscular rays)
 *
 * Similar implementation to the one used by Crytek for CryEngine 2 [Sousa2008].
 * Blurs a mask generated from the depth map along radial lines emanating from the light
 * source. The blur repeatedly applies a blur filter of increasing support but constant
 * sample count to produce a blur filter with large support.
 *
 * My implementation performs 3 passes, similar to the implementation from Sousa. I found
 * just 6 samples per pass produced acceptible results. The blur is applied three times,
 * with decreasing filter support. The result is equivalent to a single pass with
 * 6*6*6 = 216 samples.
 *
 * References:
 *
 * Sousa2008 - Crysis Next Gen Effects, GDC2008, http://www.crytek.com/sites/default/files/GDC08_SousaT_CrysisEffects.ppt
 */
const GodRaysDepthMaskShader = {
    uniforms: {
        tInput: {
            value: null,
        },
        uCameraNear: {
            value: null,
        },
        uCameraNearOffset: {
            value: null,
        },
        uCameraFar: {
            value: null,
        },
    },
    vertexShader: godraysDepthMaskVertexShader,
    fragmentShader: godraysDepthMaskFragmentShader,
};

/**
 * The god-ray generation shader.
 *
 * First pass:
 *
 * The depth map is blurred along radial lines towards the "sun". The
 * output is written to a temporary render target (I used a 1/4 sized
 * target).
 *
 * Pass two & three:
 *
 * The results of the previous pass are re-blurred, each time with a
 * decreased distance between samples.
 */
const GodRaysGenerateShader = {
    uniforms: {
        tInput: {
            value: null,
        },
        fStepSize: {
            value: 1.0,
        },
        vSunPositionScreenSpace: {
            value: new Vector3(),
        },
    },
    vertexShader: godraysGenerateVertexShader,
    fragmentShader: godraysGenerateFragmentShader,
};

/**
 * Additively applies god rays from texture tGodRays to a background (tColors).
 * fGodRayIntensity attenuates the god rays.
 */
const GodRaysCombineShader = {
    uniforms: {
        tColors: {
            value: null,
        },
        tGodRays: {
            value: null,
        },
        fGodRayIntensity: {
            value: 0.69,
        },
        uGodRayColor: {
            value: new Color(),
        },
        uResolution: {
            value: new Vector2(),
        },
    },
    vertexShader: godraysCombineVertexShader,
    fragmentShader: godraysCombineFragmentShader,
};

export { GodRaysDepthMaskShader, GodRaysGenerateShader, GodRaysCombineShader };
