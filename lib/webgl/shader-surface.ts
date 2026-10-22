import { prefersReducedMotion } from "@/lib/motion";

/**
 * Runs a shader program on a canvas and owns everything around it: compiling,
 * sizing, the frame loop, and pausing when the canvas (or whatever it shows through)
 * is off-screen, the tab is hidden, or the visitor prefers reduced motion.
 *
 * Programs receive `u_res` (canvas pixels) and `u_time` (seconds the surface has
 * been visible). Anything else is set by the caller in `onInit` and `onFrame`.
 * Without a `vertexSource` the program is a full-screen fragment shader.
 */

const FULLSCREEN_VERTEX_SHADER = `#version 300 es
void main() {
  vec2 corner = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  gl_Position = vec4(corner * 2.0 - 1.0, 0.0, 1.0);
}`;

/** Caps cost on high-DPI screens; the imagery is soft enough that upscaling is invisible. */
const MAX_PIXEL_RATIO = 1.5;

/** A composed moment of the animation that still reads as intentional when it never moves. */
const STILL_FRAME_SECONDS = 12;

type CanvasSize = { width: number; height: number };

export type ShaderSurface = {
  gl: WebGL2RenderingContext;
  uniform: (name: string) => WebGLUniformLocation | null;
  /** Draws a single frame now; needed when inputs change while motion is reduced. */
  redraw: () => void;
  dispose: () => void;
};

type ShaderSurfaceOptions = {
  fragmentSource: string;
  vertexSource?: string;
  vertexCount?: number;
  mode?: "triangles" | "points";
  /** Fraction of device pixels to render at. */
  resolutionScale?: number;
  /** Runs only while one of these is on screen; by default, the canvas itself. */
  visibleWith?: Element[];
  /** Runs once after the program is in use; set constant uniforms and GL state here. */
  onInit?: (surface: ShaderSurface) => void;
  onFrame?: (surface: ShaderSurface, elapsedSeconds: number, size: CanvasSize) => void;
};

function compile(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    // The page degrades to its CSS fallback, but a silent null would hide a real GLSL bug.
    console.error("Shader failed to compile:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function link(gl: WebGL2RenderingContext, vertexSource: string, fragmentSource: string) {
  const vertex = compile(gl, gl.VERTEX_SHADER, vertexSource);
  const fragment = compile(gl, gl.FRAGMENT_SHADER, fragmentSource);
  if (!vertex || !fragment) return null;

  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  // Shader objects are only needed until the program links.
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("Shader program failed to link:", gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }
  return program;
}

/**
 * Returns null when WebGL2 is unavailable or the shader fails to build, so the
 * CSS fallback the caller paints underneath the canvas becomes the finished picture.
 */
export function mountShaderSurface(
  canvas: HTMLCanvasElement,
  {
    fragmentSource,
    vertexSource = FULLSCREEN_VERTEX_SHADER,
    vertexCount = 3,
    mode = "triangles",
    resolutionScale = 0.65,
    visibleWith = [canvas],
    onInit,
    onFrame,
  }: ShaderSurfaceOptions,
): ShaderSurface | null {
  const gl = canvas.getContext("webgl2", {
    alpha: false,
    antialias: false,
    depth: false,
    powerPreference: "low-power",
  });
  if (!gl) return null;

  const program = link(gl, vertexSource, fragmentSource);
  if (!program) return null;
  gl.useProgram(program);

  const uniform = (name: string) => gl.getUniformLocation(program, name);
  const uRes = uniform("u_res");
  const uTime = uniform("u_time");
  const primitive = mode === "points" ? gl.POINTS : gl.TRIANGLES;

  const size: CanvasSize = { width: 1, height: 1 };
  let elapsed = prefersReducedMotion() ? STILL_FRAME_SECONDS : 0;
  let lastTick = performance.now();
  let frame = 0;
  let running = false;

  const draw = () => {
    gl.uniform1f(uTime, elapsed);
    onFrame?.(surface, elapsed, size);
    gl.drawArrays(primitive, 0, vertexCount);
  };

  const tick = (now: number) => {
    // Accumulating only while running means a pause never makes the picture jump.
    elapsed += (now - lastTick) / 1000;
    lastTick = now;
    draw();
    if (running) frame = requestAnimationFrame(tick);
  };

  const stop = () => {
    running = false;
    cancelAnimationFrame(frame);
  };

  const play = () => {
    if (running || prefersReducedMotion()) return;
    running = true;
    lastTick = performance.now();
    frame = requestAnimationFrame(tick);
  };

  const resize = () => {
    const ratio = Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO) * resolutionScale;
    size.width = Math.max(1, Math.floor(canvas.clientWidth * ratio));
    size.height = Math.max(1, Math.floor(canvas.clientHeight * ratio));
    canvas.width = size.width;
    canvas.height = size.height;
    gl.viewport(0, 0, size.width, size.height);
    gl.uniform2f(uRes, size.width, size.height);
    // Resizing wipes the drawing buffer, and an opaque canvas shows that as black until the next
    // frame; drawing at once means a resize never flashes, animated or not.
    draw();
  };

  // Rendering a canvas nobody can see is pure battery drain.
  const onScreen = new Set<Element>();
  const visibility = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) onScreen.add(entry.target);
      else onScreen.delete(entry.target);
    }
    if (onScreen.size) play();
    else stop();
  });
  const resizeObserver = new ResizeObserver(resize);
  const onVisibilityChange = () => (document.hidden || !onScreen.size ? stop() : play());

  // Deliberately does not lose the context: a canvas keeps one context for life, and
  // React Strict Mode remounts would otherwise be handed back a permanently dead one.
  const dispose = () => {
    stop();
    visibility.disconnect();
    resizeObserver.disconnect();
    document.removeEventListener("visibilitychange", onVisibilityChange);
    gl.deleteProgram(program);
  };

  const surface: ShaderSurface = { gl, uniform, redraw: draw, dispose };

  onInit?.(surface);
  resize();
  visibleWith.forEach((target) => visibility.observe(target));
  resizeObserver.observe(canvas);
  document.addEventListener("visibilitychange", onVisibilityChange);

  return surface;
}
