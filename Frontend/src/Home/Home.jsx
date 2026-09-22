import React, { useEffect } from 'react'
import EnhancedSEO from "../Component/EnhancedSEO";
import Hero from './Hero'
import Category from './Category'
import PopularProduct from './PopularProduct'
import NewArrived from './NewArrived'
import ClientsAbout from './ClientsAbout'
import FestiveGiftPack from './FestiveGiftPack'
import Subscribe from './Subscribe'
import imagePreloadManager from '../services/imagePreloadManager';
import { useStore } from '../Context/StoreContext';
// import OfferBanner from './OfferBanner';

const Home = () => {
  const { allProducts } = useStore();

  // Preload critical images when products are loaded
  useEffect(() => {
    if (allProducts && allProducts.length > 0) {
      // Preload top products images
      const topProducts = allProducts.slice(0, 12);
      imagePreloadManager.preloadHomepageImages(topProducts).catch(err => 
        console.warn('Image preload warning:', err)
      );
    }
  }, [allProducts]);

  return (
    <div>
      <EnhancedSEO
        title={"Kavi's Dry Fruits | Premium Dry Fruits, Nuts, Seeds & Gift Boxes Online"}
        description={"Buy premium dry fruits, almonds, cashews, pistachios, dates, raisins, seeds and gift boxes at the best price. Fresh quality and Pan India delivery from Kavi's Dry Fruits."}
        keywords={"dry fruits online, premium dry fruits, almonds, cashews, pistachios, dates, raisins, gift boxes, healthy snacks, dry fruits Tamil Nadu, Tirupattur dry fruits"}
        canonical={"https://kavisdryfruits.com/"}
      />
        <Hero/>
        <Category/>
        <PopularProduct/>
        <FestiveGiftPack/> 
        <NewArrived/>
        <ClientsAbout/>        
        <Subscribe/>
    </div>
  )
}

export default Home