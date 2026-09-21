import React from 'react';
import { Helmet } from 'react-helmet';
import PageHeader from '../Component/PageHeader';
import About from '../Home/about';
import ClientsAbout from '../Home/ClientsAbout';
import Services from '../Home/Services';
import { FaLeaf, FaSeedling, FaShieldAlt, FaHeart } from 'react-icons/fa';

const highlights = [
  {
    icon: FaSeedling,
    title: 'Farm-direct sourcing',
    text: 'We source premium dry fruits from trusted growers and harvests that meet strict quality standards.'
  },
  {
    icon: FaShieldAlt,
    title: 'Pure and honest',
    text: 'No artificial shine, no chemical coating, and no compromise on freshness or cleanliness.'
  },
  {
    icon: FaHeart,
    title: 'Made for healthier living',
    text: 'Our products support daily wellness, gifting, family snacking, and better nutrition at every stage.'
  }
];

const About_Us = () => {
  return (
    <div>
      <Helmet>
        <title>About Kavi’s Dry Fruits | Premium Quality & Real Wellness</title>
        <meta
          name="description"
          content="Learn about Kavi’s Dry Fruits, our farm-direct sourcing, purity-first process, and commitment to healthy, nutritious dry fruits for every family."
        />
        <meta
          name="keywords"
          content="about kavis dry fruits, dry fruits brand, healthy snacking, farm-direct nuts and dry fruits"
        />
        <link rel="canonical" href="https://kavisdryfruits.com/aboutus" />
      </Helmet>

      <PageHeader title={"About Us"} curpage={"About Us"} />

      <section className="bg-gradient-to-b from-white via-emerald-50/40 to-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid gap-8 lg:grid-cols-[1.2fr_0.8fr] items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
              <FaLeaf className="text-emerald-600" />
              Our story
            </span>
            <h2 className="mt-4 text-3xl font-extrabold text-slate-900 sm:text-4xl">
              Brining honest nutrition and real taste to your everyday life.
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              Kavi’s Dry Fruits began with a simple goal: to make clean, healthy, and premium-quality dry fruits available to families who care about what they eat. From almonds and cashews to dates, raisins, and gift boxes, every product is chosen for freshness, potency, and natural goodness.
            </p>
            <p className="mt-4 text-base leading-7 text-slate-600">
              We believe nourishment should feel natural, enjoyable, and trustworthy. That’s why we focus on careful sourcing, hygienic packing, and a customer-first experience built around quality and care.
            </p>
          </div>

          <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-xl shadow-emerald-100/60">
            <div className="grid gap-4">
              {highlights.map(({ icon: Icon, title, text }) => (
                <div key={title} className="flex gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                    <Icon />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{title}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-600">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <About />
      <ClientsAbout />
      <Services />
    </div>
  );
};

export default About_Us;