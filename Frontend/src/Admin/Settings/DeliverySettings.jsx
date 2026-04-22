import React, { useState, useEffect } from "react";
import { FaTruck, FaSave, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "../../services/api";

const DeliverySettings = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    shipping_enabled: "false",
    shipping_amount: "0",
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get("/settings");
        if (res.data) {
          setSettings({
            shipping_enabled: res.data.shipping_enabled || "false",
            shipping_amount: res.data.shipping_amount || "0",
          });
        }
      } catch (error) {
        console.error("Fetch settings error:", error);
        toast.error("Failed to load settings");
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.post("/settings", settings);
      toast.success("Settings saved successfully!");
    } catch (error) {
      console.error("Save settings error:", error);
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-10 bg-slate-50 min-h-screen">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate("/adminpanel/settings")}
          className="flex items-center gap-2 text-slate-600 hover:text-emerald-600 transition-colors mb-6 group"
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-semibold">Back to Settings</span>
        </button>

        <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 shadow-inner">
              <FaTruck size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tighter">
                Delivery Settings
              </h2>
              <p className="text-slate-500 text-sm font-medium">
                Configure global shipping charges for your store.
              </p>
            </div>
          </div>

          <div className="space-y-8">
            {/* Toggle Switch */}
            <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900">Enable Shipping Charge</h3>
                <p className="text-xs text-slate-500">Enable or disable delivery fees on checkout.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={settings.shipping_enabled === "true"}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      shipping_enabled: e.target.checked ? "true" : "false",
                    }))
                  }
                />
                <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>

            {/* Shipping Amount */}
            {settings.shipping_enabled === "true" && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">
                  Default Shipping Amount (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                  <input
                    type="number"
                    value={settings.shipping_amount}
                    onChange={(e) =>
                      setSettings((prev) => ({ ...prev, shipping_amount: e.target.value }))
                    }
                    className="w-full pl-10 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-bold text-slate-900"
                    placeholder="Enter amount"
                  />
                </div>
                <p className="text-xs text-slate-400 mt-2 ml-1 italic">
                  This amount will be added to the total at checkout when enabled.
                </p>
              </div>
            )}

            {/* Save Button */}
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-600 transition-all duration-300 shadow-lg shadow-slate-900/10 disabled:bg-slate-400"
            >
              <FaSave />
              {saving ? "Saving Changes..." : "Save Settings"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliverySettings;
