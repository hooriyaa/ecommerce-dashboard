import { NextRequest, NextResponse } from "next/server";
import { createClient } from "next-sanity";

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2023-01-01",
  token: process.env.NEXT_PUBLIC_SANITY_AUTH_TOKEN,
  useCdn: false,
});

const PRODUCT_TYPE = "products";

// GET: Fetch all products
export async function GET() {
  try {
    const query = `*[_type == "${PRODUCT_TYPE}"]`;
    const products = await sanityClient.fetch(query);
    return NextResponse.json({ success: true, products });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

// POST: Create a new product
export async function POST(req: NextRequest) {
  try {
    const { title, price, image, description } = await req.json();
    const product = { _type: PRODUCT_TYPE, title, price, image, description };
    await sanityClient.create(product);
    return NextResponse.json({ success: true, product });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

// PUT: Update a product
export async function PUT(req: NextRequest) {
  try {
    const { id, title, price, image, description } = await req.json();
    if (!id) return NextResponse.json({ success: false, error: "Missing product ID" }, { status: 400 });

    await sanityClient.patch(id).set({ title, price, image, description }).commit();
    return NextResponse.json({ success: true, message: "Product updated" });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

// DELETE: Remove a product
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    await sanityClient.delete(id);
    return NextResponse.json({ success: true, message: "Product deleted" });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
