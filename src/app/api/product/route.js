import { Product } from "../../../../models/Product";
import mongooseConnect from "../../../../lib/mongoose";

export async function POST(req) {
  const body = await req.json();

  try {
    await mongooseConnect(); // Ensure Mongoose connection before operations
    if (req.method === "POST") {
      const { title, description, price, images, category, itemProps } = body;

      const productDoc = await Product.create({
        title,
        description,
        price,
        images,
        category,
        properties: itemProps,
      });
      return new Response("ok", productDoc); // Send 201 Created status code
    } else {
      return new Response(JSON.stringify("Method Not Allowed"));
    }
  } catch (error) {
    return new Response(JSON.stringify("Internal Server Error"));
  }
}

export async function GET(request) {
  await mongooseConnect();

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (id !== null) {
    const response = await Product.findById(id).populate("category");
    return Response.json(response);
  } else {
    const response = await Product.find().populate("category");
    return Response.json(response);
  }
}

export async function PUT(req) {
  const body = await req.json();

  try {
    await mongooseConnect();

    const { title, description, price, images, _id, itemProps } = body;

    const category = body.category === "Uncategorized" ? null : body.category;

    await Product.findByIdAndUpdate(_id, {
      title,
      description,
      price,
      images,
      category,
      properties: itemProps,
    });
    return new Response(true);
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify("Internal Server Error"));
  }
}

export async function DELETE(request) {
  await mongooseConnect();

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  try {
    await Product.findByIdAndDelete(id);
    return new Response(true);
  } catch (err) {
    return new Response(JSON.stringify("Internal Server Error"));
  }
}
