import { useState, useEffect } from "react";

interface Product {
  productId: string;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
  category: string;
}
interface cartItem extends Product {
  quantity: number;
}
interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  productId: string;
}
interface order {
  productId: string;
  items: OrderItem[];
  totalamount: number;
  status: string;
  createdat: string;
}

export default function Application() {
  const [Product, setProdcut] = useState<Product[]>([
    {
      productId: "123",
      name: "tv",
      imageUrl: "hefrueggegecyegudgyfud",
      category: "accessories",
      description: "good looking tv",
      price: 234,
    },
  ]);
  const [newPProduct, setNewProdcut] = useState({
    productId: "",
    name: "",
    price: 0,
    imageUrl: "",
    description: "",
    category: "",
  });
  function addproduct() {
    setProdcut([...Product, newPProduct]);
    setNewProdcut({
      productId: "",
      name: "",
      price: 0,
      imageUrl: "",
      description: "",
      category: "",
    });
  }

  return (
    <>
      <form action="submit" onSubmit={addproduct}>
        {" "}
        <input
          type="text"
          value={newPProduct.productId}
          onChange={(e) =>
            setNewProdcut({ ...newPProduct, productId: e.target.value })
          }
        />
        <input
          type="text"
          value={newPProduct.name}
          onChange={(e) =>
            setNewProdcut({ ...newPProduct, name: e.target.value })
          }
        />
        <input
          type="text"
          value={newPProduct.imageUrl}
          onChange={(e) =>
            setNewProdcut({ ...newPProduct, imageUrl: e.target.value })
          }
        />
        <input
          type="text"
          value={newPProduct.price}
          onChange={(e) =>
            setNewProdcut({ ...newPProduct, price: Number(e.target.value) })
          }
        />
        <input
          type="text"
          value={newPProduct.description}
          onChange={(e) =>
            setNewProdcut({ ...newPProduct, description: e.target.value })
          }
        />
        <select
          name="selct"
          id=""
          value={newPProduct.category}
          onChange={(e) =>
            setNewProdcut({ ...newPProduct, category: e.target.value })
          }
        >
          <option value="">choose the category</option>
          <option value="laptop">laptop</option>
          <option value="accessories">accessories</option>
          <option value="electroncis">electroncis</option>
        </select>
      </form>
    </>
  );
}
