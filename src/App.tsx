import { useState, useEffect } from "react";
import { ArrowLeft, Component } from "lucide-react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
// Importing components and layouts
import { ProtectedRoute } from "./features/ProtectedRoute";
import AdminPanel from "./features/AdminPanel";
import NavBar from "./components/layout/NavBar.tsx";
import Footer from "./components/layout/Footer.tsx";

import ShopView from "./components/layout/ShopView.tsx";
import CartSideBar from "./components/cart/CartSideBar.tsx";
import HandleAuthentication from "./components/authentication/HandleAuthentication.tsx";
import PaymentPage from "./payment/Payment.tsx";
import OrderSuccessPage from "./features/OrderSuccessPage.tsx";

import MyOrdersPage from "./features/ViewOrders.tsx";
// Importing types
import type { Product, order } from "./types/interface";

// Importing store
import useStore from "./services/useStore.tsx";
import MapPage from "./map/MapPage.tsx";

function App() {
  const navigate = useNavigate();
  const {
    searchTerm,
    cart,
    setCurrentOrderId,
    isLoggedIn,
    isLoading,
    deliveryLocation,
    setOrderPlaced,
  } = useStore();

  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<order[]>([]);
  const [adminTab, setAdminTab] = useState<"products" | "orders" | "update">(
    "products",
  );

  const [isDataLoading, setIsDataLoading] = useState(true);

  // 1. Fetch Products on mount
  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setIsDataLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsDataLoading(false);
      });
  }, []);
  const fetchOrders = () => {
    fetch("http://localhost:5000/api/orders")
      .then((res) => res.json())
      .then((data) => setOrders(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Error fetching orders:", err));
  };
  const handleCheckout = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("Token check:", token ? "Token exists" : "No token found");
      console.log("Checkout process started...");

      // Check if logged in OR if we are explicitly bypassing for auto-checkout
      if (!isLoggedIn) {
        console.log("User not logged in, redirecting...");
        navigate("/login");
        return;
      }

      const totalAmount = cart.reduce(
        (total, item) => total + item.price * item.quantity,
        0,
      );
      console.log(totalAmount);
      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: cart,
          totalAmount: totalAmount,
          status: "pending_payment",
        }),
      });

      const newOrder = await response.json();

      if (response.ok) {
        // Check if the ID exists. Does your backend use _id or id?
        console.log("Server Response:", newOrder); // LOG 2: Important!

        const order_Id = newOrder._id || newOrder.id;

        if (order_Id) {
          console.log(order_Id);
          setOrderPlaced(true);
          setCurrentOrderId(order_Id);
          navigate("/selectmap");

          setTimeout(() => setOrderPlaced(false), 5000);

          console.log("Navigating to payment for ID:", order_Id); // LOG 3
        } else {
          console.error("Server responded with error:", newOrder);
          alert(`Checkout failed: ${newOrder.message || "Unknown error"}`);
        }
      }
    } catch (error: any) {
      console.error("Fetch Error:", error);
      alert(
        "Error connecting to server. Is your backend running at port 5000?",
      );
    }
  }; // 3. Logic to auto-trigger checkout after login

  // Fetch Orders for Admin

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen p-3 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto">
        <NavBar />
        <Routes>
          <Route
            path="/"
            element={
              <>
                <header className="flex justify-between items-center my-8 pb-4 border-b border-slate-100">
                  <h1 className="text-2xl font-black text-amber-600 italic">
                    SHOP
                  </h1>
                  <button
                    onClick={() => navigate("/admin")}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition"
                  >
                    <Component size={18} /> Admin Panel
                  </button>
                </header>
                <div className="grid lg:grid-cols-3 gap-10">
                  {isDataLoading ? (
                    <div className=" flex justify-center py-20">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
                    </div>
                  ) : (
                    <ShopView filteredProducts={filteredProducts} />
                  )}
                </div>
              </>
            }
          />
          <Route
            path="/CartSideBar"
            element={
              <CartSideBar
                handleCheckOut={handleCheckout}
                isLoading={isLoading}
                isLoggedIn={isLoggedIn}
                deliveryLocation={deliveryLocation}
              />
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminPanel
                  product={products}
                  setproduct={setProducts}
                  adminTab={adminTab}
                  setAdminTab={setAdminTab}
                  orders={orders}
                  setOrders={setOrders}
                  fetchOrders={fetchOrders}
                />
              </ProtectedRoute>
            }
          />

          <Route
            path="/login"
            element={
              <div className="mt-10">
                <button
                  onClick={() => navigate("/")}
                  className="mb-4 flex items-center gap-2 hover:underline"
                >
                  <ArrowLeft size={16} /> Back to Shop
                </button>
                <HandleAuthentication />
              </div>
            }
          />

          <Route path="/payment/:orderId" element={<PaymentPage />} />
          <Route path="/order-success" element={<OrderSuccessPage />} />
          <Route
            path="/my-orders"
            element={<MyOrdersPage orders={orders} setOrders={setOrders} />}
          />

          <Route
            path="/selectmap"
            element={
              isLoggedIn ? (
                <section className="bg-white p-6 rounded-2xl border shadow-sm">
                  <h2 className="text-xl font-bold mb-4">
                    1. Delivery Location
                  </h2>
                  <MapPage />
                </section>
              ) : (
                <Navigate to="/" />
              )
            }
          />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <Footer />
      </div>
    </div>
  );
}

export default App;
