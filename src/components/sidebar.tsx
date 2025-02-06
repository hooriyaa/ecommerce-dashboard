"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Home, Box, ShoppingCart, Star, LogOut, PlusCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";


const Sidebar = () => {
  const router = useRouter();

  const handleLogout = () => {
    router.push("/admin/login");
  };

  const sidebarVariants = {
    open: { opacity: 1, x: 0 },
    closed: { opacity: 0, x: "-100%" },
  };

  const linkVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95 },
  };
 
  const links = [
    { href: "/admin/dashboard", icon: <Home className="mr-2 h-4 w-4" />, text: "Dashboard" },
    { href: "/admin/dashboard/products", icon: <Box className="mr-2 h-4 w-4" />, text: "Products" },
    { href: "/admin/dashboard/add_Product", icon: <PlusCircle className="mr-2 h-4 w-4" />, text: "Add Products" },
    { href: "/admin/dashboard/orders", icon: <ShoppingCart className="mr-2 h-4 w-4" />, text: "Orders" },
    { href: "/admin/dashboard/reviews", icon: <Star className="mr-2 h-4 w-4" />, text: "Reviews" },
  ];

  return (
    <>
      {/* Hamburger menu for mobile */}
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="bg-transparent border-none">
              <Menu className="h-6 w-6 text-white" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 bg-[#029FAE] text-white p-4">
            <motion.div
              initial="closed"
              animate="open"
              variants={sidebarVariants}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-bold mb-4">Admin Dashboard</h2>
              <nav className="mt-4 space-y-2">
                <AnimatePresence>
                  {links.map((link, index) => (
                    <motion.div
                      key={index}
                      variants={linkVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      <Link
                        href={link.href}
                        className="flex items-center p-2 rounded hover:bg-[#02888D]"
                      >
                        {link.icon}
                        {link.text}
                      </Link>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </nav>
              <motion.div variants={linkVariants} whileHover="hover" whileTap="tap">
                <Button
                  onClick={handleLogout}
                  className="mt-8 bg-[#ffffff] hover:text-[#ffffff] text-[#029FAE] hover:bg-[#02888D] w-full rounded">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </motion.div>
            </motion.div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Regular sidebar for desktop */}
      <aside className="hidden lg:block w-64 bg-[#029FAE] text-white min-h-screen p-4 fixed inset-y-0 left-0 z-50">
        <motion.div
          initial="closed"
          animate="open"
          variants={sidebarVariants}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-xl font-bold mb-4">Admin Dashboard</h2>
          <nav className="mt-4 space-y-2">
            <AnimatePresence>
              {links.map((link, index) => (
                <motion.div
                  key={index}
                  variants={linkVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Link
                    href={link.href}
                    className="flex items-center p-2 rounded hover:bg-[#02888D]"
                  >
                    {link.icon}
                    {link.text}
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </nav>
          <motion.div variants={linkVariants} whileHover="hover" whileTap="tap">
            <Button
              onClick={handleLogout}
              className="mt-8 bg-[#ffffff] hover:text-[#ffffff] text-[#029FAE] hover:bg-[#02888D] w-full rounded">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </motion.div>
        </motion.div>
      </aside>
    </>
  );
};

export default Sidebar;