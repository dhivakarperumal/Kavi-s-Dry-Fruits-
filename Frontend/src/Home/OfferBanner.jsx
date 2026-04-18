

const OfferBanner = () => {
  return (
    <section className="h-auto md:h-[60vh] bg-green4 px-4 md:px-35 py-10 overflow-hidden relative">
      <img src="https://kavisdryfruits.com/images/offer-side-bg1.png" alt="bg_image" className=" absolute -right-72 w-[35%]" />
      <div className="w-full h-full border-4 border-dashed border-green-600 rounded-lg p-6 flex flex-col lg:flex-row items-center justify-between gap-6">
        {/* Text Section */}
        <div className="lg:w-2/3 text-center lg:text-left">
          <h1 className="text-lg md:text-xl font-semibold mb-2">
            OFFER: 50% OFF ALL DRY FRUITS
          </h1>
          <p className="text-xl font-semibold mb-4">
            FOR THE NEXT <span className="text-primary">48 HOURS</span>  ONLY
          </p>
        </div>

        {/* Image */}
        <div className="lg:w-1/2 w-2/3">
          <img
            src='https://kavisdryfruits.com/images/offer-bg.png'
            alt="Offer Banner"
            className="w-full h-auto object-contain"
          />
        </div>

        {/* Coupon Code */}
        <div className="lg:w-1/2 text-center lg:text-right">
          <p className="text-lg text-center font-bold mb-2 uppercase">Farst Delivery</p>
          <p className="text-xl text-center font-bold text-green1 px-4 py-2 rounded ">
            With in 48 Hours
          </p>
        </div>
      </div>
    </section>
  );
};

export default OfferBanner;
