import { useState } from "react";
import axios from "axios";

const API = "http://127.0.0.1:8000/products";

function ProductList({ products = [], dispatch, onEdit }) {
  const [search, setSearch] = useState("");

  const [productToDelete, setProductToDelete] = useState(null);

  // // DELETE PRODUCT
  // const deleteProduct = async (id) => {

  //   if (!window.confirm("Are you sure you want to delete this product?")) {
  //     return;
  //   }

  //   try {

  //     await axios.delete(`${API}/${id}`);

  //     dispatch({
  //       type: "DELETE_PRODUCT",
  //       payload: id
  //     });

  //   } catch (error) {
  //     console.error(error);
  //     alert("Unable to delete product");
  //   }
  // };

  // DELETE PRODUCT
  const deleteProduct = async () => {
    if (!productToDelete) return;

    try {
      await axios.delete(`${API}/${productToDelete.id}`);

      dispatch({
        type: "DELETE_PRODUCT",
        payload: productToDelete.id,
      });

      setProductToDelete(null);
    } catch (error) {
      console.error("Delete error:", error);
      alert("Unable to delete product");
    }
  };

  // SEARCH PRODUCT
  const filteredProducts = products.filter((product) =>
    (product.name || "").toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="container py-4">
      <div className="product-list-card">
        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
          <div>
            <h3 className="fw-bold mb-1">Product Management</h3>

            <p className="text-muted mb-0">Manage your products easily</p>
          </div>

          <span className="badge bg-primary fs-6">
            Total Products: {products.length}
          </span>
        </div>

        {/* SEARCH */}
        <div className="row mb-4">
          <div className="col-md-5">
            <div className="input-group">
              <span className="input-group-text bg-white">
                <i className="bi bi-search"></i>
              </span>

              <input
                type="text"
                className="form-control"
                placeholder="Search product by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* PRODUCT TABLE */}
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th style={{ width: "60px" }}>ID</th>
                <th>PRODUCT NAME</th>
                <th>DESCRIPTION</th>
                <th>PRICE</th>
                <th>QUANTITY</th>
                <th className="text-center">ACTIONS</th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product, index) => (
                  <tr key={product.id}>
                    {/* ID */}
                    <td className="text-muted">{product.id}</td>

                    {/* PRODUCT NAME */}
                    <td>
                      <div className="d-flex align-items-center gap-3">
                        <div className="product-avatar">
                          {(product.name || "").charAt(0).toUpperCase()}
                        </div>

                        <span className="fw-semibold">{product.name}</span>
                      </div>
                    </td>

                    {/* DESCRIPTION */}
                    <td>
                      <span className="text-muted">{product.description}</span>
                    </td>

                    {/* PRICE */}
                    <td>
                      <span className="fw-semibold">
                        ₹{Number(product.price).toLocaleString("en-IN")}
                      </span>
                    </td>

                    {/* QUANTITY */}
                    <td>
                      <span className="badge bg-info-subtle text-info-emphasis">
                        {product.quantity}
                      </span>
                    </td>

                    {/* ACTIONS */}
                    <td className="text-center">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => onEdit(product)}
                      >
                        <i className="bi bi-pencil-square me-1"></i>
                        Edit
                      </button>

                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => setProductToDelete(product)}
                      >
                        <i className="bi bi-trash me-1"></i>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-5">
                    <i className="bi bi-box-seam display-5 text-secondary"></i>

                    <p className="text-muted mt-2 mb-0">No products found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* FOOTER */}
        <div className="d-flex justify-content-between text-muted small mt-3">
          <span>
            Showing {filteredProducts.length} of {products.length} products
          </span>

          <span>Product Management System</span>
        </div>
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      {productToDelete && (
        <div className="delete-modal-overlay">
          <div className="delete-modal">
            {/* ICON */}
            <div className="delete-modal-icon">
              <i className="bi bi-trash3-fill"></i>
            </div>

            {/* CONTENT */}
            <h4 className="fw-bold mb-2">Delete Product?</h4>

            <p className="text-muted mb-2">
              Are you sure you want to delete this product?
            </p>

            <h6 className="fw-bold text-dark mb-3">{productToDelete.name}</h6>

            <p className="text-muted small">This action cannot be undone.</p>

            {/* BUTTONS */}
            <div className="d-flex justify-content-center gap-3 mt-4">
              <button
                type="button"
                className="btn btn-outline-secondary px-4"
                onClick={() => setProductToDelete(null)}
              >
                Cancel
              </button>

              <button
                type="button"
                className="btn btn-danger px-4"
                onClick={deleteProduct}
              >
                <i className="bi bi-trash me-2"></i>
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductList;
