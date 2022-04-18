uniform float uTime;
uniform float uScale;
uniform float uProgress;
uniform sampler2D uTexture;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
varying float vNoise;

void main() {
  vec2 newUV = (vUv - vec2(.5)) * (1. - uScale) + vec2(.5);
  vec2 diff = .02 * vec2(cos(0.), sin(0.)) * uProgress;
  vec4 cr = texture2D(uTexture, newUV + diff);
  vec4 cga = texture2D(uTexture, newUV);
  vec4 cb = texture2D(uTexture, newUV - diff);

  vec4 color = vec4(cr.r, cga.g, cb.b, cga.a);
  gl_FragColor = color;
}
