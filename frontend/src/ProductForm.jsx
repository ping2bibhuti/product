import { useState, useEffect, useRef } from "react";
import axios from "axios";

const API = "http://127.0.0.1:8000/products";

function ProductForm({ dispatch, product, onCancel }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");

  const [error, setError] = useState("");

  const nameInputRef = useRef(null);
  const formRef = useRef(null);

  // RESET FORM
  const resetForm = () => {
    setName("");
    setDescription("");
    setPrice("");
    setQuantity("");
    setError("");
  };


  // LOAD DATA FOR EDIT
  useEffect(() => {
    if (product) {
      setName(product.name || "");
      setDescription(product.description || "");
      setPrice(product.price ?? "");
      setQuantity(product.quantity ?? "");
      setError("");

      // SCROLL TO FORM
      formRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      // FOCUS NAME FIELD
      nameInputRef.current?.focus({
        preventScroll: true,
      });
    } else {
      setName("");
      setDescription("");
      setPrice("");
      setQuantity("");
      setError("");
    }
  }, [product]);

  // ADD / UPDATE PRODUCT
  const addProduct = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Please enter product name");
      return;
    }

    if (!description.trim()) {
      setError("Please enter product description");
      return;
    }

    if (price === "" || !Number.isFinite(Number(price)) || Number(price) < 0) {
      setError("Please enter a valid price");
      return;
    }

    if (
      quantity === "" ||
      !Number.isInteger(Number(quantity)) ||
      Number(quantity) < 0
    ) {
      setError("Please enter a valid quantity");
      return;
    }

    const productData = {
      name: name.trim(),
      description: description.trim(),
      price: Number(price),
      quantity: Number(quantity),
    };

    try {
      if (product) {
        // UPDATE PRODUCT
        const res = await axios.put(`${API}/${product.id}`, productData);

        dispatch({
          type: "UPDATE_PRODUCT",
          payload: res.data,
        });
      } else {
        // ADD PRODUCT
        const res = await axios.post(API, productData);

        dispatch({
          type: "ADD_PRODUCT",
          payload: res.data,
        });
      }

      resetForm();

      if (onCancel) {
        onCancel();
      }
    } catch (error) {
      console.error("Save failed:", error.response?.data || error);

      setError(
        product
          ? "Unable to update product. Please try again."
          : "Unable to add product. Please try again.",
      );
    }
  };

  return (
    <div className="container py-4">
      {/* PAGE HEADER */}
      <div className="product-page-header mb-4">
        <div>
          <h2 className="fw-bold mb-1">Product Management</h2>

          <p className="text-muted mb-0">
            Manage and organize your products efficiently
          </p>
        </div>
      </div>

      {/* ADD / EDIT PRODUCT CARD */}
      <div
        className="add-product-card"
        ref={formRef}
        style={{ scrollMarginTop: "20px" }}
      >
        <div className="d-flex align-items-center gap-3 mb-4">
          <div className="add-product-icon">
            <i
              className={`bi ${product ? "bi-pencil-square" : "bi-person-plus-fill"}`}
            ></i>
          </div>

          <div>
            <h5 className="fw-bold mb-1">
              {product ? "Edit Product" : "Add New Product"}
            </h5>

            <p className="text-muted small mb-0">
              Enter the product details below
            </p>
          </div>
        </div>

        <form onSubmit={addProduct}>
          <div className="row g-3">
            {/* NAME */}
            <div className="col-md-6">
              <label className="form-label fw-semibold">Product Name</label>

              <input
                ref={nameInputRef}
                type="text"
                className="form-control"
                placeholder="Enter product name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError("");
                }}
              />
            </div>

            {/* DESCRIPTION */}
            <div className="col-md-6">
              <label className="form-label fw-semibold">Description</label>

              <input
                type="text"
                className="form-control"
                placeholder="Enter description"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  setError("");
                }}
              />
            </div>

            {/* PRICE */}
            <div className="col-md-6">
              <label className="form-label fw-semibold">Price (₹)</label>

              <input
                type="number"
                min="0"
                step="0.01"
                className="form-control"
                placeholder="Enter price"
                value={price}
                onChange={(e) => {
                  setPrice(e.target.value);
                  setError("");
                }}
              />
            </div>

            {/* QUANTITY */}
            <div className="col-md-6">
              <label className="form-label fw-semibold">Quantity</label>

              <input
                type="number"
                min="0"
                step="1"
                className="form-control"
                placeholder="Enter quantity"
                value={quantity}
                onChange={(e) => {
                  setQuantity(e.target.value);
                  setError("");
                }}
              />
            </div>

            {/* ERROR MESSAGE */}
            {error && (
              <div className="col-12">
                <div className="text-danger small">{error}</div>
              </div>
            )}

            {/* BUTTONS */}
            <div className="col-12 d-flex justify-content-end gap-2">
              {product && (
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-lg"
                  onClick={() => {
                    resetForm();
                    if (onCancel) onCancel();
                  }}
                >
                  Cancel
                </button>
              )}

              <button type="submit" className="btn btn-primary btn-lg">
                <i
                  className={`bi ${product ? "bi-check-circle" : "bi-plus-circle"} me-2`}
                ></i>

                {product ? "Update Product" : "Add Product"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductForm;
