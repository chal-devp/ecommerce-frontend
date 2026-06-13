import { useNavigate } from "react-router-dom";
import type { Product } from "../../types/interface";
import useStore from "../../services/useStore.tsx";

interface ShopViewProps {
  filteredProducts: Product[];
}
function ShopView({ filteredProducts }: ShopViewProps) {
  const { addToCart } = useStore();
  // Persist Cart
  const navigate = useNavigate();

  return (
    <>
      {filteredProducts.map((product) => (
        <div
          key={product._id}
          className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
        >
          <img
            src={product.imageUrl || "https://via.placeholder.com/150"}
            alt={product.name}
            className="w-full h-48 object-cover rounded-2xl mb-4"
          />
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-lg">{product.name}</h3>
            <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-md font-bold">
              {product.category}
            </span>
          </div>
          <p className="text-blue-600 font-black text-xl mb-4">
            ${product.price}
          </p>
          <button
            onClick={() => {
              addToCart(product);
              navigate("/CartSideBar");
            }}
            className="w-full bg-slate-900 text-white py-3 rounded-xl hover:bg-blue-600 transition-colors font-bold"
          >
            Add to Cart
          </button>
        </div>
      ))}
    </>
  );
}
export default ShopView;
