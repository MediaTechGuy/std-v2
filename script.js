/* ─────────────────────────────────────────────
   Blessing & Tolulope — Save The Date v3
   script.js (fixed)
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
  document.getElementById('card').setAttribute('aria-hidden', 'false');

  revealItems();
  setTimeout(startMusic, 2200);
}

/* ═══════════════════════════════════════════
   SEQUENTIAL REVEAL
   Finds all .ri and .photo-card elements inside
   the card and staggers them with .show class
═══════════════════════════════════════════ */
function revealItems() {
  /* Reveal general .ri items */
  const riItems = document.querySelectorAll('#card .ri');
  /* Reveal photo cards separately (they overlap with .ri flow) */
  const photoCards = document.querySelectorAll('#card .photo-card');

  const BASE_DELAY = 900;  /* card transition ~0.85s */
  const STAGGER    = 220;

  riItems.forEach((el, i) => {
    setTimeout(() => {
      el.classList.add('show');
    }, BASE_DELAY + i * STAGGER);
  });

  /* Photo cards stagger after the header reveals */
  photoCards.forEach((el, i) => {
    setTimeout(() => {
      el.classList.add('show');
    }, BASE_DELAY + 2 * STAGGER + i * STAGGER);
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
