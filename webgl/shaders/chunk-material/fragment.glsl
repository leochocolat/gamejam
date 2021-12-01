// Varyings
varying vec2 vUv;
varying vec3 vNormal;

// Uniforms
uniform vec3 color;

void main() {
	float mono = (vNormal.x + vNormal.y + vNormal.z) / 3.0;
	gl_FragColor = vec4(mono * color, 1.0);
}