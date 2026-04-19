/* ─────────────────────────────────────────────
   Blessing & Tolulope — Save The Date
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
  document.getElementById('letter').setAttribute('aria-hidden', 'false');

  /* Reveal letter text items one by one after letter appears */
  revealItems();

  /* Start music after letter fully visible */
  setTimeout(startMusic, 1800);
}

/* ═══════════════════════════════════════════
   SEQUENTIAL TEXT REVEAL
   Each .reveal-item gets .visible with staggered delay
═══════════════════════════════════════════ */
function revealItems() {
  const items = document.querySelectorAll('.reveal-item');
  /* Letter transition finishes ~1.7s after click.
     Start revealing items from 1.7s, each 180ms apart */
  const BASE_DELAY = 1700;
  const STAGGER    = 200;

  items.forEach((el, i) => {
    setTimeout(() => {
      el.classList.add('visible');
    }, BASE_DELAY + i * STAGGER);
  });
}

/* ═══════════════════════════════════════════
   MUSIC
═══════════════════════════════════════════ */
function startMusic() {
  if (!musicEl) { initYouTube(); return; }

  musicEl.volume = 0.75;

  const p = musicEl.play();
  if (p !== undefined) {
    p.then(() => setPlayingUI(true))
     .catch(() => {
       /* Autoplay blocked — player is visible so user can tap play */
       setPlayingUI(false);
       initYouTube();
     });
  }

  musicEl.addEventListener('play',  () => setPlayingUI(true));
  musicEl.addEventListener('pause', () => setPlayingUI(false));
  musicEl.addEventListener('ended', () => setPlayingUI(false));
  musicEl.addEventListener('error', () => {
    console.warn('Local audio failed — YouTube fallback.');
    initYouTube();
  });
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
  tag.id    = 'yt-script';
  tag.src   = 'https://www.youtube.com/iframe_api';
  document.head.appendChild(tag);
}

window.onYouTubeIframeAPIReady = function () {
  ytAPIReady = true;
  ytPlayer = new YT.Player('yt-player', {
    width: '1', height: '1',
    videoId: YT_VID,
    playerVars: { autoplay: 1, controls: 0, rel: 0, loop: 1, playlist: YT_VID },
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
