// ====== CONFIGURACIÓN ======
const VIDEOS   = ["Videos/video1.mp4",
    "Videos/video2.mp4",
    "Videos/video3.mp4",
    "Videos/video4.mp4",
    "Videos/video5.mp4"];
const MUSICA   = "Musica/sonido1.mp3";      
const VOLUMEN  = 0.3;     
const INTRO_MS = 8000;    
const OUTRO_MS = 10000;   
const MIN_SEG  = 10;      
const VUELTAS  = 2;       
const REPETIR  = true;    
// ===========================

const $ = id => document.getElementById(id);
const wait = ms => new Promise(r => setTimeout(r, ms));
const show = id => ["intro","main","outro"].forEach(s => $(s).classList.toggle("on", s == id));

const aud = new Audio(MUSICA || undefined);
aud.loop = true;
aud.volume = VOLUMEN;

async function clip(u){
  const f = $("fg"), b = $("bg");
  f.src = b.src = u;
  f.loop = b.loop = true;
  await new Promise(r => { f.onloadedmetadata = r });
  f.currentTime = b.currentTime = 0;
  f.play().catch(()=>{});
  b.play().catch(()=>{});
  const d = f.duration || 8;
  await wait(Math.max(1, Math.ceil(MIN_SEG / d)) * d * 1000);
}

async function play(){
  do {
    show("intro");
    await wait(INTRO_MS);

    show("main");
    for (let v = 0; v < VUELTAS; v++)
      for (const u of VIDEOS) await clip(u);

    $("fg").pause(); $("bg").pause();
    show("outro");
    await wait(OUTRO_MS);
  } while (REPETIR);
}

// Música: los navegadores exigen un clic para dar sonido, se activa con el primer toque/tecla
function startMusic(){ if (MUSICA) aud.play().catch(()=>{}); }
if (MUSICA){
  aud.play().catch(()=>{
    ["click","keydown","touchstart"].forEach(ev =>
      addEventListener(ev, startMusic, { once:true }));
  });
}

// Clic en la pantalla = pantalla completa
$("stage").onclick = () =>
  document.fullscreenElement ? document.exitFullscreen() : $("stage").requestFullscreen?.();

play();