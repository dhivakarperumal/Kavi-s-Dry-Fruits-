import emailjs from "@emailjs/browser";
import { toast } from "react-hot-toast";
import { useRef, useState } from "react";
import { Helmet } from "react-helmet";

const Subscribe = () => {
  const form = useRef();
  const [loading, setLoading] = useState(false);

  const sendEmail = (e) => {
    e.preventDefault();
    setLoading(true);

    emailjs
      .sendForm("service_jk0jogd", "template_g8sy9ff", form.current, {
        publicKey: "wFa5mGD4BGmNhcjWx",
      })
      .then(
        () => {
          toast.success("Message sent successfully!");
          form.current.reset();
          setLoading(false);
        },
        (error) => {
          console.error("Email error:", error.text);
          toast.error("Failed to send message. Try again.");
          setLoading(false);
        }
      );
  };
  return (
    <div className="bg-green-200 px-4 py-12 md:py-20 border-t-1 border-primary relative overflow-hidden">
      {/* Background image on bottom-left */}
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

      <img
        src="https://kavisdryfruits.com/images/Subscribe-bg.png"
        alt="Subscribe Decoration"
        className="absolute bottom-0 left-0 w-30 md:w-38 lg:w-46 hidden sm:block md:block"
      />

      <div className="max-w-4xl mx-auto flex flex-col-reverse  items-center justify-between gap-12">
        {/* Text and Form Section */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-700 mb-4">
            Subscribe to Get Exclusive Offers & Fresh Dry Fruit Deals!
          </h1>
          <div className=" flex flex-col justify-center items-center">
            <p className="text-gray-800 text-center max-w-2xl text-sm sm:text-xl font-semibold mb-6">
              Join the Kavi’s family and discover how simple, smart, and
              satisfying healthy eating can be.
            </p>

            <form ref={form} onSubmit={sendEmail}  className="flex flex-col items-center gap-4">
              <input
                type="email"
                name="email"
                placeholder="Enter Your Email..."
                required
                className="px-5 py-3 rounded-2xl border-green1 border-2 font-bold text-green1 focus:outline-none w-full sm:w-auto min-w-[200px] sm:min-w-[350px]"
              />
              <button
                type="submit"
                className="bg-green-700 hover:bg-green-800 text-white font-semibold px-6 py-3 rounded-md transition"
              >
                Subscribe Now
              </button>
            </form>
          </div>
        </div>

        {/* Image of Hands with Dry Fruits */}
        <div className="flex-1 hidden  md:block flex absolute bottom-0 right-0 lg:right-18">
          <img
            src="https://kavisdryfruits.com/images/Subscribe.png"
            alt="Hand holding dry fruits"
            className="hidden sm:block md:block md:w-42 lg:w-80"
          />
        </div>
      </div>
    </div>
  );
};

export default Subscribe;
