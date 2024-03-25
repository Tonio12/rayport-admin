import { NextResponse } from "next/server";
import { Category } from "../../../../models/Category";
import mongooseConnect from "../../../../lib/mongoose";

export async function POST(req) {
  await mongooseConnect();
  const body = await req.json();
  const { name, properties } = body;

  const parentCat = body.parentCat === "" ? null : body.parentCat;

  try {
    const categoryDoc = await Category.create({
      name,
      parent: parentCat,
      properties,
    });
    return new Response("ok", categoryDoc);
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
}

export async function GET() {
  await mongooseConnect();
  try {
    const data = await Category.find().populate("parent");
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error });
  }
}

export async function PUT(req) {
  await mongooseConnect();
  const body = await req.json();
  const { name, id, properties } = body;

  const parentCat = body.parentCat === "" ? null : body.parentCat;

  try {
    const categoryDoc = await Category.findByIdAndUpdate(id, {
      name,
      properties,
      parent: parentCat,
    });
    return NextResponse.json(categoryDoc);
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
}

export async function DELETE(request) {
  await mongooseConnect();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("_id");

  try {
    await Category.findByIdAndDelete(id);
    return NextResponse.json(true);
  } catch (error) {
    return NextResponse.json({ error: error });
  }
}
