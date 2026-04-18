import React from 'react'
import PageHeader from '../Component/PageHeader'
import Contact from '../Home/Contact'
import Services from '../Home/Services'
import { Helmet } from "react-helmet";

const Contac_Us = () => {
  return (
    <div>
    <Helmet>
  <title>Contact Kavi’s Dry Fruits – Customer Support & Order Enquiries</title>

  <meta
    name="description"
    content="Get in touch with Kavi’s Dry Fruits for order enquiries, wholesale prices, bulk ordering, delivery details & customer support."
  />

  <meta
    name="keywords"
    content="contact kavis dry fruits, dry fruits shop phone number, dry fruits delivery support"
  />

  <link rel="canonical" href="https://kavisdryfruits.com/contact" />
</Helmet>

        <PageHeader title={"Contact Us"} curpage={"Contact Us"}/>
        <Contact/>  
        <Services/>
    </div>
  )
}

export default Contac_Us