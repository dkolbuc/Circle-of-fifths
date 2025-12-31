/* -----------------------------
   DATA MODEL (with enharmonics, musical notation)
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
    // B / C♭
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
    // F♯ / G♭
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
    // C♯ / D♭
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

const MAJOR_FORMULA = 'W W H W W W H';
const NATURAL_MINOR_FORMULA = 'W H W W H W W';

/* -----------------------------
   SVG / CIRCLE SETUP
------------------------------ */
const svgNS = 'http://www.w3.org/2000/svg';
const canvas = document.getElementById('canvas');

const svg = document.createElementNS(svgNS,'svg');
svg.setAttribute('viewBox','0 0 600 600');
canvas.appendChild(svg);

const cx = 300, cy = 300;

const rOuter        = 270;
const rMajorInner   = 200;
const rDegreeOuter  = 185;
const rDegreeInner  = 155;
const rMinorOuter   = 150;
const rMinorInner   = 100;
const rCenter       = 60;
const rSig          = 80;

const segAngle = 360 / circle.length; // 30°
const startAngle = -90; // C at top

function p2c(cx, cy, r, deg){
  const rad = deg * Math.PI / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad)
  };
}

function wedgePath(r0, r1, a0, a1){
  const pA = p2c(cx,cy,r0,a0);
  const pB = p2c(cx,cy,r0,a1);
  const pC = p2c(cx,cy,r1,a1);
  const pD = p2c(cx,cy,r1,a0);
  const large = (a1 - a0) > 180 ? 1 : 0;

  return `
    M ${pA.x} ${pA.y}
    A ${r0} ${r0} 0 ${large} 1 ${pB.x} ${pB.y}
    L ${pC.x} ${pC.y}
    A ${r1} ${r1} 0 ${large} 0 ${pD.x} ${pD.y}
    Z
  `;
}

/* -----------------------------
   DRAW CIRCLE
------------------------------ */
const romanDegrees = ['I','ii','iii','IV','V','vi','vii°'];

circle.forEach((item,i)=>{
  const a0 = startAngle + i * segAngle;
  const a1 = a0 + segAngle;
  const mid = (a0 + a1) / 2;

  // Major wedge
  const majorWedge = document.createElementNS(svgNS,'path');
  majorWedge.setAttribute('d', wedgePath(rMajorInner, rOuter, a0, a1));
  majorWedge.classList.add('wedge');
  majorWedge.dataset.index = i;
  majorWedge.style.fill = (i % 2 === 0) ? '#eaf6ff' : '#f7fbff';
  svg.appendChild(majorWedge);

  // Major label
  const pMajor = p2c(cx,cy,rOuter + 22, mid);
  const tMajor = document.createElementNS(svgNS,'text');
  tMajor.setAttribute('x', pMajor.x);
  tMajor.setAttribute('y', pMajor.y + 6);
  tMajor.classList.add('majorLabel');
  tMajor.dataset.index = i;
  tMajor.textContent = item.altMajor ? `${item.major} / ${item.altMajor}` : item.major;
  svg.appendChild(tMajor);

  // Degree label
  const pDeg = p2c(cx,cy,(rDegreeInner + rDegreeOuter)/2, mid);
  const tDeg = document.createElementNS(svgNS,'text');
  tDeg.setAttribute('x', pDeg.x);
  tDeg.setAttribute('y', pDeg.y + 4);
  tDeg.classList.add('degreeLabel');
  tDeg.textContent = romanDegrees[i % 7];
  svg.appendChild(tDeg);

  // Minor wedge
  const minorWedge = document.createElementNS(svgNS,'path');
  minorWedge.setAttribute('d', wedgePath(rMinorInner, rMinorOuter, a0, a1));
  minorWedge.classList.add('wedge');
  minorWedge.dataset.index = i;
  minorWedge.style.fill = (i % 2 === 0) ? '#fff6f0' : '#fff8f4';
  svg.appendChild(minorWedge);

  // Minor label
  const pMinor = p2c(cx,cy,(rMinorInner + rMinorOuter)/2, mid);
  const tMinor = document.createElementNS(svgNS,'text');
  tMinor.setAttribute('x', pMinor.x);
  tMinor.setAttribute('y', pMinor.y + 4);
  tMinor.classList.add('minorLabel');
  tMinor.dataset.index = i;
  tMinor.textContent = item.altMinor ? `${item.minor} / ${item.altMinor}` : item.minor;
  svg.appendChild(tMinor);

  // Key signature label
  const pSigPos = p2c(cx,cy,rSig, mid);
  const tSig = document.createElementNS(svgNS,'text');
  tSig.setAttribute('x', pSigPos.x);
  tSig.setAttribute('y', pSigPos.y + 4);
  tSig.classList.add('sigText');
  tSig.textContent = item.sig;
  svg.appendChild(tSig);

  // Click handlers
  [majorWedge, minorWedge, tMajor, tMinor].forEach(el=>{
    el.style.cursor = 'pointer';
    el.addEventListener('click', ()=> selectKey(i));
  });
});

/* Center circle */
const center = document.createElementNS(svgNS,'circle');
center.setAttribute('cx',cx);
center.setAttribute('cy',cy);
center.setAttribute('r',rCenter);
center.setAttribute('fill','#fff');
center.setAttribute('stroke','#ddd');
svg.appendChild(center);

const centerText = document.createElementNS(svgNS,'text');
centerText.setAttribute('x',cx);
centerText.setAttribute('y',cy + 6);
centerText.setAttribute('text-anchor','middle');
centerText.classList.add('sigText');
centerText.textContent = 'Key signatures';
svg.appendChild(centerText);

/* -----------------------------
   TRIADS & SEVENTHS
------------------------------ */

// Major triad qualities
const MAJOR_TRIAD_QUALITIES = [
  { rn: 'I',    func: 'Tonic',        quality: 'major' },
  { rn: 'ii',   func: 'Supertonic',   quality: 'minor' },
  { rn: 'iii',  func: 'Mediant',      quality: 'minor' },
  { rn: 'IV',   func: 'Subdominant',  quality: 'major' },
  { rn: 'V',    func: 'Dominant',     quality: 'major' },
  { rn: 'vi',   func: 'Submediant',   quality: 'minor' },
  { rn: 'vii°', func: 'Leading tone', quality: 'diminished' }
];

// Natural minor triad qualities
const MINOR_TRIAD_QUALITIES = [
  { rn: 'i',    func: 'Tonic',        quality: 'minor' },
  { rn: 'ii°',  func: 'Supertonic',   quality: 'diminished' },
  { rn: 'III',  func: 'Mediant',      quality: 'major' },
  { rn: 'iv',   func: 'Subdominant',  quality: 'minor' },
  { rn: 'v',    func: 'Dominant',     quality: 'minor' },
  { rn: 'VI',   func: 'Submediant',   quality: 'major' },
  { rn: 'VII',  func: 'Subtonic',     quality: 'major' }
];

// Major seventh qualities
const MAJOR_SEVENTH_QUALITIES = [
  { rn: 'IM7',    func: 'Tonic',        quality: 'major 7' },
  { rn: 'ii7',    func: 'Supertonic',   quality: 'minor 7' },
  { rn: 'iii7',   func: 'Mediant',      quality: 'minor 7' },
  { rn: 'IVM7',   func: 'Subdominant',  quality: 'major 7' },
  { rn: 'V7',     func: 'Dominant',     quality: 'dominant 7' },
  { rn: 'vi7',    func: 'Submediant',   quality: 'minor 7' },
  { rn: 'viiø7',  func: 'Leading tone', quality: 'half-diminished 7' }
];

// Natural minor seventh qualities
const MINOR_SEVENTH_QUALITIES = [
  { rn: 'i7',    func: 'Tonic',        quality: 'minor 7' },
  { rn: 'iiø7',  func: 'Supertonic',   quality: 'half-diminished 7' },
  { rn: 'IIIM7', func: 'Mediant',      quality: 'major 7' },
  { rn: 'iv7',   func: 'Subdominant',  quality: 'minor 7' },
  { rn: 'v7',    func: 'Dominant',     quality: 'minor 7' },
  { rn: 'VIM7',  func: 'Submediant',   quality: 'major 7' },
  { rn: 'VII7',  func: 'Subtonic',     quality: 'dominant 7' }
];

function buildTriads(scaleNotes, qualities){
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

function buildSevenths(scaleNotes, qualities){
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

function renderTriadSection(triads, name, altName, altTriads){
  let html = `<h3>${name} triads</h3>`;
  html += triads.map(t => `
    <div class="triadRow">
      <span class="triadRN">${t.rn}</span>
      <span class="triadFunc">${t.func}</span>
      <span class="triadChord">${t.chord}</span>
    </div>
  `).join('');

  if (altTriads){
    html += `<h3>${altName} triads</h3>`;
    html += altTriads.map(t => `
      <div class="triadRow">
        <span class="triadRN">${t.rn}</span>
        <span class="triadFunc">${t.func}</span>
        <span class="triadChord">${t.chord}</span>
      </div>
    `).join('');
  }

  return html;
}

function renderSeventhSection(sevenths, name, altName, altSevenths){
  let html = `<h3>${name} seventh chords</h3>`;
  html += sevenths.map(t => `
    <div class="seventhRow">
      <span class="seventhRN">${t.rn}</span>
      <span class="seventhFunc">${t.func}</span>
      <span class="seventhChord">${t.chord}</span>
    </div>
  `).join('');

  if (altSevenths){
    html += `<h3>${altName} seventh chords</h3>`;
    html += altSevenths.map(t => `
      <div class="seventhRow">
        <span class="seventhRN">${t.rn}</span>
        <span class="seventhFunc">${t.func}</span>
        <span class="seventhChord">${t.chord}</span>
      </div>
    `).join('');
  }

  return html;
}

/* -----------------------------
   CADENCES
------------------------------ */

const MAJOR_CADENCES = [
  {
    name: 'Perfect authentic cadence',
    pattern: ['V','I'],
    func: 'Dominant → Tonic'
  },
  {
    name: 'Plagal cadence',
    pattern: ['IV','I'],
    func: 'Subdominant → Tonic'
  },
  {
    name: 'Half cadence',
    pattern: ['ii','V'],
    func: 'Pre-dominant → Dominant'
  },
  {
    name: 'Deceptive cadence',
    pattern: ['V','vi'],
    func: 'Dominant → Submediant'
  }
];

const MINOR_CADENCES = [
  {
    name: 'Authentic cadence (natural minor)',
    pattern: ['v','i'],
    func: 'Dominant → Tonic'
  },
  {
    name: 'Plagal cadence',
    pattern: ['iv','i'],
    func: 'Subdominant → Tonic'
  },
  {
    name: 'Half cadence',
    pattern: ['ii°','v'],
    func: 'Pre-dominant → Dominant'
  },
  {
    name: 'Deceptive cadence',
    pattern: ['v','VI'],
    func: 'Dominant → Submediant'
  }
];

function findTriadByRN(triads, rn){
  return triads.find(t => t.rn === rn);
}

function renderCadences(majorTriads, minorTriads, keyName){
  const parts = [];

  parts.push(`<div class="cadenceGroup">`);
  parts.push(`<div class="cadenceHeader">Major cadences in ${keyName}</div>`);
  MAJOR_CADENCES.forEach(c => {
    const chords = c.pattern.map(rn => {
      const t = findTriadByRN(majorTriads, rn);
      return t ? `${rn} (${t.chord})` : rn;
    }).join(' → ');
    parts.push(`
      <div class="cadenceRow">
        <div class="cadenceName">${c.name}</div>
        <div class="cadenceRoman">${c.func}</div>
        <div class="cadenceExample">${chords}</div>
      </div>
    `);
  });
  parts.push(`</div>`);

  parts.push(`<div class="cadenceGroup">`);
  parts.push(`<div class="cadenceHeader">Minor cadences in ${keyName.toLowerCase()}</div>`);
  MINOR_CADENCES.forEach(c => {
    const chords = c.pattern.map(rn => {
      const t = findTriadByRN(minorTriads, rn);
      return t ? `${rn} (${t.chord})` : rn;
    }).join(' → ');
    parts.push(`
      <div class="cadenceRow">
        <div class="cadenceName">${c.name}</div>
        <div class="cadenceRoman">${c.func}</div>
        <div class="cadenceExample">${chords}</div>
      </div>
    `);
  });
  parts.push(`</div>`);

  return parts.join('');
}

/* -----------------------------
   TITLE & REFERENCE HELPERS
------------------------------ */

function buildTitle(data){
  const majorTitle = data.altMajor
    ? `${data.major} / ${data.altMajor}`
    : data.major;

  const minorTitle = data.altMinor
    ? `${data.minor} / ${data.altMinor}`
    : data.minor;

  return `${majorTitle} — ${minorTitle} minor`;
}

function formatMajorScales(data){
  if (data.altMajorNotes){
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

function formatMinorScales(data){
  if (data.altMinorNotes){
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

function formatRelativeLine(data){
  if (data.altMinor){
    return `Relative minor: ${data.minor} / ${data.altMinor}`;
  }
  return `Relative minor: ${data.minor}`;
}

function formatParallelLine(data){
  if (data.altMajor && data.altMinor){
    return `Parallel minor: ${data.major.toLowerCase()} / ${data.altMajor.toLowerCase()}`;
  }
  return `Parallel minor: ${data.major.toLowerCase()}`;
}

function formatFifthLines(i){
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
   AUDIO (Piano-like synth)
------------------------------ */

document.addEventListener('click', () => {
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}, { once: true });

let audioCtx = null;
let activeNodes = [];
let playbackMode = 'arpeggio'; // 'block' or 'arpeggio'

const NOTE_BASES = {
  'C': 0,
  'D': 2,
  'E': 4,
  'F': 5,
  'G': 7,
  'A': 9,
  'B': 11
};

function ensureAudioContext(){
  if (!audioCtx){
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
}

function parseNoteToSemitone(note){
  // Accepts "C", "C♯", "C♭", "E♯", "F♭", etc.
  const m = note.match(/^([A-Ga-g])([♯♭]?)/);
  if (!m) return 0;
  let letter = m[1].toUpperCase();
  const accidental = m[2];

  let semitone = NOTE_BASES[letter] ?? 0;
  if (accidental === '♯') semitone += 1;
  if (accidental === '♭') semitone -= 1;

  // Wrap into 0–11
  semitone = ((semitone % 12) + 12) % 12;
  return semitone;
}

function noteToFrequency(note, keyRoot){
  const baseMidiC4 = 60; // C4
  const keyRootSemitone = parseNoteToSemitone(keyRoot);
  const tonicMidi = baseMidiC4 + keyRootSemitone;

  const noteSemitone = parseNoteToSemitone(note);
  let midi = tonicMidi + (noteSemitone - keyRootSemitone);

  while (midi < 52) midi += 12;
  while (midi > 80) midi -= 12;

  const freq = 440 * Math.pow(2, (midi - 69) / 12);
  return freq;
}

function createPianoOscillator(freq, startTime, duration){
  ensureAudioContext();

  // Oscillator with custom harmonic spectrum
  const oscL = audioCtx.createOscillator();
  const oscR = audioCtx.createOscillator();
  const gainL = audioCtx.createGain();
  const gainR = audioCtx.createGain();
  const noise = audioCtx.createBufferSource();
  const noiseGain = audioCtx.createGain();

  // Custom harmonic profile: fundamental + richer harmonics
  const real = new Float32Array([0, 1.0, 0.75, 0.4, 0.2, 0.1]);
  const imag = new Float32Array(real.length);
  const wave = audioCtx.createPeriodicWave(real, imag);
  oscL.setPeriodicWave(wave);
  oscR.setPeriodicWave(wave);

  // Slight detune between channels for width
  oscL.frequency.value = freq;
  oscR.frequency.value = freq * 1.002;

  oscL.detune.value = (Math.random() * 6) - 3; // ±3 cents
  oscR.detune.value = (Math.random() * 6) - 3;

  // Stereo pan via gains (L/R balance)
  const mainGain = audioCtx.createGain();
  gainL.gain.value = 0.6;
  gainR.gain.value = 0.6;
  mainGain.gain.value = 0.6;

  // Hammer noise: short burst of filtered noise at attack
  const bufferSize = audioCtx.sampleRate * 0.05; // 50ms
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++){
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

  // Piano-like ADSR envelope on mainGain
  const attack = 0.005;
  const decay = 0.15;
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

  activeNodes.push(oscL, oscR, noise);
}

function playTone(freq, startTime, duration){
  createPianoOscillator(freq, startTime, duration);
}

function stopAllAudio(){
  activeNodes.forEach(n=>{
    try { n.stop(); } catch(e){}
  });
  activeNodes = [];
}

/* Playback helpers */

function playScale(notes, keyRoot){
  stopAllAudio();
  ensureAudioContext();
  const now = audioCtx.currentTime;
  const step = 0.35;

  notes.forEach((n, idx) => {
    const t = now + idx * step;
    const freq = noteToFrequency(n, keyRoot);
    playTone(freq, t, 0.5);
  });
}

function playChord(notes, keyRoot, startTime){
  if (playbackMode === 'block'){
    notes.forEach(n => {
      const freq = noteToFrequency(n, keyRoot);
      playTone(freq, startTime, 0.8);
    });
  } else {
    notes.forEach((n, idx) => {
      const t = startTime + idx * 0.08;
      const freq = noteToFrequency(n, keyRoot);
      playTone(freq, t, 0.5);
    });
  }
}

function parseChordNotes(chordStr){
  return chordStr.split('–').map(s => s.trim());
}

function playChordSequence(chords, keyRoot){
  stopAllAudio();
  ensureAudioContext();
  const now = audioCtx.currentTime;
  const step = 0.9;

  chords.forEach((chord, idx) => {
    const t = now + idx * step;
    const notes = parseChordNotes(chord.chord);
    playChord(notes, keyRoot, t);
  });
}

/* -----------------------------
   MAIN SELECTION LOGIC
------------------------------ */

let currentIndex = 0;

function selectKey(i){
  currentIndex = i;
  const data = circle[i];

  // Clear highlights
  document.querySelectorAll('.wedge').forEach(w => w.classList.remove('selected-wedge'));
  document.querySelectorAll('.majorLabel').forEach(t => t.classList.remove('selected-label'));
  document.querySelectorAll('.minorLabel').forEach(t => t.classList.remove('selected-label'));

  // Highlight
  document.querySelectorAll(`.wedge[data-index="${i}"]`)
    .forEach(w => w.classList.add('selected-wedge'));

  document.querySelectorAll(`.majorLabel[data-index="${i}"]`)
    .forEach(t => t.classList.add('selected-label'));

  document.querySelectorAll(`.minorLabel[data-index="${i}"]`)
    .forEach(t => t.classList.add('selected-label'));

  // Title & key signature
  document.getElementById('keyTitle').textContent = buildTitle(data);
  document.getElementById('sig').textContent = data.sig;

  // Scales
  document.getElementById('majorNotes').innerHTML = formatMajorScales(data);
  document.getElementById('minorNotes').innerHTML = formatMinorScales(data);
  document.getElementById('majorFormula').textContent = MAJOR_FORMULA;
  document.getElementById('minorFormula').textContent = NATURAL_MINOR_FORMULA;

  // Triads
  const majorTriads = buildTriads(data.majorNotes, MAJOR_TRIAD_QUALITIES);
  const minorTriads = buildTriads(data.minorNotes, MINOR_TRIAD_QUALITIES);

  let altMajorTriads = null;
  let altMinorTriads = null;

  if (data.altMajorNotes){
    altMajorTriads = buildTriads(data.altMajorNotes, MAJOR_TRIAD_QUALITIES);
  }
  if (data.altMinorNotes){
    altMinorTriads = buildTriads(data.altMinorNotes, MINOR_TRIAD_QUALITIES);
  }

  document.getElementById('majorTriads').innerHTML =
    renderTriadSection(majorTriads, data.major, data.altMajor, altMajorTriads);
  document.getElementById('minorTriads').innerHTML =
    renderTriadSection(minorTriads, data.minor, data.altMinor, altMinorTriads);

  // Sevenths
  const majorSevenths = buildSevenths(data.majorNotes, MAJOR_SEVENTH_QUALITIES);
  const minorSevenths = buildSevenths(data.minorNotes, MINOR_SEVENTH_QUALITIES);

  let altMajorSevenths = null;
  let altMinorSevenths = null;

  if (data.altMajorNotes){
    altMajorSevenths = buildSevenths(data.altMajorNotes, MAJOR_SEVENTH_QUALITIES);
  }
  if (data.altMinorNotes){
    altMinorSevenths = buildSevenths(data.altMinorNotes, MINOR_SEVENTH_QUALITIES);
  }

  document.getElementById('majorSevenths').innerHTML =
    renderSeventhSection(majorSevenths, data.major, data.altMajor, altMajorSevenths);
  document.getElementById('minorSevenths').innerHTML =
    renderSeventhSection(minorSevenths, data.minor, data.altMinor, altMinorSevenths);

  // Cadences (use main spelling for header)
  document.getElementById('cadenceList').innerHTML =
    renderCadences(majorTriads, minorTriads, data.major);

  // Reference box
  const relativeLine = formatRelativeLine(data);
  const parallelLine = formatParallelLine(data);
  const fifthInfo = formatFifthLines(i);

  const refRelative = document.getElementById('refRelative');
  const refParallel = document.getElementById('refParallel');
  const refFifthAbove = document.getElementById('refFifthAbove');
  const refFifthBelow = document.getElementById('refFifthBelow');

  if (refRelative) refRelative.textContent = relativeLine;
  if (refParallel) refParallel.textContent = parallelLine;
  if (refFifthAbove) refFifthAbove.textContent = fifthInfo.up;
  if (refFifthBelow) refFifthBelow.textContent = fifthInfo.down;
}

/* -----------------------------
   UI WIRING: toggles & buttons
------------------------------ */

// Minor labels toggle
const minorToggle = document.getElementById('showMinor');
if (minorToggle){
  minorToggle.addEventListener('change', e=>{
    const show = e.target.checked;
    document.querySelectorAll('.minorLabel')
      .forEach(t => t.style.display = show ? 'block' : 'none');
  });
}

// Playback mode toggle
const modeBlockBtn = document.getElementById('modeBlock');
const modeArpBtn = document.getElementById('modeArpeggio');

function setPlaybackMode(mode){
  playbackMode = mode;
  if (modeBlockBtn && modeArpBtn){
    modeBlockBtn.classList.toggle('active', mode === 'block');
    modeArpBtn.classList.toggle('active', mode === 'arpeggio');
  }
}

if (modeBlockBtn){
  modeBlockBtn.addEventListener('click', ()=> setPlaybackMode('block'));
}
if (modeArpBtn){
  modeArpBtn.addEventListener('click', ()=> setPlaybackMode('arpeggio'));
}

// Audio buttons
const btnPlayMajorScale = document.getElementById('playMajorScale');
const btnPlayMinorScale = document.getElementById('playMinorScale');
const btnPlayAllTriads = document.getElementById('playAllTriads');
const btnPlayAllSevenths = document.getElementById('playAllSevenths');
const btnStopAudio = document.getElementById('stopAudio');

if (btnPlayMajorScale){
  btnPlayMajorScale.addEventListener('click', ()=>{
    const data = circle[currentIndex];
    playScale(data.majorNotes, data.major);
  });
}

if (btnPlayMinorScale){
  btnPlayMinorScale.addEventListener('click', ()=>{
    const data = circle[currentIndex];
    playScale(data.minorNotes, data.major);
  });
}

if (btnPlayAllTriads){
  btnPlayAllTriads.addEventListener('click', ()=>{
    const data = circle[currentIndex];
    const majorTriads = buildTriads(data.majorNotes, MAJOR_TRIAD_QUALITIES);
    playChordSequence(majorTriads, data.major);
  });
}

if (btnPlayAllSevenths){
  btnPlayAllSevenths.addEventListener('click', ()=>{
    const data = circle[currentIndex];
    const majorSevenths = buildSevenths(data.majorNotes, MAJOR_SEVENTH_QUALITIES);
    playChordSequence(majorSevenths, data.major);
  });
}

if (btnStopAudio){
  btnStopAudio.addEventListener('click', ()=>{
    stopAllAudio();
  });
}

/* -----------------------------
   Individual chord buttons
------------------------------ */

const triadButtonContainer = document.getElementById('triadButtons');
const seventhButtonContainer = document.getElementById('seventhButtons');

function buildChordButtons(){
  if (triadButtonContainer){
    triadButtonContainer.innerHTML = '';
    MAJOR_TRIAD_QUALITIES.forEach(q => {
      const btn = document.createElement('button');
      btn.className = 'chordBtn';
      btn.textContent = q.rn;
      btn.dataset.type = 'triad';
      btn.dataset.rn = q.rn;
      triadButtonContainer.appendChild(btn);
    });
  }

  if (seventhButtonContainer){
    seventhButtonContainer.innerHTML = '';
    MAJOR_SEVENTH_QUALITIES.forEach(q => {
      const btn = document.createElement('button');
      btn.className = 'chordBtn';
      btn.textContent = q.rn;
      btn.dataset.type = 'seventh';
      btn.dataset.rn = q.rn;
      seventhButtonContainer.appendChild(btn);
    });
  }
}

function handleChordButtonClick(e){
  const btn = e.target.closest('.chordBtn');
  if (!btn) return;
  const type = btn.dataset.type;
  const rn = btn.dataset.rn;
  const data = circle[currentIndex];

  let chords;
  if (type === 'triad'){
    chords = buildTriads(data.majorNotes, MAJOR_TRIAD_QUALITIES);
  } else {
    chords = buildSevenths(data.majorNotes, MAJOR_SEVENTH_QUALITIES);
  }

  const chord = chords.find(c => c.rn === rn);
  if (!chord) return;

  const notes = parseChordNotes(chord.chord);
  stopAllAudio();
  ensureAudioContext();
  const now = audioCtx.currentTime;
  playChord(notes, data.major, now);
}

if (triadButtonContainer){
  triadButtonContainer.addEventListener('click', handleChordButtonClick);
}
if (seventhButtonContainer){
  seventhButtonContainer.addEventListener('click', handleChordButtonClick);
}

/* -----------------------------
   INITIAL STATE
------------------------------ */
buildChordButtons();
setPlaybackMode('arpeggio');
selectKey(0);
