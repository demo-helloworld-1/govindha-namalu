// Audio Synthesis Setup (Web Audio API)
let audioCtx = null;
let isBellMuted = false;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playTempleBell(pitch = 1200) {
  if (isBellMuted) return;
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const freqs = [pitch, pitch * 1.52, pitch * 2.01, pitch * 2.9];
    const gains = [0.4, 0.25, 0.15, 0.08];

    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      osc.type = idx === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      gainNode.gain.setValueAtTime(gains[idx], now);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + (idx === 0 ? 1.6 : 0.8));
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 1.7);
    });
  } catch (e) {
    console.warn("Audio pending gesture");
  }
}

function playShankhamSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const dur = 2.4;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc1.type = 'sawtooth';
    osc2.type = 'sine';

    osc1.frequency.setValueAtTime(220, now);
    osc1.frequency.exponentialRampToValueAtTime(370, now + 0.4);
    osc1.frequency.linearRampToValueAtTime(360, now + 1.8);
    osc1.frequency.exponentialRampToValueAtTime(280, now + dur);

    osc2.frequency.setValueAtTime(222, now);
    osc2.frequency.exponentialRampToValueAtTime(372, now + 0.4);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, now);
    filter.frequency.linearRampToValueAtTime(1400, now + 0.6);
    filter.frequency.linearRampToValueAtTime(600, now + dur);

    gainNode.gain.setValueAtTime(0.01, now);
    gainNode.gain.linearRampToValueAtTime(0.35, now + 0.4);
    gainNode.gain.linearRampToValueAtTime(0.28, now + 1.6);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + dur);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + dur);
    osc2.stop(now + dur);
  } catch (e) {
    console.warn("Audio Context sound error");
  }
}
