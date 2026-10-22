"use client";

import { useEffect, useRef } from "react";

import { readBrandColor, watchBrandColors } from "@/lib/brand-color";
import { NOISE_GLSL } from "@/lib/webgl/noise.glsl";
import { mountShaderSurface, type ShaderSurface } from "@/lib/webgl/shader-surface";

const FRAGMENT_SHADER = `#version 300 es
precision highp float;

uniform vec2  u_res;
uniform float u_time;
uniform float u_scroll;
uniform vec2  u_pointer;
uniform float u_pointer_strength;
uniform vec3  u_bg;
uniform vec3  u_wash;
uniform vec3  u_glow;
uniform float u_glow_mix;
uniform float u_vignette;

out vec4 fragColor;
${NOISE_GLSL}
void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_res) / u_res.y;
  float t = u_time * 0.02;

  // Two shades of paper folding slowly into each other, carried up a little behind the content.
  vec2 p = uv * 0.9 - vec2(0.0, u_scroll * 0.25) + vec2(t, t * 0.5);
  float wash = fbm(p + 0.8 * fbm(p * 1.3 - t));
  vec3 color = mix(u_bg, u_wash, smoothstep(0.35, 0.75, wash) * 0.7);

  // One warm light in the top corner: the window by day, the lamp by night.
  vec2 lightAt = vec2(-0.55 * u_res.x / u_res.y, 0.6);
  float light = exp(-dot(uv - lightAt, uv - lightAt) * 1.1);
  color = mix(color, u_glow, light * u_glow_mix);

  // A faint warmth where the pointer rests, fading once it stops moving.
  vec2 pointer = (u_pointer * u_res - 0.5 * u_res) / u_res.y;
  color = mix(color, u_glow, exp(-dot(uv - pointer, uv - pointer) * 6.0) * 0.06 * u_pointer_strength);

  // Corners settle into shadow at night, so the room feels lit from inside.
  float edge = smoothstep(0.6, 1.4, length(uv * vec2(0.85, 1.0)));
  color *= 1.0 - edge * u_vignette;

  color += (hash(gl_FragCoord.xy) - 0.5) * 0.01;
  fragColor = vec4(color, 1.0);
}`;

/** Per-frame decay of the pointer's warmth once it stops moving. */
const POINTER_DECAY = 0.96;

/** How strongly the corner light shows, and how deep the corners go, in each theme. */
const LIGHTING = {
  light: { glowMix: 0.22, vignette: 0 },
  dark: { glowMix: 0.14, vignette: 0.35 },
};

/**
 * The room behind the whole site: a slow, quiet wash of paper with one warm light in the
 * corner, and a faint warmth that follows the pointer. Kept deliberately calm so the
 * scenes in front of it do the moving. The wrapper paints a matching gradient for
 * browsers without WebGL2.
 */
export function RoomLight() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const pointer = { x: 0.5, y: 0.5, strength: 0 };
    let scrollScreens = 0;
    let uScroll: WebGLUniformLocation | null = null;
    let uPointer: WebGLUniformLocation | null = null;
    let uPointerStrength: WebGLUniformLocation | null = null;

    const applyBrandColors = ({ gl, uniform }: ShaderSurface) => {
      const lighting = document.documentElement.classList.contains("dark") ? LIGHTING.dark : LIGHTING.light;
      gl.uniform3fv(uniform("u_bg"), readBrandColor("bg"));
      gl.uniform3fv(uniform("u_wash"), readBrandColor("bg-2"));
      gl.uniform3fv(uniform("u_glow"), readBrandColor("glow"));
      gl.uniform1f(uniform("u_glow_mix"), lighting.glowMix);
      gl.uniform1f(uniform("u_vignette"), lighting.vignette);
    };

    const rooms = [...document.querySelectorAll("[data-shows-room]")];
    const surface = mountShaderSurface(canvas, {
      fragmentSource: FRAGMENT_SHADER,
      resolutionScale: 0.5,
      // Every other scene is opaque and hides the room completely, so it only needs to move behind these.
      visibleWith: rooms.length ? rooms : undefined,
      onInit: applyBrandColors,
      onFrame: ({ gl, uniform }) => {
        uScroll ??= uniform("u_scroll");
        uPointer ??= uniform("u_pointer");
        uPointerStrength ??= uniform("u_pointer_strength");
        pointer.strength *= POINTER_DECAY;
        gl.uniform1f(uScroll, scrollScreens);
        gl.uniform2f(uPointer, pointer.x, pointer.y);
        gl.uniform1f(uPointerStrength, pointer.strength);
      },
    });
    if (!surface) return;

    const onScroll = () => {
      scrollScreens = window.scrollY / window.innerHeight;
    };
    // The shader's y axis runs upward, so the pointer's screen y is flipped.
    const onPointerMove = (event: PointerEvent) => {
      pointer.x = event.clientX / window.innerWidth;
      pointer.y = 1 - event.clientY / window.innerHeight;
      pointer.strength = 1;
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    const unwatchBrandColors = watchBrandColors(() => {
      applyBrandColors(surface);
      surface.redraw();
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointerMove);
      unwatchBrandColors();
      surface.dispose();
    };
  }, []);

  return (
    <div aria-hidden="true" className="room-light pointer-events-none fixed inset-0 -z-10">
      <canvas ref={canvasRef} className="absolute inset-0 size-full" />
    </div>
  );
}
