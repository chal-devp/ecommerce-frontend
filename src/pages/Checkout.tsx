localStorage.setItem("pendingCheckout", "true");
useEffect(() => {
  const shouldPayNow = localStorage.getItem("pendingCheckout");

  // ADD 'isLoading === false' to the check
  if (shouldPayNow === "true" && !isLoading && isLoggedIn && cart.length > 0) {
    localStorage.removeItem("pendingCheckout");

    const timer = setTimeout(() => {
      handleCheckout();
    }, 100); // Small 100ms delay helps state stabilize

    return () => clearTimeout(timer);
  }
}, [isLoggedIn, isLoading, cart.length, handleCheckout]);
const handleCheckout = useCallback(async () => {
  try {
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

    const response = await fetch("http://localhost:5000/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: cart,
        location: deliveryLocation,
        total: totalAmount,
        status: "pending_payment",
      }),
    });

    const newOrder = await response.json();
    console.log("Server Response:", newOrder); // LOG 2: Important!

    if (response.ok) {
      // Check if the ID exists. Does your backend use _id or id?
      const orderId = newOrder._id || newOrder.id;

      if (orderId) {
        setOrderPlaced(true);
        setCart([]);
        setDeliveryLocation(null);
        setTimeout(() => setOrderPlaced(false), 5000);

        console.log("Navigating to payment for ID:", orderId); // LOG 3
        navigate(`/payment/${orderId}`);
      } else {
        console.error("Order created but no ID returned from server.");
        alert("Server error: Order ID missing.");
      }
    } else {
      console.error("Server responded with error:", newOrder);
      alert(`Checkout failed: ${newOrder.message || "Unknown error"}`);
    }
  } catch (error: any) {
    console.error("Fetch Error:", error);
    alert("Error connecting to server. Is your backend running at port 5000?");
  }
}, [isLoggedIn, cart, deliveryLocation, navigate, setCart]);
import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { CheckCircle, Package, ArrowRight, ShoppingBag } from "lucide-react";
import confetti from "canvas-confetti"; // Optional: npm install canvas-confetti

const OrderSuccessPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Fire confetti for a nice UX touch when the page loads
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#22c55e", "#3b82f6", "#f59e0b"],
    });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-10 text-center border border-slate-100">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 p-4 rounded-full">
            <CheckCircle size={64} className="text-green-500 animate-bounce" />
          </div>
        </div>

        <h1 className="text-3xl font-black text-slate-800 mb-2">
          Order Confirmed!
        </h1>
        <p className="text-slate-500 mb-8">
          Thank you for your purchase. Your order has been placed successfully
          and is now being processed.
        </p>

        {/* Order Info Card */}
        <div className="bg-slate-50 rounded-2xl p-6 mb-8 border border-slate-100 text-left">
          <div className="flex items-center gap-3 mb-4">
            <Package className="text-blue-500" size={20} />
            <span className="font-bold text-slate-700">Status: Processing</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            You will receive an email confirmation shortly with your order
            details and tracking information once shipped.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link
            to="/my-orders"
            className="flex items-center justify-center gap-2 w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg"
          >
            View My Orders <ArrowRight size={18} />
          </Link>

          <button
            onClick={() => navigate("/")}
            className="flex items-center justify-center gap-2 w-full bg-white text-slate-600 py-4 rounded-2xl font-bold border border-slate-200 hover:bg-slate-50 transition-all"
          >
            <ShoppingBag size={18} /> Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
