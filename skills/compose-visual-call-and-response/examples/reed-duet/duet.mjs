import { Score, SCORE_DEFAULTS, envelope } from '../../scripts/score.mjs';

export const bpm = 120;
export const beat = 60 / bpm;
export const beatsPerBar = 4;
export const roots = [146.83, 174.61, 196.00, 130.81];
export const duration = roots.length * beatsPerBar * beat;
const parameters = structuredClone(SCORE_DEFAULTS);
Object.assign(parameters, { on: true, bpm, routes: 1, callBeats: beatsPerBar });
Object.assign(parameters.call, { audio: 0, travel: 1.92 * beat, rise: 0.24 * beat, crest: 0.26 * beat, release: 0.70 * beat });
Object.assign(parameters.reply, { delay: beat, travel: 1.44 * beat, rise: 0.22 * beat, crest: 0.16 * beat, release: 0.76 * beat, gain: 0.85 });

export function voicesAt(time, mode) {
  // One short authored phrase. Reconstruct it at any playhead, including a scrub.
  const score = new Score(parameters);
  score.advance(time);
  return score.alive(time).filter(gesture => {
    if (gesture.n < 0 || gesture.start >= duration) return false;
    if (gesture.kind === 'call') return true;
    return mode !== 'solo' && !(mode === 'rest' && gesture.n === 1);
  });
}

export function amountAt(voices, time, kind, position) {
  let amount = 0;
  for (const voice of voices) {
    if (voice.kind !== kind) continue;
    const age = time - voice.start - position * voice.travel;
    amount += voice.strength * envelope(age, voice.rise, voice.crest, voice.release);
  }
  return amount;
}

export function draw(context, time, mode) {
  const { width, height } = context.canvas;
  const voices = voicesAt(time, mode);
  const water = context.createLinearGradient(0, 0, 0, height);
  water.addColorStop(0, '#10292f');
  water.addColorStop(0.62, '#184148');
  water.addColorStop(1, '#09242c');
  context.fillStyle = water;
  context.fillRect(0, 0, width, height);

  for (let row = 0; row < 3; row++) {
    const count = 41 - row * 7;
    for (let i = 0; i < count; i++) {
      const u = i / (count - 1);
      const wave = amountAt(voices, time, 'call', u);
      const seed = Math.sin(i * 6.81 + row * 5.9);
      const x = width * (0.055 + u * 0.89) + row * 4;
      const base = height * (0.72 + row * 0.065) + 8 * Math.sin(u * 8 + row);
      const length = 48 + row * 19 + 16 * seed;
      const lean = (wave * 44 + 10 * seed) * (0.65 + row * 0.19);
      context.strokeStyle = `rgba(135, 230, 204, ${0.16 + 0.15 * row + 0.42 * wave})`;
      context.lineWidth = 1.6 + row * 0.85;
      context.beginPath();
      context.moveTo(x, base);
      context.quadraticCurveTo(x + 5, base - length * 0.57, x + lean, base - length + wave * 12);
      context.stroke();
    }
  }

  for (let i = 0; i < 36; i++) {
    const u = i / 35;
    const lift = amountAt(voices, time, 'reply', 1 - u);
    const x = width * (0.07 + 0.86 * u);
    const y = height * 0.43 + 12 * Math.cos(u * 8) + 4 * Math.sin(i * 9);
    context.fillStyle = `rgba(244, 201, 112, ${0.25 + 0.75 * lift})`;
    context.beginPath();
    context.ellipse(x - lift * 10, y - lift * 60, 2.3 + lift * 2.1, 4.5 + lift * 2, -0.55 + lift * 0.8, 0, 2 * Math.PI);
    context.fill();
  }
}
