"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { createClient } from "next-sanity";
import { ShoppingBag, Package, Star, Truck, Clock } from "lucide-react";
import Loader from "@/components/loader";

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2023-01-01",
  useCdn: false,
});

type DashboardData = {
  totalProducts: number;
  totalOrders: number;
  totalReviews: number;
  totalDeliveredOrders: number;
  totalPendingOrders: number;
  chartData: Array<{ name: string; value: number }>;
};

const AdminDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const products = await sanityClient.fetch("*[_type == 'products']");
        const orders = await sanityClient.fetch("*[_type == 'orders']");
        const reviews = await sanityClient.fetch("*[_type == 'review']");

        const totalProducts = products.length;
        const totalOrders = orders.length;
        const totalReviews = reviews.length;

        const deliveredOrders: number = orders.filter((order: { status: string }) => order.status === "delivered").length;
        const pendingOrders: number = orders.filter((order: { status: string }) => order.status === "pending").length;

        interface Order {
          status: string;
          total: number;
        }

        interface ChartData {
          name: string;
          value: number;
        }

        const chartData: ChartData[] = orders.map((order: Order, index: number) => ({
          name: `Order ${index + 1}`,
          value: order.total,
        }));

        setDashboardData({
          totalProducts,
          totalOrders,
          totalReviews,
          totalDeliveredOrders: deliveredOrders,
          totalPendingOrders: pendingOrders,
          chartData,
        });
      } catch (error) {
        console.error("Failed to fetch dashboard data: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <motion.h1
        className="text-2xl sm:text-3xl font-bold mb-6 text-[#007580] text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Dashboard
      </motion.h1>

      {loading ? (
        <Loader />
      ) : (
        dashboardData && (
          <>
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              {[{
                title: "Total Products", value: dashboardData.totalProducts, color: "#F5813F", icon: ShoppingBag
              }, {
                title: "Total Orders", value: dashboardData.totalOrders, color: "#01AD5A", icon: Package
              }, {
                title: "Total Reviews", value: dashboardData.totalReviews, color: "#DE3163", icon: Star
              }, {
                title: "Delivered Orders", value: dashboardData.totalDeliveredOrders, color: "#F5813F", icon: Truck
              }, {
                title: "Pending Orders", value: dashboardData.totalPendingOrders, color: "#DE3163", icon: Clock
              }].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                >
                  <Card className="shadow-xl border-t-4" style={{ borderColor: item.color }}>
                    <CardHeader className="flex items-center space-x-3 text-[#007580]">
                      <item.icon size={24} />
                      <span className="text-lg sm:text-xl font-semibold">{item.title}</span>
                    </CardHeader>
                    <CardContent className="text-2xl sm:text-3xl font-bold text-gray-700">
                      {item.value}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              className="mt-6 sm:mt-8 w-full overflow-x-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="text-xl sm:text-2xl font-bold mb-4 text-[#007580] text-center sm:text-left mt-5">Orders Chart</h2>
              <div className="w-[320px] sm:w-full">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dashboardData.chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#F5813F" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </>
        )
      )}
    </div>
  );
};

export default AdminDashboard;