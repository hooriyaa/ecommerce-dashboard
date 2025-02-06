import { NextResponse } from "next/server";
import { createClient } from "next-sanity";

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2023-01-01",
  token: process.env.NEXT_PUBLIC_SANITY_AUTH_TOKEN,
  useCdn: false,
});

// Helper function to extract error messages safely
const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return "An unexpected error occurred";
};

export async function GET() {
  try {
    const query = `*[_type == "review"]`;
    const reviews = await sanityClient.fetch(query);
    return NextResponse.json(reviews);
  } catch (error: unknown) {
    console.error("GET error:", error);
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id"); // Get the ID from the URL
    if (!id) {
      return NextResponse.json({ error: "Review ID is required" }, { status: 400 });
    }
    const body = await req.json();
    await sanityClient
      .patch(id)
      .set({
        user: body.user,
        rating: body.rating,
        comment: body.comment,
        date: body.date,
        productId: body.productId,
      })
      .commit();
    return NextResponse.json({ message: "Review updated successfully" });
  } catch (error: unknown) {
    console.error("PUT error:", error);
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id"); // Get the ID from the URL
    if (!id) {
      return NextResponse.json({ error: "Review ID is required" }, { status: 400 });
    }
    await sanityClient.delete(id);
    return NextResponse.json({ message: "Review deleted successfully" });
  } catch (error: unknown) {
    console.error("DELETE error:", error);
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}
