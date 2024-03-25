"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page({ params }) {
  const router = useRouter();
  const { id } = params;
  const [productInfo, setProductInfo] = useState();

  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get("/api/product/?id=" + id).then((response) => {
      setProductInfo(response.data);
    });
  }, [id]);

  const goBack = () => {
    router.push("/products");
  };

  const handleDelete = async () => {
    await axios.delete("/api/product/?id=" + id);
    goBack();
  };

  return (
    <div className=" min-w-full">
      <h1 className=" text-center">
        ARE YOU SURE YOU WANT TO DELETE THIS ITEM "{productInfo?.title}"?
      </h1>
      <div className="flex gap-2 justify-center">
        <button className="btn-red" onClick={handleDelete}>
          Yes
        </button>
        <button className="btn-default" onClick={goBack}>
          No
        </button>
      </div>
    </div>
  );
}
