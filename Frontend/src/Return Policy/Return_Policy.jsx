import React from 'react'
import PageHeader from '../Component/PageHeader'
import { Helmet } from "react-helmet";

const Return_Policy = () => {
  return (
    <div>
    <Helmet>
  <title>Return Policy - Kavi’s Dry Fruits</title>

  <meta
    name="description"
    content="Learn about our return policy for Kavi’s Dry Fruits. Easy returns and exchanges for quality assurance."
  />

  <meta
    name="keywords"
    content="return policy dry fruits, exchange policy, refund policy kavis dry fruits"
  />

  <link rel="canonical" href="https://kavisdryfruits.com/return-policy" />
</Helmet>

        <PageHeader title={"Return Policy"} curpage={"Return Policy"}/>
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold mb-4">Return Policy</h2>
                <p className="mb-4">
                    At Kavi’s Dry Fruits, we strive to provide the highest quality products. If you are not satisfied with your purchase, please review our return policy below.
                </p>
                <h3 className="text-xl font-semibold mb-2">Eligibility for Returns</h3>
                <ul className="list-disc list-inside mb-4">
                    <li>Products must be returned within 7 days of delivery.</li>
                    <li>Items must be in their original packaging and unused.</li>
                    <li>Proof of purchase is required.</li>
                </ul>
                <h3 className="text-xl font-semibold mb-2">Non-Returnable Items</h3>
                <ul className="list-disc list-inside mb-4">
                    <li>Perishable items that have been opened.</li>
                    <li>Custom or personalized products.</li>
                </ul>
                <h3 className="text-xl font-semibold mb-2">Return Process</h3>
                <ol className="list-decimal list-inside mb-4">
                    <li>Contact our customer service team at kavisdryfruits@gmail.com.</li>
                    <li>Provide order details and reason for return.</li>
                    <li>Ship the item back to us using the provided return label.</li>
                    <li>Once received, we will process your refund or exchange within 5-7 business days.</li>
                </ol>
                <h3 className="text-xl font-semibold mb-2">Refunds</h3>
                <p className="mb-4">
                    Refunds will be issued to the original payment method. Shipping costs are non-refundable unless the return is due to our error.
                </p>
                <p>
                    For any questions, please contact us at kavisdryfruits@gmail.com.
                </p>
            </div>
        </div>
    </div>
  )
}

export default Return_Policy