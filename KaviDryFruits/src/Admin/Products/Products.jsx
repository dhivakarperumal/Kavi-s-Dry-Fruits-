// import React, { useState, useEffect, useRef } from "react";
// import { db } from "../../firebase";
// import {
//   collection,
//   addDoc,
//   getDocs,
//   deleteDoc,
//   updateDoc,
//   doc,
// } from "firebase/firestore";
// import { toast } from "react-hot-toast";
// import { FaEdit, FaTrash } from "react-icons/fa";
// import imageCompression from "browser-image-compression";
// import { useNavigate } from "react-router-dom";
// import JsBarcode from "jsbarcode";

// // Initial product template
// const initialProduct = () => ({
//   productId: "",
//   name: "",
//   category: "",
//   images: [],
//   rating: 0,
//   offer: 0,
//   mrp: 0,
//   offerPrice: 0,
//   description: "",
//   stock: 0,
//   health_benefits: [],
//   weights: [],
//   prices: {},
//   combos: [],
//   type: "",
//   barcode: "",
//   barcodeValue: "",
// });

// // Use the provided GoDaddy upload endpoint directly
// const UPLOAD_ENDPOINT = "https://kavisdryfruits.com/api/uploads.php";

// const AddProductList = () => {
//   const [viewMode, setViewMode] = useState("add");
//   const [mode, setMode] = useState("product");
//   const [product, setProduct] = useState(initialProduct());
//   const [productList, setProductList] = useState([]);
//   const [editingId, setEditingId] = useState(null);
//   const [submitting, setSubmitting] = useState(false);

//   const navigate = useNavigate();
//   const barcodeRef = useRef(null);

//   const [categories, setCategories] = useState([]);

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const colRef = collection(db, "categories");
//         const snapshot = await getDocs(colRef);
//         const categoryList = snapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }));
//         setCategories(categoryList);
//       } catch (error) {
//         console.error("Error fetching categories:", error);
//       }
//     };

//     fetchCategories();
//   }, []);

//   // Generate base64 barcode
//   const generateBarcodeBase64 = (value) => {
//     const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
//     JsBarcode(svg, value, {
//       format: "CODE128",
//       lineColor: "#000",
//       width: 2,
//       height: 50,
//       displayValue: false,
//     });
//     const svgData = new XMLSerializer().serializeToString(svg);
//     return `data:image/svg+xml;base64,${btoa(svgData)}`;
//   };

//   // Auto-generate barcode whenever productId changes
//   useEffect(() => {
//     if (product.productId && barcodeRef.current) {
//       const code = product.barcodeValue || product.productId;
//       JsBarcode(barcodeRef.current, code, {
//         format: "CODE128",
//         lineColor: "#000",
//         width: 2,
//         height: 50,
//         displayValue: false,
//       });

//       const svgData = new XMLSerializer().serializeToString(barcodeRef.current);
//       const base64Data = `data:image/svg+xml;base64,${btoa(svgData)}`;

//       if (product.barcode !== base64Data || product.barcodeValue !== code) {
//         setProduct((prev) => ({
//           ...prev,
//           barcode: base64Data,
//           barcodeValue: code,
//         }));
//       }
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [product.productId, product.name, product.category, JSON.stringify(product.prices)]);

//   // Fetch products from Firebase
//   const fetchProducts = async () => {
//     try {
//       const snapshot = await getDocs(collection(db, "products"));
//       const firestoreProducts = snapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       }));
//       setProductList(firestoreProducts);
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to load products");
//     }
//   };

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   const [weightsInput, setWeightsInput] = useState("");

//   // Input handlers
//   const handleChange = (e) =>
//     setProduct({ ...product, [e.target.name]: e.target.value });

//   const handleArrayChange = (e, key) =>
//     setProduct({ ...product, [key]: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) });

//   const handleWeightsAndPrices = (e) => {
//     const value = e.target.value;
//     setWeightsInput(value);
//     const weights = value.split(",").map((w) => w.trim()).filter(Boolean);
//     const prices = {};
//     weights.forEach((w) => (prices[w] = product.prices?.[w] ?? { mrp: 0, offerPrice: 0 }));
//     setProduct({ ...product, weights, prices });
//   };

//   const handleMrpChange = (weight, mrp) => {
//     setProduct((prev) => ({
//       ...prev,
//       prices: {
//         ...prev.prices,
//         [weight]: { ...prev.prices[weight], mrp: parseFloat(mrp) },
//       },
//     }));
//   };

//   const handleOfferPriceChange = (weight, offerPrice) => {
//     setProduct((prev) => ({
//       ...prev,
//       prices: {
//         ...prev.prices,
//         [weight]: { ...prev.prices[weight], offerPrice: parseFloat(offerPrice) },
//       },
//     }));
//   };

//   // Upload a single File to your GoDaddy endpoint; expects JSON { url: "..." } on success
//   const uploadFileToServer = async (file) => {
//     try {
//       const formData = new FormData();
//       formData.append("image", file);

//       const res = await fetch(UPLOAD_ENDPOINT, {
//         method: "POST",
//         body: formData,
//       });

//       if (!res.ok) {
//         const text = await res.text();
//         throw new Error(`Upload failed: ${res.status} ${text}`);
//       }

//       const data = await res.json();
//       if (!data.url) throw new Error("Upload response missing 'url' field");
//       return data.url;
//     } catch (err) {
//       console.error("uploadFileToServer error:", err);
//       throw err;
//     }
//   };

//   // Image upload & compression -> upload to GoDaddy upload folder endpoint, store URLs
//  const handleImageUpload = async (e) => {
//   const rawFiles = Array.from(e.target.files).slice(0, 4);
//   if (rawFiles.length === 0) return;

//   try {
//     toast.loading("Uploading images...", { id: "img-upload" });

//     // Compress all selected images
//     const compressedFiles = [];
//     for (const file of rawFiles) {
//       try {
//         const compressedBlob = await imageCompression(file, {
//           maxSizeMB: 2,
//           maxWidthOrHeight: 1200,
//           useWebWorker: true,
//         });

//         compressedFiles.push(
//           new File([compressedBlob], file.name, {
//             type: compressedBlob.type || file.type,
//           })
//         );
//       } catch (err) {
//         compressedFiles.push(file); // fallback
//       }
//     }

//     // Prepare FormData
//     const formData = new FormData();
//     compressedFiles.forEach((file) => formData.append("files[]", file));

//     const res = await fetch(UPLOAD_ENDPOINT, {
//       method: "POST",
//       body: formData,
//     });

//     const rawData = await res.text();
//     console.log("Server Response:", rawData);

//     let data;
//     try {
//       data = JSON.parse(rawData);
//     } catch {
//       toast.error("Invalid server response. Not JSON.");
//       return;
//     }

//     if (!data.success || !Array.isArray(data.files)) {
//       toast.error("Upload failed: Invalid response structure");
//       return;
//     }

//     // Extract URLs correctly
//     const uploadedUrls = data.files
//       .filter((f) => f.url)
//       .map((f) => f.url);

//     console.log("Uploaded URLs:", uploadedUrls);

//     // Save to state
//     setProduct((prev) => ({
//       ...prev,
//       images: [...prev.images, ...uploadedUrls],
//     }));

//     toast.success("Images uploaded successfully!", { id: "img-upload" });
//   } catch (err) {
//     console.error("Upload error:", err);
//     toast.error("Failed to upload images", { id: "img-upload" });
//   }
// };


//   // Submit form
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSubmitting(true);
//     try {
//       const formattedStock =
//         mode === "combo"
//           ? parseInt(product.stock || 0)
//           : parseInt(product.stock || 0) * 1000;

//       if (editingId) {
//         await updateDoc(doc(db, "products", editingId), {
//           ...product,
//           stock: formattedStock,
//         });
//         toast.success(`${mode === "combo" ? "Combo" : "Product"} updated!`);
//         setEditingId(null);
//       } else {
//         const snapshot = await getDocs(collection(db, "products"));
//         const count = snapshot.size;
//         const prefix = mode === "combo" ? "KPC" : "KP";
//         const productId = `${prefix}${(count + 1).toString().padStart(3, "0")}`;
//         const barcodeImg = generateBarcodeBase64(productId);

//         const newProduct = {
//           ...product,
//           productId,
//           stock: formattedStock,
//           barcode: barcodeImg,
//           barcodeValue: productId,
//         };

//         await addDoc(collection(db, "products"), newProduct);
//         toast.success(`${mode === "combo" ? "Combo" : "Product"} added!`);
//       }

//       setProduct(initialProduct());
//       setWeightsInput("");
//       fetchProducts();
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to submit");
//     }
//     setSubmitting(false);
//   };

//   const handleEdit = (p) => {
//     const isCombo = p.combos?.length > 0;
//     setMode(isCombo ? "combo" : "product");

//     // Convert old price format to new format
//     let prices = p.prices || {};
//     if (!isCombo && p.weights && p.weights.length > 0) {
//       const newPrices = {};
//       p.weights.forEach((w) => {
//         if (typeof prices[w] === 'number') {
//           // Old format: prices[w] = number
//           newPrices[w] = { mrp: prices[w], offerPrice: prices[w] };
//         } else if (prices[w] && typeof prices[w] === 'object') {
//           // New format
//           newPrices[w] = prices[w];
//         } else {
//           newPrices[w] = { mrp: 0, offerPrice: 0 };
//         }
//       });
//       prices = newPrices;
//     }

//     setWeightsInput(p.weights?.join(", ") || "");
//     setProduct({
//       ...p,
//       stock: isCombo ? p.stock || 0 : (p.stock || 0) / 1000,
//       images: p.images || [],
//       prices,
//     });
//     setEditingId(p.id);
//     setViewMode("add");
//     window.scrollTo(0, 0);
//     navigate("#movetop");
//   };

//   // Delete product
//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure?")) return;
//     try {
//       await deleteDoc(doc(db, "products", id));
//       toast.success("Deleted!");
//       fetchProducts();
//     } catch {
//       toast.error("Failed to delete!");
//     }
//   };

//   return (
//     <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-10 py-6">
//       <div className="flex flex-col md:flex-row md:justify-between gap-4 mb-6">
//         {viewMode === "add" && (
//           <div className="flex flex-wrap gap-4">
//             <button
//               onClick={() => {
//                 setMode("product");
//                 setProduct(initialProduct());
//                 setWeightsInput("");
//                 setEditingId(null);
//               }}
//               className={`px-4 py-2 cursor-pointer rounded font-semibold ${mode === "product" ? "bg-green-600 text-white" : "bg-gray-200"
//                 }`}
//             >
//               Regular Product
//             </button>
//             <button
//               onClick={() => {
//                 setMode("combo");
//                 setProduct({ ...initialProduct(), combos: [], type: "" });
//                 setWeightsInput("");
//                 setEditingId(null);
//               }}
//               className={`px-4 py-2 cursor-pointer rounded font-semibold ${mode === "combo" ? "bg-green-600 text-white" : "bg-gray-200"
//                 }`}
//             >
//               Combo Product
//             </button>
//           </div>
//         )}

//         <div className="flex flex-wrap gap-4">
//           <button
//             onClick={() => setViewMode("add")}
//             className={`px-4 py-2 cursor-pointer rounded font-semibold ${viewMode === "add" ? "bg-green-600 text-white" : "bg-gray-200"
//               }`}
//           >
//             Add Product
//           </button>
//           <button
//             onClick={() => setViewMode("list")}
//             className={`px-4 py-2 cursor-pointer rounded font-semibold ${viewMode === "list" ? "bg-green-600 text-white" : "bg-gray-200"
//               }`}
//           >
//             Show Products
//           </button>
//         </div>
//       </div>

//       {viewMode === "add" ? (
//         <div>
//           <form
//             onSubmit={handleSubmit}
//             className="space-y-6 bg-white p-6 shadow rounded"
//           >
//             <h2 id="movetop" className="text-xl font-semibold border-b border-green-500 pb-2">
//               {editingId ? "Edit" : "Add"} {mode === "combo" ? "Combo" : "Product"}
//             </h2>

//             {/* Barcode preview */}
//             {product.productId && (
//               <div className="mb-4 md:col-span-2">
//                 <p className="font-semibold mb-1">Generated Barcode:</p>
//                 <svg ref={barcodeRef}></svg>
//                 {product.barcode && (
//                   <img
//                     src={product.barcode}
//                     alt="barcode"
//                     className="mt-2 w-40 border rounded"
//                   />
//                 )}
//               </div>
//             )}

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {/* Product Name */}
//               <div>
//                 <label className="block font-semibold mb-1">Product Name</label>
//                 <input
//                   name="name"
//                   value={product.name}
//                   onChange={handleChange}
//                   placeholder="Enter product name"
//                   className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
//                   required
//                 />
//               </div>

//               {/* Category */}
//               <div>
//                 <label className="block font-semibold mb-1">Category</label>
//                 <select
//                   name="category"
//                   value={product.category}
//                   onChange={handleChange}
//                   className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
//                   required
//                 >
//                   <option value="">-- Select category --</option>
//                   {categories.map((cat) => (
//                     <option key={cat.id || cat.catId} value={cat.cname}>
//                       {cat.cname}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* Stock */}
//               <div>
//                 <label className="block font-semibold mb-1">
//                   Stock ({mode === "combo" ? "pcs" : "kg"})
//                 </label>
//                 <input
//                   name="stock"
//                   type="number"
//                   value={product.stock}
//                   min={0}
//                   onChange={handleChange}
//                   placeholder={
//                     mode === "combo"
//                       ? "Enter stock in pieces"
//                       : "Enter stock in kilograms"
//                   }
//                   className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
//                 />
//               </div>

//               {/* Rating */}
//               <div>
//                 <label className="block font-semibold mb-1">Rating</label>
//                 <input
//                   name="rating"
//                   type="number"
//                   min="0"
//                   step="0.1"
//                   value={product.rating}
//                   onChange={handleChange}
//                   placeholder="Enter rating (0-5)"
//                   className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
//                 />
//               </div>

//               {/* Offer % */}
//               <div>
//                 <label className="block font-semibold mb-1">Offer %</label>
//                 <input
//                   name="offer"
//                   type="number"
//                   min="0"
//                   value={product.offer}
//                   onChange={handleChange}
//                   placeholder="Enter discount offer (e.g. 10)"
//                   className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
//                 />
//               </div>

//               {/* Description */}
//               <div>
//                 <label className="block font-semibold mb-1">Description</label>
//                 <textarea
//                   name="description"
//                   value={product.description}
//                   onChange={handleChange}
//                   placeholder="Enter product description"
//                   className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
//                   rows={3}
//                 />
//               </div>

//               {/* Image Upload */}
//               <div>
//                 <label className="block font-semibold mb-1">Upload Images</label>

//                 <input
//                   type="file"
//                   multiple
//                   accept="image/*"
//                   onChange={handleImageUpload}
//                   className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
//                 />

//                 {product.images.length > 0 && (
//                   <div className="flex gap-3 mt-3 flex-wrap">
//                     {product.images.map((img, i) => (
//                       <div key={i} className="relative w-20 h-20">
//                         <img
//                           src={img}
//                           alt={`preview-${i}`}
//                           className="w-full h-full object-cover rounded border"
//                         />

//                        <button
//   type="button"
//   onClick={() =>
//     setProduct((prev) => ({
//       ...prev,
//       images: prev.images.filter((_, index) => index !== i),
//     }))
//   }
//   className="absolute -top-2 -right-2 bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs shadow cursor-pointer hover:bg-red-700"
// >
//   ✕
// </button>

//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               {/* Health benefits */}
//               <div>
//                 <label className="block font-semibold mb-1">Health Benefits</label>
//                 <input
//                   value={product.health_benefits.join(",")}
//                   onChange={(e) => handleArrayChange(e, "health_benefits")}
//                   placeholder="Enter health benefits (comma separated)"
//                   className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
//                 />
//               </div>

//               {/* Weights */}
//               <div>
//                 <label className="block font-semibold mb-1">Weights</label>
//                 <input
//                   value={weightsInput}
//                   onChange={handleWeightsAndPrices}
//                   placeholder="Enter weights (comma separated)"
//                   className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
//                 />
//               </div>

//               {/* Price Inputs */}
//               {product.weights.length > 0 &&
//                 product.weights.map((w, i) => (
//                   <div key={i} className="col-span-2">
//                     <h3 className="text-lg font-semibold mb-2">Pricing for {w}</h3>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div>
//                         <label className="block font-semibold mb-1">MRP for {w}</label>
//                         <input
//                           type="number"
//                           min="0"
//                           step="0.01"
//                           value={product.prices[w]?.mrp || ""}
//                           onChange={(e) => handleMrpChange(w, e.target.value)}
//                           placeholder={`Enter MRP for ${w}`}
//                           className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
//                         />
//                       </div>
//                       <div>
//                         <label className="block font-semibold mb-1">Offer Price for {w}</label>
//                         <input
//                           type="number"
//                           min="0"
//                           step="0.01"
//                           value={product.prices[w]?.offerPrice || ""}
//                           onChange={(e) => handleOfferPriceChange(w, e.target.value)}
//                           placeholder={`Enter Offer Price for ${w}`}
//                           className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 ))}

//               {/* Combo-specific */}
//               {mode === "combo" && (
//                 <>
//                   <div>
//                     <label className="block font-semibold mb-1">Combo Items</label>
//                     <input
//                       value={product.combos?.join(",")}
//                       onChange={(e) => handleArrayChange(e, "combos")}
//                       placeholder="Enter combo items (comma separated)"
//                       className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
//                     />
//                   </div>
//                   <div>
//                     <label className="block font-semibold mb-1">Combo Type</label>
//                     <input
//                       name="type"
//                       value={product.type}
//                       onChange={handleChange}
//                       placeholder="Enter combo type (e.g., Festive, Gift)"
//                       className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
//                     />
//                   </div>
//                   <div>
//                     <label className="block font-semibold mb-1">MRP</label>
//                     <input
//                       name="mrp"
//                       type="number"
//                       min="0"
//                       step="0.01"
//                       value={product.mrp}
//                       onChange={handleChange}
//                       placeholder="Enter Maximum Retail Price"
//                       className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
//                     />
//                   </div>
//                   <div>
//                     <label className="block font-semibold mb-1">Offer Price</label>
//                     <input
//                       name="offerPrice"
//                       type="number"
//                       min="0"
//                       step="0.01"
//                       value={product.offerPrice}
//                       onChange={handleChange}
//                       placeholder="Enter Offer Price"
//                       className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
//                     />
//                   </div>
//                 </>
//               )}
//             </div>

//             {/* Submit */}
//             <div className="flex items-center justify-end">
//               <button
//                 type="submit"
//                 disabled={submitting}
//                 className={`px-6 py-3 cursor-pointer rounded text-white font-semibold ${submitting ? "bg-gray-400 cursor-not-allowed" : "bg-green-600"
//                   }`}
//               >
//                 {submitting
//                   ? "Processing..."
//                   : editingId
//                     ? "Update Product"
//                     : "Add Product"}
//               </button>
//             </div>
//           </form>
//         </div>
//       ) : (
//         <div className="bg-white shadow rounded mt-5 p-4">
//           <h2 className="text-xl font-semibold mb-4">All Products</h2>

//           {productList.length === 0 ? (
//             <p>No products found.</p>
//           ) : (
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//               {productList.map((p) => {
//                 const imgSrc =
//                   (p.images && p.images.length && p.images[0]) ||
//                   p.image ||
//                   p.thumbnail ||
//                   "/placeholder.png";
//                 const name = p.name || "Unnamed product";
//                 const stock = p.stock || 0;
//                 const stockLabel =
//                   p.combos?.length > 0 ? `${stock} pcs` : `${(stock || 0) / 1000} kg`;

//                 // Calculate MRP and offer price based on product type
//                 let mrp = null;
//                 let offerPrice = null;
//                 let offerPercent = 0;

//                 if (p.category === "Combo" || p.combos?.length > 0) {
//                   // For combo products
//                   mrp = p.mrp || null;
//                   offerPrice = p.offerPrice || null;
//                   if (mrp && offerPrice) {
//                     offerPercent = Math.round(((mrp - offerPrice) / mrp) * 100);
//                   }
//                 } else {
//                   // For regular products with weights
//                   const firstWeight = p.weights?.[0];
//                   const priceObj = p.prices?.[firstWeight];
                  
//                   if (typeof priceObj === "object" && priceObj !== null) {
//                     mrp = priceObj.mrp || null;
//                     offerPrice = priceObj.offerPrice || null;
//                     if (mrp && offerPrice) {
//                       offerPercent = Math.round(((mrp - offerPrice) / mrp) * 100);
//                     }
//                   } else if (typeof priceObj === "number") {
//                     // Fallback for old format
//                     offerPrice = priceObj;
//                     mrp = p.offer ? Math.round(priceObj + (priceObj * p.offer) / 100) : priceObj;
//                     offerPercent = p.offer || 0;
//                   }
//                 }

//                 return (
//                   <div
//                     key={p.id || p.productId}
//                     className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 flex flex-col"
//                   >
//                     <div className="flex justify-end">
//                       {offerPercent > 0 && (
//                         <span className="bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
//                           -{offerPercent}%
//                         </span>
//                       )}
//                     </div>

//                     <div className="flex-1 flex flex-col items-center gap-3">
//                       <div className="w-36 h-36 bg-gray-50 rounded-md flex items-center justify-center overflow-hidden">
//                         <img
//                           src={imgSrc}
//                           alt={name}
//                           className="object-contain w-full h-full"
//                         />
//                       </div>

//                       <div className="text-center">
//                         <h3 className="text-lg font-semibold">{name}</h3>
//                         <p className="text-sm text-gray-500 mt-1">{stockLabel}</p>
//                         {mrp && offerPrice && (
//                           <p className="text-sm text-gray-600 mt-1">
//                             MRP: <span className="line-through text-gray-400">₹{mrp}</span>{" "}
//                             <span className="font-semibold text-green-600">₹{offerPrice}</span>
//                           </p>
//                         )}
//                       </div>

                  
//                     </div>

//                     <div className="mt-4 flex items-center justify-between gap-2">
//                       <button
//                         onClick={() => handleEdit(p)}
//                         className="flex-1 bg-yellow-500 hover:bg-yellow-600 cursor-pointer text-white px-3 py-2 rounded-md flex items-center justify-center gap-2"
//                         aria-label={`Edit ${name}`}
//                       >
//                         <FaEdit />
//                         <span className="hidden sm:inline">Edit</span>
//                       </button>

//                       <button
//                         onClick={() => handleDelete(p.id)}
//                         className="flex-1 bg-red-500 hover:bg-red-600 cursor-pointer text-white px-3 py-2 rounded-md flex items-center justify-center gap-2"
//                         aria-label={`Delete ${name}`}
//                       >
//                         <FaTrash />
//                         <span className="hidden sm:inline">Delete</span>
//                       </button>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default AddProductList;



import React, { useState } from "react";

const AddProductList = () => {
  const [productType, setProductType] = useState("single");

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [images, setImages] = useState([]);
  const [rating, setRating] = useState(0);
  const [barcode, setBarcode] = useState("");
  const [barcodeValue, setBarcodeValue] = useState("");

  // ================= VARIANTS =================
  const [variants, setVariants] = useState([
    { weight: "", mrp: "", offerPercent: "", offerPrice: "", stock: "" }
  ]);

  // ================= COMBO =================
  const [comboItems, setComboItems] = useState([
    { name: "", weight: "" }
  ]);

  const [comboDetails, setComboDetails] = useState({
    mrp: "",
    offerPercent: "",
    offerPrice: "",
    stock: ""
  });

  // ================= IMAGE UPLOAD =================
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  // ================= VARIANT CHANGE =================
  const handleVariantChange = (index, field, value) => {
    const updated = [...variants];
    updated[index][field] = value;

    const mrp = Number(updated[index].mrp);
    const offer = Number(updated[index].offerPercent);

    if (mrp && offer) {
      updated[index].offerPrice = Math.round(
        mrp - (mrp * offer) / 100
      );
    }

    setVariants(updated);
  };

  const addVariant = () => {
    setVariants([
      ...variants,
      { weight: "", mrp: "", offerPercent: "", offerPrice: "", stock: "" }
    ]);
  };

  // ================= COMBO =================
  const handleComboItemChange = (index, field, value) => {
    const updated = [...comboItems];
    updated[index][field] = value;
    setComboItems(updated);
  };

  const addComboItem = () => {
    setComboItems([...comboItems, { name: "", weight: "" }]);
  };

  const handleComboDetailsChange = (field, value) => {
    const updated = { ...comboDetails, [field]: value };

    const mrp = Number(updated.mrp);
    const offer = Number(updated.offerPercent);

    if (mrp && offer) {
      updated.offerPrice = Math.round(
        mrp - (mrp * offer) / 100
      );
    }

    setComboDetails(updated);
  };

  // ================= TOTAL STOCK =================
  const totalStock = variants.reduce(
    (sum, v) => sum + Number(v.stock || 0),
    0
  );

  // ================= SUBMIT =================
  const handleSubmit = () => {
    let productData = {
      name,
      category,
      images,
      rating: Number(rating),
      barcode,
      barcodeValue
    };

    if (productType === "single") {
      productData = {
        ...productData,
        type: "single",
        variants,
        totalStock
      };
    } else {
      productData = {
        ...productData,
        type: "combo",
        items: comboItems,
        ...comboDetails
      };
    }

    console.log("FINAL PRODUCT:", productData);
    alert("Product Ready ✅ Check Console");
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Add Product</h2>

      {/* TYPE */}
      <select
        value={productType}
        onChange={(e) => setProductType(e.target.value)}
        className="border p-2 mb-4"
      >
        <option value="single">Single Product</option>
        <option value="combo">Combo Product</option>
      </select>

      {/* BASIC DETAILS */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <input
          placeholder="Product Name"
          className="border p-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="Category"
          className="border p-2"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        <input
          type="number"
          placeholder="Rating"
          className="border p-2"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
        />

        <input
          placeholder="Barcode Type"
          className="border p-2"
          value={barcode}
          onChange={(e) => setBarcode(e.target.value)}
        />

        <input
          placeholder="Barcode Value"
          className="border p-2 col-span-2"
          value={barcodeValue}
          onChange={(e) => setBarcodeValue(e.target.value)}
        />
      </div>

      {/* IMAGE */}
      <input type="file" multiple onChange={handleImageUpload} />
      <div className="flex gap-2 flex-wrap mt-2">
        {images.map((img, i) => (
          <img key={i} src={img} alt="" className="w-16 h-16 object-cover" />
        ))}
      </div>

      {/* ================= SINGLE ================= */}
      {productType === "single" && (
        <>
          <h3 className="mt-4 font-semibold">Variants</h3>

          {variants.map((v, i) => (
            <div key={i} className="grid grid-cols-5 gap-2 mt-2">
              <input
                placeholder="Weight"
                className="border p-2"
                value={v.weight}
                onChange={(e) =>
                  handleVariantChange(i, "weight", e.target.value)
                }
              />

              <input
                type="number"
                placeholder="MRP"
                className="border p-2"
                value={v.mrp}
                onChange={(e) =>
                  handleVariantChange(i, "mrp", e.target.value)
                }
              />

              <input
                type="number"
                placeholder="Offer %"
                className="border p-2"
                value={v.offerPercent}
                onChange={(e) =>
                  handleVariantChange(i, "offerPercent", e.target.value)
                }
              />

              <input
                placeholder="Offer Price"
                className="border p-2 bg-gray-100"
                value={v.offerPrice}
                readOnly
              />

              <input
                type="number"
                placeholder="Stock"
                className="border p-2"
                value={v.stock}
                onChange={(e) =>
                  handleVariantChange(i, "stock", e.target.value)
                }
              />
            </div>
          ))}

          <button
            onClick={addVariant}
            className="bg-blue-500 text-white px-3 py-1 mt-3"
          >
            + Add Variant
          </button>

          <div className="mt-2 font-bold">
            Total Stock: {totalStock}
          </div>
        </>
      )}

      {/* ================= COMBO ================= */}
      {productType === "combo" && (
        <>
          <h3 className="mt-4 font-semibold">Combo Items</h3>

          {comboItems.map((item, i) => (
            <div key={i} className="grid grid-cols-2 gap-2 mt-2">
              <input
                placeholder="Item Name"
                className="border p-2"
                value={item.name}
                onChange={(e) =>
                  handleComboItemChange(i, "name", e.target.value)
                }
              />

              <input
                placeholder="Weight"
                className="border p-2"
                value={item.weight}
                onChange={(e) =>
                  handleComboItemChange(i, "weight", e.target.value)
                }
              />
            </div>
          ))}

          <button
            onClick={addComboItem}
            className="bg-blue-500 text-white px-3 py-1 mt-3"
          >
            + Add Item
          </button>

          <h3 className="mt-4 font-semibold">Pricing</h3>

          <div className="grid grid-cols-4 gap-2 mt-2">
            <input
              type="number"
              placeholder="MRP"
              className="border p-2"
              value={comboDetails.mrp}
              onChange={(e) =>
                handleComboDetailsChange("mrp", e.target.value)
              }
            />

            <input
              type="number"
              placeholder="Offer %"
              className="border p-2"
              value={comboDetails.offerPercent}
              onChange={(e) =>
                handleComboDetailsChange("offerPercent", e.target.value)
              }
            />

            <input
              placeholder="Offer Price"
              className="border p-2 bg-gray-100"
              value={comboDetails.offerPrice}
              readOnly
            />

            <input
              type="number"
              placeholder="Stock"
              className="border p-2"
              value={comboDetails.stock}
              onChange={(e) =>
                handleComboDetailsChange("stock", e.target.value)
              }
            />
          </div>
        </>
      )}

      {/* SUBMIT */}
      <button
        onClick={handleSubmit}
        className="bg-green-600 text-white px-5 py-2 mt-6"
      >
        Save Product
      </button>
    </div>
  );
};

export default AddProductList;