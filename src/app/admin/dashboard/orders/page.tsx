"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Loader from "@/components/loader";
import { motion, AnimatePresence } from "framer-motion"; 

type Order = {
  _id: string;
  fullName: string;
  emailAddress: string;
  status: string;
  total: number;
  items: { title: string; price: number; quantity: number }[];
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/orders");
        if (!res.ok) throw new Error("Failed to fetch orders");
        const data = await res.json();
        setOrders(data.orders);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch("/api/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      setOrders(orders.map((order) => (order._id === id ? { ...order, status } : order)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const deleteOrder = async (id: string) => {
    if (!confirm("Are you sure you want to delete this order?")) return;
    try {
      const res = await fetch("/api/orders", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Failed to delete order");
      setOrders(orders.filter((order) => order._id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  // Filter orders based on search term (email or status)
  const filteredOrders = orders.filter(
    (order) =>
      order.emailAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-6 text-center"><Loader /></div>;
  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Orders</h1>

      {/* Search Bar with Animation */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <input
          type="text"
          placeholder="Search by email or status..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#029FAE]"
        />
      </motion.div>

      {/* Table for larger screens */}
      <div>
        <table className="w-full border-collapse bg-white shadow-md rounded-lg hidden md:table lg:table">
          <thead className="bg-[#029FAE] text-white">
            <tr>
              <th className="p-4 text-left">Customer</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Total</th>
              <th className="p-4 text-left">Items</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {filteredOrders.map((order) => (
                <motion.tr
                  key={order._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="border-b border-gray-200 hover:bg-gray-50 transition-colors px-8"
                >
                  <OrderRow order={order} updateStatus={updateStatus} deleteOrder={deleteOrder} />
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Cards for smaller screens */}
      <div className="md:hidden space-y-4">
        <AnimatePresence>
          {filteredOrders.map((order) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <OrderCard order={order} updateStatus={updateStatus} deleteOrder={deleteOrder} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

type OrderRowProps = {
  order: Order;
  updateStatus: (id: string, status: string) => void;
  deleteOrder: (id: string) => void;
};

function OrderRow({ order, updateStatus, deleteOrder }: OrderRowProps) {
  return (
    <>
      <td className="p-4 text-gray-700">{order.fullName}</td>
      <td className="p-4 text-gray-700">{order.emailAddress}</td>
      <td className="p-4 text-gray-700">{order.status}</td>
      <td className="p-4 text-gray-700">${order.total}</td>
      <td className="p-4">
        <div className="flex flex-col space-y-2 space-x-2">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              className="bg-[#029FAE] text-white hover:bg-[#02888D] hover:text-white"
              onClick={() => updateStatus(order._id, "Shipped")}
            >
              Mark as Shipped
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="destructive"
              className="bg-red-500 text-white hover:bg-red-600"
              onClick={() => deleteOrder(order._id)}
            >
              Delete
            </Button>
          </motion.div>
        </div>
      </td>
    </>
  );
}

function OrderCard({ order, updateStatus, deleteOrder }: OrderRowProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md p-4">
      <div className="space-y-3">
        <div>
          <span className="font-bold text-gray-700">Customer:</span> {order.fullName}
        </div>
        <div>
          <span className="font-bold text-gray-700">Email:</span> {order.emailAddress}
        </div>
        <div>
          <span className="font-bold text-gray-700">Status:</span> {order.status}
        </div>
        <div>
          <span className="font-bold text-gray-700">Total:</span> ${order.total}
        </div>
        <div className="flex space-x-4">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              className="bg-[#029FAE] text-white hover:bg-[#02888D] hover:text-white"
              onClick={() => updateStatus(order._id, "Shipped")}
            >
              Mark as Shipped
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="destructive"
              className="bg-red-500 text-white hover:bg-red-600"
              onClick={() => deleteOrder(order._id)}
            >
              Delete
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}