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
  FaImages,
  FaChevronLeft,
  FaChevronRight
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
  const [activeModalTab, setActiveModalTab] = useState('benefits'); // 'benefits' | 'videos' | 'images' | 'details'
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

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8); // Default to 8 (2 rows of 4)

  // Reset to page 1 whenever filters or search query change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedGoal, selectedCategory, itemsPerPage]);

  const totalItems = filteredData.length;
  const effectiveItemsPerPage = itemsPerPage === 'all' ? totalItems : Number(itemsPerPage);
  const totalPages = Math.max(1, Math.ceil(totalItems / (effectiveItemsPerPage || 1)));

  // Slice paginated items for current page view
  const paginatedData = useMemo(() => {
    if (itemsPerPage === 'all') return filteredData;
    const startIndex = (currentPage - 1) * effectiveItemsPerPage;
    return filteredData.slice(startIndex, startIndex + effectiveItemsPerPage);
  }, [filteredData, currentPage, effectiveItemsPerPage, itemsPerPage]);

  const startItemIndex = totalItems === 0 ? 0 : (currentPage - 1) * effectiveItemsPerPage + 1;
  const endItemIndex = itemsPerPage === 'all' ? totalItems : Math.min(currentPage * effectiveItemsPerPage, totalItems);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      const el = document.getElementById('benefits-grid-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const openModal = (product, initialTab = 'benefits') => {
    setSelectedProduct(product);
    setActiveModalTab(initialTab);
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        
        {/* Editorial Section Header */}
        {/* <div className="text-center max-w-3xl mx-auto mb-8 space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100/80 border border-emerald-200 text-emerald-800 text-[11px] font-extrabold uppercase tracking-widest">
            <FaLeaf className="text-emerald-600" /> 100% Pure & Nutritionist Backed
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-stone-900 tracking-tight">
            Nature’s Superfood & Wellness Guide
          </h1>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            Discover why daily portions of dry fruits are essential for your heart, mind, and energy. Click any card to explore full health benefits and video tutorials.
          </p>
        </div> */}

        {/* Interactive Search & Filter Controls */}
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-stone-200/80 mb-8 space-y-4">
          
          {/* Top Row: Search Input & Category Selector */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 text-sm" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search superfoods, health targets (e.g. cholesterol, glowing skin, memory)..."
                className="w-full pl-11 pr-10 py-3 bg-stone-50 border border-stone-200 rounded-xl text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
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
                  className="px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-stone-800 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/30 cursor-pointer"
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
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="text-[11px] font-extrabold text-stone-400 uppercase tracking-wider mr-1">Goal:</span>
              {WELLNESS_GOALS.map((goal) => {
                const isActive = selectedGoal === goal.id;
                return (
                  <button
                    key={goal.id}
                    onClick={() => setSelectedGoal(goal.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-emerald-700 text-white shadow-sm shadow-emerald-700/20 scale-[1.02]'
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

          
        </div>

        {/* Empty State */}
        {filteredData.length === 0 ? (
          <div className="rounded-2xl bg-white border border-stone-200/80 p-10 text-center shadow-xs max-w-xl mx-auto my-12">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-3 text-xl">
              <FaLeaf />
            </div>
            <h3 className="text-xl font-bold text-stone-900 mb-2">No matching superfoods found</h3>
            <p className="text-stone-500 text-xs mb-5">
              We couldn't find any health benefit profiles matching your current filters. Try searching for a different keyword or reset your selection.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedGoal('all');
                setSelectedCategory('All');
              }}
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-sm shadow-emerald-200 cursor-pointer"
            >
              <FaRedo className="text-xs" /> Reset All Filters
            </button>
          </div>
        ) : (
          <>
            {/* Cards Grid - 4 Cards Per Row with Fully Viewable Images */}
            <div id="benefits-grid-section" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
            {paginatedData.map((item, idx) => {
              const benefits = safeParse(item.benefits);
              const primaryImage = getPrimaryImage(item);
              const videos = safeParse(item.videos);
              const images = safeParse(item.images);
              const timing = getTimingBadge(item.howToEat);

              return (
                <div
                  key={item.id || idx}
                  className="group bg-white rounded-2xl border border-stone-200/80 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col hover:-translate-y-1"
                >
                  {/* Media Header - Fully Visible Image (No Cropping) */}
                  <div 
                    onClick={() => openModal(item, 'benefits')}
                    className="relative h-48 sm:h-52 w-full bg-stone-50/80 border-b border-stone-100 flex items-center justify-center p-3 cursor-pointer overflow-hidden"
                  >
                    {primaryImage ? (
                      <img
                        src={primaryImage}
                        alt={item.productName || 'Health benefit'}
                        className="w-full h-full object-contain group-hover:scale-108 transition-transform duration-500 ease-out"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-emerald-50 text-emerald-500">
                        <FaLeaf size={44} />
                      </div>
                    )}

                    {/* Top Badges */}
                    <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/95 backdrop-blur-md text-emerald-800 text-[10px] font-bold uppercase tracking-wider shadow-xs border border-stone-100">
                        <FaLeaf className="text-emerald-600 text-[9px]" /> {item.category || 'Superfood'}
                      </span>
                      {(videos.length > 0 || images.length > 0) && (
                        <span className="inline-flex items-center gap-1 bg-stone-900/75 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] text-white font-medium shadow-xs">
                          {videos.length > 0 && <span className="flex items-center gap-1"><FaVideo className="text-[9px]" /> {videos.length}</span>}
                          {images.length > 0 && <span className="flex items-center gap-1"><FaImage className="text-[9px]" /> {images.length}</span>}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Content - Compact & Clean */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                    
                    {/* Timing Badge & Title & Short Description */}
                    <div>
                      <div className="mb-2">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/60 font-medium text-[10px]">
                          {timing.icon}
                          <span>{timing.label}</span>
                        </span>
                      </div>

                      <div className="flex items-start justify-between gap-1.5">
                        <h3 
                          onClick={() => openModal(item, 'benefits')}
                          className="text-lg font-extrabold text-stone-900 tracking-tight line-clamp-1 group-hover:text-emerald-800 transition-colors cursor-pointer"
                        >
                          {item.productName || 'Premium Superfood'}
                        </h3>
                        {benefits.length > 0 && (
                          <span className="shrink-0 text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/60 px-1.5 py-0.5 rounded-md">
                            {benefits.length} Benefits
                          </span>
                        )}
                      </div>
                      <p className="text-stone-500 text-xs mt-1 leading-relaxed line-clamp-2">
                        {item.shortDescription || item.detailedDescription || 'A nutrient-dense superfood carefully curated to boost immunity, energy, and full-body vitality.'}
                      </p>
                    </div>

                    {/* Compact Highlight Benefit Tags (Clickable to open popup) */}
                    {benefits.length > 0 && (
                      <div 
                        onClick={() => openModal(item, 'benefits')}
                        className="flex flex-wrap items-center gap-1.5 cursor-pointer"
                        title="Click to view full clinical details"
                      >
                        {benefits.slice(0, 2).map((b, i) => {
                          const { title } = normalizeBenefit(b);
                          return (
                            <span 
                              key={i} 
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-stone-50 hover:bg-emerald-50 text-stone-700 hover:text-emerald-800 text-[11px] font-medium border border-stone-200/70 transition-colors"
                            >
                              <FaCheckCircle className="text-emerald-600 text-[9px] shrink-0" />
                              <span className="truncate max-w-[130px]">{title || 'Proven Benefit'}</span>
                            </span>
                          );
                        })}
                        {benefits.length > 3 && (
                          <span className="text-[10px] font-bold text-emerald-700 hover:underline">
                            +{benefits.length - 3} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* Dietitian's Tip Box (Compact) */}
                    {(item.howToEat || item.howToStore) && (
                      <div className="bg-amber-50/80 border border-amber-200/50 rounded-xl p-2.5 text-xs text-amber-950 flex items-start gap-2">
                        <FaLightbulb className="text-amber-600 mt-0.5 shrink-0 text-xs" />
                        <p className="line-clamp-2 text-stone-700 text-[11px] leading-tight">
                          <strong className="text-amber-900 font-bold">How to Eat: </strong>
                          {item.howToEat || item.howToStore}
                        </p>
                      </div>
                    )}

                    {/* Dual Action Footer: View Benefits + View Media */}
                    <div className="pt-1 flex items-center gap-2">
                      {/* View Health Benefits in Popup Button */}
                      <button
                        onClick={() => openModal(item, 'benefits')}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-xs shadow-emerald-700/20 cursor-pointer"
                        title="View detailed health benefits"
                      >
                        <FaHeartbeat className="text-white text-xs" />
                        <span>View Benefits</span>
                      </button>

                      {/* View Media (Videos/Gallery) Button */}
                      <button
                        onClick={() => openModal(item, videos.length > 0 ? 'videos' : 'images')}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 hover:border-emerald-400 text-stone-700 text-xs font-bold transition-all shadow-2xs cursor-pointer"
                        title="View video guides and photo gallery"
                      >
                        <FaPlay className="text-emerald-600 text-xs" />
                        <span>View Media</span>
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Pagination Bar */}
          {totalPages > 1 && (
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-stone-200/80 shadow-xs">
              {/* Page Summary */}
              <p className="text-xs text-stone-500 font-medium">
                Showing <strong className="text-stone-900">{startItemIndex} - {endItemIndex}</strong> of <strong className="text-stone-900">{totalItems}</strong> superfoods
              </p>

              {/* Numbered Page Buttons with Prev/Next */}
              <div className="flex items-center gap-1.5">
                {/* Prev Button */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                    currentPage === 1
                      ? 'text-stone-300 bg-stone-100 cursor-not-allowed'
                      : 'text-stone-700 bg-stone-100 hover:bg-emerald-50 hover:text-emerald-700 cursor-pointer'
                  }`}
                  title="Previous Page"
                >
                  <FaChevronLeft size={11} />
                </button>

                {/* Page Numbers */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                  if (
                    totalPages <= 7 ||
                    pageNum === 1 ||
                    pageNum === totalPages ||
                    (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                  ) {
                    const isActive = currentPage === pageNum;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-9 h-9 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          isActive
                            ? 'bg-emerald-700 text-white shadow-sm shadow-emerald-700/30 scale-105'
                            : 'bg-stone-100 text-stone-700 hover:bg-stone-200/70'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  } else if (
                    pageNum === currentPage - 2 ||
                    pageNum === currentPage + 2
                  ) {
                    return (
                      <span key={pageNum} className="px-1 text-stone-400 text-xs font-bold select-none">
                        ...
                      </span>
                    );
                  }
                  return null;
                })}

                {/* Next Button */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                    currentPage === totalPages
                      ? 'text-stone-300 bg-stone-100 cursor-not-allowed'
                      : 'text-stone-700 bg-stone-100 hover:bg-emerald-50 hover:text-emerald-700 cursor-pointer'
                  }`}
                  title="Next Page"
                >
                  <FaChevronRight size={11} />
                </button>
              </div>

              {/* Items Per Page Selector (Bottom) */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">Per Page:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(e.target.value === 'all' ? 'all' : Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-stone-700 outline-none cursor-pointer hover:border-emerald-500"
                >
                  <option value={8}>8</option>
                  <option value={12}>12</option>
                  <option value={16}>16</option>
                  <option value={24}>24</option>
                  <option value="all">All</option>
                </select>
              </div>
            </div>
          )}
        </>
        )}

        {/* Bottom Banner: Shop & Combos Integration */}
        <div className="mt-16 bg-gradient-to-r from-emerald-900 via-emerald-800 to-green-900 rounded-2xl p-6 sm:p-10 text-white shadow-lg relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="relative z-10 max-w-xl text-center md:text-left space-y-2">
            <span className="inline-block px-3 py-1 bg-white/10 rounded-full text-emerald-200 text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
              Freshness Guaranteed
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Ready to Upgrade Your Daily Nutrition?
            </h2>
            <p className="text-emerald-100 text-xs sm:text-sm leading-relaxed">
              Every dry fruit at Kavi’s Dry Fruits is ethically sourced, naturally sun-dried, vacuum packed, and free from synthetic preservatives.
            </p>
          </div>

          <div className="relative z-10 flex flex-wrap items-center justify-center gap-3 shrink-0">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-white text-emerald-900 hover:bg-emerald-50 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow-md"
            >
              <FaShoppingBag /> Explore All Products
            </Link>
            <Link
              to="/combos"
              className="inline-flex items-center gap-2 bg-emerald-700/70 hover:bg-emerald-700 border border-emerald-500/50 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-wider transition-all backdrop-blur-sm"
            >
              Wellness Combos <FaArrowRight />
            </Link>
          </div>

          {/* Background Decorative Rings */}
          <div className="absolute -right-20 -bottom-20 w-72 h-72 rounded-full bg-emerald-600/20 blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -top-20 w-72 h-72 rounded-full bg-green-500/10 blur-3xl pointer-events-none" />
        </div>

      </div>

      {/* POPUP / MODAL: Where Key Health Benefits & Media Are Detailed */}
      {selectedProduct && (
        <div
          className="fixed inset-0 z-[1000] bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-4xl w-full max-h-[92vh] sm:max-h-[88vh] flex flex-col overflow-hidden border border-stone-100 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-6 border-b border-stone-100 flex items-center justify-between bg-stone-50/80 shrink-0">
              <div className="pr-2 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] sm:text-xs font-bold text-emerald-800 bg-emerald-100/70 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    {selectedProduct.category || 'Superfood'}
                  </span>
                  <span className="text-[11px] text-stone-400 font-medium hidden sm:inline">• Health & Nutritional Dossier</span>
                </div>
                <h2 className="text-xl sm:text-3xl font-black text-stone-900 tracking-tight truncate">
                  {selectedProduct.productName}
                </h2>
              </div>
              <button
                onClick={closeModal}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-stone-200/70 hover:bg-stone-300 text-stone-700 flex items-center justify-center transition-colors shrink-0 cursor-pointer ml-2"
                title="Close"
              >
                <FaTimes size={16} />
              </button>
            </div>

            {/* Modal Navigation Tabs (Responsive with whitespace-nowrap & scrollbar-hide) */}
            <div className="px-3 sm:px-6 border-b border-stone-100 flex items-center gap-2 sm:gap-6 bg-white overflow-x-auto scrollbar-hide shrink-0">
              <button
                onClick={() => setActiveModalTab('benefits')}
                className={`py-3 sm:py-3.5 px-2.5 sm:px-1 text-[11px] sm:text-xs font-bold uppercase tracking-wider border-b-2 flex items-center gap-1.5 shrink-0 whitespace-nowrap transition-all cursor-pointer ${
                  activeModalTab === 'benefits'
                    ? 'border-emerald-600 text-emerald-700'
                    : 'border-transparent text-stone-400 hover:text-stone-700'
                }`}
              >
                <FaHeartbeat className="text-rose-500 text-xs shrink-0" />
                <span>Key Health Benefits ({safeParse(selectedProduct.benefits).length})</span>
              </button>

              <button
                onClick={() => setActiveModalTab('videos')}
                className={`py-3 sm:py-3.5 px-2.5 sm:px-1 text-[11px] sm:text-xs font-bold uppercase tracking-wider border-b-2 flex items-center gap-1.5 shrink-0 whitespace-nowrap transition-all cursor-pointer ${
                  activeModalTab === 'videos'
                    ? 'border-emerald-600 text-emerald-700'
                    : 'border-transparent text-stone-400 hover:text-stone-700'
                }`}
              >
                <FaVideo className="text-xs shrink-0" />
                <span>Video Guides ({safeParse(selectedProduct.videos).length})</span>
              </button>

              <button
                onClick={() => setActiveModalTab('images')}
                className={`py-3 sm:py-3.5 px-2.5 sm:px-1 text-[11px] sm:text-xs font-bold uppercase tracking-wider border-b-2 flex items-center gap-1.5 shrink-0 whitespace-nowrap transition-all cursor-pointer ${
                  activeModalTab === 'images'
                    ? 'border-emerald-600 text-emerald-700'
                    : 'border-transparent text-stone-400 hover:text-stone-700'
                }`}
              >
                <FaImages className="text-xs shrink-0" />
                <span>Photo Gallery ({safeParse(selectedProduct.images).length})</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              
              {/* TAB 1: KEY HEALTH BENEFITS (Featured here in full detail) */}
              {activeModalTab === 'benefits' && (
                <div className="space-y-6">
                  
                  {/* Overview description */}
                  {(selectedProduct.detailedDescription || selectedProduct.shortDescription) && (
                    <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100">
                      <h4 className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                        <FaLeaf /> Superfood Profile
                      </h4>
                      <p className="text-stone-700 text-sm leading-relaxed">
                        {selectedProduct.detailedDescription || selectedProduct.shortDescription}
                      </p>
                    </div>
                  )}

                  {/* All Verified Key Health Benefits */}
                  <div>
                    <h4 className="text-xs font-extrabold text-stone-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                      <FaCheckCircle className="text-emerald-600" /> Clinically & Ayurvedically Verified Benefits
                    </h4>
                    
                    {(() => {
                      const benefits = safeParse(selectedProduct.benefits);
                      if (benefits.length === 0) {
                        return (
                          <div className="p-6 bg-stone-50 rounded-2xl text-center text-stone-400 text-xs">
                            No specific health benefits listed yet.
                          </div>
                        );
                      }
                      return (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                          {benefits.map((b, i) => {
                            const { title, description } = normalizeBenefit(b);
                            const iconData = getBenefitIcon(title, description);
                            return (
                              <div 
                                key={i} 
                                className="p-3.5 rounded-2xl bg-stone-50 hover:bg-emerald-50/60 border border-stone-200/80 transition-colors flex items-start gap-3"
                              >
                                <div className={`w-8 h-8 rounded-xl ${iconData.bg} border flex items-center justify-center shrink-0 text-sm mt-0.5 shadow-2xs`}>
                                  {iconData.icon}
                                </div>
                                <div className="min-w-0">
                                  <h5 className="text-sm font-bold text-stone-900">{title || 'Key Health Benefit'}</h5>
                                  {description && (
                                    <p className="text-xs text-stone-600 mt-1 leading-relaxed">{description}</p>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })()}
                  </div>

                  {/* How to Consume & How to Store */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    {selectedProduct.howToEat && (
                      <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/60">
                        <h5 className="text-xs font-extrabold text-amber-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                          <FaSun className="text-amber-600" /> Best Consumption Routine
                        </h5>
                        <p className="text-stone-700 text-xs leading-relaxed">{selectedProduct.howToEat}</p>
                      </div>
                    )}
                    {selectedProduct.howToStore && (
                      <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200/60">
                        <h5 className="text-xs font-extrabold text-emerald-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                          <FaLeaf className="text-emerald-600" /> Freshness & Storage Tip
                        </h5>
                        <p className="text-stone-700 text-xs leading-relaxed">{selectedProduct.howToStore}</p>
                      </div>
                    )}
                  </div>

                </div>
              )}

              {/* TAB 2: VIDEOS */}
              {activeModalTab === 'videos' && (
                <div>
                  {(() => {
                    const videos = safeParse(selectedProduct.videos);
                    if (videos.length === 0) {
                      return (
                        <div className="py-16 text-center text-stone-400 space-y-2">
                          <FaVideo size={36} className="mx-auto text-stone-300" />
                          <p className="font-bold text-stone-600 text-sm">No video guides attached yet</p>
                          <p className="text-xs">Check out the Key Health Benefits or Photo Gallery tab.</p>
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

              {/* TAB 3: IMAGES GALLERY */}
              {activeModalTab === 'images' && (
                <div>
                  {(() => {
                    const images = safeParse(selectedProduct.images);
                    if (images.length === 0) {
                      return (
                        <div className="py-16 text-center text-stone-400 space-y-2">
                          <FaImage size={36} className="mx-auto text-stone-300" />
                          <p className="font-bold text-stone-600 text-sm">No gallery images uploaded yet</p>
                        </div>
                      );
                    }
                    return (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {images.map((img, idx) => (
                          <div
                            key={idx}
                            onClick={() => setActivePhoto(img)}
                            className="aspect-square rounded-2xl overflow-hidden border border-stone-200 shadow-xs hover:shadow-md cursor-zoom-in group relative"
                          >
                            <img
                              src={img}
                              alt="Gallery preview"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                              <span className="opacity-0 group-hover:opacity-100 bg-white/90 text-stone-800 text-[10px] font-bold px-2 py-1 rounded-md shadow-xs">
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

            </div>

            {/* Modal Footer with Direct Shop Link */}
            <div className="p-3 sm:p-5 border-t border-stone-100 bg-stone-50/80 flex items-center justify-between gap-3 shrink-0">
              <button
                onClick={closeModal}
                className="px-4 sm:px-5 py-2.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-100 text-stone-700 text-xs font-bold tracking-wide transition-all cursor-pointer"
              >
                Close
              </button>

              <Link
                to={selectedProduct.productId ? `/shop/${selectedProduct.productId}` : '/shop'}
                onClick={closeModal}
                className="inline-flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 sm:px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm shadow-emerald-600/20 transition-all cursor-pointer shrink-0"
              >
                <FaShoppingBag className="text-xs" />
                <span>Shop This Superfood</span>
                <FaArrowRight className="text-xs hidden sm:inline" />
              </Link>
            </div>

          </div>
        </div>
      )}

      {/* Full-Screen Zoom Photo Modal */}
      {activePhoto && (
        <div
          className="fixed inset-0 z-[10000] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in zoom-in duration-200"
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
