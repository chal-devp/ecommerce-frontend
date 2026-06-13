interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  imageUrl?: string;
  category?: string;
  stock?: number;
}
interface CartItem extends Product {
  quantity: number;
}
interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price?: number;
}
interface order {
  _id: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  createdAt: string;
}
export type { Product, CartItem, OrderItem, order };
