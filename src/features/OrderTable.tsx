import type { order } from "../types/interface";

interface OrderProps {
  orders: order[];
  setOrders: React.Dispatch<React.SetStateAction<order[]>>;
}

function OrderTable({ orders, setOrders }: OrderProps) {
  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/orders/${orderId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ status: newStatus }),
        },
      );

      if (response.ok) {
        setOrders((prev) =>
          prev.map((o) =>
            o._id === orderId ? { ...o, status: newStatus } : o,
          ),
        );
      }
    } catch (err: any) {
      console.error("Failed to update status", err);
    }
  };

  if (!orders || orders.length === 0) {
    return (
      <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
        <p className="text-slate-500 font-medium">No orders found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b text-slate-400 text-sm">
            <th className="p-4 uppercase tracking-wider font-bold">ID</th>
            <th className="p-4 uppercase tracking-wider font-bold">Items</th>
            <th className="p-4 uppercase tracking-wider font-bold">Total</th>
            <th className="p-4 uppercase tracking-wider font-bold">Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr
              key={order._id}
              className="border-b hover:bg-slate-50 transition-colors"
            >
              <td className="p-4 font-mono text-xs text-blue-600">
                #{order._id.slice(-6)}
              </td>
              <td className="p-4 text-sm text-slate-600">
                {order.items.map((i) => `${i.quantity}x ${i.name}`).join(", ")}
              </td>
              <td className="p-4 font-black">${order.totalAmount}</td>
              <td className="p-4">
                <select
                  value={order.status}
                  onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                  className={`p-2 rounded-lg font-bold text-xs outline-none cursor-pointer border-none shadow-sm ${
                    order.status === "Delivered"
                      ? "bg-green-100 text-green-700"
                      : order.status === "Shipped"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-orange-100 text-orange-700"
                  }`}
                >
                  <option value="Pending">Pending</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OrderTable;
