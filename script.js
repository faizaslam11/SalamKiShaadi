/* =====================================================
   CONTENT CONFIG — edit these, then re-deploy
   ===================================================== */
const CONFIG = {
  names: { first: "Salam", second: "Sara" },
  walimaDate: "2026-12-26T19:00:00+05:30", // countdown target
  RSVP_LINK: "https://wa.me/+918394907770?text=Bismillah!%20I'd%20love%20to%20join%20you%20for%20the%20Walima.", // <-- replace with your real WhatsApp/RSVP link
};
document.getElementById('rsvp-link').href = CONFIG.RSVP_LINK;

/* letter-reveal the couple names in hero */
function buildLetters(el, text){
  el.innerHTML = '';
  [...text].forEach((ch,i) => {
    const s = document.createElement('span');
    s.className = 'ch';
    s.textContent = ch === ' ' ? '\u00A0' : ch;
    s.style.transitionDelay = (i*0.035)+'s';
    el.appendChild(s);
  });
}
buildLetters(document.getElementById('name1'), CONFIG.names.first);
buildLetters(document.getElementById('name2'), CONFIG.names.second);

/* letter-reveal small caps labels on scroll */
function wrapLetters(el){
  const text = el.textContent;
  el.innerHTML = '';
  [...text].forEach((ch,i) => {
    const s = document.createElement('span');
    s.className = 'ltr';
    s.textContent = ch === ' ' ? '\u00A0' : ch;
    s.style.transitionDelay = (i*0.025)+'s';
    el.appendChild(s);
  });
}
document.querySelectorAll('.count-label').forEach(wrapLetters);
const letterIo = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.querySelectorAll('.ltr').forEach(s => s.classList.add('in')); });
}, { threshold:0.4 });
document.querySelectorAll('.count-label').forEach(el => letterIo.observe(el));

/* ---------- rotating mandala petal rings ---------- */
function buildMandala(id, count, len){
  const g = document.getElementById(id);
  if (!g) return;
  let html = '';
  for (let i=0;i<count;i++){
    const angle = (360/count)*i;
    html += `<line x1="100" y1="100" x2="100" y2="${100-len}" transform="rotate(${angle} 100 100)" stroke-opacity="0.5"/>`;
    html += `<circle cx="100" cy="${100-len}" r="2" transform="rotate(${angle} 100 100)" stroke-opacity="0.6"/>`;
  }
  g.innerHTML = html;
}
buildMandala('petals-ring', 16, 90);
buildMandala('petals-ring-2', 12, 70);

gsap.registerPlugin(ScrollTrigger);

/* ---------- cursor spotlight (desktop only, ignored on touch) ---------- */
if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  const spotlight = document.getElementById('spotlight');
  window.addEventListener('mousemove', (e) => {
    spotlight.style.setProperty('--mx', e.clientX + 'px');
    spotlight.style.setProperty('--my', e.clientY + 'px');
  }, { passive:true });
}

/* ---------- reception card 3D tilt ---------- */
const rcard = document.getElementById('rcard');
if (rcard && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  const wrap = rcard.closest('.rcard-tilt');
  wrap.addEventListener('mousemove', (e) => {
    const r = rcard.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    rcard.style.transform = `rotateY(${px*10}deg) rotateX(${-py*10}deg) translateZ(0)`;
  });
  wrap.addEventListener('mouseleave', () => { rcard.style.transform = 'rotateY(0) rotateX(0)'; });
}

/* ---------- magnetic buttons ---------- */
function magnetize(el, strength){
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  el.addEventListener('mousemove', (e) => {
    const r = el.getBoundingClientRect();
    const mx = (e.clientX - r.left - r.width/2) * strength;
    const my = (e.clientY - r.top - r.height/2) * strength;
    el.style.transform = `translate(${mx}px, ${my}px)`;
  });
  el.addEventListener('mouseleave', () => { el.style.transform = ''; });
}
document.querySelectorAll('.rsvp-btn, .im-in-btn').forEach(b => magnetize(b, 0.25));

/* ---------- ambient sky: crescent + stars ---------- */
const sky = document.getElementById('sky');
sky.innerHTML = `
  <div class="sky-el float" style="top:8%; left:8%; width:34px;">
    <svg viewBox="0 0 40 40" fill="none"><path d="M24 4 A16 16 0 1 0 24 36 A12 12 0 1 1 24 4Z" fill="var(--gold)" opacity="0.55"/></svg>
  </div>
  <div class="sky-el float" style="top:16%; right:10%; width:14px; animation-delay:1.2s;">
    <svg viewBox="0 0 16 16"><path d="M8 0 L9.6 6.4 L16 8 L9.6 9.6 L8 16 L6.4 9.6 L0 8 L6.4 6.4Z" fill="var(--gold-bright)" opacity="0.6"/></svg>
  </div>
  <div class="sky-el float" style="top:32%; left:6%; width:10px; animation-delay:2.4s;">
    <svg viewBox="0 0 16 16"><path d="M8 0 L9.6 6.4 L16 8 L9.6 9.6 L8 16 L6.4 9.6 L0 8 L6.4 6.4Z" fill="var(--gold-bright)" opacity="0.5"/></svg>
  </div>
  <div class="sky-el float" style="top:60%; right:7%; width:12px; animation-delay:.6s;">
    <svg viewBox="0 0 16 16"><path d="M8 0 L9.6 6.4 L16 8 L9.6 9.6 L8 16 L6.4 9.6 L0 8 L6.4 6.4Z" fill="var(--gold-bright)" opacity="0.55"/></svg>
  </div>
`;

/* ---------- hero intro timeline (plays once the envelope is opened) ---------- */
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isSmallScreen = window.matchMedia('(max-width: 640px)').matches;
function playHeroIntro(){
  if (reducedMotion) {
    gsap.set('#hero-bismillah,#hero-line1,#hero-parents,.hero-names .ch,.hero-amp,#hero-tagline,#hero-cue', { opacity:1, y:0, x:0, scale:1, filter:'none' });
    document.getElementById('hero-divider').querySelector('.ln').style.transform = 'scaleX(1)';
    return;
  }
  const tl = gsap.timeline({ defaults:{ ease:'power2.out' } });
  tl.to('#hero-bismillah', { opacity:1, y:0, duration:1.1 }, 0.1)
    .to('#hero-line1', { opacity:1, y:0, duration:1 }, 0.9)
    .to('#hero-parents', { opacity:1, y:0, duration:1 }, 1.7)
    .to('#name1 .ch', { opacity:2, y:0, rotate:0, duration:.6, stagger:.035, ease:'back.out(1.6)' }, 2.6)
    .to('.hero-amp', { opacity:1, y:0, scale:1, duration:.7, ease:'back.out(2)' }, 3.05)
    .to('#name2 .ch', { opacity:1, y:0, rotate:0, duration:.6, stagger:.035, ease:'back.out(1.6)' }, 3.2)
    .to('#hero-tagline', { opacity:1, y:0, duration:1 }, 4.05)
    .fromTo('#hero-divider .ln', { scaleX:0 }, { scaleX:1, duration:1 }, 4.5)
    .to('#hero-cue', { opacity:1, duration:1 }, 5.1);
}
document.getElementById('hero-cue').addEventListener('click', () => {
  document.getElementById('couple').scrollIntoView({ behavior:'smooth' });
});

/* ---------- envelope open interaction ---------- */
document.body.style.overflow = 'hidden';
const envScreen = document.getElementById('envelope-screen');
const envWrap = document.getElementById('env-wrap');
let envOpened = false;
function openEnvelope(){
  if (envOpened) return;
  envOpened = true;
  envWrap.classList.add('open');
  envScreen.classList.add('open');
  if (!reducedMotion) {
    setTimeout(() => {
      document.getElementById('env-flash').classList.add('burst');
      const cx = window.innerWidth/2, cy = window.innerHeight*0.42;
      for (let i=0;i<26;i++){
        const el = document.createElement('div');
        el.className = 'ember';
        const size = 2 + Math.random()*4;
        const angle = Math.random()*Math.PI*2;
        const dist = 40 + Math.random()*160;
        el.style.left = (cx/window.innerWidth*100) + 'vw';
        el.style.top = cy + 'px';
        el.style.bottom = 'auto';
        el.style.width = size+'px'; el.style.height = size+'px';
        el.style.setProperty('--drift', (Math.cos(angle)*dist)+'px');
        el.style.transform = `translateY(${Math.sin(angle)*dist}px)`;
        el.style.animation = `emberRise ${2+Math.random()*1.8}s ease-out forwards`;
        document.getElementById('embers').appendChild(el);
        setTimeout(() => el.remove(), 4200);
      }
    }, 550);
  }
  setTimeout(() => {
    envScreen.classList.add('hidden');
    document.body.style.overflow = '';
    playHeroIntro();
  }, reducedMotion ? 50 : 1300);
}
envScreen.addEventListener('click', openEnvelope);
envScreen.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openEnvelope(); } });
if (reducedMotion) setTimeout(openEnvelope, 300);
setTimeout(() => { if (!envOpened) openEnvelope(); }, 1200);

/* ---------- generic scroll reveal ---------- */
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
}, { threshold:0.2 });
document.querySelectorAll('.reveal,.reveal-scale').forEach(el => io.observe(el));

/* parallax on hero arch */
gsap.to('#arch', { yPercent:12, ease:'none', scrollTrigger:{ trigger:'#hero', start:'top top', end:'bottom top', scrub:true } });
/* couple mark subtle rotate parallax */
gsap.to('.couple-mark', { rotate:25, ease:'none', scrollTrigger:{ trigger:'#couple', start:'top bottom', end:'bottom top', scrub:true } });
/* reception card gentle rise + glow intensify on scroll */
gsap.fromTo('.rcard', { boxShadow:'0 30px 60px -30px rgba(0,0,0,.8), inset 0 0 10px rgba(201,169,110,0)' }, {
  boxShadow:'0 30px 60px -30px rgba(0,0,0,.8), inset 0 0 40px rgba(201,169,110,.08)',
  scrollTrigger:{ trigger:'#reception', start:'top 70%', end:'top 20%', scrub:true }
});
/* sky elements slow parallax drift */
document.querySelectorAll('.sky-el').forEach((el,i) => {
  gsap.to(el, { y:(i%2===0 ? -60 : 60), ease:'none', scrollTrigger:{ trigger:document.body, start:'top top', end:'bottom bottom', scrub:1 } });
});

/* ---------- countdown with flip-digit pulse ---------- */
const target = new Date(CONFIG.walimaDate).getTime();
function pad(n){ return String(n).padStart(2,'0'); }
function setDigit(id, val){
  const el = document.getElementById(id);
  if (el.textContent !== val) { el.textContent = val; el.classList.remove('pulse'); void el.offsetWidth; el.classList.add('pulse'); }
}
function tickCountdown(){
  const now = Date.now();
  let diff = Math.max(0, target - now);
  const days = Math.floor(diff/86400000); diff -= days*86400000;
  const hours = Math.floor(diff/3600000); diff -= hours*3600000;
  const mins = Math.floor(diff/60000); diff -= mins*60000;
  const secs = Math.floor(diff/1000);
  setDigit('cd-days', pad(days)); setDigit('cd-hours', pad(hours));
  setDigit('cd-mins', pad(mins)); setDigit('cd-secs', pad(secs));
}
tickCountdown();
setInterval(tickCountdown, 1000);

/* ---------- scroll progress bar ---------- */
window.addEventListener('scroll', () => {
  const h = document.documentElement;
  const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
  document.getElementById('progress').style.width = scrolled + '%';
}, { passive:true });

/* ---------- floating embers ---------- */
const emberLayer = document.getElementById('embers');
function spawnEmber(){
  const el = document.createElement('div');
  el.className = 'ember';
  const size = 2 + Math.random()*3;
  const left = Math.random()*100;
  const duration = 9 + Math.random()*8;
  const drift = (Math.random()*100 - 50) + 'px';
  el.style.left = left + 'vw';
  el.style.bottom = '-4vh';
  el.style.width = size+'px'; el.style.height = size+'px';
  el.style.setProperty('--drift', drift);
  el.style.animation = `emberRise ${duration}s linear forwards`;
  emberLayer.appendChild(el);
  setTimeout(() => el.remove(), duration*1000 + 200);
}
let emberTimer = setInterval(spawnEmber, isSmallScreen ? 900 : 500);
for (let i=0;i<(isSmallScreen?6:10);i++) setTimeout(spawnEmber, i*180);
document.addEventListener('visibilitychange', () => {
  if (document.hidden) clearInterval(emberTimer);
  else emberTimer = setInterval(spawnEmber, isSmallScreen ? 900 : 500);
});

/* burst of embers on click anywhere (skip interactive elements) */
document.addEventListener('click', (e) => {
  if (e.target.closest('#music-btn, .rsvp-btn, .im-in-btn, #envelope-screen')) return;
  for (let i=0;i<5;i++){
    const el = document.createElement('div');
    el.className = 'ember';
    const size = 2 + Math.random()*3;
    el.style.left = ((e.clientX/window.innerWidth)*100 + (Math.random()*6-3)) + 'vw';
    el.style.top = (e.clientY) + 'px';
    el.style.bottom = 'auto';
    el.style.width = size+'px'; el.style.height = size+'px';
    el.style.setProperty('--drift', (Math.random()*80-40)+'px');
    el.style.animation = `emberRise ${2+Math.random()*1.5}s ease-out forwards`;
    emberLayer.appendChild(el);
    setTimeout(() => el.remove(), 3800);
  }
});

/* ---------- "I'm in!" confirmation ---------- */
const imInMessages = [
  "Pack your bags — Badaun is about to get a whole lot more magical! ✨🧳",
  "Yay! Save the date, dust off your finest attire, and get ready to celebrate. 🕺💃",
  "We can't wait to see you there — an evening of elegance awaits. 🌙"
];
const imInBtn = document.getElementById('im-in-btn');
const imInMsgBox = document.getElementById('im-in-message');
const imInText = document.getElementById('im-in-text');
imInBtn.addEventListener('click', () => {
  if (imInBtn.classList.contains('confirmed')) return;
  imInBtn.classList.add('confirmed');
  imInBtn.querySelector('span').textContent = "You're in! 🎉";
  imInText.textContent = imInMessages[Math.floor(Math.random()*imInMessages.length)];
  imInMsgBox.classList.add('show');
  const rect = imInBtn.getBoundingClientRect();
  for (let i=0;i<14;i++){
    const el = document.createElement('div');
    el.className = 'ember';
    const size = 2 + Math.random()*4;
    el.style.left = ((rect.left+rect.width/2)/window.innerWidth*100 + (Math.random()*16-8)) + 'vw';
    el.style.top = (rect.top) + 'px';
    el.style.bottom = 'auto';
    el.style.width = size+'px'; el.style.height = size+'px';
    el.style.setProperty('--drift', (Math.random()*160-80)+'px');
    el.style.animation = `emberRise ${2.5+Math.random()*2}s ease-out forwards`;
    emberLayer.appendChild(el);
    setTimeout(() => el.remove(), 5000);
  }
});

/* ---------- RSVP ripple ---------- */
document.getElementById('rsvp-link').addEventListener('click', function(e){
  const btn = this;
  const rect = btn.getBoundingClientRect();
  const ripple = document.createElement('span');
  const size = Math.max(rect.width, rect.height);
  ripple.className = 'ripple';
  ripple.style.width = ripple.style.height = size+'px';
  ripple.style.left = (e.clientX - rect.left - size/2)+'px';
  ripple.style.top = (e.clientY - rect.top - size/2)+'px';
  btn.appendChild(ripple);
  setTimeout(() => ripple.remove(), 650);
});

/* ---------- music toggle: gentle generative melody, inspired by the
   Hijaz maqam (the scale behind much classical Arabic/Islamic music) —
   built entirely with the Web Audio API, so no external file or
   licensing is needed. Not a real recorded nasheed, just an elegant
   ambient placeholder; swap for a real track any time (see README). --- */
let audioCtx = null, musicNodes = null, playing = false, noteTimer = null;

// D Hijaz scale (root D3), spanning just over an octave, low → high
const HIJAZ = [146.83, 155.56, 185.00, 196.00, 220.00, 233.08, 261.63, 293.66, 369.99];

function buildMusicGraph(){
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  const master = audioCtx.createGain();
  master.gain.value = 0;
  master.connect(audioCtx.destination);

  // soft feedback delay for a little space around each note
  const delay = audioCtx.createDelay(1.0);
  delay.delayTime.value = 0.34;
  const feedback = audioCtx.createGain();
  feedback.gain.value = 0.32;
  const delayFilter = audioCtx.createBiquadFilter();
  delayFilter.type = 'lowpass'; delayFilter.frequency.value = 2200;
  delay.connect(delayFilter); delayFilter.connect(feedback); feedback.connect(delay);
  delay.connect(master);

  // warm open drone: root + fifth, no third (keeps it modal, not major/minor)
  const padFilter = audioCtx.createBiquadFilter();
  padFilter.type = 'lowpass'; padFilter.frequency.value = 700;
  padFilter.connect(master);
  [HIJAZ[0], HIJAZ[4]/2].forEach((f, i) => {
    const o = audioCtx.createOscillator();
    o.type = 'sine'; o.frequency.value = f;
    const g = audioCtx.createGain(); g.gain.value = 0.09;
    o.connect(g); g.connect(padFilter);
    const lfo = audioCtx.createOscillator();
    lfo.frequency.value = 0.05 + i*0.012;
    const lfoGain = audioCtx.createGain(); lfoGain.gain.value = 0.03;
    lfo.connect(lfoGain); lfoGain.connect(g.gain);
    o.start(); lfo.start();
  });

  return { master, delay };
}

function pluckNote(freq){
  const now = audioCtx.currentTime;
  const o = audioCtx.createOscillator();
  o.type = 'triangle'; o.frequency.value = freq;
  const filter = audioCtx.createBiquadFilter();
  filter.type = 'lowpass'; filter.frequency.value = freq*3.2;
  const g = audioCtx.createGain();
  g.gain.setValueAtTime(0, now);
  g.gain.linearRampToValueAtTime(0.22, now + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0005, now + 2.3);
  const pan = audioCtx.createStereoPanner ? audioCtx.createStereoPanner() : null;
  o.connect(filter); filter.connect(g);
  if (pan) { pan.pan.value = (Math.random()*0.6-0.3); g.connect(pan); pan.connect(musicNodes.master); pan.connect(musicNodes.delay); }
  else { g.connect(musicNodes.master); g.connect(musicNodes.delay); }
  o.start(now); o.stop(now + 2.4);
}

function scheduleNotes(){
  if (!playing) return;
  // favour the tonic and fifth for a settled, meditative feel
  const weighted = [0,0,4,4,1,2,3,5,6,7];
  const idx = weighted[Math.floor(Math.random()*weighted.length)];
  pluckNote(HIJAZ[idx] * (Math.random()<0.3 ? 2 : 1));
  noteTimer = setTimeout(scheduleNotes, 1800 + Math.random()*1900);
}

const musicBtn = document.getElementById('music-btn');
musicBtn.addEventListener('click', () => {
  if (!playing) {
    if (!audioCtx) musicNodes = buildMusicGraph();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    musicNodes.master.gain.cancelScheduledValues(audioCtx.currentTime);
    musicNodes.master.gain.linearRampToValueAtTime(0.55, audioCtx.currentTime + 1.6);
    playing = true; musicBtn.classList.add('playing'); musicBtn.setAttribute('aria-pressed','true');
    scheduleNotes();
  } else {
    musicNodes.master.gain.cancelScheduledValues(audioCtx.currentTime);
    musicNodes.master.gain.linearRampToValueAtTime(0, audioCtx.currentTime + .9);
    playing = false; musicBtn.classList.remove('playing'); musicBtn.setAttribute('aria-pressed','false');
    clearTimeout(noteTimer);
  }
});