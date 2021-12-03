// Varyings
varying vec2 vUv;
varying vec3 vNormal;

// Uniforms
uniform vec2 resolution;

void main() {
    vUv = uv;
    vNormal = normal;

    vec4 pos = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    pos.xyz /= pos.w;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}