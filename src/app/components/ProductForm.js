"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Spinner from "./Spinner";

export default function ProductForm({ productInfo }) {
  const {
    _id,
    title: existingTitle,
    description: existingDescription,
    price: existingPrice,
    images,
    category: existingCategory,
    properties: assignedProperties,
  } = productInfo || {};

  const [title, setTitle] = useState(existingTitle || "");
  const [description, setDescription] = useState(existingDescription || "");
  const [price, setPrice] = useState(existingPrice || 0);
  const [itemProps, setItemProps] = useState(assignedProperties || {});
  const [selectedImages, setSelectedImages] = useState(images || []);
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState(existingCategory?._id || undefined);
  const router = useRouter();

  useEffect(() => {
    axios.get("/api/category").then((res) => {
      setCategories([...res.data]);
    });
  }, []);

  const saveProduct = async (e) => {
    e.preventDefault();

    try {
      const formData = {
        title,
        description,
        price,
        images: [...selectedImages],
        itemProps,
      };

      if (_id) {
        await axios.put("/api/product", { ...formData, _id, category });
      } else {
        await axios.post("/api/product", { ...formData, category });
      }

      router.push("/products");
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target?.files);
    setUploading(true);

    if (files.length === 0) {
      console.warn("No images selected for upload.");
      return;
    }
    setSelectedImages([...files]);

    const imagePromises = files.map(async (file) => {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Extract and return the uploaded image URL from the response
      const uploadedImageUrl = response.data.link;
      return uploadedImageUrl;
    });

    try {
      // Wait for all image uploads to complete and collect URLs
      const imageUrls = await Promise.all(imagePromises);

      // Update selected images with URLs (optional)
      setSelectedImages([...imageUrls]);

      console.log("Images uploaded successfully:", imageUrls);
    } catch (error) {
      console.error("Error uploading images:", error);
      // Handle upload errors gracefully (e.g., display error message)
    }
    setUploading(false);
  };

  const properties = [];

  if (categories.length > 0 && category) {
    const selCatInfo = categories?.find(({ _id }) => _id == category);
    selCatInfo?.properties && properties.push(...selCatInfo.properties);
    if (selCatInfo?.parent?._id) {
      const parentCat = categories.find(
        ({ _id }) => _id == selCatInfo?.parent?._id
      );
      properties.push(parentCat.properties);
    }
  }

  function handlePropertyChange(name, value) {
    setItemProps((prev) => {
      const newProductProps = { ...prev };
      newProductProps[name] = value;
      return newProductProps;
    });
  }

  return (
    <div className="w-full">
      <form onSubmit={saveProduct}>
        <label>
          Product
          <input
            type="text"
            placeholder="Product Name"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          ></input>
        </label>
        <label>
          Category
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value={null}>Uncategorized</option>
            {categories.length > 0 &&
              categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
          </select>
          {properties.length > 0 &&
            properties.map((property) => (
              <div className="flex gap-1">
                <label className=" basis-full" htmlFor="prop">
                  {property.name}
                </label>
                <select
                  id="prop"
                  value={itemProps[property.name]}
                  onChange={(e) =>
                    handlePropertyChange(property.name, e.target.value)
                  }
                >
                  {property.values.map((v) => (
                    <option value={v}>{v}</option>
                  ))}
                </select>
              </div>
            ))}
        </label>
        <label>
          Photos
          <div className="mb-2">
            <div className="flex mb-2 flex-wrap">
              <Spinner loading={uploading} />
              {!uploading &&
                selectedImages.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Image ${index}`}
                    className="w-24 h-24 mr-2 rounded-lg"
                  />
                ))}
            </div>
            <div className="w-24 h-24 border flex items-center justify-center text-sm gap-1 text-gray-500 rounded-md bg-gray-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15m0-3-3-3m0 0-3 3m3-3V15"
                />
              </svg>
              <div>Upload</div>
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                multiple
                accept="image/*"
              />
            </div>
            {!selectedImages?.length && <div>No photos for this product</div>}
          </div>
        </label>
        <label>
          Description
          <textarea
            placeholder="Description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </label>
        <label>
          Price (in GHS)
          <input
            type="text"
            placeholder="Price"
            name="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          ></input>
        </label>
        <button type="submit" className="btn-primary">
          Save
        </button>
      </form>
    </div>
  );
}
