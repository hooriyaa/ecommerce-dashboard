import { defineType } from "sanity";

export const categorySchema = defineType({
  name: "categories",
  title: "Categories",
  type: "document",
  fields: [
    {
        name: "id",
        title: "ID",
        type: "number",
      },
    {
      name: "title",
      title: "Category Title",
      type: "string",
    },
    {
        name: "price",
        title: "Price",
        type: "number",
      },
      {
        title: "Price without Discount",
        name: "priceWithoutDiscount",
        type: "number",
      },
    {
      name: "image",
      title: "Category Image",
      type: "image",
    },
    {
        name: "inventory",
        title: "Inventory Management",
        type: "number",
      },
    {
      title: "Number of Products",
      name: "products",
      type: "number",
    },
  ],
});
