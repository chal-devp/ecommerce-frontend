import { type Dispatch, type SetStateAction } from "react";
import { ArrowLeft, PlusCircle, Package } from "lucide-react"; // Option A: Lucide Icons
import { useNavigate } from "react-router-dom";
import ProductUpload from "./ProductUpload.tsx";
import Order from "./OrderTable.tsx";
import type { order, Product } from "../types/interface.ts";
import ProductUpdate from "./ProductUpdate.tsx";

// REMOVED: Duplicate imports and Heroicons mix-in to prevent "ReferenceError"

// Define the "shape" of the props we are receiving from App.tsx
interface AdminPanelProps {
  product: Product[];
  setproduct: Dispatch<SetStateAction<Product[]>>;
  adminTab: "products" | "orders" | "update";
  setAdminTab: (tab: "products" | "orders" | "update") => void;
  orders: order[];
  setOrders: Dispatch<SetStateAction<order[]>>;
  fetchOrders: () => void;
}

const AdminPanel = ({
  setproduct,
  product,
  adminTab,
  setAdminTab,
  orders,
  setOrders,
  fetchOrders,
}: AdminPanelProps) => {
  const navigate = useNavigate();

  return (
    <div className="mt-10">
      <button
        onClick={() => navigate("/")}
        className="mb-4 flex items-center gap-2 hover:underline text-slate-600"
      >
        <ArrowLeft size={16} /> Shop
      </button>

      <div className="bg-white p-8 rounded-3xl shadow-2xl border border-slate-100">
        <div className="flex justify-center gap-4 mb-10">
          <button
            onClick={() => setAdminTab("products")}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
              adminTab === "products"
                ? "bg-amber-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {/* Using Lucide PlusCircle as defined in imports */}
            <PlusCircle size={20} /> Add Product
          </button>

          <button
            onClick={() => {
              setAdminTab("orders");
              fetchOrders();
            }}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
              adminTab === "orders"
                ? "bg-amber-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <Package size={20} /> Manage Orders
          </button>
          <button
            onClick={() => {
              setAdminTab("update");
            }}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
              adminTab === "update"
                ? "bg-amber-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <Package size={20} /> Update product
          </button>
        </div>
        {/* Decide which sub-component to show */}
        {adminTab === "products" ? (
          <ProductUpload />
        ) : adminTab === "orders" ? (
          <Order orders={orders} setOrders={setOrders} />
        ) : (
          <ProductUpdate setProducts={setproduct} product={product} />
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
