import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { toast } from "react-hot-toast";
import { ImSpinner8 } from "react-icons/im";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import logo from "/images/Kavi_logo.png";

const Billing = () => {
  const [expandAddress, setExpandAddress] = useState(false);
  const [client, setClient] = useState({
    name: "",
    phone: "",
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

  // ---------------- Order ID generation ----------------
  const generateOrderId = async () => {
    try {
      // Fetch latest orders to get the next number
      const res = await api.get("/orders");
      const orderNumber = res.data.length + 1;
      return `KDF00${String(orderNumber).padStart(3, "0")}`;
    } catch (err) {
      console.error("generateOrderId error:", err);
      return `KDF${Date.now()}`;
    }
  };

  useEffect(() => {
    api.get("/products").then((res) => {
      setProductList(res.data);
    });
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (!client.phone || client.phone.length < 5) return;

      try {
        const res = await api.get("/orders");
        const deliveries = res.data.filter((entry) => entry.clientPhone === client.phone);

        if (deliveries.length > 0) {
          const latest = deliveries[0]; // descending order assumed
          setClient((prev) => ({
            ...prev,
            name: latest.clientName || "",
            gst: latest.clientGST || "",
            customerType: latest.customerType || "Online Customer",
            paymentMode: latest.paymentMode || "Cash",
            shippingAddress: typeof latest.shippingAddress === 'string' ? JSON.parse(latest.shippingAddress) : latest.shippingAddress,
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
      // For combo products, use offerPrice or mrp at top level
      price = product.offerPrice || product.mrp || priceMap?.["combo"] || 0;
    } else {
      // For regular products, get price from priceMap for the weight
      const priceObj = priceMap[weight];
      if (typeof priceObj === "object" && priceObj !== null) {
        price = priceObj.offerPrice || priceObj.mrp || 0;
      } else if (typeof priceObj === "number") {
        // Fallback for old format
        price = priceObj;
      } else {
        price = Object.values(priceMap || {})[0] || 0;
      }
    }

    return Number(price);
  };

  const handleProductSelect = (id) => {
    const product = productList.find((p) => p.productId === id);
    if (!product) return;

    const isCombo = product.category === "Combo";
    // default weight: "combo" for combos, otherwise first available weight
    const defaultWeight = isCombo ? "combo" : (product.weights?.[0] || "");
    const priceMap = product.prices || {};
    
    // Calculate price - prioritize offerPrice
    let defaultPrice = 0;
    if (isCombo) {
      // For combo products, use offerPrice or mrp at top level
      defaultPrice = product.offerPrice || product.mrp || priceMap["combo"] || 0;
    } else {
      defaultPrice = calculatePrice(priceMap, defaultWeight, false);
    }

    setSelectedProduct({
      id: product.productId,
      dbId: product.id,
      name: product.name,
      category: product.category || "",
      weights: typeof product.variants === 'string' ? JSON.parse(product.variants).map(v => v.weight) : (product.variants || []).map(v => v.weight),
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

    // prefer explicit selectedProduct.price, fallback to priceMap lookups
    const price =
      Number(selectedProduct.price ?? selectedProduct.priceMap?.[selectedProduct.weight]) ||
      Number(Object.values(selectedProduct.priceMap || {})[0] || 0);

    const total = price * selectedProduct.quantity;
    const gst = parseFloat(selectedProduct.gst || 0);

    const existingIndex = invoiceItems.findIndex(
      (item) =>
        item.id === selectedProduct.id &&
        (isCombo || item.weight === selectedProduct.weight)
    );

    if (existingIndex !== -1) {
      const updatedItems = [...invoiceItems];
      const existingItem = updatedItems[existingIndex];
      const newQuantity = existingItem.quantity + selectedProduct.quantity;
      const newTotal = price * newQuantity;
      const newGst = existingItem.gst + gst;

      updatedItems[existingIndex] = {
        ...existingItem,
        quantity: newQuantity,
        total: newTotal,
        gst: newGst,
      };

      setInvoiceItems(updatedItems);
      setGstAmount((prev) => prev + gst);
    } else {
      setInvoiceItems([
        ...invoiceItems,
        {
          ...selectedProduct,
          price,
          total,
          gst,
          weight: isCombo ? "Combo" : selectedProduct.weight,
        },
      ]);
      setGstAmount((prev) => prev + gst);
    }

    setSelectedProduct({});
  };

  const removeInvoiceItem = (index) => {
    const removedItem = invoiceItems[index];
    setGstAmount((prev) => prev - removedItem.gst);
    const updatedItems = invoiceItems.filter((_, i) => i !== index);
    setInvoiceItems(updatedItems);
  };

  const printInvoice = (
    newOrderId,
    client,
    invoiceItems,
    gstAmount,
    shippingCharge,
    totalAmount
  ) => {
    const printable =
      typeof window !== "undefined"
        ? window.open("", "", "width=800,height=600")
        : null;

    if (printable && printable.document) {
      printable.document.open();
      printable.document.write(`
    <html>
      <head>
        <title>Invoice ${newOrderId}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 30px; }
          th, td { border: 2px solid #3a3838ff; padding: 8px; text-align: center; font-size: 13px; }
           th { background-color: #f6f6f6; }
            .summary { margin-top: 12px; font-size: 14px;float: right; text-align: right; }
             .info p { margin: 4px 0; font-size: 14px; line-height: 1.6; }
          .header { text-align: center; font-size: 22px; font-weight: bold; margin-bottom: 20px; }
          .footer { margin-top: 30px; font-style: italic; text-align: center; font-size: 14px; color: #555;position: fixed; bottom: 20px; width: 90%; }
          img.logo { max-width: 150px; display: block; margin: 0 auto 10px; }
        </style>
      </head>
      <body>
        <img src="${logo}" alt="Logo" class="logo" />
        <div class="header">Kavi's Dry Fruits</div>
        <div class="info">
        <p><strong>Order ID:</strong> ${newOrderId}</p>
        <p><strong>Client Name:</strong> ${client.name}</p>
        <p><strong>Phone:</strong> ${client.phone}</p>
        ${client.gst ? `<p><strong>GST No:</strong> ${client.gst}</p>` : ""}
        <p><strong>Customer Type:</strong> ${client.customerType}</p>
        <p><strong>Payment Mode:</strong> ${client.paymentMode}</p>
        <p><strong>Address:</strong> ${client.shippingAddress.street}, ${client.shippingAddress.city}, ${client.shippingAddress.state}, ${client.shippingAddress.zip}, ${client.shippingAddress.country}</p>
        </div>
        <table>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Product Name</th>
              <th>Weight</th>
              <th>Price</th>
              <th>Qty</th>              
              <th>Total</th>
              
            </tr>
          </thead>
          <tbody>
            ${invoiceItems
              .map(
                (item) => `
                <tr>
                <td>${invoiceItems.indexOf(item) + 1}</td>
                  <td>${item.name}</td>
                  <td>${item.weight}</td>
                  <td>₹${item.price.toFixed(2)}</td>
                  <td>${item.quantity}</td>
                  <td>₹${item.total.toFixed(2)}</td>
                </tr>
              `
              )
              .join("")}
          </tbody>
        </table>
        <div class="summary">
        <p><strong>GST Total:</strong> ₹${gstAmount.toFixed(2)}</p>
        <p><strong>Shipping Charge:</strong> ₹${shippingCharge.toFixed(2)}</p>
        <p><strong>Final Amount:</strong> ₹${totalAmount.toFixed(2)}</p>
        </div>
        <div class="footer">
          Thank you for shopping at Kavi's Dry Fruits!
We truly appreciate your trust in us. Enjoy your purchase, and we look forward to serving you again!
        </div>
      </body>
    </html>
  `);
      printable.document.close();
      printable.focus();
      setTimeout(() => {
        printable.print();
      }, 500);
    } else {
      toast.error("Print window blocked or failed to open.");
    }
  };

  const handleSave = async () => {
    if (!client.name || invoiceItems.length === 0)
      return toast.error("Fill all fields");

    setIsLoading(true);
    try {
      const newOrderId = await generateOrderId();
      const totalAmount = invoiceItems.reduce(
        (acc, i) => acc + i.total + i.gst,
        0
      ) + shippingCharge;
      await api.post("/orders", {
        orderId: newOrderId,
        clientName: client.name,
        clientPhone: client.phone,
        clientGST: client.gst,
        shippingAddress: client.shippingAddress,
        customerType: client.customerType,
        paymentMode: client.paymentMode,
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
            const isCombo = item.category === "Combo";
            const reduceAmount = isCombo ? item.quantity : item.quantity * 1000;
            const newStock = currentStock - reduceAmount;
            
            const endpoint = matched.comboItems ? `/combos/${matched.id}` : `/products/${matched.id}`;
            await api.put(endpoint, { ...matched, totalStock: String(newStock) });
          }
        })
      );

      toast.success("Bill saved successfully!");
      printInvoice(newOrderId, client, invoiceItems, gstAmount, shippingCharge, totalAmount);
      setClient({ 
        name: "", 
        phone: "", 
        gst: "", 
        shippingAddress: {
          street: "",
          city: "",
          state: "Tamil Nadu",
          zip: "",
          country: "India",
        },
        customerType: "Online Customer", 
        paymentMode: "Cash" 
      });
      setInvoiceItems([]);
      setGstAmount(0);
      setShippingCharge(0);
    } catch (error) {
      console.error(error);
      toast.error("Failed to save bill!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6  ">
      <div className="p-4 md:p-6 m-2 md:m-4 max-w-7xl mx-auto bg-white shadow rounded-lg">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Client Info */}
        <div className="space-y-2">
          <label>Client Name:</label>
          <input
            placeholder="Enter client name"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            value={client.name}
            onChange={(e) => setClient({ ...client, name: e.target.value })}
          />
          <label>Phone Number:</label>
          <input
            placeholder="Enter phone number"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            value={client.phone}
            onChange={(e) => setClient({ ...client, phone: e.target.value })}
          />
          <label>GST Number (optional):</label>
          <input
            placeholder="Enter GST number (if any)"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            value={client.gst}
            onChange={(e) => setClient({ ...client, gst: e.target.value })}
          />
          <label>Customer Type:</label>
          <select
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 cursor-pointer"
            value={client.customerType}
            onChange={(e) => setClient({ ...client, customerType: e.target.value })}
          >
            <option value="Online Customer">Online Customer</option>
            <option value="Shop Customer">Shop Customer</option>
          </select>
          <label>Payment Mode:</label>
          <select
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 cursor-pointer"
            value={client.paymentMode}
            onChange={(e) => setClient({ ...client, paymentMode: e.target.value })}
          >
            <option value="Cash">Cash</option>
            <option value="Card">Card</option>
            <option value="UPI">UPI</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Cheque">Cheque</option>
          </select>

          {/* Collapsible Address Section */}
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => setExpandAddress(!expandAddress)}
              className="w-full flex items-center justify-between p-4 bg-green-50 hover:bg-green-100 cursor-pointer"
            >
              <label className="font-semibold text-gray-700">Shipping Address</label>
              {expandAddress ? (
                <MdKeyboardArrowUp size={20} />
              ) : (
                <MdKeyboardArrowDown size={20} />
              )}
            </button>
            {expandAddress && (
              <div className="p-4 space-y-2 bg-white">
                <label>Street Address:</label>
                <input
                  placeholder="Enter street address"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  value={client.shippingAddress.street}
                  onChange={(e) => setClient({ ...client, shippingAddress: { ...client.shippingAddress, street: e.target.value } })}
                />
                <label>City:</label>
                <input
                  placeholder="Enter city"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  value={client.shippingAddress.city}
                  onChange={(e) => setClient({ ...client, shippingAddress: { ...client.shippingAddress, city: e.target.value } })}
                />
                <label>State:</label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 cursor-pointer"
                  value={client.shippingAddress.state}
                  onChange={(e) => setClient({ ...client, shippingAddress: { ...client.shippingAddress, state: e.target.value } })}
                >
                  <option value="">-- Select State --</option>
                  <option value="Andhra Pradesh">Andhra Pradesh</option>
                  <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                  <option value="Assam">Assam</option>
                  <option value="Bihar">Bihar</option>
                  <option value="Chhattisgarh">Chhattisgarh</option>
                  <option value="Goa">Goa</option>
                  <option value="Gujarat">Gujarat</option>
                  <option value="Haryana">Haryana</option>
                  <option value="Himachal Pradesh">Himachal Pradesh</option>
                  <option value="Jharkhand">Jharkhand</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Kerala">Kerala</option>
                  <option value="Madhya Pradesh">Madhya Pradesh</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Manipur">Manipur</option>
                  <option value="Meghalaya">Meghalaya</option>
                  <option value="Mizoram">Mizoram</option>
                  <option value="Nagaland">Nagaland</option>
                  <option value="Odisha">Odisha</option>
                  <option value="Punjab">Punjab</option>
                  <option value="Rajasthan">Rajasthan</option>
                  <option value="Sikkim">Sikkim</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Telangana">Telangana</option>
                  <option value="Tripura">Tripura</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="Uttarakhand">Uttarakhand</option>
                  <option value="West Bengal">West Bengal</option>
                </select>
                <label>Zip Code:</label>
                <input
                  placeholder="Enter zip code"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  value={client.shippingAddress.zip}
                  onChange={(e) => setClient({ ...client, shippingAddress: { ...client.shippingAddress, zip: e.target.value } })}
                />
                <label>Country:</label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 cursor-pointer"
                  value={client.shippingAddress.country}
                  onChange={(e) => setClient({ ...client, shippingAddress: { ...client.shippingAddress, country: e.target.value } })}
                >
                  <option value="">-- Select Country --</option>
                  <option value="India">India</option>
                  <option value="USA">USA</option>
                  <option value="UK">UK</option>
                  <option value="Canada">Canada</option>
                  <option value="Australia">Australia</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Product Selection */}
        <div className="space-y-2">
          <label>Select Product:</label>
          <select
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 cursor-pointer"
            value={selectedProduct.id || ""}
            onChange={(e) => handleProductSelect(e.target.value)}
          >
            <option value="">-- Select Product ID --</option>
            {productList.map((p) => (
              <option key={p.id} value={p.productId}>
                {p.productId} - {p.name}
              </option>
            ))}
          </select>

          {selectedProduct.name && (
            <div className="space-y-2">
              <label>Product Name:</label>
              <p className="w-full border border-gray-300 rounded-lg px-4 py-2">
                {selectedProduct.name}
              </p>

              <label>Quantity:</label>
              <input
                type="number"
                placeholder="Enter quantity"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                value={selectedProduct.quantity || 1}
                min="0"
                onChange={(e) =>
                  setSelectedProduct({
                    ...selectedProduct,
                    quantity: parseInt(e.target.value),
                  })
                }
              />

              {selectedProduct.category !== "Combo" && (
                <>
                  <label>Weight:</label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    value={selectedProduct.weight || ""}
                    onChange={(e) => {
                      const newWeight = e.target.value;
                      // update price from priceMap when weight changes, considering offer pricing
                      const newPrice = calculatePrice(selectedProduct.priceMap, newWeight, selectedProduct.category === "Combo", selectedProduct.category === "Combo" ? selectedProduct : null);
                      setSelectedProduct({
                        ...selectedProduct,
                        weight: newWeight,
                        price: newPrice,
                      });
                    }}
                  >
                    <option value="">-- Select Weight --</option>
                    {selectedProduct.weights.map((w, i) => (
                      <option key={i} value={w}>
                        {w}
                      </option>
                    ))}
                  </select>
                  
                </>
              )}
              <label>Price (₹):</label>
              <input
                type="text"
                placeholder="Price per unit"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                value={selectedProduct.price || ""}
                onChange={(e) =>
                  setSelectedProduct({
                    ...selectedProduct,
                    price: parseFloat(e.target.value) || 0,
                  })
                }
              />

              <label>GST Amount (₹):</label>
              <input
                type="number"
                min="0"
                placeholder="Enter GST amount"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                value={selectedProduct.gst || ""}
                onChange={(e) =>
                  setSelectedProduct({
                    ...selectedProduct,
                    gst: parseFloat(e.target.value) || 0,
                  })
                }
              />

              <button
                className="bg-green-600 text-white px-4 py-2 rounded w-full cursor-pointer"
                onClick={addProductToInvoice}
              >
                Add Product
              </button>
            </div>
          )}
        </div>
      </div>

      <hr className="my-6 border-b border-gray-300" />

      {/* Invoice Table */}
      <h2 className="text-xl font-semibold mb-3">Invoice Items</h2>
      {invoiceItems.length > 0 ? (
        <div className="overflow-x-auto rounded">
          <table className="min-w-full text-sm ">
            <thead >
              <tr className="bg-green-500 text-white">
                <th className="px-3 py-4">Product ID</th>
                <th className="px-3 py-4">Name</th>
               
                <th className="px-3 py-4">Weight</th>
                <th className="px-3 py-4">Price</th>
                 <th className="px-3 py-4">Qty</th>
                <th className="px-3 py-4">Total</th>
                <th className="px-3 py-4">GST</th>
                <th className="px-3 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {invoiceItems.map((item, i) => (
                <tr key={i} className="border-b hover:bg-gray-100 text-center" >
                  <td className="px-3 py-4">{item.id}</td>
                  <td className="px-3 py-4">{item.name}</td>
                 
                  <td className="px-3 py-4">{item.weight}</td>
                  <td className="px-3 py-4">₹{item.price.toFixed(2)}</td>
                   <td className="px-3 py-4">{item.quantity}</td>
                  <td className="px-3 py-4">₹{item.total.toFixed(2)}</td>
                  <td className="px-3 py-4">₹{item.gst.toFixed(2)}</td>
                  <td className="px-3 py-4 text-center">
                    <button
                      onClick={() => removeInvoiceItem(i)}
                      className="bg-red-600 text-white px-3 py-1 cursor-pointer rounded text-xs"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500">No items added yet.</p>
      )}

      <div className="mt-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <label>Shipping Charge (₹):</label>
          <input
            type="number"
            min="0"
            placeholder="Enter shipping charge"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 mb-2"
            value={shippingCharge}
            onChange={(e) => setShippingCharge(parseFloat(e.target.value) || 0)}
          />
          <p className="text-sm font-medium">
            GST Total: ₹{gstAmount.toFixed(2)}
          </p>
          <p className="text-lg font-bold">
            Total Amount: ₹
            {(invoiceItems.reduce((a, b) => a + b.total + b.gst, 0) + shippingCharge).toFixed(2)}
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="bg-green-600 flex items-center justify-center gap-2 cursor-pointer text-white px-6 py-2 rounded text-sm w-full md:w-auto"
        >
          {isLoading ? <ImSpinner8 className="animate-spin" /> : "Save & Print"}
        </button>
      </div>
      </div>
    </div>
  );
};

export default Billing;
