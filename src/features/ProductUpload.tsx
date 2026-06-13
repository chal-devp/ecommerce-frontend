import { useState } from "react";

function ProductUpload() {
  const [loading, setLoading] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    category: "",
    imageUrl: "",
    description: "",
  });
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Ensure price is sent as a number
      const productToSave = {
        ...newProduct,
        price: parseFloat(newProduct.price),
      };

      const response = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productToSave),
      });

      if (response.ok) {
        // Switch to see if orders exist or stay here
        setNewProduct({
          name: "",
          price: "",
          category: "",
          imageUrl: "",
          description: "",
        });
        setLoading(false);
        alert("Product Added!");
      }
    } catch (err: any) {
      alert("Backend server error!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {" "}
      <form onSubmit={handleUpload} className="max-w-2xl mx-auto space-y-4">
        <h2 className="text-2xl font-black mb-6">Create New Listing</h2>
        <div className="grid grid-cols-2 gap-4">
          <input
            className="p-4 bg-slate-50 rounded-xl border-none ring-1 ring-slate-200 focus:ring-blue-500 outline-none"
            placeholder="Product Name"
            value={newProduct.name}
            onChange={(e) =>
              setNewProduct({ ...newProduct, name: e.target.value })
            }
            required
          />
          <input
            className="p-4 bg-slate-50 rounded-xl border-none ring-1 ring-slate-200 focus:ring-blue-500 outline-none"
            placeholder="Price ($)"
            type="number"
            value={newProduct.price}
            onChange={(e) =>
              setNewProduct({
                ...newProduct,
                price: e.target.value,
              })
            }
            required
          />
        </div>
        <input
          className="w-full p-4 bg-slate-50 rounded-xl border-none ring-1 ring-slate-200 focus:ring-blue-500 outline-none"
          placeholder="Image URL"
          value={newProduct.imageUrl}
          onChange={(e) =>
            setNewProduct({
              ...newProduct,
              imageUrl: e.target.value,
            })
          }
        />
        <select
          className="w-full p-4 bg-slate-50 rounded-xl border-none ring-1 ring-slate-200 focus:ring-blue-500 outline-none"
          value={newProduct.category}
          onChange={(e) =>
            setNewProduct({
              ...newProduct,
              category: e.target.value,
            })
          }
        >
          <option value="">Select Category</option>
          <option value="Laptops">Laptops</option>
          <option value="Phones">Phones</option>
          <option value="Accessories">Accessories</option>
        </select>
        <button
          disabled={loading}
          type="submit"
          className="w-full bg-blue-600 text-white font-bold p-4 rounded-xl hover:bg-blue-700 transition-all"
        >
          {loading ? "uploading" : "Upload to Store"}
        </button>
      </form>
    </div>
  );
}
export default ProductUpload;
