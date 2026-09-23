import React from 'react';
import { Helmet } from 'react-helmet-async';
import PageHeader from '../Component/PageHeader';
import About from '../Home/about';
import ClientsAbout from '../Home/ClientsAbout';
import Services from '../Home/Services';
import { FaLeaf, FaSeedling, FaShieldAlt, FaHeart } from 'react-icons/fa';

const highlights = [
  {
    icon: FaSeedling,
    title: 'Farm-direct sourcing',
    text: 'We source premium dry fruits from trusted growers and harvests that meet strict quality standards.'
  },
  {
    icon: FaShieldAlt,
    title: 'Pure and honest',
    text: 'No artificial shine, no chemical coating, and no compromise on freshness or cleanliness.'
  },
  {
    icon: FaHeart,
    title: 'Made for healthier living',
    text: 'Our products support daily wellness, gifting, family snacking, and better nutrition at every stage.'
  }
];

const About_Us = () => {
  return (
    <div>
      <Helmet>
        <title>About Kavi’s Dry Fruits | Premium Quality & Real Wellness</title>
        <meta
          name="description"
          content="Learn about Kavi’s Dry Fruits, our farm-direct sourcing, purity-first process, and commitment to healthy, nutritious dry fruits for every family."
        />
        <meta
          name="keywords"
          content="about kavis dry fruits, dry fruits brand, healthy snacking, farm-direct nuts and dry fruits"
        />
        <link rel="canonical" href="https://kavisdryfruits.com/aboutus" />
      </Helmet>

      <PageHeader title={"About Us"} curpage={"About Us"} />

      <About />
      <ClientsAbout />
      <Services />
    </div>
  );
};

export default About_Us;