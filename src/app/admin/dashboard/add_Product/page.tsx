"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "next-sanity";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaPlus, FaSave, FaImage, FaTag, FaDollarSign, FaListAlt, FaInfoCircle, FaIdCard } from "react-icons/fa";

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2023-01-01",
  token: process.env.NEXT_PUBLIC_SANITY_AUTH_TOKEN,
  useCdn: false,
});

const AddProductPage = () => {
  const { register, handleSubmit, reset } = useForm<ProductFormData>();
  const [imageFile, setImageFile] = useState<File | null>(null);

  interface ProductFormData {
    id: string;
    title: string;
    price: number;
    priceWithoutDiscount: number;
    badge?: string;
    description: string;
    inventory: number;
  }

  const handleSave = async (data:ProductFormData) => {
    try {
      let imageRef = null;
      if (imageFile) {
        const imageAsset = await sanityClient.assets.upload("image", imageFile);
        imageRef = imageAsset._id;
      }

      await sanityClient.create({
        _type: "products",
        id: data.id, // Use the manually entered ID
        title: data.title,
        price: Number(data.price),
        priceWithoutDiscount: Number(data.priceWithoutDiscount),
        badge: data.badge,
        description: data.description,
        inventory: Number(data.inventory),
        image: imageRef ? { asset: { _ref: imageRef } } : null,
      });

      toast.success("Product added successfully");
      reset();
      setImageFile(null);
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Failed to add product");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-[#007580] flex items-center">
        <FaPlus className="mr-2 text-xl mt-1" /> Add Product
      </h1>
      <form onSubmit={handleSubmit(handleSave)} className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <FaIdCard className="text-[#F5813F]" />
            <Input
              placeholder="Product ID"
              {...register("id", { required: true })}
              className="flex-1"
            />
          </div>
          <div className="flex items-center space-x-2">
            <FaTag className="text-[#F5813F]" />
            <Input placeholder="Title" {...register("title", { required: true })} className="flex-1" />
          </div>
          <div className="flex items-center space-x-2">
            <FaDollarSign className="text-[#01AD5A]" />
            <Input placeholder="Price" type="number" {...register("price", { required: true })} className="flex-1" />
          </div>
          <div className="flex items-center space-x-2">
            <FaDollarSign className="text-[#01AD5A]" />
            <Input placeholder="Price Without Discount" type="number" {...register("priceWithoutDiscount", { required: true })} className="flex-1" />
          </div>
          <div className="flex items-center space-x-2">
            <FaTag className="text-[#F5813F]" />
            <Input placeholder="Badge" {...register("badge")} className="flex-1" />
          </div>
          <div className="flex items-center space-x-2">
            <FaInfoCircle className="text-[#007580]" />
            <Textarea placeholder="Description" {...register("description", { required: true })} className="flex-1" />
          </div>
          <div className="flex items-center space-x-2">
            <FaListAlt className="text-[#007580]" />
            <Input placeholder="Inventory" type="number" {...register("inventory", { required: true })} className="flex-1" />
          </div>
          <div className="flex items-center space-x-2">
            <FaImage className="text-[#F5813F]" />
            <input
              type="file"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              accept="image/*"
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#01AD5A] file:text-white hover:file:bg-[#01ad5ae7]"
            />
          </div>
        </div>
        <Button type="submit" className="bg-[#007580] text-white hover:bg-[#005f6b] w-full flex items-center justify-center">
          <FaSave className="mr-2" /> Save Product
        </Button>
      </form>
    </div>
  );
};

export default AddProductPage;