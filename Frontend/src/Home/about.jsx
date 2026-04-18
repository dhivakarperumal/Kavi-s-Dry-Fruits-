
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import { useState, useEffect } from "react";
import {Link} from "react-router-dom"
import { Helmet } from "react-helmet";

const About = () => {
  const { ref, inView } = useInView({
    triggerOnce: false,
    threshold: 0.4,
  });

  const [startCount, setStartCount] = useState(false);

  useEffect(() => {
    if (inView) {
      setStartCount(true);
    }
  }, [inView]);

  const stats = [
    { number: 3, suffix: "+", label: "Years of Experience" },
    { number: 1500, suffix: "+", label: "Happy Customers" },
    { number: 100, suffix: "+", label: "Natural & Handpicked" },
  ];

  return (
    <section className="bg-Beach py-8 px-6 h-auto" ref={ref}>
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

      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold mb-4">
          About <span className="text-green1">Us</span>
        </h2>
        <div className="md:w-[17%] w-[80%] h-[2px] border-b-2 border-dashed border-green1 mx-auto"></div>
      </div>

      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        {/* Left Content */}
        <div>
          <h2 className="text-3xl font-bold text-green-800 mb-4">
            Kavi’s Dry Fruits – Where Purity Meets Power
          </h2>
          <p className="text-gray-700 text-justify mb-6 font-semibold">
            At Kavi’s Dry Fruits, we believe that great health starts with what
            you eat. That’s why we bring you premium-quality dry fruits, nuts,
            seeds, and superfoods—sourced from trusted farms, packed with care,
            and delivered fresh to your doorstep. We are not just a store—we are
            your partner in building a healthier, happier lifestyle.
          </p>

          {/* Count-up Stats */}
          <div className="space-y-4 mb-6" ref={ref}>
            {stats.map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-primary text-white flex items-center justify-center text-xl font-bold shadow-lg">
                  {startCount ? (
                    <CountUp
                      end={item.number}
                      suffix={item.suffix}
                      duration={2}
                    />
                  ) : (
                    "0"
                  )}
                </div>
                <p className="text-lg font-medium text-green-900">
                  {item.label}
                </p>
              </div>
            ))}
          </div>

          <Link to={"/aboutus"} className="ml-[20%] bg-green1 hover:bg-primary transition text-white font-semibold px-6 py-3 rounded-lg shadow-md">
            Explore Our Story
          </Link >
        </div>

        {/* Right Image */}
        <div>
          <img src="https://kavisdryfruits.com/images/Kavi_logo.png" alt="About us" className=" drop-shadow-2xl" />
        </div>
      </div>
    </section>
  );
};

export default About;
