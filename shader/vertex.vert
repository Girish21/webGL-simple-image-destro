uniform float uTime;
uniform vec2 uMouse;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vMouse;
varying float vNoise;

void main() {
  vec3 newPosition = position;

  vec4 mvPosition = modelViewMatrix * vec4(newPosition, 1.);
  gl_Position = projectionMatrix * mvPosition;

  vUv = uv;
  vPosition = newPosition;
  vPosition = normal;
}
