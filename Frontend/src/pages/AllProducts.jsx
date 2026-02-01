// import React, { useEffect, useMemo } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchProducts } from "../features/product/productSlice";
// import { ProductCard } from "../components/index";
// import { calculateTotals, getCartCount } from "../features/cart/cartSlice";
// const AllProducts = () => {
//   const dispatch = useDispatch();
//   const { products, searchQuery, isLoading } = useSelector(
//     (state) => state.product,
//   );
//   const { cartItems } = useSelector((state) => state.cart);
//   useEffect(() => {
//     dispatch(fetchProducts());
//     dispatch(getCartCount());
//     dispatch(calculateTotals());
//   }, [dispatch]);
//   // const [filteredProducts, setFilteredProducts] = useState([]);
//   // useEffect(() => {
//   //   if (searchQuery.length > 0) {
//   //     setFilteredProducts(
//   //       products.filter((product) =>
//   //         product.name.toLowerCase().includes(searchQuery.toLowerCase()),
//   //       ),
//   //     );
//   //   } else {
//   //     setFilteredProducts(products);
//   //   }
//   // }, [products, searchQuery]);
//   const filteredProducts = useMemo(() => {
//     return products
//       .filter((product) => product.inStock)
//       .filter((product) =>
//         product.name.toLowerCase().includes(searchQuery.toLowerCase()),
//       );
//   }, [products, searchQuery]);
//   if (isLoading) {
//     return <p>Loading products</p>;
//   }
//   return (
//     <div className="mt-16 flex flex-col">
//       <div className="flex flex-col items-end w-max">
//         <p className="text-2xl font-medium uppercase">All Products</p>
//         <div className="w-16 h-0.5 bg-primary rounded-full"></div>
//       </div>
//       <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6 lg:grid-cols-5 mt-6">
//         {filteredProducts
//           .filter((product) => product.inStock)
//           .map((product, index) => (
//             <ProductCard key={product._id} product={product} />
//           ))}
//       </div>
//     </div>
//   );
// };

// export default AllProducts;

import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../features/product/productSlice";
import { ProductCard } from "../components";
import { calculateTotals } from "../features/cart/cartSlice";

const AllProducts = () => {
  const dispatch = useDispatch();

  const { products, searchQuery, isLoading } = useSelector(
    (state) => state.product,
  );

  const { cartItems } = useSelector((state) => state.cart);

  /* ===== LOAD PRODUCTS ONCE ===== */
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  /* ===== RECALCULATE CART TOTALS WHEN CART CHANGES ===== */
  useEffect(() => {
    dispatch(calculateTotals());
  }, [cartItems, dispatch]);

  /* ===== FILTER PRODUCTS ===== */
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => product.inStock)
      .filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
  }, [products, searchQuery]);

  if (isLoading) {
    return <p>Loading products...</p>;
  }

  return (
    <div className="mt-16 flex flex-col">
      <div className="flex flex-col items-end w-max">
        <p className="text-2xl font-medium uppercase">All Products</p>
        <div className="w-16 h-0.5 bg-primary rounded-full"></div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6 mt-6">
        {filteredProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default AllProducts;
