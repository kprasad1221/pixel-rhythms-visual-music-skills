import { beat, beatsPerBar, draw, duration, roots } from './duet.mjs';

const play = document.querySelector('#play');
const mode = document.querySelector('#mode');
const position = document.querySelector('#position');
const timeLabel = document.querySelector('#time');
const status = document.querySelector('#status');
const drawing = document.querySelector('canvas').getContext('2d');
let audio, buffer, source, origin;
let time = 0;
let pending = false;
let frame;
position.max = duration;

function makeMusic(context) {
  // Four bars. The bass marks each call and the high note answers on beat two.
  // Generate one buffer so changing a visual option never alters the comparison audio.
  const buffer = context.createBuffer(1, Math.round(duration * context.sampleRate), context.sampleRate);
  const samples = buffer.getChannelData(0);
  function pluck(start, hz, volume, decay) {
    const first = Math.round(start * context.sampleRate);
    const length = Math.min(Math.ceil(decay * 7 * context.sampleRate), samples.length - first);
    for (let i = 0; i < length; i++) {
      const age = i / context.sampleRate;
      const phase = 2 * Math.PI * hz * age;
      const amp = Math.min(age / 0.008, 1) * Math.exp(-age / decay);
      samples[first + i] += volume * amp * (Math.sin(phase) + 0.19 * Math.sin(2 * phase));
    }
  }
  roots.forEach((root, bar) => {
    const start = bar * beatsPerBar * beat;
    pluck(start, root, 0.28, 0.24);
    pluck(start + beat, root * 3, 0.16, 0.22);
    pluck(start + 2.5 * beat, root * 2, 0.09, 0.14);
  });
  return buffer;
}

function render() {
  draw(drawing, time, mode.value);
  position.value = time;
  timeLabel.value = time.toFixed(2) + ' / ' + duration.toFixed(2) + ' s';
  position.setAttribute('aria-valuetext', time.toFixed(2) + ' seconds');
}

function stop() {
  cancelAnimationFrame(frame);
  if (!source) return;
  source.onended = null;
  source.stop();
  source.disconnect();
  source = null;
  play.textContent = 'Play';
}

function tick() {
  if (!source) return;
  time = Math.min(duration, Math.max(0, audio.currentTime - origin));
  render();
  if (time < duration) frame = requestAnimationFrame(tick);
}

function startAt(offset) {
  stop();
  source = audio.createBufferSource();
  source.buffer = buffer;
  source.connect(audio.destination);
  origin = audio.currentTime - offset;
  source.onended = () => {
    source.disconnect();
    source = null;
    cancelAnimationFrame(frame);
    time = duration;
    play.textContent = 'Play';
    render();
  };
  source.start(0, offset);
  play.textContent = 'Pause';
  tick();
}

play.addEventListener('click', async () => {
  if (source) {
    time = Math.min(duration, audio.currentTime - origin);
    stop();
    render();
    return;
  }
  if (pending) return;
  pending = true;
  try {
    audio ??= new AudioContext();
    await audio.resume();
    buffer ??= makeMusic(audio);
    status.textContent = '';
    startAt(time >= duration ? 0 : time);
  } catch {
    status.textContent = 'Audio could not start. You can still explore the phrase with the playhead.';
  } finally {
    pending = false;
  }
});

mode.addEventListener('change', render);
position.addEventListener('input', () => {
  time = Number(position.value);
  if (source && time < duration) startAt(time);
  else stop();
  render();
});
render();
