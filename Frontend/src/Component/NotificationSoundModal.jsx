import React, { useState, useEffect } from "react";
import {
  FaVolumeUp,
  FaVolumeMute,
  FaPlay,
  FaCheck,
  FaTimes,
  FaUpload,
  FaBell,
} from "react-icons/fa";
import {
  SOUND_PRESETS,
  getSelectedSoundPreset,
  setSelectedSoundPreset,
  getNotificationVolume,
  setNotificationVolume,
  playPresetSound,
} from "../utils/notificationAudio";

const NotificationSoundModal = ({ isOpen, onClose, onTestNotification }) => {
  const [selectedPreset, setSelectedPreset] = useState("whatsapp");
  const [volume, setVolume] = useState(80);
  const [playingId, setPlayingId] = useState(null);
  const [customFileName, setCustomFileName] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedPreset(getSelectedSoundPreset());
      setVolume(Math.round(getNotificationVolume() * 100));
      const hasCustom = localStorage.getItem("kavi_custom_audio_base64");
      if (hasCustom) {
        setCustomFileName("Custom Audio Loaded");
      }
      setSaveSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePlayPreview = (presetId) => {
    setPlayingId(presetId);
    playPresetSound(presetId, volume / 100);
    setTimeout(() => {
      setPlayingId(null);
    }, 1200);
  };

  const handleSelectSound = (presetId) => {
    setSelectedPreset(presetId);
    handlePlayPreview(presetId);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.includes("audio") && !file.name.endsWith(".mp3") && !file.name.endsWith(".wav")) {
      alert("Please select a valid audio file (.mp3 or .wav)");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Data = event.target?.result;
      if (base64Data) {
        localStorage.setItem("kavi_custom_audio_base64", String(base64Data));
        setCustomFileName(file.name);
        setSelectedPreset("custom");
        playPresetSound("custom", volume / 100);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    setSelectedSoundPreset(selectedPreset);
    setNotificationVolume(volume / 100);
    setSaveSuccess(true);
    setTimeout(() => {
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 animate-fade-in">
      <div
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center shadow-inner">
              <FaBell size={18} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight leading-none">
                Notification Sound Settings
              </h3>
              <p className="text-xs text-emerald-100 font-medium mt-1">
                Select your preferred sound and adjust volume
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
          >
            <FaTimes size={14} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1" style={{ scrollbarWidth: "thin" }}>
          {/* Volume Control */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-2">
                {volume === 0 ? (
                  <FaVolumeMute className="text-slate-400" />
                ) : (
                  <FaVolumeUp className="text-emerald-600" />
                )}
                Sound Volume
              </span>
              <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                {volume}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => {
                const newVol = Number(e.target.value);
                setVolume(newVol);
                setNotificationVolume(newVol / 100);
              }}
              className="w-full accent-emerald-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
            />
          </div>

          {/* Sound Presets List */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-3">
              Choose Incoming Alert Sound
            </label>

            <div className="grid grid-cols-1 gap-2.5">
              {SOUND_PRESETS.map((preset) => {
                const isSelected = selectedPreset === preset.id;
                const isPlaying = playingId === preset.id;

                return (
                  <div
                    key={preset.id}
                    onClick={() => handleSelectSound(preset.id)}
                    className={`relative flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-emerald-50/80 border-emerald-400 shadow-sm"
                        : "bg-white border-slate-200/80 hover:bg-slate-50 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      {/* Selection Radio Circle */}
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                          isSelected
                            ? "border-emerald-600 bg-emerald-600"
                            : "border-slate-300 bg-white"
                        }`}
                      >
                        {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p
                            className={`text-sm font-bold truncate ${
                              isSelected ? "text-emerald-950 font-black" : "text-slate-800"
                            }`}
                          >
                            {preset.name}
                          </p>
                          <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">
                            {preset.category}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 truncate mt-0.5">
                          {preset.description}
                        </p>
                      </div>
                    </div>

                    {/* Preview Play Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlayPreview(preset.id);
                      }}
                      title="Play Preview"
                      className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition shadow-sm ${
                        isPlaying
                          ? "bg-emerald-600 text-white scale-105"
                          : "bg-slate-100 text-slate-700 hover:bg-emerald-500 hover:text-white"
                      }`}
                    >
                      <FaPlay size={11} className={isPlaying ? "animate-pulse" : ""} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Optional: Upload Custom File */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-dashed border-slate-300 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <FaUpload className="text-slate-400" />
                Upload Custom Audio File
              </p>
              <p className="text-[11px] text-slate-500 truncate mt-0.5">
                {customFileName || "Supports .mp3, .wav (e.g. downloaded tone)"}
              </p>
            </div>
            <label className="px-3 py-1.5 bg-white border border-slate-300 hover:border-emerald-500 text-slate-700 hover:text-emerald-700 text-xs font-bold rounded-xl cursor-pointer shadow-sm transition shrink-0">
              Browse...
              <input
                type="file"
                accept="audio/mp3,audio/wav,audio/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          {onTestNotification && (
            <button
              type="button"
              onClick={() => {
                setSelectedSoundPreset(selectedPreset);
                setNotificationVolume(volume / 100);
                onTestNotification();
              }}
              className="w-full sm:w-auto text-xs font-bold text-slate-600 hover:text-slate-900 px-3 py-2 rounded-xl hover:bg-slate-200/60 transition"
            >
              🔔 Test Full Alert & Popup
            </button>
          )}

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className={`px-5 py-2 text-xs font-bold rounded-xl transition shadow flex items-center gap-2 text-white ${
                saveSuccess
                  ? "bg-emerald-600"
                  : "bg-emerald-600 hover:bg-emerald-700"
              }`}
            >
              {saveSuccess ? (
                <>
                  <FaCheck /> Saved!
                </>
              ) : (
                "Save Sound Preference"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSoundModal;
