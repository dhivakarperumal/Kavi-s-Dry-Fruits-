import React, { useState } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { toast } from "react-hot-toast";

const MigrateProducts = () => {
  const [migrating, setMigrating] = useState(false);
  const [status, setStatus] = useState("");

  const migrateProducts = async () => {
    setMigrating(true);
    setStatus("Starting migration...");

    try {
      const snapshot = await getDocs(collection(db, "products"));
      const products = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      let migratedCount = 0;

      for (const product of products) {
        let needsUpdate = false;
        const updatedProduct = { ...product };

        if (product.category === "Combo" || product.combos?.length > 0) {
          // For combo products, ensure mrp and offerPrice exist
          if (typeof product.mrp !== "number" || typeof product.offerPrice !== "number") {
            // If they don't exist, try to estimate from old price or set defaults
            if (typeof product.price === "number") {
              updatedProduct.mrp = Math.round(product.price / 0.84); // Estimate MRP
              updatedProduct.offerPrice = product.price;
            } else {
              updatedProduct.mrp = 0;
              updatedProduct.offerPrice = 0;
            }
            needsUpdate = true;
          }
        } else {
          // For regular products, migrate prices object
          if (!product.prices || typeof product.prices !== "object") {
            updatedProduct.prices = {};
            needsUpdate = true;
          }

          if (product.weights && product.weights.length > 0) {
            product.weights.forEach((weight) => {
              const currentPrice = updatedProduct.prices[weight];

              if (typeof currentPrice === "number") {
                // Convert old number format to new object format
                updatedProduct.prices[weight] = {
                  mrp: Math.round(currentPrice / 0.84), // Estimate MRP
                  offerPrice: currentPrice,
                };
                needsUpdate = true;
              } else if (!currentPrice || typeof currentPrice !== "object") {
                // Set default values
                updatedProduct.prices[weight] = {
                  mrp: 0,
                  offerPrice: 0,
                };
                needsUpdate = true;
              }
            });
          }
        }

        if (needsUpdate) {
          await updateDoc(doc(db, "products", product.id), updatedProduct);
          migratedCount++;
          setStatus(`Migrated ${migratedCount} products...`);
        }
      }

      setStatus(`Migration completed! ${migratedCount} products updated.`);
      toast.success(`Migration completed! ${migratedCount} products updated.`);

    } catch (error) {
      console.error("Migration error:", error);
      setStatus("Migration failed. Check console for details.");
      toast.error("Migration failed.");
    } finally {
      setMigrating(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Migrate Product Pricing</h2>
      <p className="mb-4 text-gray-600">
        This tool will update all existing products to use the new MRP and Offer Price structure.
        Products with old number-based prices will be converted to the new object format.
      </p>

      <button
        onClick={migrateProducts}
        disabled={migrating}
        className={`px-6 py-3 rounded text-white font-semibold ${
          migrating
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
        }`}
      >
        {migrating ? "Migrating..." : "Start Migration"}
      </button>

      {status && (
        <p className="mt-4 text-sm text-gray-700">{status}</p>
      )}
    </div>
  );
};

export default MigrateProducts;