"use client";
import axios from "axios";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";

function page() {
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);
  const [parentCat, setParentCat] = useState(null);
  const [editedCategory, setEditedCategory] = useState(null);
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  function fetchCategories() {
    axios.get("/api/category").then((res) => {
      setCategories([...res.data]);
    });
  }

  const saveCategory = async (e) => {
    e.preventDefault();

    if (editedCategory) {
      const id = editedCategory._id;
      await axios.put("/api/category", {
        name,
        parentCat,
        id,
        properties: properties.map((p) => ({
          name: p.name,
          values: p.values.split(","),
        })),
      });
      setName("");
      setEditedCategory(null);
      setParentCat(null);
      setProperties([]);
      fetchCategories();
    } else {
      await axios.post("/api/category", { name, parentCat, properties });
      setName("");
      setParentCat(null);
      setProperties([]);
      fetchCategories();
    }
  };

  const addProperty = () => {
    return setProperties((prev) => [...prev, { name: "", values: "" }]);
  };

  const confirmDelete = (category) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "##3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axios.delete("/api/category?_id=" + category._id);
        fetchCategories();
      }
    });
  };

  const editCategory = (category) => {
    setEditedCategory(category);
    setName(category.name);
    setParentCat(category.parent?._id ? category.parent?._id : "");
    setProperties(
      category.properties.map(({ name, values }) => ({
        name,
        values: values.join(","),
      }))
    );
  };

  const handlePropertyNameChange = (i, value) => {
    setProperties((prev) => {
      const properties = [...prev];
      properties[i].name = value;
      return properties;
    });
  };

  const handlePropertyValuesChange = (i, value) => {
    setProperties((prev) => {
      const properties = [...prev];
      properties[i].values = value;
      return properties;
    });
  };

  const removeProperty = (indexToRemove) => {
    setProperties((prev) => {
      return prev.filter((p, pIndex) => {
        return pIndex != indexToRemove;
      });
    });
  };

  return (
    <div className="min-w-full flex flex-col">
      <h1>Categories</h1>
      <label>
        {editedCategory
          ? `Edit Category ${editedCategory.name}`
          : "Create New Category"}
      </label>
      <form onSubmit={saveCategory}>
        <div className="flex gap-1 ">
          <input
            onChange={(ev) => setName(ev.target.value)}
            value={name}
            type="text"
            placeholder="Category Name"
          />
          <select
            value={parentCat ? parentCat : ""}
            onChange={(e) => setParentCat(e.target.value)}
          >
            <option>No Parent</option>
            {categories.length > 0 &&
              categories.map((category) => (
                <option value={category._id} key={category._id}>
                  {category.name}
                </option>
              ))}
          </select>
        </div>
        <div>
          <label className="flex flex-col mb-2">
            Properties
            <button
              onClick={addProperty}
              type="button"
              className="btn-default text-sm max-w-fit"
            >
              Add new property
            </button>
          </label>
        </div>
        {properties.length > 0 &&
          properties.map((property, i) => {
            return (
              <div key={i} className="flex gap-1 mb-2">
                <input
                  className="mb-0"
                  onChange={(e) => handlePropertyNameChange(i, e.target.value)}
                  value={property.name}
                  type="text"
                  placeholder="property namme  (colour)"
                />
                <input
                  className="mb-0"
                  value={property.values}
                  onChange={(e) =>
                    handlePropertyValuesChange(i, e.target.value)
                  }
                  type="text"
                  placeholder="values (comma seperated)"
                />
                <button
                  type="button"
                  onClick={() => removeProperty(i)}
                  className="btn-red"
                >
                  Remove
                </button>
              </div>
            );
          })}
        <div className="flex gap-1">
          <button type="submit" className="btn-primary">
            Save
          </button>
          {editedCategory && (
            <button
              type="button"
              onClick={() => {
                setEditedCategory(null);
                setName("");
                setParentCat("");
                setProperties([]);
              }}
              className="btn-red"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
      {!editedCategory && (
        <table className="basic mt-6">
          <thead>
            <tr>
              <th>Categories</th>
              <th>Parent</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {categories.length > 0 &&
              categories.map((category) => (
                <tr key={category._id}>
                  <td>{category.name}</td>
                  <td>{category.parent?.name}</td>
                  <td className="flex gap-1">
                    <button
                      onClick={() => editCategory(category)}
                      className="bg-blue-900 btn"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                        />
                      </svg>
                      Edit
                    </button>
                    <button
                      onClick={() => confirmDelete(category)}
                      className="bg-red-600 btn"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                        />
                      </svg>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default page;
