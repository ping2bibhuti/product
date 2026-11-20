import { useReducer, useEffect, useState } from "react";
import axios from "axios";
import { productReducer, initialState } from "./reducer";
import ProductForm from "./ProductForm";
import ProductList from "./ProductList";

const API = "http://127.0.0.1:8000/products";

function App() {
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [state, dispatch] = useReducer(productReducer, initialState);

  const fetchProducts = async () => {
    const res = await axios.get(API);
    dispatch({ type: "SET_PRODUCTS", payload: res.data });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div>

      {/* ADD / EDIT FORM */}
      <ProductForm
        dispatch={dispatch}
        product={selectedProduct}
        onCancel={() => setSelectedProduct(null)}
      />

      {/* PRODUCT LIST */}
      <ProductList
        products={state.products}
        dispatch={dispatch}
        onEdit={(product) => setSelectedProduct(product)}
      />
    </div>
  );
}

export default App;
