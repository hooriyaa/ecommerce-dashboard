import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { createClient } from "next-sanity";

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2023-01-01",
  token: process.env.NEXT_PUBLIC_SANITY_AUTH_TOKEN,
  useCdn: false,
});

const ORDER_TYPE = "orders";

// Helper function to extract error messages safely
const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return "An unexpected error occurred";
};

// GET: Fetch all orders
export async function GET() {
  try {
    const query = `*[_type == "${ORDER_TYPE}"]{_id, fullName, emailAddress, status, total, items[]->{title, price, quantity}}`;
    const orders = await sanityClient.fetch(query);
    return NextResponse.json({ success: true, orders });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: getErrorMessage(error) }, { status: 500 });
  }
}

// POST: Create a new order
export async function POST(req: NextRequest) {
  try {
    const { fullName, emailAddress, status, items, total } = await req.json();
    const order = {
      _type: ORDER_TYPE,
      _id: uuidv4(),
      fullName,
      emailAddress,
      status,
      items,
      total,
    };

    await sanityClient.create(order);
    return NextResponse.json({ success: true, order });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: getErrorMessage(error) }, { status: 500 });
  }
}

// PUT: Update an order
export async function PUT(req: NextRequest) {
  try {
    const { id, status } = await req.json();
    await sanityClient.patch(id).set({ status }).commit();
    return NextResponse.json({ success: true, message: "Order updated" });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: getErrorMessage(error) }, { status: 500 });
  }
}

// DELETE: Remove an order
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    await sanityClient.delete(id);
    return NextResponse.json({ success: true, message: "Order deleted" });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: getErrorMessage(error) }, { status: 500 });
  }
}
