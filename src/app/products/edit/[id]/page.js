"use client";
import ProductForm from "@/app/components/ProductForm";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Page({ params }) {
  const id = params.id;
  const [productInfo, setProductInfo] = useState(null);
  useEffect(() => {
    axios.get("/api/product?id=" + id).then((response) => {
      setProductInfo(response.data);
    });
  }, [id]);

  return (
    <div>
      <h1>Edit Product</h1>
      {productInfo && <ProductForm productInfo={productInfo} />}
    </div>
  );
}
