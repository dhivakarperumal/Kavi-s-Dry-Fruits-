import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import JsBarcode from "jsbarcode";

const Stickers = () => {
  const [productsList, setProductsList] = useState([]);
  const [productInput, setProductInput] = useState({
    productId: "",
    name: "",
    weight: "",
    price: "",
    barcode: "",
    packingDate: "",
    printQty: 1,
  });
  const [selectedProducts, setSelectedProducts] = useState({});
  const [barcodeImg, setBarcodeImg] = useState("");

  // Update barcode image whenever barcode value changes
  useEffect(() => {
    if (!productInput.barcode) {
      setBarcodeImg("");
      return;
    }
    const canvas = document.createElement("canvas");
    JsBarcode(canvas, productInput.barcode, {
      format: "CODE128",
      width: 2,
      height: 60,
      displayValue: true,
      fontSize: 14,
    });
    setBarcodeImg(canvas.toDataURL("image/png"));
  }, [productInput.barcode]);

  // Fetch products from Firestore
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const snapshot = await getDocs(collection(db, "products"));
        const data = snapshot.docs.map((doc) => ({ productId: doc.id, ...doc.data() }));
        setProductsList(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductInput((prev) => ({ ...prev, [name]: value }));
  };

  // When user selects a product from Firestore
  const handleSelectProduct = (e) => {
    const productId = e.target.value;
    const selected = productsList.find((p) => p.productId === productId);
    if (selected) {
      const defaultWeight = selected.prices ? Object.keys(selected.prices)[0] : "";
      setProductInput({
        productId: selected.productId,
        name: selected.name,
        weight: defaultWeight,
        price: "",
        barcode: selected.barcode || selected.productId,
        packingDate: selected.packingDate || "",
        printQty: 1,
      });
    } else {
      setProductInput({
        productId: "",
        name: "",
        weight: "",
        price: "",
        barcode: "",
        packingDate: "",
        printQty: 1,
      });
    }
  };

  // Add product to selected list
  const handleAddProduct = () => {
    const { productId, name, weight, price, barcode, packingDate, printQty } = productInput;
    if (!productId || !name || !weight || !price || !barcode || !packingDate || !printQty) {
      alert("Please fill all fields.");
      return;
    }

    // Generate barcode image
    const canvas = document.createElement("canvas");
    JsBarcode(canvas, barcode, { format: "CODE128", width: 2, height: 60, displayValue: false, fontSize: 14 });
    const barcodeImgData = canvas.toDataURL("image/png");

    const key = `${productId}-${weight}`;
    setSelectedProducts((prev) => ({
      ...prev,
      [key]: { productId, name, weight, price, barcodeImg: barcodeImgData, packingDate, printQty: Number(printQty) },
    }));

    setProductInput({ productId: "", name: "", weight: "", price: "", barcode: "", packingDate: "", printQty: 1 });
  };

  // Remove product from selected list
  const handleRemoveProduct = (key) => {
    setSelectedProducts((prev) => {
      const updated = { ...prev };
      delete updated[key];
      return updated;
    });
  };

  // Print all selected products in 3 columns
  const handlePrint = () => {
    const productsToPrint = Object.values(selectedProducts);
    if (productsToPrint.length === 0) {
      alert("Please add at least one product to print.");
      return;
    }

    const formatDate = (dateString) => {
      const date = new Date(dateString); 
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    };

    const iframe = document.createElement("iframe");
    iframe.style.position = "absolute";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(`
    <html>
     <head>
  <title>Print Stickers</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      padding: 10px;
    }

    .sticker-container {
      display: grid;
      grid-template-columns: repeat(10, 1fr);
      gap: 20px;
    }

    .sticker {
      width: 82px;
      padding: 0.5px;
      text-align: center;
    }

    .sticker img {
      width: 100%;
      height: 50px;
      margin-bottom: 2px;
      object-fit: cover; 
    }
  </style>
</head>

      <body>
        <div class="sticker-container">
  `);

    productsToPrint.forEach((product) => {
      for (let i = 0; i < product.printQty; i++) {
        doc.write(`
        <div class="sticker" style="text-align: center; font-family: Arial, sans-serif;  ">
        <img src="${product.barcodeImg}"  alt="Barcode" />
  <div style="font-weight: bold; margin-top: 5px;">MRP: ₹${product.price}</div>
  <div style="margin-top: 2px;">${formatDate(product.packingDate)}</div>
</div>

      `);
      }
    });

    doc.write(`
        </div>
      </body>
    </html>
  `);

    doc.close();
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
    document.body.removeChild(iframe);
  };

  return (
   <>
   
    <div className="p-8 max-w-6xl mx-auto ">
      <h1 className="text-xl font-bold mb-4">Print Stickers</h1>

      <div className="grid grid-cols-1 bg-white shadow p-8 rounded-xl md:grid-cols-2 gap-4 mb-4">
        {/* Product Selection */}
        <div className="flex flex-col">
          <label className="font-semibold">Select Product</label>
          <select
            value={productInput.productId}
            onChange={handleSelectProduct}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="">-- Select a Product --</option>
            {productsList.map((p) => (
              <option key={p.productId} value={p.productId}>
                {p.productId} - {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Product Name */}
        <div className="flex flex-col">
          <label className="font-semibold">Product Name</label>
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={productInput.name}
            readOnly
            className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
          />
        </div>

        {/* Weight Selector */}
        {productInput.productId && productsList.find(p => p.productId === productInput.productId)?.prices && (
          <div className="flex flex-col">
            <label className="font-semibold">Select Weight</label>
            <select
              name="weight"
              value={productInput.weight}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              {Object.keys(productsList.find(p => p.productId === productInput.productId).prices).map((w) => (
                <option key={w} value={w}>{w}</option>
              ))}
            </select>
          </div>
        )}

        {/* Price */}
        <div className="flex flex-col">
          <label className="font-semibold">Price</label>
          <input
            type="number"
            name="price"
            placeholder="Enter price manually"
            value={productInput.price}
            min={0}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        {/* Barcode */}
        {/* <div className="flex flex-col">
          <label className="font-semibold">Barcode</label>
          <input
            type="text"
            name="barcode"
            placeholder="Enter barcode value"
            value={productInput.barcode}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div> */}

        <div className="flex flex-col">
          {barcodeImg && (
            <>
              <label className="font-semibold">Barcode Preview</label>
              <img
                src={barcodeImg}
                alt="Barcode Preview"
                className=" border border-gray-300 rounded w-28 h-15  object-cover px-3 py-2"
                style={{ width: "300px", height: "120px" }}
              />
            </>
          )}
        </div>

        {/* Packing Date */}
        <div className="flex flex-col">
          <label className="font-semibold">Packing Date</label>
          <input
            type="date"
            name="packingDate"
            placeholder="Select packing date"
            value={productInput.packingDate}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        {/* Print Quantity */}
        <div className="flex flex-col">
          <label className="font-semibold">Print Quantity</label>
          <input
            type="number"
            name="printQty"
            min={1}
            placeholder="Enter quantity to print"
            value={productInput.printQty}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        {/* Add Product Button (full width) */}
        <div className="md:col-span-2">
          <button
            onClick={handleAddProduct}
            className="bg-green-500 text-white px-4 py-2 cursor-pointer rounded mt-2 w-full"
          >
            Add Product
          </button>
        </div>
      </div>



      
    </div>


<div className=" p-8 max-w-9xl mx-auto" >
        {Object.keys(selectedProducts).length > 0 && (
          <div className="mb-4">
            <h2 className="font-semibold mb-2">Selected Products:</h2>
            <div className="overflow-x-auto shadow rounded-xl bg-white">
              <table className="min-w-[640px] w-full text-sm text-center">
                <thead className="bg-green-500 text-white">
                  <tr>
                    <th className="px-3 py-4">Product ID</th>
                    <th className="px-3 py-4">Name</th>
                    <th className="px-3 py-4">Weight</th>
                    <th className="px-3 py-4">Price</th>
                    <th className="px-3 py-4">Packing Date</th>
                    <th className="px-3 py-4">Barcode</th>
                    <th className="px-3 py-4">Print Qty</th>
                    <th className="px-3 py-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(selectedProducts).map(([key, product]) => (
                    <tr key={key}>
                      <td className="px-3 py-4">{product.productId}</td>
                      <td className="px-3 py-4">{product.name}</td>
                      <td className="px-3 py-4">{product.weight}</td>
                      <td className="px-3 py-4">{product.price}</td>
                      <td className="px-3 py-4">{product.packingDate}</td>
                      <td className="px-3 py-4">
                        <img src={product.barcodeImg} className="w-28 h-15  object-cover" alt="Barcode" />
                      </td>
                      <td className="px-3 py-4">{product.printQty}</td>
                      <td className="px-3 py-4 text-center">
                        <button onClick={() => handleRemoveProduct(key)} className="text-red-500 font-bold">Remove</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <button onClick={handlePrint} className="bg-green-500 cursor-pointer text-white px-4 py-2 rounded">Print Stickers</button>
      </div>
   
   </>
  );
};

export default Stickers;
