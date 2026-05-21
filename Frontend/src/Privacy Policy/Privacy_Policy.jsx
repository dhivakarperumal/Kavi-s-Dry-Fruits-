import React from 'react'
import PageHeader from '../Component/PageHeader'
import { Helmet } from 'react-helmet'

const Privacy_Policy = () => {
  return (
    <div>
      <Helmet>
        <title>Privacy Policy - Kavi’s Dry Fruits</title>
        <meta
          name="description"
          content="Read Kavi’s Dry Fruits privacy policy to learn how we collect, use, and protect your personal data when you shop with us."
        />
        <meta
          name="keywords"
          content="privacy policy dry fruits, kavi dry fruits privacy, personal data, cookies, customer information"
        />
        <link rel="canonical" href="https://kavisdryfruits.com/privacy-policy" />
      </Helmet>

      <PageHeader
        title={"Privacy Policy"}
        subtitle={"privacy-policy"}
        curpage={"Privacy Policy"}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <h2 className="text-2xl font-bold mb-4">Privacy Policy</h2>
          <p className="text-base leading-7 text-gray-700">
            At Kavi’s Dry Fruits, protecting your personal information is a top priority. This privacy policy explains what data we collect, why we collect it, and how we use it when you shop on our website.
          </p>

          <div>
            <h3 className="text-xl font-semibold mb-2">Information We Collect</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Contact details such as name, email address, phone number, and delivery address.</li>
              <li>Order information including purchased products, quantities, and payment details.</li>
              <li>Account login and authentication details when you create an account.</li>
              <li>Browsing data, device details, and location data collected through cookies and analytics tools.</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">How We Use Your Information</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>To process and fulfill orders, deliver products, and provide customer support.</li>
              <li>To communicate updates about your order, promotions, offers, and important service messages.</li>
              <li>To improve our website, personalize your shopping experience, and prevent fraud.</li>
              <li>To comply with legal obligations and enforce our terms and policies.</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">Cookies and Tracking</h3>
            <p className="text-gray-700 leading-7">
              We use cookies and similar technologies to remember your preferences, support shopping cart functionality, and understand how visitors use our website. You can manage cookie settings through your browser, but some site features may not work without cookies enabled.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">Sharing and Third-Party Services</h3>
            <p className="text-gray-700 leading-7">
              We do not sell your personal information. We may share data with trusted service providers who support our operations, such as payment processors, delivery partners, and analytics providers. These partners are required to keep your data secure and use it only for the services they provide to us.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">Data Security</h3>
            <p className="text-gray-700 leading-7">
              We use reasonable technical and organizational safeguards to protect your data from unauthorized access, use, or disclosure. However, no internet transmission or system is completely secure, so please take care when sharing personal information online.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">Your Rights</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>You can review, update, or delete your account information by contacting us.</li>
              <li>You may unsubscribe from marketing communications at any time.</li>
              <li>If you have questions about how we handle your personal data, we will respond promptly.</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">Updates to This Policy</h3>
            <p className="text-gray-700 leading-7">
              We may update this privacy policy to reflect changes in our business or legal requirements. We encourage you to review this page regularly for the latest information.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">Contact Us</h3>
            <p className="text-gray-700 leading-7">
              If you have questions about this privacy policy or your personal information, please contact us at <strong>kavidryfruits@gmail.com</strong> or call us at <strong>+91 9489593504</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Privacy_Policy
