/**
 * Comprehensive Audio Engine for Real-Time Notifications.
 * Supports multiple distinct sound presets synthesized with Web Audio API,
 * volume control, custom MP3 playback, and localStorage persistence.
 */

export const SOUND_PRESETS = [
  {
    id: "whatsapp",
    name: "WhatsApp Chime",
    description: "Original iconic two-tone ping (Gentle & clear)",
    category: "Classic",
  },
  {
    id: "cashRegister",
    name: "Cash Register Bell",
    description: "Crisp metallic payment chime (Great for orders)",
    category: "Commerce",
  },
  {
    id: "crystal",
    name: "Crystal Glass",
    description: "High-pitch sparkling chime (Elegant & crisp)",
    category: "Modern",
  },
  {
    id: "bell",
    name: "Desk Reception Bell",
    description: "Resonant service bell chime (Warm & audible)",
    category: "Traditional",
  },
  {
    id: "digital",
    name: "Digital Arpeggio",
    description: "Upbeat triple electronic tone (High tech)",
    category: "Modern",
  },
  {
    id: "bubble",
    name: "Soft Water Pop",
    description: "Subtle, non-intrusive bubble tap",
    category: "Minimal",
  },
  {
    id: "custom",
    name: "Custom MP3 Audio",
    description: "Plays notification.mp3 from Frontend/public folder",
    category: "Custom",
  },
];

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

// Auto-unlock AudioContext on first user interaction anywhere on the page
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

// Storage helpers
export const getSelectedSoundPreset = () => {
  if (typeof window === "undefined") return "whatsapp";
  return localStorage.getItem("kavi_notification_sound_preset") || "whatsapp";
};

export const setSelectedSoundPreset = (presetId) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("kavi_notification_sound_preset", presetId);
};

export const getNotificationVolume = () => {
  if (typeof window === "undefined") return 0.8;
  const v = localStorage.getItem("kavi_notification_volume");
  return v !== null ? parseFloat(v) : 0.8;
};

export const setNotificationVolume = (volume) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("kavi_notification_volume", String(volume));
};

/**
 * Synthesizes a given sound preset using Web Audio API
 */
export const playPresetSound = (presetId = "whatsapp", volume = 0.8) => {
  try {
    // If user chose Custom MP3 or uploaded sound
    if (presetId === "custom") {
      const customData = typeof window !== "undefined" ? localStorage.getItem("kavi_custom_audio_base64") : null;
      const audio = new Audio(customData || "/notification.mp3");
      audio.volume = Math.max(0, Math.min(1, volume));
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          synthesizePreset("whatsapp", volume);
        });
      }
      return;
    }

    synthesizePreset(presetId, volume);
  } catch (err) {
    console.warn("Could not play preset sound:", err);
  }
};

const synthesizePreset = (presetId, volMultiplier = 0.8) => {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(Math.max(0.01, Math.min(1, volMultiplier)), now);
  masterGain.connect(ctx.destination);

  switch (presetId) {
    case "cashRegister": {
      // Crisp metallic chime with rich harmonics (1200Hz + 2400Hz + 3600Hz)
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = "sine";
      osc1.frequency.setValueAtTime(1200, now);
      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(2400, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.4, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(masterGain);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.45);
      osc2.stop(now + 0.45);
      break;
    }

    case "crystal": {
      // Elegant crystal glass harmonic (E6 1318Hz -> B6 1975Hz -> E7 2637Hz)
      const freqs = [1318.5, 1975.5, 2637];
      freqs.forEach((freq, idx) => {
        const start = now + idx * 0.06;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.001, start);
        gain.gain.exponentialRampToValueAtTime(0.25, start + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.35);

        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(start);
        osc.stop(start + 0.35);
      });
      break;
    }

    case "bell": {
      // Resonant desk service bell (587Hz D5 -> 880Hz A5)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.08); // A5

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.35, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);

      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(now);
      osc.stop(now + 0.55);
      break;
    }

    case "digital": {
      // Fast ascending tech arpeggio (C6 1046Hz, E6 1318Hz, G6 1568Hz)
      const notes = [1046.5, 1318.5, 1567.98];
      notes.forEach((freq, idx) => {
        const start = now + idx * 0.05;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.001, start);
        gain.gain.exponentialRampToValueAtTime(0.22, start + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.18);

        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(start);
        osc.stop(start + 0.18);
      });
      break;
    }

    case "bubble": {
      // Soft pleasant pop pitch bend (440Hz -> 880Hz quick)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(920, now + 0.08);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.35, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(now);
      osc.stop(now + 0.18);
      break;
    }

    case "whatsapp":
    default: {
      // WhatsApp-style two-tone chime: G5 (784Hz) -> C6 (1046.5Hz)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(784, now);
      gain1.gain.setValueAtTime(0.001, now);
      gain1.gain.exponentialRampToValueAtTime(0.28, now + 0.02);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc1.connect(gain1);
      gain1.connect(masterGain);
      osc1.start(now);
      osc1.stop(now + 0.12);

      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(1046.5, now + 0.08);
      gain2.gain.setValueAtTime(0.001, now + 0.08);
      gain2.gain.exponentialRampToValueAtTime(0.32, now + 0.1);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.38);
      osc2.connect(gain2);
      gain2.connect(masterGain);
      osc2.start(now + 0.08);
      osc2.stop(now + 0.38);
      break;
    }
  }
};

/**
 * Main function called on incoming notification.
 * Uses the saved sound preset and volume preference.
 */
export const playNotificationSound = (type = "default") => {
  const currentPreset = getSelectedSoundPreset();
  const currentVolume = getNotificationVolume();

  // If specific alert type and using default whatsapp, give specialized tones
  if (currentPreset === "whatsapp") {
    if (type === "lowStock") {
      playPresetSound("bell", currentVolume);
      return;
    }
  }

  playPresetSound(currentPreset, currentVolume);
};

export default playNotificationSound;
