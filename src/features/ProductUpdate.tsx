import { useState, type Dispatch, type SetStateAction } from "react";
import type { Product } from "../types/interface.ts";

interface productProp {
  product: Product[];
  setProducts: Dispatch<SetStateAction<Product[]>>;
}
function ChildComponent({
  item,
  onDelete,
  onUpate,
}: {
  item: Product;
  onDelete: (productId: string) => void;
  onUpate: (productId: string, change: number) => void;
}) {
  const [localStock, setLocalStock] = useState<string | number>("");
  return (
    <div
      key={item._id}
      className=" bg-slate-300 text-sm  m-1 rounded-2xl shadow-sm border overflow-x-hidden border-slate-500 text-slate-900"
    >
      <img
        src={item.imageUrl}
        alt="image"
        className="w-full  h-48 p-1 rounded-2xl "
      />
      <div className=" px-1 py-2 w-full rounded-2xl bg-slate-600 flex justify-between items-center">
        <h1 className="text-sm font-bold p-1">{item.name}</h1>
        <span
          className="text-smfontbold
              p-1"
        >
          {item.stock}
        </span>
      </div>

      <button
        onClick={() => {
          onDelete(item._id);
        }}
        className="bg-red-300 p-1  text-sm rounded-xl mt-1 w-full hover:bg-red-600"
      >
        delete
      </button>
      <div className="w-full flex justify-between items-center p-2   bg-slate-900 gap-4">
        <input
          type="number"
          className=" border min-w-0 border-green-500 rounded-2xl focus:outline-none text-white font-bold"
          value={localStock}
          onChange={(e) => {
            setLocalStock(e.target.value);
          }}
        />
        <button
          onClick={() => {
            onUpate(item._id, Number(localStock));
          }}
          className="bg-green-500 text-black p-1 font-bold text-sm rounded-xl hover:bg-red-600"
        >
          update
        </button>
      </div>
    </div>
  );
}
function ProductUpdate({ product, setProducts }: productProp) {
  const haandleApiToDeleteEach = async (productId: string) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/product/${productId}`,
        {
          method: "DELETE",
          headers: {
            "content-type": "application-json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      if (response.ok) {
        const productFromBackEnd = await response.json();
        setProducts(productFromBackEnd);
      }
    } catch (error) {
      console.error("backend error :", error);
    }
  };
  const haandleApiToIncreaseEachStock = async (
    productId: string,
    change: number,
  ) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/product/${productId}`,
        {
          method: "patch",
          headers: {
            "content-type": "application-json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ stockChange: Number(change) }),
        },
      );

      if (response.ok) {
        const productToSave = await response.json();
        setProducts(productToSave);
      }
    } catch (error) {
      console.error("backend server error:", error);
    }
  };
  return (
    <div className="w-full  ">
      <h1 className=" text-green-700 text-2xl text-center p-1 uppercase shadow backdrop-blur-xl text-shadow-sky-700">
        admin page to update product
      </h1>
      <div className="grid grid-cols-2 md:grid-cols-4 p-6">
        {product.map((item) => (
          <ChildComponent
            item={item}
            onDelete={haandleApiToDeleteEach}
            onUpate={haandleApiToIncreaseEachStock}
          />
        ))}
      </div>
    </div>
  );
}
export default ProductUpdate;
