// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useParams } from "react-router-dom";
// import { categories } from "../assets/groceries_assets/assets";
// import ProductCard from "../components/ProductCard";
// import { fetchProducts } from "../features/product/productSlice";
// import { getCartCount, calculateTotals } from "../features/cart/cartSlice";
// const ProductCategory = () => {
//   const { products } = useSelector((state) => state.product);
//   const { cartItems } = useSelector((state) => state.cart);
//   const { category } = useParams();
//   const dispatch = useDispatch();
//   const searchCategory = categories.find(
//     (item) => item.path.toLowerCase() === category,
//   );
//   //   console.log(searchCategory);
//   const filteredProducts = products.filter(
//     (product) => product.category.toLowerCase() === category,
//   );
//   console.log("filteredProducts", filteredProducts);
//   useEffect(() => {
//     if (products.length === 0) {
//       dispatch(fetchProducts());
//     }
//   }, [dispatch, products.length]);
//   /* ---------- CART TOTALS ---------- */
//   useEffect(() => {
//     dispatch(getCartCount());
//     dispatch(calculateTotals());
//   }, [dispatch, cartItems]);
//   return (
//     <div className="mt-16">
//       {searchCategory && (
//         <div className="flex flex-col items-end w-max">
//           <p className="text-2xl font-medium">
//             {searchCategory.text.toUpperCase()}
//           </p>
//           <div className="w-16 h-0.5 bg-primary rounded-full"></div>
//         </div>
//       )}

//       {filteredProducts.length > 0 ? (
//         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6 mt-6">
//           {filteredProducts.map((product) => (
//             <ProductCard key={product._id} product={product} />
//           ))}
//         </div>
//       ) : (
//         <div className="flex items-center justify-center h-[60vh]">
//           <p className="text-2xl font-medium text-primary">
//             No products found in this category.
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProductCategory;

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { categories } from "../assets/groceries_assets/assets";
import ProductCard from "../components/ProductCard";
import { fetchProducts } from "../features/product/productSlice";

const ProductCategory = () => {
  const dispatch = useDispatch();
  const { category } = useParams();
  const { products, isLoading } = useSelector((state) => state.product);

  // Fetch products on refresh
  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, products.length]);

  const normalizedCategory = category.toLowerCase();

  const filteredProducts = products.filter(
    (product) =>
      product.category && product.category.toLowerCase() === normalizedCategory,
  );

  const searchCategory = categories.find(
    (item) => item.path.toLowerCase() === normalizedCategory,
  );

  if (isLoading) {
    return <p className="mt-20 text-center">Loading...</p>;
  }

  return (
    <div className="mt-16">
      {searchCategory && (
        <div className="flex flex-col items-end w-max">
          <p className="text-2xl font-medium">
            {searchCategory.text.toUpperCase()}
          </p>
          <div className="w-16 h-0.5 bg-primary rounded-full" />
        </div>
      )}

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6 mt-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-[60vh]">
          <p className="text-2xl font-medium text-primary">
            No products found in this category.
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductCategory;
