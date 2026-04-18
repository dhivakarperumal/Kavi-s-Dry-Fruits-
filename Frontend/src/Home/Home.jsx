import React, { useEffect } from 'react'
import EnhancedSEO from "../Component/EnhancedSEO";
import Hero from './Hero'
import Category from './Category'
import PopularProduct from './PopularProduct'
import NewArrived from './NewArrived'
import ClientsAbout from './ClientsAbout'
import FestiveGiftPack from './FestiveGiftPack'
import Subscribe from './Subscribe'
import { Helmet } from "react-helmet";
import imagePreloadManager from '../services/imagePreloadManager';
import { useStore } from '../Context/StoreContext';

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
    <Helmet>
  <title>Shop Premium Dry Fruits, Nuts, Dates & Seeds | Kavi’s Dry Fruits Tirupattur</title>

  <meta
    name="description"
    content="Buy premium dry fruits, nuts, seeds, raisins, dates and combo packs at best prices. Fresh quality delivered across Tamil Nadu and India. Contact +91 94895 93504. Tirupattur 635653."
  />

  <meta
    name="keywords"
    content="
      dry fruits shop, buy dry fruits online, almonds online, cashews online, pistachios online, dates online, raisins online, premium dry fruits store,
      fresh dry fruits Tirupattur, Tirupattur dry fruits, dry fruits 635653, dry fruits Tamil Nadu,
      dry fruits Chennai, dry fruits Coimbatore, dry fruits Madurai, dry fruits Vellore, dry fruits Salem,
      dry fruits Krishnagiri, dry fruits Dharmapuri, dry fruits Erode, dry fruits Tirunelveli,
      dry fruits Kanyakumari, dry fruits Tiruvannamalai, dry fruits Namakkal, dry fruits Trichy,
      dry fruits Thanjavur, dry fruits Cuddalore, dry fruits Dindigul, dry fruits Kanchipuram,
      buy nuts online India, premium nuts store, healthy snacks online, organic dry fruits,
      big size cashews W180, premium almonds, roasted pistachios, family pack dry fruits,
      dry fruits combo pack, Tamil Nadu pincode delivery, dry fruits shop phone number +91 94895 93504
    "
  />

  <link rel="canonical" href="https://kavisdryfruits.com/shop" />

  <meta property="og:title" content="Shop Premium Dry Fruits & Nuts – Kavi’s Dry Fruits Tirupattur" />
  <meta property="og:description" content="Premium almonds, cashews, pista, dates & seeds delivered across Tamil Nadu & India. Contact +91 94895 93504." />
  <meta property="og:url" content="https://kavisdryfruits.com/shop" />
  <meta property="og:type" content="website" />
</Helmet>

      <EnhancedSEO
        title={"Kavi’s Dry Fruits – Premium Dry Fruits, Nuts, Seeds & Gift Boxes Online"}
        description={"Buy premium dry fruits, almonds, cashews, pistachios, dates, raisins, seeds & gift boxes at best price. Pan India delivery. Fresh, healthy & handpicked quality from Kavi’s Dry Fruits."}
        keywords={"dry fruits online, premium dry fruits, almonds, cashews, pista, dates, raisins, gift boxes, healthy snacks, dry fruits Tamil Nadu, dry fruits shop Tirupathur"}
        canonical={"https://kavisdryfruits.com/"}
      />
        <Hero/>
        <Category/>
        <FestiveGiftPack/> 
        <PopularProduct/>              
        <NewArrived/>
        <ClientsAbout/>        
        <Subscribe/>
    </div>
  )
}

export default Home