import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FiArrowLeft, FiMail, FiPhone, FiMapPin, FiMessageSquare } from "react-icons/fi";
import api from "../../services/api";

const ContactFormSubmissions = () => {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const response = await api.get("/contact-form");
      setSubmissions(response.data || []);
    } catch (error) {
      console.error("Error fetching contact submissions:", error);
      toast.error("Unable to load form submissions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const formatDate = (value) => {
    if (!value) return "N/A";
    return new Date(value).toLocaleString();
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-green-900">Contact Form Submissions</h2>
          <p className="text-sm text-gray-600">All messages received from the website subscribe/contact form.</p>
        </div>
        <button
          onClick={() => navigate("/adminpanel/settings")}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-700 text-white font-medium shadow hover:bg-emerald-800"
        >
          <FiArrowLeft />
          <span>Back to Settings</span>
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20 text-gray-500">Loading submissions...</div>
      ) : submissions.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center text-gray-600">
          No submissions found yet.
        </div>
      ) : (
        <div className="grid gap-4">
          {submissions.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{item.name || "Customer"}</h3>
                  <p className="text-sm text-gray-500">{item.subject || "Contact Form"}</p>
                </div>
                <span className="text-xs bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-semibold">
                  {item.source || "website"}
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-3 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <FiMail className="text-emerald-700" />
                  <span>{item.email || "No email provided"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiPhone className="text-emerald-700" />
                  <span>{item.phone || "No phone provided"}</span>
                </div>
              </div>

              {item.address && (
                <div className="mt-4 flex items-start gap-2 text-sm text-gray-700">
                  <FiMapPin className="text-emerald-700 mt-0.5" />
                  <span>{item.address}</span>
                </div>
              )}

              <div className="mt-4 flex items-start gap-2 text-sm text-gray-700">
                <FiMessageSquare className="text-emerald-700 mt-0.5" />
                <div className="whitespace-pre-wrap">{item.message || "No message provided"}</div>
              </div>

              <div className="mt-4 text-xs text-gray-500 border-t border-gray-100 pt-3">
                Submitted on: {formatDate(item.created_at)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContactFormSubmissions;
