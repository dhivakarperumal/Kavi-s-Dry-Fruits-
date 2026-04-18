import React, { useState, useEffect, useRef } from "react";
import api from "../../services/api";
import { toast } from "react-hot-toast";
import { ImSpinner8 } from "react-icons/im";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { FiMic, FiMaximize, FiTrash2, FiPlus, FiPrinter, FiSearch, FiPackage, FiCamera, FiX } from "react-icons/fi";
import { Html5QrcodeScanner } from "html5-qrcode";
import logo from "/images/Kavi_logo.png";

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Delhi", "Goa", "Gujarat", "Haryana",
  "Himachal Pradesh", "Jammu & Kashmir", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra",
  "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttarakhand", "Uttar Pradesh", "West Bengal", "Andaman & Nicobar", "Chandigarh",
  "Dadra & Nagar Haveli", "Daman & Diu", "Lakshadweep", "Puducherry",
];

const CreateBilling = () => {
  const [expandAddress, setExpandAddress] = useState(false);
  const [client, setClient] = useState({
    name: "",
    phone: "",
    email: "",
    gst: "",
    shippingAddress: {
      street: "",
      city: "",
      state: "Tamil Nadu",
      zip: "",
      country: "India",
    },
    customerType: "Online Customer",
    paymentMode: "Cash",
  });
  const [shippingCharge, setShippingCharge] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState({});
  const [productList, setProductList] = useState([]);
  const [invoiceItems, setInvoiceItems] = useState([]);
  const [gstAmount, setGstAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showCamera, setShowCamera] = useState(false);

  const [manualBarcode, setManualBarcode] = useState("");

  const voiceSearchRef = useRef(null);

  // ---------------- Order ID generation ----------------
  const generateOrderId = async () => {
    try {
      const res = await api.get("/orders");
      const orderNumber = res.data.length + 1;
      return `KDF00${String(orderNumber).padStart(3, "0")}`;
    } catch (err) {
      console.error("generateOrderId error:", err);
      return `KDF${Date.now()}`;
    }
  };

  useEffect(() => {
    Promise.all([
      api.get("/products"),
      api.get("/combos")
    ]).then(([prodRes, comboRes]) => {
      const prods = (prodRes.data || []).map(p => ({ ...p, type: 'single' }));
      const combos = (comboRes.data || []).map(c => ({ ...c, type: 'combo', category: 'Combo' }));
      setProductList([...prods, ...combos]);
    }).catch(err => {
      console.error("Fetch products/combos error", err);
      toast.error("Failed to load inventory");
    });
  }, []);

  // ---------------- Barcode Scanner Logic ----------------
  const barcodeBufferRef = useRef("");
  const lastKeyTimeRef = useRef(0);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const currentTime = Date.now();
      const timeDiff = currentTime - lastKeyTimeRef.current;
      lastKeyTimeRef.current = currentTime;

      // Most hardware scanners hit 'Enter' at the end
      if (e.key === "Enter") {
        const finalCode = barcodeBufferRef.current.trim();
        if (finalCode.length > 2) {
          handleBarcodeScan(finalCode);
        }
        barcodeBufferRef.current = "";
        return;
      }

      // If delay between keys is too long, it's likely manual typing
      // hardware scanners are usually < 50ms, let's use 100ms for safety
      if (timeDiff > 100) {
        barcodeBufferRef.current = ""; 
      }

      // Ignore if typing in a standard input field
      const target = e.target;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
          return;
      }

      // Avoid capturing control keys
      if (e.key.length === 1) {
        barcodeBufferRef.current += e.key;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [productList]);

  const handleBarcodeScan = (code) => {
    const product = productList.find((p) => String(p.productId) === code || String(p.barcode) === code);
    if (product) {
      handleProductSelect(product.productId);
      toast.success(`Scanned: ${product.name}`);
    } else {
      toast.error("Product not found for barcode: " + code);
    }
  };

  // ---------------- Voice Search Logic ----------------
  const startVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("Voice recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      toast(`Searching for: ${transcript}`);
      
      const matched = productList.find(p => p.name.toLowerCase().includes(transcript));
      if (matched) {
        handleProductSelect(matched.productId);
      } else {
        toast.error("No product matched voice command: " + transcript);
      }
    };

    recognition.start();
  };

  // ---------------- Camera Scanner Logic ----------------
  useEffect(() => {
    let scanner = null;
    if (showCamera) {
      scanner = new Html5QrcodeScanner("reader", {
        fps: 10,
        qrbox: { width: 250, height: 250 },
      });

      scanner.render(
        (decodedText) => {
          handleBarcodeScan(decodedText);
          setShowCamera(false);
          scanner.clear();
        },
        (error) => {
          // silently handle scan errors
        }
      );
    }
    return () => {
      if (scanner) {
        scanner.clear().catch(e => console.error("Scanner cleanup error", e));
      }
    };
  }, [showCamera]);

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (!client.phone || client.phone.length < 5) return;

      try {
        const res = await api.get("/orders");
        const deliveries = res.data.filter((entry) => entry.clientPhone === client.phone);

        if (deliveries.length > 0) {
          const latest = deliveries[0]; 
          const addr = typeof latest.shippingAddress === 'string' ? JSON.parse(latest.shippingAddress) : (latest.shippingAddress || {});
          setClient((prev) => ({
            ...prev,
            name: latest.clientName || "",
            email: latest.email || "",
            gst: latest.clientGST || "",
            customerType: latest.customerType || "Online Customer",
            paymentMode: latest.paymentMode || "Cash",
            shippingAddress: {
              street: addr.street || "",
              city: addr.city || "",
              state: addr.state || "Tamil Nadu",
              zip: addr.zip || "",
              country: addr.country || "India",
            },
          }));
          toast.success("Client details auto-filled.");
        }
      } catch (e) {}
    }, 700);

    return () => clearTimeout(delayDebounce);
  }, [client.phone]);

  const calculatePrice = (priceMap, weight, isCombo, product = null) => {
    let price = 0;
    if (isCombo && product) {
      price = product.offerPrice || product.mrp || priceMap?.["combo"] || 0;
    } else {
      const priceObj = priceMap[weight];
      if (typeof priceObj === "object" && priceObj !== null) {
        price = priceObj.offerPrice || priceObj.mrp || priceObj.price || 0;
      } else if (typeof priceObj === "number") {
        price = priceObj;
      } else {
        const firstVal = Object.values(priceMap || {})[0];
        price = (typeof firstVal === 'object' ? (firstVal?.offerPrice || firstVal?.mrp || firstVal?.price) : firstVal) || 0;
      }
    }
    return Number(price);
  };

  const handleProductSelect = (id) => {
    const product = productList.find((p) => p.productId === id);
    if (!product) return;

    const isCombo = product.category === "Combo";
    let variants = [];
    try {
      variants = typeof product.variants === 'string' ? JSON.parse(product.variants) : (product.variants || []);
    } catch(e) { console.error("Variants parse error", e); }

    // Derive priceMap from variants if product.prices is missing/empty
    let priceMap = product.prices || {};
    if (Object.keys(priceMap).length === 0 && variants.length > 0) {
      variants.forEach(v => {
        if (v.weight) {
          priceMap[v.weight] = {
            offerPrice: parseFloat(v.offerPrice || v.price || 0),
            mrp: parseFloat(v.mrp || v.price || 0)
          };
        }
      });
    }

    const defaultWeight = isCombo ? "combo" : (variants[0]?.weight || "");
    
    let defaultPrice = 0;
    if (isCombo) {
      // Combos often store data in comboDetails
      let details = {};
      try {
        details = typeof product.comboDetails === 'string' ? JSON.parse(product.comboDetails) : (product.comboDetails || {});
      } catch(e) {}
      defaultPrice = product.offerPrice || product.mrp || details.offerPrice || details.mrp || priceMap["combo"]?.offerPrice || priceMap["combo"] || 0;
    } else {
      defaultPrice = calculatePrice(priceMap, defaultWeight, false);
    }

    let images = [];
    try {
      images = typeof product.images === 'string' ? JSON.parse(product.images) : (product.images || []);
    } catch(e) { console.error("Images parse error", e); }

    setSelectedProduct({
      id: product.productId,
      dbId: product.id,
      name: product.name,
      category: product.category || "",
      image: images[0] || product.image || "",
      primaryImage: images[0] || product.image || "",
      weights: variants.map(v => v.weight),
      comboProducts: typeof product.comboItems === 'string' ? JSON.parse(product.comboItems) : (product.comboItems || []),
      quantity: 1,
      weight: defaultWeight,
      priceMap,
      gst: product.gst || 0,
      price: Number(defaultPrice),
    });
  };

  const addProductToInvoice = () => {
    const isCombo = selectedProduct.category === "Combo";
    if (!selectedProduct.id || (!isCombo && !selectedProduct.weight)) return;

    const price = Number(selectedProduct.price ?? selectedProduct.priceMap?.[selectedProduct.weight]) ||
                  Number(Object.values(selectedProduct.priceMap || {})[0] || 0);

    const total = price * selectedProduct.quantity;
    const gst = parseFloat(selectedProduct.gst || 0);

    const existingIndex = invoiceItems.findIndex(
      (item) => item.id === selectedProduct.id && (isCombo || item.weight === selectedProduct.weight)
    );

    if (existingIndex !== -1) {
      const updatedItems = [...invoiceItems];
      const existingItem = updatedItems[existingIndex];
      const newQuantity = existingItem.quantity + selectedProduct.quantity;
      updatedItems[existingIndex] = {
        ...existingItem,
        quantity: newQuantity,
        total: price * newQuantity,
        gst: existingItem.gst + gst,
      };
      setInvoiceItems(updatedItems);
      setGstAmount((prev) => prev + gst);
    } else {
      setInvoiceItems([...invoiceItems, { ...selectedProduct, price, total, gst, weight: isCombo ? "Combo" : selectedProduct.weight }]);
      setGstAmount((prev) => prev + gst);
    }

    setSelectedProduct({});
  };

  const handleSave = async () => {
    if (!client.name || invoiceItems.length === 0) return toast.error("Fill all fields");

    setIsLoading(true);
    try {
      const newOrderId = await generateOrderId();
      const totalAmount = invoiceItems.reduce((acc, i) => acc + i.total + i.gst, 0) + shippingCharge;
      
      await api.post("/orders", {
        orderId: newOrderId,
        userId: "POS-GUEST",
        clientName: client.name,
        clientPhone: client.phone,
        clientGST: client.gst,
        email: client.email || "",
        shippingAddress: client.shippingAddress,
        customerType: client.customerType,
        paymentMode: client.paymentMode,
        paymentStatus: "Paid",
        paymentId: "POS-OFFLINE",
        orderStatus: "Delivered",
        shippingCharge,
        items: invoiceItems,
        gstAmount,
        totalAmount,
      });

      await Promise.all(
        invoiceItems.map(async (item) => {
          const matched = productList.find(p => p.productId === item.id);
          if (matched) {
            const currentStock = Number(matched.totalStock) || 0;
            const reduceAmount = item.category === "Combo" ? item.quantity : item.quantity * 1000;
            const newStock = currentStock - reduceAmount;
            const endpoint = matched.comboItems ? `/combos/${matched.id}` : `/products/${matched.id}`;
            await api.put(endpoint, { ...matched, totalStock: String(newStock) });
          }
        })
      );

      toast.success("Bill saved successfully!");
      setInvoiceItems([]);
      setGstAmount(0);
      setShippingCharge(0);
    } catch (error) {
      toast.error("Failed to save bill!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
                <h1 className="text-2xl font-[900] text-slate-950 tracking-tight">Checkout Terminal</h1>
                <p className="text-xs text-slate-500 font-bold mt-1">Generate premium POS invoices & dynamic stock management</p>
            </div>
            <div className="flex items-center gap-3">
                <button 
                  onClick={() => setShowCamera(true)}
                  className="flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-black bg-white text-gray-600 border border-gray-100 hover:bg-gray-50 transition-all shadow-lg"
                >
                  <FiCamera /> Scan Code
                </button>
                <button 
                  onClick={startVoiceSearch}
                  className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-black transition-all shadow-lg ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-white text-gray-600 border border-gray-100 hover:bg-gray-50'}`}
                >
                  <FiMic /> {isListening ? 'Listening...' : 'Voice Search'}
                </button>
            </div>
        </div>

        {/* Camera Overlay */}
        {showCamera && (
          <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
             <div className="bg-white rounded-[3rem] p-8 w-full max-w-lg relative overflow-hidden">
                <button onClick={() => setShowCamera(false)} className="absolute right-6 top-6 p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-all">
                   <FiX size={20} />
                </button>
                <h3 className="text-xl font-black text-slate-800 mb-6 uppercase tracking-tight">Vision Scanner</h3>
                <div id="reader" className="overflow-hidden rounded-2xl border-4 border-gray-50"></div>
                <p className="text-center text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mt-6">Position barcode within the frame</p>
             </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel: Client Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-100 transition-all hover:scale-[1.01]">
              <h3 className="text-base font-[900] text-slate-900 mb-6 flex items-center gap-2 uppercase tracking-tight">
                <span className="w-2.5 h-2.5 bg-indigo-600 rounded-full animate-pulse"></span> Client Profile
              </h3>
              
              <div className="space-y-4">
                <div className="group">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] mb-1.5 ml-1 block group-focus-within:text-indigo-600 transition-colors">Full Name</label>
                  <input
                    placeholder="Enter customer name..."
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 outline-none focus:bg-white focus:border-indigo-500/30 focus:ring-4 focus:ring-indigo-500/5 transition-all font-black text-slate-900 text-sm placeholder:text-slate-300"
                    value={client.name}
                    onChange={(e) => setClient({ ...client, name: e.target.value })}
                  />
                </div>
                
                <div className="group">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] mb-1.5 ml-1 block group-focus-within:text-indigo-600 transition-colors">Phone Number</label>
                  <input
                    placeholder="Search by mobile..."
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 outline-none focus:bg-white focus:border-indigo-500/30 focus:ring-4 focus:ring-indigo-500/5 transition-all font-black text-slate-900 text-sm placeholder:text-slate-300"
                    value={client.phone}
                    onChange={(e) => setClient({ ...client, phone: e.target.value })}
                  />
                </div>

                <div className="group">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] mb-1.5 ml-1 block group-focus-within:text-indigo-600 transition-colors">Email Address</label>
                  <input
                    placeholder="Enter email..."
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 outline-none focus:bg-white focus:border-indigo-500/30 focus:ring-4 focus:ring-indigo-500/5 transition-all font-black text-slate-900 text-sm placeholder:text-slate-300"
                    value={client.email}
                    onChange={(e) => setClient({ ...client, email: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] mb-1.5 ml-1 block">Type</label>
                    <select
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-3 outline-none focus:bg-white focus:border-indigo-500/30 transition-all font-black text-slate-900 text-xs appearance-none cursor-pointer"
                      value={client.customerType}
                      onChange={(e) => setClient({ ...client, customerType: e.target.value })}
                    >
                      <option>Online Customer</option>
                      <option>Shop Customer</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] mb-1.5 ml-1 block">Mode</label>
                    <select
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-3 outline-none focus:bg-white focus:border-indigo-500/30 transition-all font-black text-slate-900 text-xs appearance-none cursor-pointer"
                      value={client.paymentMode}
                      onChange={(e) => setClient({ ...client, paymentMode: e.target.value })}
                    >
                      <option>Cash</option>
                      <option>UPI</option>
                      <option>Card</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    onClick={() => setExpandAddress(!expandAddress)}
                    className="w-full flex items-center justify-between p-5 bg-slate-900 rounded-[1.5rem] hover:bg-black transition-all text-sm font-black text-white cursor-pointer shadow-lg shadow-indigo-100"
                  >
                    <span className="uppercase tracking-[0.1em]">Shipping Address details</span>
                    {expandAddress ? <MdKeyboardArrowUp size={20} /> : <MdKeyboardArrowDown size={20} />}
                  </button>
                  {expandAddress && (
                    <div className="p-6 mt-3 space-y-4 bg-white rounded-[2rem] border-2 border-slate-100 animate-in fade-in slide-in-from-top-2 shadow-inner">
                      <input placeholder="Street / Door No." className="w-full bg-slate-50 rounded-xl px-5 py-3 text-sm font-bold border-none outline-none focus:bg-white focus:ring-2 focus:ring-indigo-100" value={client.shippingAddress.street} onChange={(e) => setClient({...client, shippingAddress:{...client.shippingAddress, street:e.target.value}})} />
                      <div className="grid grid-cols-2 gap-3">
                        <input placeholder="City" className="w-full bg-slate-50 rounded-xl px-5 py-3 text-sm font-bold border-none outline-none focus:bg-white focus:ring-2 focus:ring-indigo-100" value={client.shippingAddress.city} onChange={(e) => setClient({...client, shippingAddress:{...client.shippingAddress, city:e.target.value}})} />
                        <select 
                          className="w-full bg-slate-50 rounded-xl px-5 py-3 text-sm font-bold border-none outline-none focus:bg-white focus:ring-2 focus:ring-indigo-100 appearance-none cursor-pointer" 
                          value={client.shippingAddress.state} 
                          onChange={(e) => setClient({...client, shippingAddress:{...client.shippingAddress, state:e.target.value}})}
                        >
                          <option value="">Select State</option>
                          {indianStates.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <input placeholder="Zip Code" className="w-full bg-slate-50 rounded-xl px-5 py-3 text-sm font-bold border-none outline-none focus:bg-white focus:ring-2 focus:ring-indigo-100" value={client.shippingAddress.zip} onChange={(e) => setClient({...client, shippingAddress:{...client.shippingAddress, zip:e.target.value}})} />
                        <input placeholder="Country" className="w-full bg-slate-50 rounded-xl px-5 py-3 text-sm font-bold border-none outline-none focus:bg-white focus:ring-2 focus:ring-indigo-100" value={client.shippingAddress.country} onChange={(e) => setClient({...client, shippingAddress:{...client.shippingAddress, country:e.target.value}})} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>


          </div>

          {/* Right Panel: POS and Cart */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-2xl shadow-indigo-50 overflow-hidden">
                <div className="flex flex-col md:flex-row items-center gap-4 mb-5">
                    <div className="flex-1 relative group">
                        <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-indigo-600 transition-colors" size={16} />
                        <select
                            className="w-full pl-14 pr-10 py-3.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:bg-white focus:border-indigo-500/20 focus:ring-4 focus:ring-indigo-500/5 font-black text-slate-900 text-sm appearance-none cursor-pointer transition-all"
                            value={selectedProduct.id || ""}
                            onChange={(e) => handleProductSelect(e.target.value)}
                        >
                            <option value="">Search Inventory...</option>
                            {productList.map((p) => (
                                <option key={p.id} value={p.productId}>
                                   {p.productId} — {p.name} ({p.category === 'Combo' ? 'COMBO' : 'SINGLE'})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="w-full md:w-56 relative">
                        <input
                           type="text"
                           placeholder="Type Barcode..."
                           className="w-full pl-5 pr-10 py-3.5 bg-indigo-50 border border-indigo-100 rounded-xl outline-none focus:bg-white focus:border-indigo-500 transition-all font-black text-indigo-950 text-sm placeholder:text-indigo-300"
                           value={manualBarcode}
                           onChange={(e) => setManualBarcode(e.target.value)}
                           onKeyDown={(e) => {
                             if (e.key === "Enter") {
                               handleBarcodeScan(manualBarcode);
                               setManualBarcode("");
                             }
                           }}
                        />
                    </div>
                </div>

                {selectedProduct.name && (
                    <div className="p-6 bg-indigo-50/50 rounded-[2rem] border border-indigo-100 animate-in zoom-in-95 duration-500">
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-end">
                            <div className="md:col-span-2">
                                <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-2 block ml-1">Focused Item</label>
                                <div className="bg-white p-4 rounded-2xl border border-indigo-50 shadow-lg shadow-indigo-100/20 flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-xl bg-white overflow-hidden flex-shrink-0 border border-slate-100 flex items-center justify-center p-0.5">
                                       {selectedProduct.primaryImage ? (
                                         <img 
                                           src={selectedProduct.primaryImage.startsWith('http') ? selectedProduct.primaryImage : `http://localhost:5000${selectedProduct.primaryImage}`} 
                                           alt="" 
                                           className="w-full h-full object-contain"
                                         />
                                       ) : (
                                         <FiPackage className="text-slate-100" size={24} />
                                       )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="font-black text-slate-950 text-sm truncate leading-tight">{selectedProduct.name}</p>
                                      <div className="mt-1 flex flex-wrap gap-1.5">
                                        <span className="text-[8px] font-black px-2 py-0.5 bg-indigo-600 text-white rounded uppercase tracking-wider">{selectedProduct.category}</span>
                                        {selectedProduct.category === "Combo" && selectedProduct.comboProducts?.length > 0 && (
                                            <div className="w-full mt-2 space-y-1">
                                                <div className="flex flex-wrap gap-1">
                                                    {selectedProduct.comboProducts.map((sub, sIdx) => (
                                                        <div key={sIdx} className="text-[8px] font-black text-slate-500 bg-white border border-slate-50 px-1.5 py-1 rounded">
                                                            {sub.name} • <span className="text-indigo-600">{sub.weight}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                      </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div>
                                <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-2 block ml-1 whitespace-nowrap">Unit Price</label>
                                <input
                                    type="number"
                                    className="w-full bg-white rounded-xl px-4 py-3 outline-none border border-slate-100 focus:border-indigo-500 font-black text-slate-950 text-sm shadow-sm"
                                    value={selectedProduct.price || 0}
                                    onChange={(e) => setSelectedProduct({...selectedProduct, price: parseFloat(e.target.value) || 0})}
                                />
                            </div>
                            
                            {selectedProduct.category !== "Combo" && (
                              <div>
                                  <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-2 block ml-1 whitespace-nowrap">Variant</label>
                                  <select
                                      className="w-full bg-white rounded-xl px-3 py-3 outline-none border border-slate-100 focus:border-indigo-500 font-black text-slate-950 appearance-none cursor-pointer shadow-sm text-xs"
                                      value={selectedProduct.weight || ""}
                                      onChange={(e) => {
                                        const newWeight = e.target.value;
                                        const newPrice = calculatePrice(selectedProduct.priceMap, newWeight, false);
                                        setSelectedProduct({
                                          ...selectedProduct,
                                          weight: newWeight,
                                          price: newPrice,
                                        });
                                      }}
                                  >
                                      {selectedProduct.weights?.map((w, idx) => (
                                          <option key={idx} value={w}>{w}</option>
                                      ))}
                                  </select>
                              </div>
                            )}

                            <div>
                                <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-2 block ml-1">Qty</label>
                                <input
                                    type="number"
                                    className="w-full bg-white rounded-xl px-4 py-3 outline-none border border-slate-100 focus:border-indigo-500 font-black text-slate-950 text-sm shadow-sm"
                                    value={selectedProduct.quantity || 1}
                                    min="1"
                                    onChange={(e) => setSelectedProduct({...selectedProduct, quantity: parseInt(e.target.value) || 1})}
                                />
                            </div>

                            <button
                                onClick={addProductToInvoice}
                                className="bg-indigo-600 text-white font-black py-3.5 rounded-xl shadow-xl shadow-indigo-100 hover:bg-black hover:scale-[1.02] transition-all flex items-center justify-center gap-1.5 uppercase tracking-widest text-[10px]"
                            >
                                <FiPlus size={14} /> Add Item
                            </button>
                        </div>
                    </div>
                )}

                <div className="mt-8">
                    <div className="flex items-center justify-between mb-4 px-2">
                        <h3 className="font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
                          <FiPackage className="text-primary" /> Invoice Summary
                        </h3>
                        <span className="text-xs font-black text-gray-400">{invoiceItems.length} items total</span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left border-b border-gray-50">
                                    <th className="px-4 py-4 text-[10px] font-black text-gray-300 uppercase tracking-widest">ID</th>
                                    <th className="px-4 py-4 text-[10px] font-black text-gray-300 uppercase tracking-widest">Product</th>
                                    <th className="px-4 py-4 text-[10px] font-black text-gray-300 uppercase tracking-widest text-center">Qty</th>
                                    <th className="px-4 py-4 text-[10px] font-black text-gray-300 uppercase tracking-widest text-right">Amount</th>
                                    <th className="px-4 py-4 text-[10px] font-black text-gray-300 uppercase tracking-widest text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {invoiceItems.length > 0 ? invoiceItems.map((item, index) => (
                                    <tr key={index} className="group hover:bg-gray-50/50 transition-colors">
                                        <td className="px-4 py-5 font-bold text-gray-400 text-xs">#{item.id}</td>
                                        <td className="px-4 py-5">
                                            <p className="font-black text-slate-700 text-sm">{item.name}</p>
                                            <p className="text-[10px] font-black text-primary bg-primary/5 inline-block px-1.5 py-0.5 rounded mt-1 uppercase tracking-tighter">{item.weight}</p>
                                        </td>
                                        <td className="px-4 py-5 text-center font-black text-slate-600">{item.quantity}</td>
                                        <td className="px-4 py-5 text-right font-black text-slate-800">₹{item.total.toFixed(2)}</td>
                                        <td className="px-4 py-5 text-center">
                                            <button onClick={()=>removeInvoiceItem(index)} className="p-2.5 text-red-100 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                                                <FiTrash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                  <tr>
                                    <td colSpan="5" className="py-20 text-center">
                                      <p className="text-xs font-black uppercase text-gray-300 tracking-[0.2em]">Terminal Ready - Start Adding Products</p>
                                    </td>
                                  </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="mt-10 border-t border-gray-100 pt-8 pb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between text-sm font-bold text-gray-400">
                                <span>GST Subtotal</span>
                                <span>₹{gstAmount.toFixed(2)}</span>
                            </div>
                            <div className="flex items-center justify-between group">
                                <span className="text-sm font-bold text-gray-400">Shipping Charge</span>
                                <input 
                                  type="number" 
                                  className="w-24 bg-gray-50 border-none rounded-xl px-3 py-1.5 text-right font-black text-slate-800 outline-none focus:ring-2 focus:ring-primary/20"
                                  value={shippingCharge}
                                  onChange={(e)=>setShippingCharge(parseFloat(e.target.value) || 0)}
                                />
                            </div>
                            <div className="pt-4 flex items-center justify-between">
                                <span className="text-xl font-black text-slate-800 uppercase tracking-tighter">Total Amount</span>
                                <span className="text-3xl font-black text-primary tracking-tighter">
                                  ₹{(invoiceItems.reduce((a, b) => a + b.total + b.gst, 0) + shippingCharge).toFixed(2)}
                                </span>
                            </div>
                        </div>
                        <div className="flex gap-4">
                             <button
                                onClick={handleSave}
                                disabled={isLoading || invoiceItems.length === 0}
                                className="flex-1 bg-emerald-500 text-white font-black py-5 rounded-[1.5rem] shadow-xl shadow-emerald-100 hover:bg-emerald-600 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:shadow-none uppercase tracking-widest text-sm"
                            >
                                {isLoading ? <ImSpinner8 className="animate-spin" /> : <><FiPrinter /> Finalize & Print</>}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateBilling;
