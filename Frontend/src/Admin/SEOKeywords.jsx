import React, { useState, useEffect } from "react";
import { FaPlus, FaTimes, FaSave, FaEdit } from "react-icons/fa";
import { toast } from "react-hot-toast";
import api from "../services/api";

const createLocalId = () => `tmp-${Date.now()}-${Math.random().toString(36).slice(2)}`;
const parseKeywordsInput = (value) =>
  value
    .split(",")
    .map((keyword) => keyword.trim())
    .filter(Boolean);

const SEOKeywords = () => {
  const [keywords, setKeywords] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");

  const fetchKeywords = async () => {
    try {
      const response = await api.get("/seo");
      setKeywords(
        (response.data.keywords || []).map((item) => ({
          ...item,
          localId: item.id ? `id-${item.id}` : createLocalId(),
        }))
      );
    } catch (err) {
      console.error("Error fetching SEO keywords:", err);
      toast.error("Failed to fetch SEO keywords.");
    }
  };

  useEffect(() => {
    fetchKeywords();
  }, []);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleEditChange = (e) => {
    setEditValue(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      addKeyword(inputValue.trim());
    }
  };

  const addKeyword = (keyword) => {
    const parsed = parseKeywordsInput(keyword);
    if (parsed.length === 0) return;

    const lowerSet = new Set(keywords.map((item) => item.keyword.toLowerCase()));
    const newItems = [];

    parsed.forEach((word) => {
      const normalized = word.trim();
      if (!normalized) return;
      if (lowerSet.has(normalized.toLowerCase())) return;
      lowerSet.add(normalized.toLowerCase());
      newItems.push({ id: null, localId: createLocalId(), keyword: normalized });
    });

    if (newItems.length === 0) {
      toast.error("Keyword already exists or contains invalid text.");
      return;
    }

    setKeywords((prev) => [...prev, ...newItems]);
    setInputValue("");
    toast.success("Keyword added!");
  };

  const removeKeyword = async (item) => {
    if (item.id) {
      try {
        await api.delete(`/seo/${item.id}`);
        setKeywords((prev) => prev.filter((k) => k.localId !== item.localId));
        toast.success("Keyword deleted successfully.");
        return;
      } catch (err) {
        console.error("Error deleting keyword:", err);
        toast.error("Failed to delete keyword.");
        return;
      }
    }

    setKeywords((prev) => prev.filter((k) => k.localId !== item.localId));
    toast.success("Keyword removed!");
  };

  const startEditing = (item) => {
    setEditingId(item.localId);
    setEditValue(item.keyword);
  };

  const saveEditedKeyword = async (item) => {
    const normalized = editValue.trim();
    if (!normalized) {
      toast.error("Keyword cannot be empty.");
      return;
    }

    if (
      keywords.some(
        (k) => k.localId !== item.localId && k.keyword.toLowerCase() === normalized.toLowerCase()
      )
    ) {
      toast.error("Keyword already exists!");
      return;
    }

    if (item.id) {
      try {
        await api.put(`/seo/${item.id}`, { keyword: normalized });
        setKeywords((prev) =>
          prev.map((k) =>
            k.localId === item.localId ? { ...k, keyword: normalized } : k
          )
        );
        toast.success("Keyword updated successfully.");
      } catch (err) {
        console.error("Error updating keyword:", err);
        toast.error("Failed to update keyword.");
      }
    } else {
      setKeywords((prev) =>
        prev.map((k) =>
          k.localId === item.localId ? { ...k, keyword: normalized } : k
        )
      );
      toast.success("Keyword updated successfully.");
    }

    setEditingId(null);
    setEditValue("");
  };

  const handleSubmit = async () => {
    const newKeywords = keywords
      .filter((item) => !item.id)
      .map((item) => item.keyword.trim())
      .filter(Boolean);

    setLoading(true);
    try {
      await api.post("/seo", { keywords: newKeywords });
      toast.success("New keywords saved successfully!");
      setInputValue("");
      fetchKeywords();
    } catch (err) {
      console.error("Error saving SEO keywords:", err);
      toast.error("Failed to save SEO keywords.");
    } finally {
      setLoading(false);
    }
  };

  const hasNewKeywords = keywords.some((k) => !k.id);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 mt-3">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            SEO Keywords Management
          </h2>
          <p className="text-gray-600">
            Add and manage SEO keywords for your website
          </p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Add Keyword
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Type a keyword and press Enter"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={() => inputValue.trim() && addKeyword(inputValue.trim())}
              className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <FaPlus />
            </button>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current Keywords ({keywords.length})
          </label>
          <div className="min-h-[200px] border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
            {keywords.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <FaPlus className="mx-auto mb-2 text-2xl" />
                  <p>No keywords added yet</p>
                  <p className="text-sm">Add keywords using the input above</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {keywords.map((item, index) => (
                  <div
                    key={item.localId ?? `${item.keyword}-${index}`}
                    className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    {editingId === item.localId ? (
                      <input
                        value={editValue}
                        onChange={handleEditChange}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            saveEditedKeyword(item);
                          }
                        }}
                        onBlur={() => saveEditedKeyword(item)}
                        className="bg-white px-2 py-1 rounded-lg border border-blue-300 text-sm"
                        autoFocus
                      />
                    ) : (
                      <span>{item.keyword}</span>
                    )}

                    {editingId !== item.localId && (
                      <button
                        onClick={() => startEditing(item)}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                        type="button"
                      >
                        <FaEdit size={12} />
                      </button>
                    )}

                    <button
                      onClick={() => removeKeyword(item)}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                      type="button"
                    >
                      <FaTimes size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={loading || !hasNewKeywords}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaSave />
            {loading ? "Saving..." : hasNewKeywords ? "Save Keywords" : "All Saved"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SEOKeywords;