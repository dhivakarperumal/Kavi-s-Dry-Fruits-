import EnhancedSEO from "../Component/EnhancedSEO";
import Hero from './Hero'
import Category from './Category'
import PopularProduct from './PopularProduct'
import NewArrived from './NewArrived'
import ClientsAbout from './ClientsAbout'
import FestiveGiftPack from './FestiveGiftPack'
import Subscribe from './Subscribe'
import InstagramFeed from './InstagramFeed'
// import OfferBanner from './OfferBanner';

const Home = () => {
  return (
    <div>
      <EnhancedSEO
        title={"Kavi's Dry Fruits | Premium Dry Fruits, Nuts, Seeds & Gift Boxes Online"}
        description={"Buy premium dry fruits, almonds, cashews, pistachios, dates, raisins, seeds and gift boxes at the best price. Fresh quality and Pan India delivery from Kavi's Dry Fruits."}
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