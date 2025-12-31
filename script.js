/* -----------------------------
   AUDIO UNLOCK FOR IOS / HTTPS
------------------------------ */
let audioCtx = null;

function directIOSAudioUnlock() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

window.addEventListener('touchstart', directIOSAudioUnlock, { once: true });
window.addEventListener('click', directIOSAudioUnlock, { once: true });

function ensureAudioContext() {
  if (!audioCtx) {
    directIOSAudioUnlock();
  }
}

/* -----------------------------
   DATA MODEL (circle of fifths)
------------------------------ */
const circle = [
  {
    major: 'C',
    altMajor: null,
    minor: 'a',
    altMinor: null,
    sig: '0',
    majorNotes: ['C','D','E','F','G','A','B'],
    minorNotes: ['A','B','C','D','E','F','G']
  },
  {
    major: 'G',
    altMajor: null,
    minor: 'e',
    altMinor: null,
    sig: '1♯',
    majorNotes: ['G','A','B','C','D','E','F♯'],
    minorNotes: ['E','F♯','G','A','B','C','D']
  },
  {
    major: 'D',
    altMajor: null,
    minor: 'b',
    altMinor: null,
    sig: '2♯',
    majorNotes: ['D','E','F♯','G','A','B','C♯'],
    minorNotes: ['B','C♯','D','E','F♯','G','A']
  },
  {
    major: 'A',
    altMajor: null,
    minor: 'f♯',
    altMinor: null,
    sig: '3♯',
    majorNotes: ['A','B','C♯','D','E','F♯','G♯'],
    minorNotes: ['F♯','G♯','A','B','C♯','D','E']
  },
  {
    major: 'E',
    altMajor: null,
    minor: 'c♯',
    altMinor: null,
    sig: '4♯',
    majorNotes: ['E','F♯','G♯','A','B','C♯','D♯'],
    minorNotes: ['C♯','D♯','E','F♯','G♯','A','B']
  },
  {
    major: 'B',
    altMajor: 'C♭',
    minor: 'g♯',
    altMinor: 'a♭',
    sig: '5♯ / 7♭',
    majorNotes: ['B','C♯','D♯','E','F♯','G♯','A♯'],
    altMajorNotes: ['C♭','D♭','E♭','F♭','G♭','A♭','B♭'],
    minorNotes: ['G♯','A♯','B','C♯','D♯','E','F♯'],
    altMinorNotes: ['A♭','B♭','C♭','D♭','E♭','F♭','G♭']
  },
  {
    major: 'F♯',
    altMajor: 'G♭',
    minor: 'd♯',
    altMinor: 'e♭',
    sig: '6♯ / 6♭',
    majorNotes: ['F♯','G♯','A♯','B','C♯','D♯','E♯'],
    altMajorNotes: ['G♭','A♭','B♭','C♭','D♭','E♭','F'],
    minorNotes: ['D♯','E♯','F♯','G♯','A♯','B','C♯'],
    altMinorNotes: ['E♭','F','G♭','A♭','B♭','C♭','D♭']
  },
  {
    major: 'C♯',
    altMajor: 'D♭',
    minor: 'a♯',
    altMinor: 'b♭',
    sig: '7♯ / 5♭',
    majorNotes: ['C♯','D♯','E♯','F♯','G♯','A♯','B♯'],
    altMajorNotes: ['D♭','E♭','F','G♭','A♭','B♭','C'],
    minorNotes: ['A♯','B♯','C♯','D♯','E♯','F♯','G♯'],
    altMinorNotes: ['B♭','C','D♭','E♭','F','G♭','A♭']
  },
  {
    major: 'A♭',
    altMajor: null,
    minor: 'f',
    altMinor: null,
    sig: '4♭',
    majorNotes: ['A♭','B♭','C','D♭','E♭','F','G'],
    minorNotes: ['F','G','A♭','B♭','C','D♭','E♭']
  },
  {
    major: 'E♭',
    altMajor: null,
    minor: 'c',
    altMinor: null,
    sig: '3♭',
    majorNotes: ['E♭','F','G','A♭','B♭','C','D'],
    minorNotes: ['C','D','E♭','F','G','A♭','B♭']
  },
  {
    major: 'B♭',
    altMajor: null,
    minor: 'g',
    altMinor: null,
    sig: '2♭',
    majorNotes: ['B♭','C','D','E♭','F','G','A'],
    minorNotes: ['G','A','B♭','C','D','E♭','F']
  },
  {
    major: 'F',
    altMajor: null,
    minor: 'd',
    altMinor: null,
    sig: '1♭',
    majorNotes: ['F','G','A','B♭','C','D','E'],
    minorNotes: ['D','E','F','G','A','B♭','C']
  }
];

/* -----------------------------
   PIANO KEYBOARD CONFIG
------------------------------ */

const PIANO_NOTES = [
  'C', 'C♯', 'D', 'D♯', 'E',
  'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'
];

let pianoOctaves = 1;      // 1 or 2
let pianoStartOctave = 4;  // C4 default

function buildPiano() {
  const piano = document.getElementById('piano');
  if (!piano) return;

  piano.innerHTML = '';

  const totalKeys = pianoOctaves * 12;

  for (let i = 0; i < totalKeys; i++) {
    const noteName = PIANO_NOTES[i % 12];
    const octave = pianoStartOctave + Math.floor(i / 12);
    const fullNote = noteName + octave;

    const key = document.createElement('div');
    key.className = noteName.includes('♯') ? 'blackKey' : 'whiteKey';
    key.dataset.note = fullNote;

    key.addEventListener('mousedown', () => playSingleNote(fullNote));
    key.addEventListener('touchstart', () => playSingleNote(fullNote));

    piano.appendChild(key);
  }
}
/* -----------------------------
   NOTE PARSING & FREQUENCY
------------------------------ */

const NOTE_BASES = {
  'C': 0,
  'D': 2,
  'E': 4,
  'F': 5,
  'G': 7,
  'A': 9,
  'B': 11
};

function parseNoteToSemitone(note) {
  const m = note.match(/^([A-Ga-g])([♯♭]?)/);
  if (!m) return 0;
  let letter = m[1].toUpperCase();
  const accidental = m[2];

  let semitone = NOTE_BASES[letter] ?? 0;
  if (accidental === '♯') semitone += 1;
  if (accidental === '♭') semitone -= 1;

  return ((semitone % 12) + 12) % 12;
}

function noteToFrequency(note, keyRoot) {
  const baseMidiC4 = 60;
  const keyRootSemitone = parseNoteToSemitone(keyRoot);
  const tonicMidi = baseMidiC4 + keyRootSemitone;

  const noteSemitone = parseNoteToSemitone(note);
  let midi = tonicMidi + (noteSemitone - keyRootSemitone);

  while (midi < 52) midi += 12;
  while (midi > 80) midi -= 12;

  return 440 * Math.pow(2, (midi - 69) / 12);
}

/* -----------------------------
   PIANO KEY HIGHLIGHTING
------------------------------ */

function highlightKey(note, startTime, duration) {
  const key = document.querySelector(`[data-note="${note}"]`);
  if (!key) return;

  const tOn = startTime;
  const tOff = startTime + duration;

  setTimeout(() => key.classList.add('active'), (tOn - audioCtx.currentTime) * 1000);
  setTimeout(() => key.classList.remove('active'), (tOff - audioCtx.currentTime) * 1000);
}

/* -----------------------------
   PLAY SINGLE NOTE (click)
------------------------------ */

function playSingleNote(fullNote) {
  ensureAudioContext();
  stopAllAudio();

  const freq = noteToFrequency(fullNote, 'C'); // root irrelevant for single notes
  const now = audioCtx.currentTime;

  playTone(fullNote, freq, now, 0.6);
}

/* -----------------------------
   SYNTH ENGINE
------------------------------ */

let activeNodes = [];
let playbackMode = 'arpeggio';

function playTone(note, freq, startTime, duration) {
  ensureAudioContext();

  const oscL = audioCtx.createOscillator();
  const oscR = audioCtx.createOscillator();
  const gainL = audioCtx.createGain();
  const gainR = audioCtx.createGain();
  const noise = audioCtx.createBufferSource();
  const noiseGain = audioCtx.createGain();

  const real = new Float32Array([0, 1.0, 0.75, 0.4, 0.2, 0.1]);
  const imag = new Float32Array(real.length);
  const wave = audioCtx.createPeriodicWave(real, imag);
  oscL.setPeriodicWave(wave);
  oscR.setPeriodicWave(wave);

  oscL.frequency.value = freq;
  oscR.frequency.value = freq * 1.002;

  oscL.detune.value = (Math.random() * 6) - 3;
  oscR.detune.value = (Math.random() * 6) - 3;

  const mainGain = audioCtx.createGain();
  gainL.gain.value = 0.6;
  gainR.gain.value = 0.6;
  mainGain.gain.value = 0.6;

  const bufferSize = audioCtx.sampleRate * 0.05;
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize / 4));
  }
  noise.buffer = buffer;
  noise.loop = false;
  noiseGain.gain.setValueAtTime(0.5, startTime);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.05);

  const filter = audioCtx.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.value = 800;

  noise.connect(filter);
  filter.connect(noiseGain);
  noiseGain.connect(mainGain);

  const attack = 0.01;
  const decay = 0.2;
  const sustain = 0.25;
  const release = 0.4;

  mainGain.gain.setValueAtTime(0, startTime);
  mainGain.gain.linearRampToValueAtTime(1.0, startTime + attack);
  mainGain.gain.linearRampToValueAtTime(sustain, startTime + attack + decay);
  mainGain.gain.setValueAtTime(sustain, startTime + duration);
  mainGain.gain.linearRampToValueAtTime(0, startTime + duration + release);

  oscL.connect(gainL);
  oscR.connect(gainR);
  gainL.connect(mainGain);
  gainR.connect(mainGain);
  mainGain.connect(audioCtx.destination);

  oscL.start(startTime);
  oscR.start(startTime);
  noise.start(startTime);

  const stopTime = startTime + duration + release + 0.05;
  oscL.stop(stopTime);
  oscR.stop(stopTime);
  noise.stop(startTime + 0.08);

  highlightKey(note, startTime, duration);

  activeNodes.push(oscL, oscR, noise, noiseGain, filter, mainGain, gainL, gainR);
}

function stopAllAudio() {
  activeNodes.forEach(n => {
    try { n.stop(); } catch(e){}
  });
  activeNodes = [];
}

/* -----------------------------
   SCALE & CHORD PLAYBACK
------------------------------ */

function playScale(notes, keyRoot) {
  stopAllAudio();
  ensureAudioContext();
  const now = audioCtx.currentTime;
  const step = 0.35;

  const playbackNotes = [...notes, notes[0]];

  playbackNotes.forEach((n, idx) => {
    const t = now + idx * step;
    const freq = noteToFrequency(n, keyRoot);
    playTone(n, freq, t, 0.5);
  });
}

function parseChordNotes(chordStr) {
  return chordStr.split('–').map(s => s.trim());
}

function playChord(notes, keyRoot, startTime) {
  if (playbackMode === 'block') {
    notes.forEach(n => {
      const freq = noteToFrequency(n, keyRoot);
      playTone(n, freq, startTime, 0.8);
    });
  } else {
    notes.forEach((n, idx) => {
      const t = startTime + idx * 0.08;
      const freq = noteToFrequency(n, keyRoot);
      playTone(n, freq, t, 0.6);
    });
  }
}

function playChordSequence(chords, keyRoot) {
  stopAllAudio();
  ensureAudioContext();
  const now = audioCtx.currentTime;
  const step = 1.0;

  chords.forEach((chord, idx) => {
    const t = now + idx * step;
    const notes = parseChordNotes(chord.chord);
    playChord(notes, keyRoot, t);
  });
}

/* -----------------------------
   TRIADS & SEVENTHS
------------------------------ */

const MAJOR_TRIAD_QUALITIES = [
  { rn: 'I', func: 'Tonic', quality: 'major' },
  { rn: 'ii', func: 'Supertonic', quality: 'minor' },
  { rn: 'iii', func: 'Mediant', quality: 'minor' },
  { rn: 'IV', func: 'Subdominant', quality: 'major' },
  { rn: 'V', func: 'Dominant', quality: 'major' },
  { rn: 'vi', func: 'Submediant', quality: 'minor' },
  { rn: 'vii°', func: 'Leading tone', quality: 'diminished' }
];

const MINOR_TRIAD_QUALITIES = [
  { rn: 'i', func: 'Tonic', quality: 'minor' },
  { rn: 'ii°', func: 'Supertonic', quality: 'diminished' },
  { rn: 'III', func: 'Mediant', quality: 'major' },
  { rn: 'iv', func: 'Subdominant', quality: 'minor' },
  { rn: 'v', func: 'Dominant', quality: 'minor' },
  { rn: 'VI', func: 'Submediant', quality: 'major' },
  { rn: 'VII', func: 'Subtonic', quality: 'major' }
];

const MAJOR_SEVENTH_QUALITIES = [
  { rn: 'IM7', func: 'Tonic', quality: 'major 7' },
  { rn: 'ii7', func: 'Supertonic', quality: 'minor 7' },
  { rn: 'iii7', func: 'Mediant', quality: 'minor 7' },
  { rn: 'IVM7', func: 'Subdominant', quality: 'major 7' },
  { rn: 'V7', func: 'Dominant', quality: 'dominant 7' },
  { rn: 'vi7', func: 'Submediant', quality: 'minor 7' },
  { rn: 'viiø7', func: 'Leading tone', quality: 'half-diminished 7' }
];

const MINOR_SEVENTH_QUALITIES = [
  { rn: 'i7', func: 'Tonic', quality: 'minor 7' },
  { rn: 'iiø7', func: 'Supertonic', quality: 'half-diminished 7' },
  { rn: 'IIIM7', func: 'Mediant', quality: 'major 7' },
  { rn: 'iv7', func: 'Subdominant', quality: 'minor 7' },
  { rn: 'v7', func: 'Dominant', quality: 'minor 7' },
  { rn: 'VIM7', func: 'Submediant', quality: 'major 7' },
  { rn: 'VII7', func: 'Subtonic', quality: 'dominant 7' }
];

function buildTriads(scaleNotes, qualities) {
  return qualities.map((q, i) => {
    const root = scaleNotes[i];
    const third = scaleNotes[(i + 2) % 7];
    const fifth = scaleNotes[(i + 4) % 7];
    return {
      rn: q.rn,
      func: q.func,
      quality: q.quality,
      chord: `${root}–${third}–${fifth}`
    };
  });
}

function buildSevenths(scaleNotes, qualities) {
  return qualities.map((q, i) => {
    const root = scaleNotes[i];
    const third = scaleNotes[(i + 2) % 7];
    const fifth = scaleNotes[(i + 4) % 7];
    const seventh = scaleNotes[(i + 6) % 7];
    return {
      rn: q.rn,
      func: q.func,
      quality: q.quality,
      chord: `${root}–${third}–${fifth}–${seventh}`
    };
  });
}

/* -----------------------------
   COMMON PROGRESSIONS
------------------------------ */

const MAJOR_PROGRESSIONS = [
  {
    name: 'Pop progression',
    pattern: ['I','V','vi','IV'],
    func: 'Very common in pop music'
  },
  {
    name: '50s progression',
    pattern: ['I','vi','IV','V'],
    func: 'Classic doo-wop / 50s sound'
  },
  {
    name: 'ii–V–I',
    pattern: ['ii','V','I'],
    func: 'Core jazz cadence'
  }
];

const MINOR_PROGRESSIONS = [
  {
    name: 'i–VII–VI–VII',
    pattern: ['i','VII','VI','VII'],
    func: 'Common natural minor loop'
  },
  {
    name: 'Andalusian cadence',
    pattern: ['i','VII','VI','V'],
    func: 'Flamenco / Spanish flavour'
  },
  {
    name: 'i–iv–v',
    pattern: ['i','iv','v'],
    func: 'Simple minor progression'
  }
];

function findTriadByRN(triads, rn) {
  return triads.find(t => t.rn === rn);
}

function playChordSequenceFromRN(pattern, triads, keyRoot) {
  const seq = pattern
    .map(rn => findTriadByRN(triads, rn))
    .filter(Boolean);
  if (seq.length === 0) return;
  playChordSequence(seq, keyRoot);
}

/* -----------------------------
   TITLE & REFERENCE HELPERS
------------------------------ */

function buildTitle(data) {
  const majorTitle = data.altMajor
    ? `${data.major} / ${data.altMajor}`
    : data.major;

  const minorTitle = data.altMinor
    ? `${data.minor} / ${data.altMinor}`
    : data.minor;

  return `${majorTitle} — ${minorTitle} minor`;
}

function formatMajorScales(data) {
  if (data.altMajorNotes) {
    return `
      <strong>${data.major} major</strong><br>
      ${data.majorNotes.join(', ')}<br><br>
      <strong>${data.altMajor} major</strong><br>
      ${data.altMajorNotes.join(', ')}
    `;
  }
  return `
    <strong>${data.major} major</strong><br>
    ${data.majorNotes.join(', ')}
  `;
}

function formatMinorScales(data) {
  if (data.altMinorNotes) {
    return `
      <strong>${data.minor} minor</strong><br>
      ${data.minorNotes.join(', ')}<br><br>
      <strong>${data.altMinor} minor</strong><br>
      ${data.altMinorNotes.join(', ')}
    `;
  }
  return `
    <strong>${data.minor} minor</strong><br>
    ${data.minorNotes.join(', ')}
  `;
}

function formatRelativeLine(data) {
  if (data.altMinor) {
    return `Relative minor: ${data.minor} / ${data.altMinor}`;
  }
  return `Relative minor: ${data.minor}`;
}

function formatParallelLine(data) {
  if (data.altMajor && data.altMinor) {
    return `Parallel minor: ${data.major.toLowerCase()} / ${data.altMajor.toLowerCase()}`;
  }
  return `Parallel minor: ${data.major.toLowerCase()}`;
}

function formatFifthLines(i) {
  const up = circle[(i + 1) % circle.length];
  const down = circle[(i - 1 + circle.length) % circle.length];

  const upLabel = up.altMajor ? `${up.major} / ${up.altMajor}` : up.major;
  const downLabel = down.altMajor ? `${down.major} / ${down.altMajor}` : down.major;

  return {
    up: `Fifth above: ${upLabel}`,
    down: `Fifth below: ${downLabel}`
  };
}

/* -----------------------------
   UI RENDERING HELPERS
------------------------------ */

function renderTriadButtons(triads, containerId, keyRoot) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';

  triads.forEach(t => {
    const btn = document.createElement('button');
    btn.className = 'btnSecondary';
    btn.textContent = t.rn;
    btn.addEventListener('click', () => {
      const notes = parseChordNotes(t.chord);
      playChord(notes, keyRoot, audioCtx.currentTime);
    });
    container.appendChild(btn);
  });
}

function renderSeventhButtons(sevenths, containerId, keyRoot) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';

  sevenths.forEach(t => {
    const btn = document.createElement('button');
    btn.className = 'btnSecondary';
    btn.textContent = t.rn;
    btn.addEventListener('click', () => {
      const notes = parseChordNotes(t.chord);
      playChord(notes, keyRoot, audioCtx.currentTime);
    });
    container.appendChild(btn);
  });
}

function renderProgressions(list, containerId, triads, keyRoot) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';

  list.forEach(p => {
    const wrap = document.createElement('div');
    wrap.className = 'progressionItem';

    const title = document.createElement('div');
    title.className = 'progressionTitle';
    title.textContent = p.name;

    const pattern = document.createElement('div');
    pattern.className = 'progressionPattern';
    pattern.textContent = p.pattern.join(' – ');

    const btn = document.createElement('button');
    btn.className = 'btnSecondary';
    btn.textContent = 'Play';
    btn.addEventListener('click', () => {
      playChordSequenceFromRN(p.pattern, triads, keyRoot);
    });

    wrap.appendChild(title);
    wrap.appendChild(pattern);
    wrap.appendChild(btn);
    container.appendChild(wrap);
  });
}

/* -----------------------------
   MAIN UPDATE FUNCTION
------------------------------ */

function updateKey(index) {
  const data = circle[index];

  // Title
  document.getElementById('keyTitle').textContent = buildTitle(data);
  document.getElementById('sig').textContent = data.sig;

  // Scales
  document.getElementById('majorNotes').innerHTML = formatMajorScales(data);
  document.getElementById('minorNotes').innerHTML = formatMinorScales(data);

  // Reference
  document.getElementById('refRelative').textContent = formatRelativeLine(data);
  document.getElementById('refParallel').textContent = formatParallelLine(data);

  const fifths = formatFifthLines(index);
  document.getElementById('refFifthAbove').textContent = fifths.up;
  document.getElementById('refFifthBelow').textContent = fifths.down;

  // Triads
  const majorTriads = buildTriads(data.majorNotes, MAJOR_TRIAD_QUALITIES);
  const minorTriads = buildTriads(data.minorNotes, MINOR_TRIAD_QUALITIES);

  renderTriadButtons(majorTriads, 'triadButtons', data.major);
  renderTriadButtons(minorTriads, 'minorTriads', data.minor);

  // Sevenths
  const majorSevenths = buildSevenths(data.majorNotes, MAJOR_SEVENTH_QUALITIES);
  const minorSevenths = buildSevenths(data.minorNotes, MINOR_SEVENTH_QUALITIES);

  renderSeventhButtons(majorSevenths, 'seventhButtons', data.major);
  renderSeventhButtons(minorSevenths, 'minorSevenths', data.minor);

  // Progressions
  renderProgressions(MAJOR_PROGRESSIONS, 'progressionList', majorTriads, data.major);
}

/* -----------------------------
   EVENT LISTENERS
------------------------------ */

document.getElementById('modeBlock').addEventListener('click', () => {
  playbackMode = 'block';
  document.getElementById('modeBlock').classList.add('active');
  document.getElementById('modeArpeggio').classList.remove('active');
});

document.getElementById('modeArpeggio').addEventListener('click', () => {
  playbackMode = 'arpeggio';
  document.getElementById('modeArpeggio').classList.add('active');
  document.getElementById('modeBlock').classList.remove('active');
});

document.getElementById('playMajorScale').addEventListener('click', () => {
  const i = currentIndex;
  playScale(circle[i].majorNotes, circle[i].major);
});

document.getElementById('playMinorScale').addEventListener('click', () => {
  const i = currentIndex;
  playScale(circle[i].minorNotes, circle[i].minor);
});

document.getElementById('playAllTriads').addEventListener('click', () => {
  const i = currentIndex;
  const triads = buildTriads(circle[i].majorNotes, MAJOR_TRIAD_QUALITIES);
  playChordSequence(triads, circle[i].major);
});

document.getElementById('playAllSevenths').addEventListener('click', () => {
  const i = currentIndex;
  const sevenths = buildSevenths(circle[i].majorNotes, MAJOR_SEVENTH_QUALITIES);
  playChordSequence(sevenths, circle[i].major);
});

document.getElementById('stopAudio').addEventListener('click', stopAllAudio);

/* -----------------------------
   PIANO DROPDOWNS
------------------------------ */

document.getElementById('pianoOctaveRange').addEventListener('change', e => {
  pianoOctaves = parseInt(e.target.value, 10);
  buildPiano();
});

document.getElementById('pianoStartOctave').addEventListener('change', e => {
  pianoStartOctave = parseInt(e.target.value, 10);
  buildPiano();
});

/* -----------------------------
   CIRCLE INTERACTION
------------------------------ */

let currentIndex = 0;

function setupCircleCanvas() {
  const canvas = document.getElementById('canvas');
  canvas.innerHTML = '';

  circle.forEach((entry, i) => {
    const btn = document.createElement('button');
    btn.className = 'circleKey';
    btn.textContent = entry.major;
    btn.addEventListener('click', () => {
      currentIndex = i;
      updateKey(i);
    });
    canvas.appendChild(btn);
  });
}

/* -----------------------------
   INITIAL STATE
------------------------------ */

window.addEventListener('DOMContentLoaded', () => {
  setupCircleCanvas();
  updateKey(0);
  buildPiano();
});




