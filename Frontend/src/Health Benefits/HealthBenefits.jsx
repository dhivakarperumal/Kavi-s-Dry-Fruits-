import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import PageHeader from '../Component/PageHeader';
import { 
  FaLeaf, 
  FaImage, 
  FaVideo, 
  FaTimes, 
  FaSearch, 
  FaHeartbeat, 
  FaBrain, 
  FaShieldAlt, 
  FaFire, 
  FaMagic, 
  FaSun, 
  FaMoon, 
  FaRegClock, 
  FaLightbulb, 
  FaShoppingBag, 
  FaPlay, 
  FaCheckCircle, 
  FaArrowRight, 
  FaRedo,
  FaImages
} from 'react-icons/fa';
import api from '../services/api';

const WELLNESS_GOALS = [
  { id: 'all', label: 'All Superfoods', icon: '🌱', keywords: [] },
  { id: 'heart', label: 'Heart & BP', icon: '🫀', keywords: ['heart', 'cholesterol', 'bp', 'blood pressure', 'cardio', 'circulation'] },
  { id: 'immunity', label: 'Immunity & Energy', icon: '🛡️', keywords: ['immune', 'energy', 'stamina', 'vitality', 'defense', 'vitamin', 'antioxidant'] },
  { id: 'brain', label: 'Brain & Memory', icon: '🧠', keywords: ['brain', 'memory', 'focus', 'mental', 'nerve', 'concentration'] },
  { id: 'glow', label: 'Skin & Hair Glow', icon: '✨', keywords: ['skin', 'hair', 'glow', 'aging', 'wrinkle', 'beauty', 'complexion'] },
  { id: 'digestion', label: 'Gut & Digestion', icon: '🌿', keywords: ['digest', 'gut', 'fiber', 'constipation', 'stomach', 'bowel', 'metabolism'] },
];

const HealthBenefits = () => {
  const [healthData, setHealthData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGoal, setSelectedGoal] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Modal states
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeModalTab, setActiveModalTab] = useState('videos'); // 'videos' | 'images' | 'details'
  const [activePhoto, setActivePhoto] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/health-benefits');
        setHealthData(response.data || []);
      } catch (error) {
        console.error("Error fetching health benefits:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const safeParse = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    try {
      const parsed = typeof data === 'string' ? JSON.parse(data) : data;
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  };

  const getPrimaryImage = (item) => {
    const images = safeParse(item.images);
    return images.length ? images[0] : null;
  };

  const getEmbedUrl = (vid) => {
    if (!vid) return '';
    if (vid.type === 'link') {
      const url = vid.value || '';
      const ytRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
      const match = url.match(ytRegex);
      if (match && match[1]) return `https://www.youtube.com/embed/${match[1]}`;
      return url;
    }
    return vid.value || '';
  };

  const normalizeBenefit = (b) => {
    if (!b) return { title: '', description: '' };
    if (typeof b === 'string') return { title: b, description: '' };
    return {
      title: b.title || b.description || '',
      description: b.title ? (b.description || '') : ''
    };
  };

  const getBenefitIcon = (title = '', description = '') => {
    const text = `${title} ${description}`.toLowerCase();
    if (text.includes('heart') || text.includes('cholesterol') || text.includes('cardio') || text.includes('blood pressure') || text.includes('bp')) {
      return { icon: <FaHeartbeat />, bg: 'bg-rose-50 text-rose-600 border-rose-100' };
    }
    if (text.includes('brain') || text.includes('memory') || text.includes('focus') || text.includes('mental') || text.includes('cognitive')) {
      return { icon: <FaBrain />, bg: 'bg-indigo-50 text-indigo-600 border-indigo-100' };
    }
    if (text.includes('skin') || text.includes('hair') || text.includes('glow') || text.includes('aging') || text.includes('youth') || text.includes('beauty')) {
      return { icon: <FaMagic />, bg: 'bg-amber-50 text-amber-600 border-amber-100' };
    }
    if (text.includes('immune') || text.includes('defense') || text.includes('infect') || text.includes('disease') || text.includes('anti')) {
      return { icon: <FaShieldAlt />, bg: 'bg-emerald-50 text-emerald-600 border-emerald-100' };
    }
    if (text.includes('energy') || text.includes('stamina') || text.includes('workout') || text.includes('muscle') || text.includes('power')) {
      return { icon: <FaFire />, bg: 'bg-orange-50 text-orange-600 border-orange-100' };
    }
    return { icon: <FaCheckCircle />, bg: 'bg-emerald-50 text-emerald-600 border-emerald-100' };
  };

  const getTimingBadge = (howToEat = '') => {
    const text = (howToEat || '').toLowerCase();
    if (text.includes('soak') || text.includes('morning') || text.includes('empty stomach')) {
      return { icon: <FaSun className="text-amber-400 text-xs" />, label: 'Best: Soaked in Morning' };
    }
    if (text.includes('night') || text.includes('bed') || text.includes('sleep') || text.includes('evening')) {
      return { icon: <FaMoon className="text-indigo-300 text-xs" />, label: 'Best: Evening / Bedtime' };
    }
    if (text.includes('workout') || text.includes('gym') || text.includes('fitness') || text.includes('energy')) {
      return { icon: <FaFire className="text-orange-400 text-xs" />, label: 'Best: Pre/Post Workout' };
    }
    return { icon: <FaRegClock className="text-emerald-300 text-xs" />, label: 'Daily Superfood Routine' };
  };

  // Extract distinct categories from data
  const categories = useMemo(() => {
    const list = new Set(healthData.map(item => item.category).filter(Boolean));
    return ['All', ...Array.from(list)];
  }, [healthData]);

  // Filtered dataset
  const filteredData = useMemo(() => {
    return healthData.filter(item => {
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;

      // Text search matching product name, category, descriptions, and benefits
      const benefits = safeParse(item.benefits);
      const benefitsText = benefits.map(b => typeof b === 'string' ? b : `${b.title || ''} ${b.description || ''}`).join(' ');
      const searchableContent = `${item.productName || ''} ${item.category || ''} ${item.shortDescription || ''} ${item.detailedDescription || ''} ${benefitsText} ${item.howToEat || ''}`.toLowerCase();

      const matchesSearch = !searchQuery.trim() || searchableContent.includes(searchQuery.toLowerCase().trim());

      // Wellness goal filter matching
      let matchesGoal = true;
      if (selectedGoal !== 'all') {
        const goal = WELLNESS_GOALS.find(g => g.id === selectedGoal);
        if (goal && goal.keywords.length > 0) {
          matchesGoal = goal.keywords.some(kw => searchableContent.includes(kw));
        }
      }

      return matchesCategory && matchesSearch && matchesGoal;
    });
  }, [healthData, searchQuery, selectedCategory, selectedGoal]);

  const openModal = (product, initialTab = 'videos') => {
    setSelectedProduct(product);
    const videos = safeParse(product.videos);
    const images = safeParse(product.images);
    if (initialTab === 'videos' && videos.length === 0 && images.length > 0) {
      setActiveModalTab('images');
    } else {
      setActiveModalTab(initialTab);
    }
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setActivePhoto(null);
    document.body.style.overflow = 'auto';
  };

  if (loading) {
    return (
      <div className="bg-stone-50 min-h-screen pb-20">
        <Helmet>
          <title>Health Benefits | Kavi's Dry Fruits</title>
        </Helmet>
        <PageHeader title="Health Benefits" />
        <div className="max-w-7xl mx-auto px-4 py-24 text-center">
          <div className="inline-flex items-center justify-center rounded-3xl bg-white p-8 shadow-xl border border-stone-100">
            <div className="h-12 w-12 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin"></div>
          </div>
          <p className="mt-6 text-stone-600 text-lg font-semibold">Loading wellness & superfood insights...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF9F6] min-h-screen pb-24 text-stone-800">
      <Helmet>
        <title>Health Benefits & Superfood Guide | Kavi's Dry Fruits</title>
        <meta name="description" content="Explore clinical and Ayurvedic health benefits of premium almonds, walnuts, dates, berries, and dry fruits. Learn nutritional values, consumption tips, and video guides." />
      </Helmet>

      <PageHeader title="Health Benefits" subtitle="wellness" curpage="Health Benefits" />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        
        {/* Editorial Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100/70 border border-emerald-200 text-emerald-800 text-xs font-extrabold uppercase tracking-widest">
            <FaLeaf className="text-emerald-600" /> 100% Pure & Nutritionist Backed
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-stone-900 tracking-tight">
            Nature’s Superfood & Wellness Guide
          </h1>
          <p className="text-stone-600 text-base sm:text-lg leading-relaxed">
            Discover how daily portions of premium dry fruits fuel your heart, enhance cognitive clarity, promote radiant skin, and power sustained vitality.
          </p>
        </div>

        {/* Interactive Search & Filter Controls */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200/80 mb-10 space-y-6">
          
          {/* Top Row: Search Input & Category Selector */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 text-base" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search superfoods, health targets (e.g. cholesterol, glowing skin, memory)..."
                className="w-full pl-12 pr-10 py-3.5 bg-stone-50 border border-stone-200 rounded-2xl text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-sm p-1"
                >
                  <FaTimes />
                </button>
              )}
            </div>

            {/* Category Dropdown */}
            {categories.length > 1 && (
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-bold text-stone-400 uppercase tracking-wider hidden lg:inline">Category:</span>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-3.5 bg-stone-50 border border-stone-200 rounded-2xl text-stone-800 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/30 cursor-pointer"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat === 'All' ? 'All Categories' : cat}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Bottom Row: Wellness Goal Filter Chips */}
          <div>
            <p className="text-[11px] font-extrabold text-stone-400 uppercase tracking-widest mb-3">
              Filter by Health Goal:
            </p>
            <div className="flex flex-wrap items-center gap-2">
              {WELLNESS_GOALS.map((goal) => {
                const isActive = selectedGoal === goal.id;
                return (
                  <button
                    key={goal.id}
                    onClick={() => setSelectedGoal(goal.id)}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20 scale-[1.02]'
                        : 'bg-stone-100 hover:bg-stone-200/70 text-stone-700 border border-transparent'
                    }`}
                  >
                    <span>{goal.icon}</span>
                    <span>{goal.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Filter Indicators & Result Count */}
          <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs text-stone-500 font-medium">
            <span>
              Showing <strong className="text-stone-900">{filteredData.length}</strong> of {healthData.length} superfoods
            </span>
            {(searchQuery || selectedGoal !== 'all' || selectedCategory !== 'All') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedGoal('all');
                  setSelectedCategory('All');
                }}
                className="inline-flex items-center gap-1.5 text-emerald-700 hover:text-emerald-800 font-bold cursor-pointer"
              >
                <FaRedo className="text-[10px]" /> Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Empty State */}
        {filteredData.length === 0 ? (
          <div className="rounded-3xl bg-white border border-stone-200/80 p-12 text-center shadow-sm max-w-xl mx-auto my-12">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">
              <FaLeaf />
            </div>
            <h3 className="text-2xl font-bold text-stone-900 mb-2">No matching superfoods found</h3>
            <p className="text-stone-500 text-sm mb-6">
              We couldn't find any health benefit profiles matching your current filters. Try searching for a different keyword or reset your selection.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedGoal('all');
                setSelectedCategory('All');
              }}
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-emerald-200"
            >
              <FaRedo className="text-xs" /> Reset All Filters
            </button>
          </div>
        ) : (
          /* Cards Grid - Option 1 Layout */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredData.map((item, idx) => {
              const benefits = safeParse(item.benefits);
              const primaryImage = getPrimaryImage(item);
              const videos = safeParse(item.videos);
              const images = safeParse(item.images);
              const timing = getTimingBadge(item.howToEat);

              return (
                <div
                  key={item.id || idx}
                  className="group bg-white rounded-3xl border border-stone-200/80 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col hover:-translate-y-1"
                >
                  {/* Media Header with Overlay & Badges */}
                  <div className="relative h-60 w-full overflow-hidden bg-emerald-50">
                    {primaryImage ? (
                      <img
                        src={primaryImage}
                        alt={item.productName || 'Health benefit'}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-50 to-green-100 text-emerald-500">
                        <FaLeaf size={56} />
                      </div>
                    )}

                    {/* Gradient Overlay for Readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                    {/* Top Badges */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-emerald-800 text-xs font-bold uppercase tracking-wider shadow-sm">
                        <FaLeaf className="text-emerald-600 text-[10px]" /> {item.category || 'Superfood'}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-700/90 text-white text-[11px] font-semibold backdrop-blur-md shadow-sm">
                        100% Natural
                      </span>
                    </div>

                    {/* Bottom Image Info: Timing & Serving Pill */}
                    <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white text-xs">
                      <div className="inline-flex items-center gap-1.5 bg-black/45 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 font-medium">
                        {timing.icon}
                        <span>{timing.label}</span>
                      </div>
                      {(videos.length > 0 || images.length > 0) && (
                        <div className="inline-flex items-center gap-1.5 bg-emerald-950/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-emerald-400/30 text-[11px] text-emerald-200">
                          {videos.length > 0 && <span className="flex items-center gap-1"><FaVideo className="text-[10px]" /> {videos.length}</span>}
                          {images.length > 0 && <span className="flex items-center gap-1"><FaImage className="text-[10px]" /> {images.length}</span>}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                    
                    {/* Title & Short Description */}
                    <div>
                      <h3 className="text-2xl font-extrabold text-stone-900 tracking-tight line-clamp-1 group-hover:text-emerald-800 transition-colors">
                        {item.productName || 'Premium Superfood'}
                      </h3>
                      <p className="text-stone-500 text-sm mt-1.5 leading-relaxed line-clamp-2">
                        {item.shortDescription || item.detailedDescription || 'A nutrient-dense superfood carefully curated to boost immunity, energy, and full-body vitality.'}
                      </p>
                    </div>

                    {/* Proven Health Benefits Cards (Top 3) */}
                    <div className="space-y-2.5">
                      <p className="text-[11px] font-extrabold text-stone-400 uppercase tracking-widest flex items-center gap-1.5">
                        <FaCheckCircle className="text-emerald-600" /> Key Health Benefits
                      </p>

                      {benefits.slice(0, 3).map((b, i) => {
                        const { title, description } = normalizeBenefit(b);
                        const iconData = getBenefitIcon(title, description);

                        return (
                          <div
                            key={i}
                            className="flex items-start gap-3 p-2.5 rounded-xl bg-stone-50 hover:bg-emerald-50/70 border border-stone-100 transition-colors"
                          >
                            <div className={`w-7 h-7 rounded-lg ${iconData.bg} border flex items-center justify-center shrink-0 text-xs mt-0.5 shadow-xs`}>
                              {iconData.icon}
                            </div>
                            <div className="min-w-0">
                              <h4 className="text-xs font-bold text-stone-800 line-clamp-1">{title || 'Essential Nutrient'}</h4>
                              {description && (
                                <p className="text-[11px] text-stone-500 leading-tight mt-0.5 line-clamp-2">{description}</p>
                              )}
                            </div>
                          </div>
                        );
                      })}

                      {benefits.length > 3 && (
                        <button
                          onClick={() => openModal(item, 'details')}
                          className="text-xs font-bold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1 pt-1 cursor-pointer"
                        >
                          +{benefits.length - 3} more clinical benefits <FaArrowRight className="text-[10px]" />
                        </button>
                      )}
                    </div>

                    {/* Dietitian's Tip Box (How to Eat / Store) */}
                    {(item.howToEat || item.howToStore) && (
                      <div className="bg-amber-50/80 border border-amber-200/60 rounded-2xl p-3 text-xs text-amber-950 flex items-start gap-2.5">
                        <FaLightbulb className="text-amber-600 mt-0.5 shrink-0 text-sm" />
                        <div className="line-clamp-2">
                          <span className="font-bold text-amber-900">Dietitian's Tip: </span>
                          <span className="text-stone-700">{item.howToEat || item.howToStore}</span>
                        </div>
                      </div>
                    )}

                    {/* Dual Action Footer: Watch & Media + Shop Button */}
                    <div className="pt-2 flex items-center gap-2.5">
                      {/* Watch & Media Button */}
                      <button
                        onClick={() => openModal(item, 'videos')}
                        className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-3 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 text-xs font-bold tracking-wide transition-all shadow-xs hover:border-emerald-300 cursor-pointer"
                        title="View videos and gallery"
                      >
                        <FaPlay className="text-emerald-600 text-xs" />
                        <span>Watch & Media</span>
                      </button>

                      {/* Direct Shop CTA */}
                      <Link
                        to={item.productId ? `/shop/${item.productId}` : '/shop'}
                        className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-bold tracking-wide transition-all shadow-sm shadow-emerald-600/20 cursor-pointer"
                      >
                        <FaShoppingBag className="text-xs" />
                        <span>Shop Product</span>
                      </Link>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom Banner: Shop & Combos Integration */}
        <div className="mt-20 bg-gradient-to-r from-emerald-900 via-emerald-800 to-green-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="relative z-10 max-w-xl text-center md:text-left space-y-3">
            <span className="inline-block px-3 py-1 bg-white/10 rounded-full text-emerald-200 text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
              Freshness Guaranteed
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Ready to Upgrade Your Daily Nutrition?
            </h2>
            <p className="text-emerald-100 text-sm sm:text-base leading-relaxed">
              Every dry fruit at Kavi’s Dry Fruits is ethically sourced, naturally sun-dried, vacuum packed, and free from synthetic preservatives.
            </p>
          </div>

          <div className="relative z-10 flex flex-wrap items-center justify-center gap-4 shrink-0">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-white text-emerald-900 hover:bg-emerald-50 px-7 py-3.5 rounded-xl font-black text-sm uppercase tracking-wider transition-all shadow-lg shadow-black/20"
            >
              <FaShoppingBag /> Explore All Products
            </Link>
            <Link
              to="/combos"
              className="inline-flex items-center gap-2 bg-emerald-700/70 hover:bg-emerald-700 border border-emerald-500/50 text-white px-7 py-3.5 rounded-xl font-black text-sm uppercase tracking-wider transition-all backdrop-blur-sm"
            >
              Wellness Combos <FaArrowRight />
            </Link>
          </div>

          {/* Background Decorative Rings */}
          <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-emerald-600/20 blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -top-20 w-80 h-80 rounded-full bg-green-500/10 blur-3xl pointer-events-none" />
        </div>

      </div>

      {/* Modern Light Media & Video Modal */}
      {selectedProduct && (
        <div
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-stone-100 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-stone-100 flex items-center justify-between bg-stone-50/60">
              <div className="pr-4 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100/70 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    {selectedProduct.category || 'Superfood'}
                  </span>
                  <span className="text-xs text-stone-400 font-medium hidden sm:inline">• Health Guide & Media</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight truncate">
                  {selectedProduct.productName}
                </h2>
              </div>
              <button
                onClick={closeModal}
                className="w-10 h-10 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors shrink-0 cursor-pointer"
                title="Close"
              >
                <FaTimes size={18} />
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="px-6 border-b border-stone-100 flex items-center gap-6 bg-white overflow-x-auto">
              <button
                onClick={() => setActiveModalTab('videos')}
                className={`py-3.5 text-xs font-bold uppercase tracking-wider border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
                  activeModalTab === 'videos'
                    ? 'border-emerald-600 text-emerald-700'
                    : 'border-transparent text-stone-400 hover:text-stone-700'
                }`}
              >
                <FaVideo /> Video Tutorials ({safeParse(selectedProduct.videos).length})
              </button>

              <button
                onClick={() => setActiveModalTab('images')}
                className={`py-3.5 text-xs font-bold uppercase tracking-wider border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
                  activeModalTab === 'images'
                    ? 'border-emerald-600 text-emerald-700'
                    : 'border-transparent text-stone-400 hover:text-stone-700'
                }`}
              >
                <FaImages /> Photo Gallery ({safeParse(selectedProduct.images).length})
              </button>

              <button
                onClick={() => setActiveModalTab('details')}
                className={`py-3.5 text-xs font-bold uppercase tracking-wider border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
                  activeModalTab === 'details'
                    ? 'border-emerald-600 text-emerald-700'
                    : 'border-transparent text-stone-400 hover:text-stone-700'
                }`}
              >
                <FaLeaf /> Full Health Dossier
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              
              {/* TAB 1: VIDEOS */}
              {activeModalTab === 'videos' && (
                <div>
                  {(() => {
                    const videos = safeParse(selectedProduct.videos);
                    if (videos.length === 0) {
                      return (
                        <div className="py-16 text-center text-stone-400 space-y-2">
                          <FaVideo size={40} className="mx-auto text-stone-300" />
                          <p className="font-bold text-stone-600">No video guides attached yet</p>
                          <p className="text-xs">Check out the Photo Gallery or Health Dossier tab.</p>
                        </div>
                      );
                    }
                    return (
                      <div className="space-y-6">
                        {videos.map((vid, idx) => (
                          <div key={idx} className="aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-lg">
                            {vid.type === 'link' ? (
                              <iframe
                                src={getEmbedUrl(vid)}
                                title={`Video guide ${idx + 1}`}
                                className="w-full h-full border-0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              />
                            ) : (
                              <video controls className="w-full h-full">
                                <source src={vid.value} type="video/mp4" />
                                Your browser does not support the video tag.
                              </video>
                            )}
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* TAB 2: IMAGES GALLERY */}
              {activeModalTab === 'images' && (
                <div>
                  {(() => {
                    const images = safeParse(selectedProduct.images);
                    if (images.length === 0) {
                      return (
                        <div className="py-16 text-center text-stone-400 space-y-2">
                          <FaImage size={40} className="mx-auto text-stone-300" />
                          <p className="font-bold text-stone-600">No gallery images uploaded yet</p>
                        </div>
                      );
                    }
                    return (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {images.map((img, idx) => (
                          <div
                            key={idx}
                            onClick={() => setActivePhoto(img)}
                            className="aspect-square rounded-2xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-md cursor-zoom-in group relative"
                          >
                            <img
                              src={img}
                              alt="Gallery preview"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                              <span className="opacity-0 group-hover:opacity-100 bg-white/90 text-stone-800 text-[10px] font-bold px-2 py-1 rounded-md shadow">
                                Click to Zoom
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* TAB 3: FULL DETAILS */}
              {activeModalTab === 'details' && (
                <div className="space-y-6">
                  {/* Detailed Description */}
                  {(selectedProduct.detailedDescription || selectedProduct.shortDescription) && (
                    <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/70">
                      <h4 className="text-xs font-extrabold text-stone-500 uppercase tracking-wider mb-2">Overview</h4>
                      <p className="text-stone-700 text-sm leading-relaxed">
                        {selectedProduct.detailedDescription || selectedProduct.shortDescription}
                      </p>
                    </div>
                  )}

                  {/* All Benefits */}
                  <div>
                    <h4 className="text-xs font-extrabold text-stone-500 uppercase tracking-wider mb-3">All Verified Benefits</h4>
                    <div className="space-y-2">
                      {safeParse(selectedProduct.benefits).map((b, i) => {
                        const { title, description } = normalizeBenefit(b);
                        const iconData = getBenefitIcon(title, description);
                        return (
                          <div key={i} className="p-3 rounded-xl bg-stone-50 border border-stone-100 flex items-start gap-3">
                            <div className={`w-7 h-7 rounded-lg ${iconData.bg} border flex items-center justify-center shrink-0 text-xs mt-0.5`}>
                              {iconData.icon}
                            </div>
                            <div>
                              <h5 className="text-xs font-bold text-stone-900">{title}</h5>
                              {description && <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">{description}</p>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* How to Eat & Store */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedProduct.howToEat && (
                      <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/50">
                        <h5 className="text-xs font-extrabold text-amber-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                          <FaSun className="text-amber-600" /> How to Consume
                        </h5>
                        <p className="text-stone-700 text-xs leading-relaxed">{selectedProduct.howToEat}</p>
                      </div>
                    )}
                    {selectedProduct.howToStore && (
                      <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/50">
                        <h5 className="text-xs font-extrabold text-emerald-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                          <FaLeaf className="text-emerald-600" /> How to Store
                        </h5>
                        <p className="text-stone-700 text-xs leading-relaxed">{selectedProduct.howToStore}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer with Direct Shop Link */}
            <div className="p-4 sm:p-6 border-t border-stone-100 bg-stone-50/60 flex items-center justify-between gap-4">
              <button
                onClick={closeModal}
                className="px-5 py-2.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-100 text-stone-700 text-xs font-bold tracking-wide transition-all cursor-pointer"
              >
                Close
              </button>

              <Link
                to={selectedProduct.productId ? `/shop/${selectedProduct.productId}` : '/shop'}
                onClick={closeModal}
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
              >
                <FaShoppingBag className="text-xs" />
                <span>Shop This Superfood</span>
                <FaArrowRight className="text-xs" />
              </Link>
            </div>

          </div>
        </div>
      )}

      {/* Full-Screen Zoom Photo Modal */}
      {activePhoto && (
        <div
          className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in zoom-in duration-200"
          onClick={() => setActivePhoto(null)}
        >
          <button
            onClick={() => setActivePhoto(null)}
            className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <FaTimes size={24} />
          </button>
          <img
            src={activePhoto}
            className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
            alt="High-resolution zoom"
          />
        </div>
      )}

    </div>
  );
};

export default HealthBenefits;
