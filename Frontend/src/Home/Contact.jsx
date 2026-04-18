import { useRef, useState } from "react";
import SEO from "../Component/SEO";
import emailjs from "@emailjs/browser";
import { toast } from "react-hot-toast";
import { Helmet } from "react-helmet";



const Contact = () => {
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
    <div className="py-10 px-4 relative overflow-hidden">
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

      <SEO
        title={"Contact Us - Kavi’s Dry Fruits"}
        description={"Contact Kavi’s Dry Fruits for enquiries, orders, and support. Office address, phone and email details."}
        canonical={"https://kavisdryfruits.com/contact"}
      />
      {/* Decorative Top-Right Image */}
      <img
        src="https://kavisdryfruits.com/images/offer-side-bg2.png"
        alt="nut decoration"
        className="hidden md:block absolute right-10 top-10 w-32"
      />

      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div className="text-center pb-10">
          <h2 className="text-2xl font-bold mb-4">
            Contact <span className="text-primary">Us</span>
          </h2>
          <div className="md:w-[17%] w-[80%] h-[2px] border-b-2 border-dashed border-primary mx-auto"></div>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* Left - Contact Info with background */}
          <div className="relative rounded-2xl min-h-[400px] overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url("https://kavisdryfruits.com/images/contact.jpg")` }}
            ></div>
            <div className="absolute inset-0 bg-black opacity-60"></div>

            <div className="relative p-8 text-white z-10 h-full flex flex-col justify-center">
              <h3 className="text-xl font-bold mb-6">OUR INFORMATION</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                <div>
                  <p className="mb-10">
                    <span className="font-semibold">Office Address</span>
                    <br />
                    No:58 Vaitheeshwaran Nagar
                    <br />
                    Tirupathur-635653 Tamilnadu
                  </p>
                  <p className="mb-4">
                    <span className="font-semibold">Call Us</span>
                    <br />
                    +91 9489593504
                  </p>
                </div>
                <div>
                  <p className="mb-10">
                    <span className="font-semibold">General Enquiry</span>
                    <br />
                    kavidryfruits@gmail.com
                  </p>
                  <p>
                    <span className="font-semibold">Our Timing</span>
                    <br />
                    Mon – Sun : 10:00 AM – 07:00 PM
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Enquiry Form */}
          <div>
            <h3 className="text-xl font-bold text-primary mb-6">
              ENQUIRY FORM
            </h3>
            <form ref={form} onSubmit={sendEmail} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name*"
                  required
                  className="border border-green1 rounded-md px-4 py-2 w-full focus:outline-none"
                />
                <input
                  type="text"
                  name="contact"
                  placeholder="Contact No*"
                  required
                  className="border border-green1 rounded-md px-4 py-2 w-full focus:outline-none"
                />
              </div>
              <input
                type="email"
                name="email"
                placeholder="Email Id"
                required
                className="border border-green1 rounded-md px-4 py-2 w-full focus:outline-none"
              />
              <textarea
                placeholder="Your Message*"
                name="message"
                required
                className="border border-green1 rounded-md px-4 py-2 w-full h-32 resize-none focus:outline-none"
              ></textarea>
              <button
                type="submit"
                disabled={loading}
                className={`${
                  loading ? "bg-gray-400 cursor-not-allowed" : "bg-primary hover:bg-green-700"
                } text-white font-semibold px-8 py-2 rounded-md transition`}
              >
                {loading ? "Sending..." : "Submit"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
