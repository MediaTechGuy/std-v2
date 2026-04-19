/* ─────────────────────────────────────────────
   Blessing & Tolulope — Save The Date v3
   script.js
───────────────────────────────────────────── */

let isOpened  = false;
let isPlaying = false;

const musicEl   = document.getElementById('music');
const iconPlay  = document.getElementById('iconPlay');
const iconPause = document.getElementById('iconPause');
const musicBars = document.getElementById('musicBars');

/* ═══════════════════════════════════════════
   OPEN ENVELOPE
═══════════════════════════════════════════ */
function openEnvelope() {
  if (isOpened) return;
  isOpened = true;

  document.body.classList.add('opened');
  document.getElementById('cardReveal').setAttribute('aria-hidden', 'false');

  /* Stagger the reveal-items inside the card */
  revealItems();

  /* Start music after card fully appears */
  setTimeout(startMusic, 2000);
}

/* ═══════════════════════════════════════════
   SEQUENTIAL REVEAL
═══════════════════════════════════════════ */
function revealItems() {
  const items = document.querySelectorAll('.reveal-item');
  const BASE  = 1000; /* card appears ~0.9s after click */
  const GAP   = 220;

  items.forEach((el, i) => {
    setTimeout(() => {
      el.classList.add('visible');
    }, BASE + i * GAP);
  });
}

/* ═══════════════════════════════════════════
   MUSIC
═══════════════════════════════════════════ */
function startMusic() {
  if (!musicEl) { initYouTube(); return; }

  musicEl.volume = 0.72;

  const p = musicEl.play();
  if (p !== undefined) {
    p.then(() => setPlayingUI(true))
     .catch(() => { setPlayingUI(false); initYouTube(); });
  }

  musicEl.addEventListener('play',  () => setPlayingUI(true));
  musicEl.addEventListener('pause', () => setPlayingUI(false));
  musicEl.addEventListener('ended', () => setPlayingUI(false));
  musicEl.addEventListener('error', () => { initYouTube(); });
}

function toggleMusic() {
  if (musicEl && !musicEl.error) {
    if (musicEl.paused) {
      musicEl.play().then(() => setPlayingUI(true)).catch(() => {});
    } else {
      musicEl.pause();
      setPlayingUI(false);
    }
    return;
  }
  if (ytPlayer && ytAPIReady) {
    isPlaying ? ytPlayer.pauseVideo() : ytPlayer.playVideo();
  }
}

function setPlayingUI(playing) {
  isPlaying = playing;
  iconPlay.style.display  = playing ? 'none'  : 'block';
  iconPause.style.display = playing ? 'block' : 'none';
  playing
    ? musicBars.classList.remove('paused')
    : musicBars.classList.add('paused');
}

/* ═══════════════════════════════════════════
   YOUTUBE FALLBACK
═══════════════════════════════════════════ */
const YT_VID   = 'xBpbM9SXQXE';
let ytPlayer   = null;
let ytAPIReady = false;

function initYouTube() {
  if (document.getElementById('yt-script')) return;
  const tag = document.createElement('script');
  tag.id  = 'yt-script';
  tag.src = 'https://www.youtube.com/iframe_api';
  document.head.appendChild(tag);
}

window.onYouTubeIframeAPIReady = function () {
  ytAPIReady = true;
  ytPlayer = new YT.Player('yt-player', {
    width: '1', height: '1',
    videoId: YT_VID,
    playerVars: { autoplay:1, controls:0, rel:0, loop:1, playlist:YT_VID },
    events: {
      onReady(e)       { e.target.setVolume(70); e.target.playVideo(); },
      onStateChange(e) {
        if (e.data === YT.PlayerState.PLAYING) setPlayingUI(true);
        if (e.data === YT.PlayerState.PAUSED ||
            e.data === YT.PlayerState.ENDED)   setPlayingUI(false);
      },
    },
  });
};
