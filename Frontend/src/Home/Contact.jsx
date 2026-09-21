import { useRef, useState } from "react";
import SEO from "../Component/SEO";
import emailjs from "@emailjs/browser";
import { toast } from "react-hot-toast";
import { Helmet } from "react-helmet";
import api from "../services/api";
import {
  FaPhoneAlt,
  FaWhatsapp,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
  FaUser,
  FaHome,
  FaCommentDots,
  FaPaperPlane,
  FaShieldAlt,
  FaTruck,
  FaAward,
  FaChevronDown
} from "react-icons/fa";

const Contact = () => {
  const form = useRef();
  const [loading, setLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      name: form.current.name.value,
      email: form.current.email.value,
      phone: form.current.contact.value,
      contact: form.current.contact.value,
      address: form.current.address.value,
      message: form.current.message.value,
      subject: "Contact Form Submission",
      source: "website",
    };

    try {
      await api.post("/contact-form", payload);

      try {
        await emailjs.sendForm("service_jk0jogd", "template_g8sy9ff", form.current, {
          publicKey: "wFa5mGD4BGmNhcjWx",
        });
      } catch (emailError) {
        console.error("Email error:", emailError);
      }

      toast.success("Message sent successfully!");
      form.current.reset();
    } catch (error) {
      console.error("Contact submission error:", error);
      toast.error(error?.response?.data?.message || "Failed to send message. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-white via-emerald-50/30 to-white py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <Helmet>
        <title>Contact Kavi’s Dry Fruits – Customer Support, Bulk & Wholesale Enquiries</title>
        <meta
          name="description"
          content="Get in touch with Kavi’s Dry Fruits for order enquiries, wholesale prices, bulk ordering, delivery details & customer support. Call +91 94895 93504."
        />
        <meta
          name="keywords"
          content="contact kavis dry fruits, dry fruits shop phone number, dry fruits delivery support, tirupattur dry fruits store"
        />
        <link rel="canonical" href="https://kavisdryfruits.com/contact" />
      </Helmet>

      <SEO
        title={"Contact Us - Kavi’s Dry Fruits"}
        description={"Contact Kavi’s Dry Fruits for enquiries, orders, and support. Office address, phone and email details."}
        canonical={"https://kavisdryfruits.com/contact"}
      />

      {/* Decorative ambient background blurs */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-200/20 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100/80 text-emerald-800 border border-emerald-200 mb-3 shadow-xs">
            <FaEnvelope className="text-emerald-600 text-xs" /> We'd Love to Hear From You
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Get in Touch With <span className="text-primary">Our Team</span>
          </h1>
          <p className="mt-3 text-slate-600 text-base sm:text-lg">
            Have questions about an order, custom gift hampers, wholesale pricing, or our natural dry fruits? Reach out to us anytime!
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-emerald-500 to-primary mx-auto mt-4 rounded-full" />
        </div>

        {/* 4 Quick Connect Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          {/* Card 1: Call Us */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 group">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-primary flex items-center justify-center text-xl mb-4 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
              <FaPhoneAlt />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Call Us</h3>
            <p className="text-xs text-slate-500 mb-3">Direct call support Mon–Sun</p>
            <a
              href="tel:+919489593504"
              className="text-sm font-semibold text-primary hover:text-emerald-700 transition flex items-center gap-1.5"
            >
              +91 94895 93504 <span>→</span>
            </a>
          </div>

          {/* Card 2: WhatsApp */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 group">
            <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center text-xl mb-4 group-hover:bg-green-600 group-hover:text-white transition-colors duration-300">
              <FaWhatsapp />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">WhatsApp Chat</h3>
            <p className="text-xs text-slate-500 mb-3">Instant response on WhatsApp</p>
            <a
              href="https://wa.me/919489593504?text=Hi%20Kavi's%20Dry%20Fruits,%20I%20have%20an%20enquiry"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-green-600 hover:text-green-700 transition flex items-center gap-1.5"
            >
              Chat on WhatsApp <span>→</span>
            </a>
          </div>

          {/* Card 3: Email */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 group">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-xl mb-4 group-hover:bg-emerald-700 group-hover:text-white transition-colors duration-300">
              <FaEnvelope />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Email Us</h3>
            <p className="text-xs text-slate-500 mb-3">Quick response within 2–4 hours</p>
            <a
              href="mailto:kavidryfruits@gmail.com"
              className="text-sm font-semibold text-primary hover:text-emerald-700 transition truncate block"
              title="kavidryfruits@gmail.com"
            >
              kavidryfruits@gmail.com
            </a>
          </div>

          {/* Card 4: Store Timings */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 group">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl mb-4 group-hover:bg-amber-600 group-hover:text-white transition-colors duration-300">
              <FaClock />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Working Hours</h3>
            <p className="text-xs text-slate-500 mb-2">Open all 7 days of the week</p>
            <p className="text-sm font-semibold text-slate-800">
              10:00 AM – 07:00 PM
            </p>
          </div>
        </div>

        {/* Main 2-Column Content: Info + Form */}
        <div className="grid lg:grid-cols-12 gap-8 items-stretch mb-16">
          {/* Left Column (5 cols): Store Info & Map */}
          <div className="lg:col-span-5 flex flex-col justify-between rounded-3xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-slate-900 text-white p-8 sm:p-10 shadow-xl relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

            <div>
              <span className="inline-block px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-semibold uppercase tracking-wider mb-4 border border-emerald-500/30">
                Store & Headquarters
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold leading-tight mb-4">
                Kavi’s Dry Fruits Store
              </h2>
              <p className="text-emerald-100/80 text-sm leading-relaxed mb-6">
                Step into our store for premium quality, naturally sourced almonds, cashews, dates, raisins, and signature gift packs in Tirupattur.
              </p>

              {/* Address card */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 mb-6">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0 mt-0.5">
                    <FaMapMarkerAlt className="text-lg" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm mb-1">Office & Store Address</h4>
                    <p className="text-emerald-100/90 text-sm leading-relaxed">
                      No: 58 Vaitheeshwaran Nagar,
                      <br />
                      Tirupathur – 635653, Tamil Nadu, India
                    </p>
                  </div>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="flex items-center gap-2 text-xs font-medium text-emerald-200/90 bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-700/30">
                  <FaShieldAlt className="text-emerald-400 text-sm shrink-0" />
                  <span>100% Quality Assured</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-emerald-200/90 bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-700/30">
                  <FaTruck className="text-emerald-400 text-sm shrink-0" />
                  <span>Pan-India Shipping</span>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/10 p-5">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-300">Need quick help?</p>
                <p className="mt-2 text-sm leading-6 text-emerald-100/80">
                  Our team can help you choose products, plan gift packs, or check an order.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <a href="tel:+919489593504" className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-xs font-bold text-emerald-900 transition hover:bg-emerald-100">
                    <FaPhoneAlt /> Call us
                  </a>
                  <a href="https://wa.me/919489593504" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-emerald-400/40 px-3 py-2 text-xs font-bold text-emerald-100 transition hover:bg-emerald-800">
                    <FaWhatsapp /> WhatsApp
                  </a>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column (7 cols): Enquiry Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xl shadow-slate-200/50">
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
                Send an Enquiry
              </h2>
              <p className="text-slate-600 text-sm sm:text-base">
                Fill in your details below. Our support team will reach out to you with pricing, order updates, or assistance.
              </p>
            </div>

            <form ref={form} onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <FaUser className="text-sm" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      placeholder="e.g. Sowmiya Ramesh"
                      required
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:border-primary focus:ring-3 focus:ring-emerald-500/15 outline-none transition text-sm text-slate-800 placeholder:text-slate-400 font-medium"
                    />
                  </div>
                </div>

                {/* Contact No */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Contact Number <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <FaPhoneAlt className="text-sm" />
                    </div>
                    <input
                      type="tel"
                      name="contact"
                      placeholder="e.g. 98765 43210"
                      required
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:border-primary focus:ring-3 focus:ring-emerald-500/15 outline-none transition text-sm text-slate-800 placeholder:text-slate-400 font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Email ID */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <FaEnvelope className="text-sm" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    placeholder="e.g. yourname@example.com"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:border-primary focus:ring-3 focus:ring-emerald-500/15 outline-none transition text-sm text-slate-800 placeholder:text-slate-400 font-medium"
                  />
                </div>
              </div>

              {/* Recipient Address */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Delivery / Recipient Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <FaHome className="text-sm" />
                  </div>
                  <input
                    type="text"
                    name="address"
                    placeholder="Street, City, Pincode"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:border-primary focus:ring-3 focus:ring-emerald-500/15 outline-none transition text-sm text-slate-800 placeholder:text-slate-400 font-medium"
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Your Message or Enquiry <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute top-3.5 left-3.5 pointer-events-none text-slate-400">
                    <FaCommentDots className="text-sm" />
                  </div>
                  <textarea
                    placeholder="Tell us what you're looking for (e.g. wholesale inquiries, gift packs, specific products)..."
                    name="message"
                    required
                    rows={4}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:border-primary focus:ring-3 focus:ring-emerald-500/15 outline-none transition text-sm text-slate-800 placeholder:text-slate-400 font-medium resize-none"
                  ></textarea>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl font-bold text-white transition-all shadow-md ${loading
                    ? "bg-slate-400 cursor-not-allowed"
                    : "bg-primary hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-600/20 active:scale-98 cursor-pointer"
                  }`}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Sending Message...</span>
                  </>
                ) : (
                  <>
                    <FaPaperPlane className="text-sm" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Frequently asked questions */}
        <section className="mx-auto max-w-5xl pb-4">
          <div className="mb-10 text-center">
            <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-amber-700">
              Helpful answers
            </span>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Frequently Asked Questions</h2>
            <p className="mx-auto mt-3 max-w-2xl text-slate-600">
              Quick answers about orders, delivery, bulk purchases, and getting in touch with our team.
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                question: "How can I place an order?",
                answer: "You can shop online through our website or contact us by phone or WhatsApp for help choosing products and completing your order.",
              },
              {
                question: "Do you accept bulk, wholesale, or gifting orders?",
                answer: "Yes. We prepare bulk orders, festive hampers, and custom gift packs. Send us your quantity and requirements so our team can share the best options.",
              },
              {
                question: "Where is Kavi’s Dry Fruits located?",
                answer: "Our store is at No: 58 Vaitheeshwaran Nagar, Tirupathur - 635653, Tamil Nadu, India. Use the map above for directions.",
              },
              {
                question: "How can I get help with delivery or an existing order?",
                answer: "Call +91 94895 93504 or message us on WhatsApp with your order details. Our team will help with delivery updates and order questions.",
              },
              {
                question: "What is your return policy?",
                answer: "Please review our Return Policy page for eligibility and steps. For assistance with a specific order, contact our support team directly.",
              },
            ].map((item, index) => {
              const isOpen = openFaq === index;

              return (
                <div key={item.question} className={`overflow-hidden rounded-2xl border bg-white transition-all ${isOpen ? "border-emerald-300 shadow-md shadow-emerald-100/60" : "border-slate-200"}`}>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenFaq(isOpen ? -1 : index)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left sm:px-6"
                  >
                    <span className="font-bold text-slate-900">{item.question}</span>
                    <FaChevronDown className={`shrink-0 text-emerald-600 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isOpen && <p className="border-t border-emerald-100 px-5 pb-5 pt-4 text-sm leading-7 text-slate-600 sm:px-6">{item.answer}</p>}
                </div>
              );
            })}
          </div>
        </section>

        {/* Full-width store location map */}
        <section className="relative left-1/2 mb-16 w-screen -translate-x-1/2 overflow-hidden border-y border-emerald-100 bg-emerald-50 shadow-xl shadow-emerald-100/40">
          <iframe
            title="Kavi's Dry Fruits store at No 58 Vaitheeshwaran Nagar, Tirupathur"
            src="https://www.google.com/maps?q=No%2058%20Vaitheeshwaran%20Nagar%2C%20Tirupathur%20635653%2C%20Tamil%20Nadu&hl=en&z=16&output=embed"
            width="100%"
            height="420"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-[360px] w-full sm:h-[420px]"
          />
        </section>
      </div>
    </div>
  );
};

export default Contact;
