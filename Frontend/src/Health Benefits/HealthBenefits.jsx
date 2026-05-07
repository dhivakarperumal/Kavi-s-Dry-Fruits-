import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import PageHeader from '../Component/PageHeader';
import { FaLeaf, FaImage, FaVideo, FaTimes } from 'react-icons/fa';
import api from '../services/api';

const HealthBenefits = () => {
  const [healthData, setHealthData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
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

  const renderBenefitText = (benefit) => {
    if (!benefit) return '';
    if (typeof benefit === 'string') return benefit;
    if (typeof benefit === 'object') return benefit.title || benefit.description || '';
    return '';
  };

  const getPrimaryImage = (item) => {
    const images = safeParse(item.images);
    return images.length ? images[0] : null;
  };

  const getEmbedUrl = (vid) => {
    if (vid.type === 'link') {
      const url = vid.value;
      const ytRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
      const match = url.match(ytRegex);
      if (match && match[1]) return `https://www.youtube.com/embed/${match[1]}`;
      return url;
    }
    return vid.value;
  };

  const openGallery = (product) => {
    setSelectedProduct(product);
    document.body.style.overflow = 'hidden';
  };

  const closeGallery = () => {
    setSelectedProduct(null);
    setActivePhoto(null);
    document.body.style.overflow = 'auto';
  };

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen pb-20">
        <Helmet>
          <title>Loading Health Benefits | Kavi's Dry Fruits</title>
        </Helmet>
        <PageHeader title="Health Benefits" />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <div className="inline-flex items-center justify-center rounded-full bg-white p-8 shadow-xl">
            <div className="h-12 w-12 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin"></div>
          </div>
          <p className="mt-8 text-gray-600 text-lg font-medium">Loading the latest health benefit stories for you...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <Helmet>
        <title>Health Benefits of Dry Fruits & Nuts | Kavi's Dry Fruits</title>
        <meta name="description" content="Explore the nutritional value and media showcase of our premium dry fruits. View images and health tutorials." />
      </Helmet>

      <PageHeader title="Health Benefits" />

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-green-800 mb-4 uppercase tracking-tight">Nature's Powerhouse</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
            Discover why our products are essential for your health. Browse through our detailed guides and tutorials.
          </p>
        </div>

        {healthData.length === 0 ? (
          <div className="rounded-[3rem] bg-white border border-gray-200 p-12 text-center shadow-lg">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">No health benefits available yet</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">We’re preparing fresh wellness details for our products. Please check back soon or add a new health benefit from the admin panel.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {healthData.map((item, idx) => {
              const benefits = safeParse(item.benefits);
              const primaryImage = getPrimaryImage(item);

              return (
                <div
                  key={idx}
                  className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-gray-100 flex flex-col h-full hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className="relative h-56 overflow-hidden bg-emerald-100">
                    {primaryImage ? (
                      <img
                        src={primaryImage}
                        alt={item.productName || 'Health benefit'}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-emerald-100 to-green-200">
                        <FaLeaf className="text-emerald-600" size={72} />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/15" />
                    <div className="absolute left-6 bottom-6 bg-white/90 rounded-full px-4 py-2 border border-gray-200 text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
                      {item.category || 'Wellness'}
                    </div>
                  </div>

                  <div className="p-8 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-2xl font-black text-gray-900 mb-3 leading-tight line-clamp-2">{item.productName || 'Premium dry fruit'}</h3>
                      <p className="text-gray-600 text-sm mb-6 line-clamp-3">{item.shortDescription || item.detailedDescription || 'A carefully curated selection of nature-rich dry fruits designed to support stronger immunity, better digestion, and more energy.'}</p>

                      <div className="space-y-3 mb-6">
                        {benefits.slice(0, 3).map((b, i) => (
                          <div key={i} className="flex gap-3 items-start bg-gray-50 p-3 rounded-2xl border border-gray-100">
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                            <p className="text-sm text-gray-700 font-medium">{renderBenefitText(b)}</p>
                          </div>
                        ))}
                        {benefits.length > 3 && (
                          <div className="text-xs text-gray-500 uppercase tracking-[0.2em] font-semibold">+{benefits.length - 3} more benefits</div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="text-xs uppercase tracking-[0.2em] text-gray-400">How to enjoy</div>
                      <p className="text-sm text-gray-600 leading-relaxed min-h-[3rem]">{item.howToEat || item.howToStore || 'Enjoy it straight from the pack or add to smoothies and breakfast bowls.'}</p>
                      <button
                        onClick={() => openGallery(item)}
                        className="w-full bg-emerald-600 text-white py-3 rounded-full font-black uppercase tracking-widest text-[10px] hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-3"
                      >
                        View Media Gallery <FaImage size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="bg-emerald-900 p-4 text-center text-white">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em]">{item.category || 'Health Product'}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-32 text-center bg-white p-12 rounded-[3rem] shadow-lg border border-green-50">
          <h3 className="text-2xl font-bold text-green-800 mb-4">Quality Nature's Best</h3>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">Discover the health benefits of all our products and start your wellness journey today.</p>
          <a
            href="/shop"
            className="inline-block bg-green-600 text-white px-10 py-4 rounded-full font-black text-lg hover:bg-green-700 transition-all shadow-xl shadow-green-100 uppercase tracking-widest"
          >
            Go to Shop
          </a>
        </div>
      </div>

      {selectedProduct && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl animate-in fade-in duration-300 flex flex-col"
          onClick={closeGallery}
        >
          <div className="p-6 md:p-10 flex items-center justify-between relative z-10">
            <div className="pr-12">
              <h2 className="text-white text-3xl md:text-5xl font-black uppercase tracking-tight truncate">{selectedProduct.productName}</h2>
              <p className="text-green-400 font-bold tracking-widest uppercase text-xs">Full Media Gallery</p>
            </div>
            <button
              onClick={closeGallery}
              className="w-12 h-12 md:w-16 md:h-16 bg-white/10 hover:bg-red-500 text-white rounded-full flex items-center justify-center transition-all shadow-2xl backdrop-blur-md shrink-0"
            >
              <FaTimes size={24} />
            </button>
          </div>

          <div
            className="flex-1 overflow-y-auto px-6 md:px-10 pb-20 scrollbar-hide"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="max-w-6xl mx-auto space-y-16">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
                <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem]">
                  <h4 className="text-green-400 font-black uppercase text-xs mb-4 tracking-widest">Description</h4>
                  <p className="text-white/80 leading-relaxed italic">"{selectedProduct.detailedDescription || selectedProduct.shortDescription || 'No description available.'}"</p>
                </div>
                <div className="bg-green-900/40 border border-green-500/20 p-8 rounded-[2rem]">
                  <h4 className="text-green-400 font-black uppercase text-xs mb-4 tracking-widest">How to Enjoy</h4>
                  <p className="text-white/80 leading-relaxed">{selectedProduct.howToEat || 'Enjoy as a healthy daily snack.'}</p>
                </div>
              </div>

              {(() => {
                const videos = safeParse(selectedProduct.videos);
                if (videos.length === 0) return null;
                return (
                  <div className="space-y-8">
                    <div className="space-y-12">
                      {videos.map((vid, i) => (
                        <div key={i} className="aspect-video rounded-[3rem] overflow-hidden bg-black shadow-2xl border-8 border-white/5 ring-1 ring-white/20">
                          {vid.type === 'link' ? (
                            <iframe
                              src={getEmbedUrl(vid)}
                              className="w-full h-full"
                              allowFullScreen
                            />
                          ) : (
                            <video controls className="w-full h-full">
                              <source src={vid.value} type="video/mp4" />
                            </video>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {(() => {
                const images = safeParse(selectedProduct.images);
                if (images.length === 0) return null;
                return (
                  <div className="space-y-8 pb-20">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {images.map((img, i) => (
                        <div
                          key={i}
                          onClick={() => setActivePhoto(img)}
                          className="aspect-square rounded-[2.5rem] overflow-hidden border-4 border-white/10 shadow-2xl group cursor-zoom-in"
                        >
                          <img src={img} alt="gallery" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {(safeParse(selectedProduct.images).length === 0 && safeParse(selectedProduct.videos).length === 0) && (
                <div className="text-center py-20 bg-white/5 rounded-[3rem] border border-dashed border-white/10">
                  <p className="text-white/40 font-black uppercase text-xs tracking-[0.3em]">No media content available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activePhoto && (
        <div
          className="fixed inset-0 z-[200] bg-black flex items-center justify-center p-4 md:p-20 animate-in zoom-in duration-300"
          onClick={() => setActivePhoto(null)}
        >
          <button className="absolute top-10 right-10 text-white/50 hover:text-white transition-colors">
            <FaTimes size={40} />
          </button>
          <img
            src={activePhoto}
            className="max-w-full max-h-full object-contain shadow-2xl rounded-lg"
            alt="Zoomed"
          />
        </div>
      )}
    </div>
  );
};

export default HealthBenefits;
