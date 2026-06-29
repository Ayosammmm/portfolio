import { useRef, useEffect } from "react";
import "./Dither.css";

const vertSrc = `#version 300 es
in vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const fragSrc = `#version 300 es
precision highp float;

uniform vec2  u_resolution;
uniform float u_time;
uniform float u_waveSpeed;
uniform float u_waveFrequency;
uniform float u_waveAmplitude;
uniform vec3  u_waveColor;
uniform float u_colorNum;
uniform float u_pixelSize;
uniform vec2  u_mousePos;
uniform int   u_enableMouse;
uniform float u_mouseRadius;

out vec4 fragColor;

// --- Perlin noise helpers ---
vec4 mod289(vec4 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
vec2 fade(vec2 t) { return t*t*t*(t*(t*6.0-15.0)+10.0); }

float cnoise(vec2 P) {
  vec4 Pi = floor(P.xyxy) + vec4(0.0,0.0,1.0,1.0);
  vec4 Pf = fract(P.xyxy) - vec4(0.0,0.0,1.0,1.0);
  Pi = mod289(Pi);
  vec4 ix = Pi.xzxz, iy = Pi.yyww;
  vec4 fx = Pf.xzxz, fy = Pf.yyww;
  vec4 i = permute(permute(ix) + iy);
  vec4 gx = fract(i * (1.0/41.0)) * 2.0 - 1.0;
  vec4 gy = abs(gx) - 0.5;
  gx -= floor(gx + 0.5);
  vec2 g00 = vec2(gx.x, gy.x), g10 = vec2(gx.y, gy.y);
  vec2 g01 = vec2(gx.z, gy.z), g11 = vec2(gx.w, gy.w);
  vec4 norm = taylorInvSqrt(vec4(dot(g00,g00),dot(g01,g01),dot(g10,g10),dot(g11,g11)));
  g00 *= norm.x; g01 *= norm.y; g10 *= norm.z; g11 *= norm.w;
  float n00 = dot(g00, vec2(fx.x, fy.x));
  float n10 = dot(g10, vec2(fx.y, fy.y));
  float n01 = dot(g01, vec2(fx.z, fy.z));
  float n11 = dot(g11, vec2(fx.w, fy.w));
  vec2 fade_xy = fade(Pf.xy);
  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
  return 2.3 * mix(n_x.x, n_x.y, fade_xy.y);
}

float fbm(vec2 p) {
  float value = 0.0, amp = 1.0, freq = u_waveFrequency;
  for (int i = 0; i < 8; i++) {
    value += amp * abs(cnoise(p));
    p *= freq;
    amp *= u_waveAmplitude;
  }
  return value;
}

float pattern(vec2 p) {
  vec2 p2 = p - u_time * u_waveSpeed;
  return fbm(p - fbm(p + fbm(p2)));
}

// --- Bayer 8x8 dithering ---
const float BAYER[64] = float[64](
   0.0, 48.0, 12.0, 60.0,  3.0, 51.0, 15.0, 63.0,
  32.0, 16.0, 44.0, 28.0, 35.0, 19.0, 47.0, 31.0,
   8.0, 56.0,  4.0, 52.0, 11.0, 59.0,  7.0, 55.0,
  40.0, 24.0, 36.0, 20.0, 43.0, 27.0, 39.0, 23.0,
   2.0, 50.0, 14.0, 62.0,  1.0, 49.0, 13.0, 61.0,
  34.0, 18.0, 46.0, 30.0, 33.0, 17.0, 45.0, 29.0,
  10.0, 58.0,  6.0, 54.0,  9.0, 57.0,  5.0, 53.0,
  42.0, 26.0, 38.0, 22.0, 41.0, 25.0, 37.0, 21.0
);

vec3 dither(vec2 coord, vec3 color) {
  int x = int(mod(coord.x, 8.0));
  int y = int(mod(coord.y, 8.0));
  float threshold = BAYER[y * 8 + x] / 64.0 - 0.25;
  float step = 1.0 / (u_colorNum - 1.0);
  color += threshold * step;
  color = clamp(color - 0.2, 0.0, 1.0);
  return floor(color * (u_colorNum - 1.0) + 0.5) / (u_colorNum - 1.0);
}

void main() {
  // Snap to pixel grid (pixelation)
  vec2 snapped = floor(gl_FragCoord.xy / u_pixelSize) * u_pixelSize;
  vec2 uv = snapped / u_resolution - 0.5;
  uv.x *= u_resolution.x / u_resolution.y;

  float f = pattern(uv);

  if (u_enableMouse == 1) {
    vec2 m = (u_mousePos / u_resolution - 0.5) * vec2(1.0, -1.0);
    m.x *= u_resolution.x / u_resolution.y;
    float dist = length(uv - m);
    f -= 0.5 * (1.0 - smoothstep(0.0, u_mouseRadius, dist));
  }

  vec3 col = mix(vec3(0.0), u_waveColor, f);
  col = dither(floor(gl_FragCoord.xy / u_pixelSize), col);

  fragColor = vec4(col, 1.0);
}
`;

export default function Dither({
  waveSpeed = 0.05,
  waveFrequency = 3,
  waveAmplitude = 0.3,
  waveColor = [0.5, 0.5, 0.5],
  colorNum = 4,
  pixelSize = 2,
  disableAnimation = false,
  enableMouseInteraction = true,
  mouseRadius = 1,
}) {
  const canvasRef = useRef(null);
  const propsRef = useRef({});
  propsRef.current = { waveSpeed, waveFrequency, waveAmplitude, waveColor, colorNum, pixelSize, disableAnimation, enableMouseInteraction, mouseRadius };

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas.getContext("webgl2");
    if (!gl) { console.error("Dither: WebGL2 not supported"); return; }

    function compileShader(type, src) {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error("Shader compile error:", gl.getShaderInfoLog(s));
        gl.deleteShader(s);
        return null;
      }
      return s;
    }

    const vert = compileShader(gl.VERTEX_SHADER, vertSrc);
    const frag = compileShader(gl.FRAGMENT_SHADER, fragSrc);
    if (!vert || !frag) return;

    const prog = gl.createProgram();
    gl.attachShader(prog, vert);
    gl.attachShader(prog, frag);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error("Dither: program link error:", gl.getProgramInfoLog(prog));
      return;
    }
    gl.useProgram(prog);

    // Full-screen triangle strip
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const posLoc = gl.getAttribLocation(prog, "a_position");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const U = {
      resolution:    gl.getUniformLocation(prog, "u_resolution"),
      time:          gl.getUniformLocation(prog, "u_time"),
      waveSpeed:     gl.getUniformLocation(prog, "u_waveSpeed"),
      waveFrequency: gl.getUniformLocation(prog, "u_waveFrequency"),
      waveAmplitude: gl.getUniformLocation(prog, "u_waveAmplitude"),
      waveColor:     gl.getUniformLocation(prog, "u_waveColor"),
      colorNum:      gl.getUniformLocation(prog, "u_colorNum"),
      pixelSize:     gl.getUniformLocation(prog, "u_pixelSize"),
      mousePos:      gl.getUniformLocation(prog, "u_mousePos"),
      enableMouse:   gl.getUniformLocation(prog, "u_enableMouse"),
      mouseRadius:   gl.getUniformLocation(prog, "u_mouseRadius"),
    };

    const mouse = { x: 0, y: 0 };

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      const w = Math.floor(canvas.clientWidth * dpr);
      const h = Math.floor(canvas.clientHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    function onMouseMove(e) {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      mouse.x = (e.clientX - rect.left) * dpr;
      mouse.y = (e.clientY - rect.top) * dpr;
    }
    window.addEventListener("mousemove", onMouseMove);

    const startTime = performance.now();
    let rafId;

    function render() {
      rafId = requestAnimationFrame(render);
      const p = propsRef.current;
      const elapsed = p.disableAnimation ? 0 : (performance.now() - startTime) / 1000;

      gl.uniform2f(U.resolution, canvas.width, canvas.height);
      gl.uniform1f(U.time, elapsed);
      gl.uniform1f(U.waveSpeed, p.waveSpeed);
      gl.uniform1f(U.waveFrequency, p.waveFrequency);
      gl.uniform1f(U.waveAmplitude, p.waveAmplitude);
      gl.uniform3fv(U.waveColor, p.waveColor);
      gl.uniform1f(U.colorNum, p.colorNum);
      gl.uniform1f(U.pixelSize, p.pixelSize);
      gl.uniform2f(U.mousePos, mouse.x, mouse.y);
      gl.uniform1i(U.enableMouse, p.enableMouseInteraction ? 1 : 0);
      gl.uniform1f(U.mouseRadius, p.mouseRadius);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
    render();

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      window.removeEventListener("mousemove", onMouseMove);
      gl.deleteBuffer(buf);
      gl.deleteShader(vert);
      gl.deleteShader(frag);
      gl.deleteProgram(prog);
    };
  }, []);

  return <canvas ref={canvasRef} className="dither-container" />;
}
