"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Trash, Pencil, Plus } from "lucide-react";
import { createClient } from "next-sanity";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2023-01-01",
  token: process.env.NEXT_PUBLIC_SANITY_AUTH_TOKEN,
  useCdn: false,
});

type Product = {
  _id: string;
  id: number;
  title: string;
  price: number;
  priceWithoutDiscount: number;
  badge: string;
  description: string;
  inventory: number;
  image: string;
};

type ProductFormData = {
  id: number;
  title: string;
  price: number;
  priceWithoutDiscount: number;
  badge: string;
  description: string;
  inventory: number;
};

const ProductPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { register, handleSubmit, reset, setValue } = useForm<ProductFormData>();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const query = `*[_type in ["products","categories"]]{_id, id, title, price, priceWithoutDiscount, badge, description, inventory, image}`;
      const data: Product[] = await sanityClient.fetch(query);
      setProducts(data);
    } catch (error: unknown) {
      console.error("Error fetching products:", error);
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      await sanityClient.transaction().delete(productId).commit();
      fetchProducts();
      toast.error("Product deleted successfully!");
    } catch (error: unknown) {
      console.error("Error deleting product:", error);
      toast.error(`Error deleting product: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  };

  const handleSave = async (data: ProductFormData) => {
    try {
      let imageRef = null;
      if (imageFile) {
        const imageAsset = await sanityClient.assets.upload("image", imageFile);
        imageRef = imageAsset._id;
      }

      if (editingProduct) {
        await sanityClient
          .patch(editingProduct._id)
          .set({
            id: data.id,
            title: data.title,
            price: Number(data.price),
            priceWithoutDiscount: Number(data.priceWithoutDiscount),
            badge: data.badge,
            description: data.description,
            inventory: Number(data.inventory),
            image: imageRef ? { asset: { _ref: imageRef } } : editingProduct.image,
          })
          .commit();

        toast.success("Product updated successfully!");
      }

      setEditingProduct(null);
      reset();
      setImageFile(null);
      fetchProducts();
    } catch (error: unknown) {
      console.error("Error saving product:", error);
      toast.error(`Error saving product: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  };

  useEffect(() => {
    if (editingProduct) {
      setValue("id", editingProduct.id);
      setValue("title", editingProduct.title);
      setValue("price", editingProduct.price);
      setValue("priceWithoutDiscount", editingProduct.priceWithoutDiscount);
      setValue("badge", editingProduct.badge);
      setValue("description", editingProduct.description);
      setValue("inventory", editingProduct.inventory);
    }
  }, [editingProduct, setValue]);

  return (
    <motion.div className="p-6 bg-gray-50 min-h-screen">
      <ToastContainer />
      <motion.div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 text-center sm:text-left">
        <h1 className="text-3xl text-[#007580] font-semibold">Products</h1>
        <Link href="/admin/dashboard/add_Product" className="w-full sm:w-auto">
          <motion.button
            className="bg-[#029FAE] text-white px-4 py-2 flex items-center justify-center w-full sm:w-auto hover:bg-[#007580] rounded-xl transition-all duration-300"
            whileHover={{ scale: 1.05 }}
          >
            <Plus className="mr-2" /> Add Product
          </motion.button>
        </Link>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {products.map((product) => (
          <motion.div key={product._id} whileHover={{ scale: 1.03 }}>
            <Card>
              <CardContent>
                <div className="relative">
                  {product.image && (
                    <Image
                      src={urlFor(product.image).url()}
                      alt={product.title}
                      width={400}
                      height={400}
                      className="w-full h-60 object-cover rounded-lg mb-4"
                    />
                  )}
                  {product.badge && (
                      <span
                        className={`absolute top-2 left-2 text-sm font-semibold px-2 py-1 rounded text-white ${
                          product.badge === "New"
                            ? "bg-[#01AD5A]"
                            : "bg-[#F5813F]"
                        }`}
                      >
                        {product.badge}
                      </span>
                    )}
                </div>
                <h2 className="text-[#007580] font-medium text-lg">{product.title}</h2>
                <p className="text-gray-600 font-semibold text-lg">${product.price}</p>
                <div className="flex justify-between mt-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        onClick={() => setEditingProduct(product)}
                        className="border-[#007580] text-[#007580] hover:bg-[#007580] hover:text-white transition-all duration-300 px-4 py-2 rounded-lg"
                      >
                        <Pencil className="w-4 h-4 mr-1" /> Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-white p-6 sm:p-4 rounded-lg shadow-lg max-w-lg sm:max-w-sm w-full">
                      <h2 className="text-2xl sm:text-xl font-semibold text-[#007580] mb-4">Edit Product</h2>
                      <form onSubmit={handleSubmit(handleSave)} className="flex flex-col gap-4">
                        <Input type="number" placeholder="ID" {...register("id")} />
                        <Input placeholder="Title" {...register("title")} />
                        <Input type="number" placeholder="Price" {...register("price")} />
                        <Input type="number" placeholder="Price Without Discount" {...register("priceWithoutDiscount")} />
                        <Input placeholder="Badge" {...register("badge")} />
                        <Textarea placeholder="Description" {...register("description")} />
                        <Input type="number" placeholder="Inventory" {...register("inventory")} />
                        <input
                          type="file"
                          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                          accept="image/*"
                          className="border rounded-md p-2 w-full"
                        />
                        <Button type="submit" className="bg-[#F5813F] text-white w-full py-2 rounded-lg hover:bg-[#d66a2e] transition-all duration-300">
                          Update Product
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>

                  <Button onClick={() => deleteProduct(product._id)} className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white">
                    <Trash className="w-4 h-4 mr-1" /> Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default ProductPage;
