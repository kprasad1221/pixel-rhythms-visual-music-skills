// Distances use the water radius as one unit. The field advances independently of rendering.
export const FIELD_HZ = 60;
export const STEP = 1 / FIELD_HZ;
export const GRID = 112;

export class WaterField {
  constructor(size = GRID) {
    this.size = size;
    const count = size * size;
    const channel = () => new Float32Array(count);
    this.height = channel();
    this.previous = channel();
    this.wet = channel();
    this.nextWet = channel();
    this.residue = channel();
    this.nextResidue = channel();
    this.damping = channel();
    this.flowX = channel();
    this.flowY = channel();
    this.halfLife = 2.8;
    this.bytes = new Uint8Array(4 * count);
    this.running = false;
    this.steps = 0;
    for (let j = 1; j < size - 1; j++) {
      for (let i = 1; i < size - 1; i++) {
        const x = 2 * i / (size - 1) - 1;
        const y = 2 * j / (size - 1) - 1;
        const r = Math.hypot(x, y);
        const k = j * size + i;
        if (r > 0.995) continue;
        this.damping[k] = 0.985 - 0.11 * Math.max(0, (r - 0.89) / 0.11);
        // Back-trace a small tangential flow so the deposited skin can migrate at rest.
        this.flowX[k] = 0.055 * y + 0.016 * Math.sin(y * 7 + x * 3);
        this.flowY[k] = -0.055 * x + 0.016 * Math.sin(x * 8 - y * 2);
      }
    }
    this.encode();
  }

  clear() {
    for (const values of [this.height, this.previous, this.wet, this.nextWet, this.residue, this.nextResidue]) values.fill(0);
    this.steps = 0;
    this.running = false;
    this.encode();
  }

  deposit(x, y, strength = 0.8, width = 0.058) {
    if (!(strength > 0) || Math.hypot(x, y) > 1) return;
    const span = (this.size - 1) / 2;
    const cx = (x + 1) * span, cy = (y + 1) * span;
    const radius = Math.max(1.2, width * span);
    for (let j = Math.max(1, Math.floor(cy - radius * 2.8)); j <= Math.min(this.size - 2, cy + radius * 2.8); j++) {
      for (let i = Math.max(1, Math.floor(cx - radius * 2.8)); i <= Math.min(this.size - 2, cx + radius * 2.8); i++) {
        const k = j * this.size + i;
        if (!this.damping[k]) continue;
        const d2 = ((i - cx) ** 2 + (j - cy) ** 2) / (radius * radius);
        // A balanced pressure impulse travels as a ridge instead of raising the whole basin.
        const bell = Math.exp(-d2 * 0.95);
        const pressure = strength * bell * (1 - 0.85 * d2);
        this.height[k] += pressure * 0.44;
        this.previous[k] += pressure * 0.29;
        this.wet[k] = Math.min(1, this.wet[k] + bell * strength * 0.68);
        this.residue[k] = Math.min(1, this.residue[k] + bell * strength * 0.33);
      }
    }
    this.running = true;
  }

  advance() {
    if (!this.running) return;
    const n = this.size, h = this.height, prev = this.previous;
    const wet = this.wet, w2 = this.nextWet, old = this.residue, next = this.nextResidue;
    const retain = Math.pow(0.5, STEP / this.halfLife);
    let maximum = 0;
    for (let k = n + 1; k < h.length - n - 1; k++) {
      if (!this.damping[k]) continue;
      const lap = h[k - 1] + h[k + 1] + h[k - n] + h[k + n] - 4 * h[k];
      const speed = (h[k] - prev[k] + 0.285 * lap) * this.damping[k];
      prev[k] = h[k] + speed;
      const front = Math.min(1, Math.abs(speed) * 4.4 + Math.abs(lap) * 0.55);
      const wetLap = wet[k - 1] + wet[k + 1] + wet[k - n] + wet[k + n] - 4 * wet[k];
      w2[k] = Math.min(1, Math.max(front, (wet[k] + 0.023 * wetLap) * 0.946));
      const fx = this.flowX[k], fy = this.flowY[k];
      const advected = old[k] + Math.abs(fx) * (old[k + (fx > 0 ? 1 : -1)] - old[k])
        + Math.abs(fy) * (old[k + (fy > 0 ? n : -n)] - old[k]);
      const blur = old[k - 1] + old[k + 1] + old[k - n] + old[k + n] - 4 * old[k];
      next[k] = Math.min(1, Math.max(0, (advected + 0.012 * blur) * retain + 0.065 * front * (1 - old[k])));
      maximum = Math.max(maximum, Math.abs(prev[k]), w2[k], next[k]);
    }
    [this.height, this.previous] = [prev, h];
    [this.wet, this.nextWet] = [w2, wet];
    [this.residue, this.nextResidue] = [next, old];
    this.steps++;
    if (maximum < 0.00065) this.clear();
  }

  encode() {
    for (let k = 0; k < this.height.length; k++) {
      const i = k * 4;
      this.bytes[i] = Math.max(0, Math.min(255, 128 + 165 * this.height[k]));
      this.bytes[i + 1] = Math.min(255, 310 * this.wet[k]);
      this.bytes[i + 2] = Math.min(255, 285 * this.residue[k]);
      this.bytes[i + 3] = 255;
    }
    return this.bytes;
  }
}

export class FixedClock {
  constructor() { this.carry = 0; }
  update(seconds, step) {
    // Across a hidden tab or an overloaded frame, bound work and discard missed deposits.
    this.carry = Math.min(4 * STEP, this.carry + Math.max(0, seconds));
    let count = 0;
    while (this.carry >= STEP - 1e-9) {
      step(STEP);
      this.carry -= STEP;
      count++;
    }
    return count;
  }
}

export const shapeGLSL = `
uniform vec2 uShape;
float outline(float a) {
  return 1.0 + uShape.x*cos(uShape.y*a+.25) + .0028*sin(a*5.0-.6);
}
`;
export const waterVertex = shapeGLSL + `
uniform sampler2D uField;
uniform float uMemory;
varying vec2 vDisk;
varying vec3 vLocal;
void main() {
  vDisk = position.xz/.956;
  float r = length(vDisk);
  float a = atan(vDisk.y,vDisk.x+.000001);
  vec4 f = texture2D(uField, vDisk*.5+.5);
  vec3 p = position;
  p.xz *= mix(1.0,outline(a),smoothstep(.36,1.0,r));
  p.y += .0055*sin(r*30.0+.7*sin(a*6.0)*r)*smoothstep(.05,.4,r);
  p.y += (f.r-.50196)*.22 + .012*f.g + .027*f.b*uMemory;
  vLocal=p;
  gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.0);
}
`;
export const waterFragment = `
uniform sampler2D uField, uInlay;
uniform vec3 uAccent, uGold;
uniform vec2 uCursor;
uniform vec4 uLights[4];
uniform float uMemory, uTexel, uLook, uHover;
varying vec2 vDisk;
varying vec3 vLocal;
float fieldHeight(vec3 f) { return (f.r-.50196)*1.45 + f.g*.16 + f.b*.85*uMemory; }
void main() {
  vec2 uv = vDisk*.5+.5;
  vec3 f=texture2D(uField,uv).rgb;
  vec2 delta=vec2(uTexel,0.);
  vec2 slope=vec2(
    fieldHeight(texture2D(uField,uv+delta).rgb)-fieldHeight(texture2D(uField,uv-delta).rgb),
    fieldHeight(texture2D(uField,uv+delta.yx).rgb)-fieldHeight(texture2D(uField,uv-delta.yx).rgb));
  float r=length(vDisk), a=atan(vDisk.y,vDisk.x+.000001);
  vec2 direction=vDisk/max(r,.001);
  vec2 refracted=uv+slope*.29+direction*((f.r-.50196)*.074+f.b*uMemory*.027);
  vec3 inlay=texture2D(uInlay,clamp(vec2(refracted.x,1.-refracted.y),.002,.998)).rgb;
  float lum=dot(inlay,vec3(.2126,.7152,.0722));
  vec3 base=mix(vec3(lum),inlay,1.08)*.94;
  // Crest, wet skin and older traces alter different parts of the reflected light.
  float flash=clamp(dot(slope,vec2(-.83,-.56))*3.9,0.,1.);
  float shadow=clamp(dot(slope,vec2(.68,.74))*2.7,0.,.55);
  float film=(1.-1./(1.+f.b*2.8))*uMemory;
  vec3 result=base*(1.-shadow);
  result=mix(result,uAccent*(.42+.46*lum),clamp(.12*f.g+.63*film,0.,.76));
  result+=uAccent*(f.g*.25+film*.21) + mix(uAccent,uGold,.62)*pow(flash,.77)*.81;
  // Thin, broken veins catch side light where fresh water meets the older film.
  float edge=length(slope)*smoothstep(.025,.19,film+f.g*.5);
  result+=uGold*min(.59,edge*1.17);
  for(int i=0;i<4;i++) {
    vec2 off=vLocal.xz-uLights[i].xy;
    float spot=exp(-dot(off,off)*112.)*uLights[i].z;
    result+=mix(uAccent,uGold,.35)*spot*(.16+.55*lum);
  }
  float brush=abs(length(vDisk-uCursor)-.037);
  result+=uAccent*.34*uHover*(1.-smoothstep(.0008,.0048,brush));
  gl_FragColor=vec4(result,1.);
}
`;

export function pluck(ctx, output, x, z, velocity = 0.84) {
  const now = ctx.currentTime;
  const scale = [146.832, 174.614, 220.000, 261.626, 293.665, 349.228, 440.000];
  const pitch = scale[Math.round(Math.min(1, Math.max(0, (x + 1) * 0.5)) * (scale.length - 1))] * (z < -0.43 ? 2 : 1);
  const pan = ctx.createStereoPanner ? ctx.createStereoPanner() : ctx.createGain();
  if (pan.pan) pan.pan.value = x * 0.70;
  pan.connect(output);
  const partials = [[1, 0.23, 0.85], [2.012, 0.087, 0.57], [3.82, 0.045, 0.34], [5.43, 0.018, 0.19]];
  let remaining = partials.length;
  for (const [ratio, amplitude, duration] of partials) {
    const oscillator = ctx.createOscillator(), gain = ctx.createGain();
    oscillator.frequency.setValueAtTime(pitch * ratio, now);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.001, amplitude * velocity), now + 0.009);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    oscillator.connect(gain).connect(pan);
    oscillator.start(now); oscillator.stop(now + duration + 0.02);
    oscillator.onended = () => {
      oscillator.disconnect(); gain.disconnect();
      if (--remaining === 0) pan.disconnect();
    };
  }
}
