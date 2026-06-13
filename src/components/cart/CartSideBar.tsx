import { ShoppingCart, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useStore from "../../services/useStore.tsx";
interface cartsidebarprop {
  handleCheckOut: () => void;
  isLoading: boolean;
  isLoggedIn: boolean;
  deliveryLocation: { lat: number; lng: number } | null;
}

function CartSideBar({
  handleCheckOut,
  isLoading,
  isLoggedIn,
  deliveryLocation,
}: cartsidebarprop) {
  const navigate = useNavigate();
  const { removeFromCart, cart, totalAmountOf } = useStore();
  const totalValue = totalAmountOf();

  // Get everything you need from the store

  return (
    <div className="min-h-screen bg-slate-100 py-12 px-5">
      <div className=" bg-slate-100 p-6 max-w-4xl mx-auto rounded-3xl shadow-xl h-fit  ">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <ShoppingCart size={20} /> Your Cart
        </h2>

        {cart.length === 0 ? (
          <p className="text-slate-400 text-center py-10">Your cart is empty</p>
        ) : (
          <>
            {/* Scrollable list of items */}
            <div className="max-h-96 overflow-y-auto pr-2">
              {cart.map((item) => (
                <div
                  key={item._id}
                  className="flex justify-between items-center mb-4 pb-4 border-b border-slate-200"
                >
                  <div>
                    <p className="font-bold text-sm">{item.name}</p>
                    <p className="text-xs text-slate-500">
                      ${item.price} x {item.quantity}
                    </p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="text-red-400 hover:text-red-600 p-2"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-slate-200">
              <div className="flex justify-between font-black text-2xl">
                <span>Total:</span>
                <span>${totalValue.toFixed(2)}</span>
              </div>
              {/* Note: No Stripe or Map here anymore! */}
            </div>
          </>
        )}
        <div className="flex justify-between p-2 rounded-2xl gap-6">
          <button
            onClick={() => navigate("/")}
            disabled={isLoading}
            className={`w-full mt-4 ${isLoggedIn ? ` bg-green-500` : ` bg-orange-500`} text-white py-4 rounded-2xl font-bold hover:bg-orange-600 disabled:bg-slate-300 transition-colors`}
          >
            {" "}
            add to cart more
          </button>
          <button
            onClick={handleCheckOut}
            disabled={isLoading || cart.length === 0}
            className={`w-full mt-4 ${deliveryLocation && isLoggedIn ? ` bg-green-500` : ` bg-orange-500`} text-white py-4 rounded-2xl font-bold hover:bg-orange-600 disabled:bg-slate-300 transition-colors`}
          >
            {!isLoggedIn &&
            cart.length > 0 &&
            !deliveryLocation &&
            cart.length > 0
              ? "Login to Checkout"
              : "Place Order"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CartSideBar;
