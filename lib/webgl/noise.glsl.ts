/**
 * Value noise and a four-octave fbm, shared by every shader on the site so the
 * surfaces visibly come from the same hand.
 *
 * The hash avoids sin(): on large inputs sin loses precision unevenly, and the
 * lattice corners stop agreeing across cells, which shows as hard-edged tiles.
 * Taking fract() first keeps every intermediate small.
 */
export const NOISE_GLSL = `
float hash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float sum = 0.0;
  float amp = 0.5;
  for (int i = 0; i < 4; i++) {
    sum += amp * noise(p);
    p *= 2.02;
    amp *= 0.5;
  }
  return sum;
}
`;
