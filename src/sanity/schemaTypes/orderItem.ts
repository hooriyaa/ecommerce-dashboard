import { defineType, defineField } from "sanity";

export const OrderItemSchema = defineType({
  name: "orderItems",
  title: "Order Item",
  type: "document",
  fields: [
    defineField({
      name: "products",
      title: "Product",
      type: "reference",
      to: [{ type: "products" }], 
    }),
    defineField({
      name: "quantity",
      title: "Quantity",
      type: "number",
    }),
    defineField({
      name: "price",
      title: "Price",
      type: "number",
    }),
  ],
});
