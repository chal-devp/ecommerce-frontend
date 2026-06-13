import { useParams, useNavigate } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "../components/checkout/CheckoutForm";
import useStore from "../services/useStore";
console.log("MY KEY:", import.meta.env.VITE_STRIPE_PUBLIC_KEY);
// Temporary test - replace the import.maeta.env line with this:
const stripePromise = loadStripe(
  "pk_test_51T5selFOuqXnRoPgSOscDQ8PDHjOfIgXbW7MI0uF4EX6kzIJy547xRvXKafe86cqH4guifjR8959qtwpfb4t2roF00qcAShAAm",
);
const PaymentPage = () => {
  const { orderId } = useParams(); // Get ID from the route: /payment/:orderId
  const navigate = useNavigate();
  const { clearCart, setCart, setDeliveryLocation, setCurrentOrderId } =
    useStore();
  // THIS is where your handlePaymentSuccess lives
  const handlePaymentSuccess = async (paymentId: string) => {
    try {
      console.log("Extracted ID:", orderId);
      // 1. Remove "/pay" from the end to match your backend route
      // 2. Ensure you are using backticks ``
      const response = await fetch(
        `http://localhost:5000/api/orders/${orderId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            // 3. Add your token here if your route is PROTECTED
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            status: "paid",
            stripePaymentId: paymentId, // Your backend ignores this currently, but it's good to send
          }),
        },
      );

      if (response.ok) {
        setCart([]);
        clearCart();
        setDeliveryLocation(null);
        setCurrentOrderId(null);
        navigate("/order-success"); // This will finally run!
      } else {
        console.error("Backend Error:", response.status);
      }
    } catch (error) {
      console.error("Connection Error:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white shadow-2xl rounded-3xl">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Finalize Payment
        </h2>

        <Elements stripe={stripePromise}>
          {/* We pass handlePaymentSuccess as the 'onSuccess' prop */}
          <CheckoutForm onSuccess={handlePaymentSuccess} />
        </Elements>
      </div>
    </div>
  );
};

export default PaymentPage;
