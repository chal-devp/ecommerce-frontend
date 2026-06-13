import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { Package, Clock, ChevronRight, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import type { order } from "../types/interface";

interface viewProp {
  orders: order[];
  setOrders: Dispatch<SetStateAction<order[]>>;
}
const MyOrdersPage = ({ orders, setOrders }: viewProp) => {
  const navigate = useNavigate();
  const [updateTab, setUpdateTab] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/orders/my-orders",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        }
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "bg-green-100 text-green-700";
      case "processing":
        return "bg-blue-100 text-blue-700";
      case "shipped":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  if (updateTab) {
    navigate("/adminupdate");
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-black text-slate-800 mb-8 flex items-center gap-3">
          <Package size={32} className="text-blue-600" />
          My Orders
        </h1>

        {orders.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] p-12 text-center shadow-sm border border-slate-100">
            <div className="bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag size={40} className="text-slate-400" />
            </div>
            <h2 className="text-xl font-bold text-slate-700 mb-2">
              No orders yet
            </h2>
            <p className="text-slate-500 mb-8">
              Ready to start your first shopping journey?
            </p>
            <Link
              to="/"
              className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-blue-700 transition mr-2"
            >
              Go Shopping
            </Link>
            <button
              className="bg-blue-600 py-3 text-white rounded-2xl px-8 font-bold hover:bg-blue-700 transition-all ml-2"
              onClick={() => setUpdateTab(!updateTab)}
            >
              go to update
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Order ID:{" "}
                      <span className="text-slate-600">
                        {order._id.slice(-8)}
                      </span>
                    </div>
                    <div className="text-lg font-bold text-slate-800">
                      ${(order.totalAmount / 100).toFixed(2)}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Clock size={14} />
                      {new Date(order.createdAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                        second: "numeric",
                      })}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span
                      className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide ${getStatusColor(order.status)}`}
                    >
                      {order.status}
                    </span>
                    <button className="p-2 hover:bg-slate-50 rounded-xl transition text-slate-400">
                      <ChevronRight size={24} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrdersPage;
