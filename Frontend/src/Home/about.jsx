import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import {
  FaLeaf,
  FaAward,
  FaUsers,
  FaCheckCircle,
  FaArrowRight,
  FaShieldAlt,
  FaSeedling,
  FaTruck,
  FaBoxOpen,
  FaStar,
  FaHeart
} from "react-icons/fa";

const About = () => {
  const { ref, inView } = useInView({
    triggerOnce: false,
    threshold: 0.2,
  });

  const [startCount, setStartCount] = useState(false);

  useEffect(() => {
    if (inView) {
      setStartCount(true);
    }
  }, [inView]);

  const stats = [
    {
      number: 3,
      suffix: "+",
      label: "Years of Experience",
      subtext: "Dedicated to premium health & dry fruits excellence",
      icon: FaAward,
      color: "from-emerald-500 to-teal-600",
    },
    {
      number: 1500,
      suffix: "+",
      label: "Happy Customers",
      subtext: "Delighting conscious households across India",
      icon: FaUsers,
      color: "from-emerald-600 to-primary",
    },
    {
      number: 100,
      suffix: "+",
      label: "Natural & Handpicked",
      subtext: "Zero adulteration, strictly farm-fresh produce",
      icon: FaLeaf,
      color: "from-teal-500 to-emerald-600",
    },
  ];

  const qualityPillars = [
    {
      icon: FaSeedling,
      title: "Farm-Direct Sourcing",
      description: "Directly hand-procured from trusted orchards at peak harvest to guarantee maximum natural nutrition and rich nutty flavor.",
    },
    {
      icon: FaShieldAlt,
      title: "100% Pure & Preservative-Free",
      description: "No artificial luster, chemical washes, or sulfur treatments. Pure, raw, and naturally sun-dried just as nature intended.",
    },
    {
      icon: FaBoxOpen,
      title: "Hygienic Sealed Packaging",
      description: "Multi-layer food-grade packaging safeguards freshness, crispness, and essential micro-nutrients in every packet.",
    },
    {
      icon: FaTruck,
      title: "Pan-India Express Delivery",
      description: "Prompt, insured shipping right to your doorstep, backed by attentive and friendly customer support every step of the way.",
    },
  ];

  const journeySteps = [
    {
      year: "2023",
      title: "Started with a Purity-First Promise",
      desc: "Kavi’s Dry Fruits began with a simple goal: make naturally fresh, carefully selected dry fruits available for every family.",
    },
    {
      year: "2024",
      title: "Careful Orchard Selection",
      desc: "We built trusted relationships with growers and refined our sourcing to bring premium quality and consistent freshness.",
    },
    {
      year: "2025",
      title: "Hygienic Packing & Wider Reach",
      desc: "Better food-grade packing and dependable delivery helped us serve more health-conscious households across India.",
    },
    {
      year: "2026",
      title: "Freshness Delivered Every Day",
      desc: "Today, we continue to grow with the same promise: handpicked products, honest quality, and a better snacking experience.",
    },
  ];

  return (
    <div className="bg-gradient-to-b from-[#fbfdf9] via-emerald-50/20 to-[#fdfcf7] text-slate-800 relative overflow-hidden" ref={ref}>
      <Helmet>
        <title>About Kavi’s Dry Fruits – Trusted Premium Dry Fruits Supplier</title>
        <meta
          name="description"
          content="Kavi’s Dry Fruits is a trusted dry fruits supplier offering premium almonds, cashews, dates, raisins, nuts, seeds & gift boxes with Pan India delivery."
        />
        <meta
          name="keywords"
          content="about kavis dry fruits, premium dry fruits store, dry fruits shop Tirupathur"
        />
        <link rel="canonical" href="https://kavisdryfruits.com/about" />
      </Helmet>

      {/* Decorative ambient background accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-200/25 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-amber-100/30 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Hero / Header Section */}
      <section className="pt-12 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100/80 text-emerald-800 text-xs sm:text-sm font-semibold border border-emerald-200 shadow-xs mb-4">
          <FaLeaf className="text-emerald-600" />
          <span>Pure • Handpicked • Farm-Fresh</span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
          Crafting Health, <span className="text-primary">Delivering Purity</span>
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-sm sm:text-base leading-6 text-slate-600">
          Welcome to Kavi’s Dry Fruits. We bring nature’s richest wholesome treats straight from trusted orchards to your daily wellness routine.
        </p>
        <div className="w-20 h-1 bg-gradient-to-r from-emerald-500 to-primary mx-auto mt-6 rounded-full" />
      </section>

      {/* Main Brand Story & Visual Card */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left: Brand Narrative */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-md border border-emerald-200">
              <FaAward className="text-emerald-600" /> Our Heritage & Philosophy
            </div>

            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 leading-tight">
              Kavi’s Dry Fruits – <span className="text-primary">Where Purity Meets Power</span>
            </h2>

            <p className="text-sm sm:text-base leading-6 text-slate-600">
              At <strong className="text-slate-900 font-semibold">Kavi’s Dry Fruits</strong>, we believe that great health starts with what you eat. That’s why we bring you premium-quality dry fruits, nuts, seeds, and superfoods—sourced from trusted farms, packed with care, and delivered fresh to your doorstep.
            </p>

            <p className="text-sm sm:text-base leading-6 text-slate-600">
              We are not just a store—we are your partner in building a healthier, happier lifestyle. From energizing morning breakfasts and guilt-free snacking to festive gifting, our wholesome selection is curated with an unwavering commitment to purity and flavor.
            </p>

            {/* Core Checkpoint Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-emerald-100 shadow-xs">
                <FaCheckCircle className="text-emerald-600 shrink-0 text-lg" />
                <span className="text-xs sm:text-sm font-semibold text-slate-800">100% Raw & Natural Goodness</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-emerald-100 shadow-xs">
                <FaCheckCircle className="text-emerald-600 shrink-0 text-lg" />
                <span className="text-xs sm:text-sm font-semibold text-slate-800">Zero Artificial Preservatives</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-emerald-100 shadow-xs">
                <FaCheckCircle className="text-emerald-600 shrink-0 text-lg" />
                <span className="text-xs sm:text-sm font-semibold text-slate-800">Moisture-Proof Nitrogen Sealed</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-emerald-100 shadow-xs">
                <FaCheckCircle className="text-emerald-600 shrink-0 text-lg" />
                <span className="text-xs sm:text-sm font-semibold text-slate-800">Prompt Pan-India Delivery</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 px-5 py-3 text-sm rounded-xl font-bold text-white bg-gradient-to-r from-emerald-600 to-primary hover:from-emerald-700 hover:to-green-700 transition shadow-lg shadow-emerald-700/20 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 sm:px-6 sm:py-3.5"
              >
                <span>Explore Fresh Collection</span>
                <FaArrowRight className="text-sm" />
              </Link>
              <Link
                to="/contactus"
                className="inline-flex items-center gap-2 px-5 py-3 text-sm rounded-xl font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 transition shadow-xs hover:border-slate-300 sm:px-6 sm:py-3.5"
              >
                <span>Get In Touch</span>
              </Link>
            </div>
          </div>

          {/* Right: Elegant Visual Showcase Card */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-md bg-gradient-to-br from-white via-emerald-50/40 to-white rounded-3xl p-8 sm:p-10 border border-emerald-100 shadow-2xl shadow-emerald-900/5 text-center">
              {/* Corner decorative motif */}
              <div className="absolute top-4 right-4 text-emerald-300/40 text-4xl">🌿</div>

              {/* Floating Quality Badge */}
              <div className="inline-flex items-center gap-2 bg-emerald-600 text-white px-3.5 py-1 rounded-full text-xs font-bold tracking-wide shadow-md mb-6">
                <FaAward className="text-amber-300" /> Premium Certified
              </div>

              {/* Central Logo Container */}
              <div className="relative mx-auto w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center rounded-2xl bg-white p-4 shadow-inner border border-emerald-100/80 mb-6 group">
                <img
                  src="https://kavisdryfruits.com/images/Kavi_logo.png"
                  alt="Kavi’s Dry Fruits Logo"
                  className="max-h-full max-w-full object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Under-logo Highlights */}
              <h3 className="text-xl font-extrabold text-slate-900">
                Kavi’s Dry Fruits
              </h3>
              <p className="text-xs text-emerald-800 font-semibold mt-1">
                Tirupattur, Tamil Nadu • Pan-India Delivery
              </p>

              {/* Rating & Trust badge */}
              <div className="mt-5 pt-4 border-t border-emerald-100 flex items-center justify-around text-center">
                <div>
                  <div className="flex items-center justify-center gap-1 text-amber-400 text-sm">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} />
                    ))}
                  </div>
                  <span className="text-[11px] font-medium text-slate-500 mt-0.5 block">
                    Highest Quality Grade
                  </span>
                </div>
                <div className="h-8 w-px bg-emerald-100" />
                <div>
                  <div className="flex items-center justify-center gap-1 text-emerald-700 font-bold text-sm">
                    <FaHeart className="text-rose-500 text-xs" /> 100% Pure
                  </div>
                  <span className="text-[11px] font-medium text-slate-500 mt-0.5 block">
                    No Chemicals Added
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Animated Count-up Impact Metrics */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-emerald-100 shadow-xl shadow-emerald-900/5">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Proven Trust & Growth</span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
              Our Journey in Numbers
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {stats.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="relative group p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-white to-emerald-50/40 border border-emerald-100/90 hover:border-emerald-300 transition duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col items-center text-center"
                >
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-primary text-white flex items-center justify-center text-2xl shadow-lg shadow-emerald-600/20 mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon />
                  </div>

                  <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                    {startCount ? (
                      <CountUp
                        end={item.number}
                        suffix={item.suffix}
                        duration={2.5}
                      />
                    ) : (
                      "0"
                    )}
                  </div>

                  <h4 className="mt-2 text-base font-bold text-emerald-900 sm:text-lg">
                    {item.label}
                  </h4>

                  <p className="mt-1 text-xs sm:text-sm text-slate-500 leading-relaxed">
                    {item.subtext}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Brand journey timeline */}
      <section className="px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-5xl">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-amber-700">Our milestones</span>
            <h3 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              Our Journey <span className="text-primary">So Far</span>
            </h3>
            <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
              From careful sourcing to doorstep delivery, every step is shaped by our promise of freshness and trust.
            </p>
            <div className="mx-auto mt-5 h-1 w-14 rounded-full bg-gradient-to-r from-amber-500 to-primary" />
          </div>

          <div className="relative">
            <div className="absolute bottom-0 left-4 top-0 w-px bg-gradient-to-b from-amber-400 via-emerald-500 to-emerald-200 lg:left-1/2 lg:-translate-x-1/2" />

            <div className="space-y-8 sm:space-y-12">
              {journeySteps.map((item, index) => {
                const isRight = index % 2 === 0;

                return (
                  <div key={item.year} className="relative grid grid-cols-[2rem_1fr] items-center gap-4 lg:grid-cols-[1fr_2rem_1fr] lg:gap-8">
                    <div className="absolute left-4 top-1/2 z-10 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-white bg-emerald-600 shadow-md shadow-emerald-700/20 lg:left-1/2">
                    </div>

                    <div className={`${isRight ? "lg:col-start-3" : "lg:col-start-1 lg:row-start-1"} col-start-2`}>
                      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-md shadow-emerald-900/5 transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg sm:p-6">
                        <div className="mb-3 flex items-center gap-3">
                          <span className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-base font-black text-amber-700 sm:text-lg lg:hidden">
                            {item.year}
                          </span>
                          <span className="h-px flex-1 bg-emerald-100" />
                        </div>
                        <h4 className="text-base font-bold text-slate-900 sm:text-lg">{item.title}</h4>
                        <p className="mt-2 text-xs leading-6 text-slate-600 sm:text-sm">{item.desc}</p>
                      </div>
                    </div>

                    <div className={`${isRight ? "lg:col-start-1 lg:row-start-1" : "lg:col-start-3 lg:row-start-1"} hidden items-center lg:flex`}>
                      <span className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-5 py-2 text-xl font-black text-amber-700 shadow-sm shadow-amber-100">
                        {item.year}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Brand Pillars Bento Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/60 px-3 py-1 rounded-full border border-emerald-200">
            Uncompromising Standards
          </span>
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 mt-2">
            Why Discerning Food Lovers Choose Us
          </h3>
          <p className="mt-2 text-slate-600 text-sm sm:text-base">
            Every dry fruit we pack represents the union of traditional farming wisdom and modern food safety.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {qualityPillars.map((pillar, index) => {
            const PillarIcon = pillar.icon;
            return (
              <div
                key={index}
                className="p-6 rounded-2xl bg-white border border-slate-200/80 hover:border-emerald-300 transition-all duration-300 hover:shadow-xl shadow-xs group"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-xl mb-4 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  <PillarIcon />
                </div>
                <h4 className="text-base font-bold text-slate-900 mb-2 sm:text-lg">
                  {pillar.title}
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

    
    </div>
  );
};

export default About;
