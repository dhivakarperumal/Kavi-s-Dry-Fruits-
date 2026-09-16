/**
 * Audio chime synthesizer & MP3 player for real-time notifications.
 * 
 * HOW TO CHANGE SOUND:
 * 1. OPTION 1 (Easiest - Use your own audio file):
 *    Place an MP3 file named "notification.mp3" into the "Frontend/public/" folder.
 *    The player will automatically detect and play your custom MP3!
 * 
 * 2. OPTION 2 (Code modification - Change tones):
 *    Modify the frequencies, tones, or duration in the synthesizeChime() function below.
 */

let audioCtx = null;

const getAudioContext = () => {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
};

// Unlock AudioContext on first user interaction anywhere on the page
if (typeof window !== "undefined") {
  const unlockAudio = () => {
    const ctx = getAudioContext();
    if (ctx && ctx.state === "suspended") {
      ctx.resume().then(() => {
        window.removeEventListener("click", unlockAudio);
        window.removeEventListener("keydown", unlockAudio);
        window.removeEventListener("touchstart", unlockAudio);
      }).catch(() => {});
    }
  };
  window.addEventListener("click", unlockAudio, { passive: true });
  window.addEventListener("keydown", unlockAudio, { passive: true });
  window.addEventListener("touchstart", unlockAudio, { passive: true });
}

/**
 * Synthesize tones using Web Audio API
 * @param {string} type - 'order' | 'lowStock' | 'contact' | 'default'
 */
const synthesizeChime = (type = "default") => {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  if (type === "lowStock") {
    // Two quick alert beeps (F5 698Hz)
    const playBeep = (startTime) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(698, startTime); // F5
      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.exponentialRampToValueAtTime(0.25, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + 0.12);
    };
    playBeep(now);
    playBeep(now + 0.15);
  } else if (type === "contact") {
    // Gentle pop / message ping (A5 880Hz -> E6 1318Hz)
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(880, now); // A5
    osc.frequency.exponentialRampToValueAtTime(1318, now + 0.15); // E6
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.28, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.25);
  } else {
    // WhatsApp-style two-tone chime: Tone 1 (784Hz / G5) -> Tone 2 (1046.5Hz / C6)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(784, now); // G5
    gain1.gain.setValueAtTime(0.001, now);
    gain1.gain.exponentialRampToValueAtTime(0.25, now + 0.02);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.12);

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(1046.5, now + 0.08); // C6
    gain2.gain.setValueAtTime(0.001, now + 0.08);
    gain2.gain.exponentialRampToValueAtTime(0.3, now + 0.1);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.08);
    osc2.stop(now + 0.35);
  }
};

/**
 * Main function to play notification sound.
 * Tries custom MP3 in /notification.mp3 first. If not found or fails, falls back to Web Audio API.
 * 
 * @param {string} type - 'order' | 'lowStock' | 'contact' | 'default'
 */
export const playNotificationSound = (type = "default") => {
  try {
    // Attempt custom MP3 file if present in public folder
    const audio = new Audio("/notification.mp3");
    audio.volume = 0.8;
    const playPromise = audio.play();

    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Fall back to clean Web Audio API synthesizer
        synthesizeChime(type);
      });
    }
  } catch (err) {
    synthesizeChime(type);
  }
};

export default playNotificationSound;
