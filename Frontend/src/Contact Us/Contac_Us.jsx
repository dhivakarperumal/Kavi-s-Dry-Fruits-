import React from 'react';
import PageHeader from '../Component/PageHeader';
import Contact from '../Home/Contact';
import Services from '../Home/Services';
import { Helmet } from 'react-helmet-async';
import { FaEnvelope, FaPhoneAlt, FaWhatsapp, FaCommentDots } from 'react-icons/fa';

const Contac_Us = () => {
  return (
    <div>
      <Helmet>
        <title>Contact Kavi’s Dry Fruits – Customer Support & Order Enquiries</title>

        <meta
          name="description"
          content="Get in touch with Kavi’s Dry Fruits for order enquiries, wholesale prices, bulk ordering, delivery details and customer support."
        />

        <meta
          name="keywords"
          content="contact kavis dry fruits, dry fruits shop phone number, dry fruits delivery support"
        />

        <link rel="canonical" href="https://kavisdryfruits.com/contactus" />
      </Helmet>

      <PageHeader title={"Contact Us"} curpage={"Contact Us"} />

      <section className="bg-gradient-to-b from-white via-emerald-50/40 to-white py-12 px-4 sm:px-6 lg:px-8">
        {/* <div className="max-w-6xl mx-auto grid gap-8 lg:grid-cols-[1fr_1.1fr] items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
              <FaCommentDots className="text-emerald-600" />
              Need help?
            </span>
            <h2 className="mt-4 text-3xl font-extrabold text-slate-900 sm:text-4xl">
              We’re here to help with every order, question, and custom request.
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              Whether you need help choosing the right dry fruits, placing a bulk order, or tracking a delivery, our support team is ready to assist with prompt, friendly guidance.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <a href="tel:+919489593504" className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                <FaPhoneAlt className="mb-3 text-emerald-600" />
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">Call us</p>
                <p className="mt-2 text-base font-bold text-slate-900">+91 94895 93504</p>
              </a>

              <a href="https://wa.me/919489593504?text=Hi%20Kavi's%20Dry%20Fruits,%20I%20have%20an%20enquiry" target="_blank" rel="noreferrer" className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                <FaWhatsapp className="mb-3 text-green-600" />
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">WhatsApp</p>
                <p className="mt-2 text-base font-bold text-slate-900">Quick chat support</p>
              </a>

              <a href="mailto:kavidryfruits@gmail.com" className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md sm:col-span-2">
                <FaEnvelope className="mb-3 text-emerald-600" />
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">Email</p>
                <p className="mt-2 text-base font-bold text-slate-900">kavidryfruits@gmail.com</p>
              </a>
            </div>
          </div>

          <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-xl shadow-emerald-100/60">
            <h3 className="text-2xl font-extrabold text-slate-900">How can we assist you?</h3>
            <ul className="mt-6 space-y-4 text-slate-600">
              <li className="flex items-start gap-3"><span className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-500" /> Product recommendations and healthy snacking guidance</li>
              <li className="flex items-start gap-3"><span className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-500" /> Order assistance, delivery support, and tracking updates</li>
              <li className="flex items-start gap-3"><span className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-500" /> Bulk purchase requests and festive or gifting requirements</li>
              <li className="flex items-start gap-3"><span className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-500" /> Support for custom product bundles and wholesale enquiries</li>
            </ul>
          </div>
        </div> */}
      </section>

      <Contact />
      <Services />
    </div>
  );
};

export default Contac_Us;