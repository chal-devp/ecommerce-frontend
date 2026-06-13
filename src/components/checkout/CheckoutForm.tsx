import { useState, useEffect } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useStore } from "../../services/useStore";
export const CheckoutForm = ({
  onSuccess,
}: {
  onSuccess: (paymenntId: string) => void;
}) => {
  const cart = useStore((state) => state.cart);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  useEffect(() => {
    console.log("CheckoutForm received totalamount prop:", total);
  }, [total]);
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [name, setName] = useState("");
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Safety check: Don't hit the server if the amount is zero
    if (total <= 0) {
      alert("Cart total is 0. Please add items to your cart.");
      return;
    }
    if (!stripe || !elements || !name) return;
    setIsProcessing(true);
    try {
      const res = await fetch(
        "http://localhost:5000/api/create-payment-intent",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: Math.round(total * 100) }),
        },
      );
      if (!res.ok) {
        const errorData = await res.json();
        console.error("Server Error:", errorData);
        throw new Error("Server responded with an error");
      }
      const { clientSecret } = await res.json();
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
          billing_details: { name },
        },
      });
      if (result.error) {
        alert(result.error.message);
      } else if (result.paymentIntent?.status === "succeeded") {
        onSuccess(result.paymentIntent.id);
      }
    } catch (err) {
      alert("Communication failed.");
    } finally {
      setIsProcessing(false);
    }
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Cardholder Name
        </label>

        <input
          type="text"
          required
          placeholder="John Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 border border-slate-200 rounded-xl bg-white focus:ring-2
focus:ring-blue-400 outline-none"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Card Details
        </label>
        <div className="p-4 bg-white rounded-xl border border-slate-200">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#1e293b",
                },
              },
            }} // Adding 'as any' hides the error
          />
        </div>
      </div>
      <button
        disabled={isProcessing || !stripe}
        className="w-full bg-blue-600 text-white py-4
rounded-2xl font-bold hover:bg-blue-700 transition"
      >
        {isProcessing ? "Processing..." : `Pay $${total.toFixed(2)}`}
      </button>
    </form>
  );
};
export default CheckoutForm;
