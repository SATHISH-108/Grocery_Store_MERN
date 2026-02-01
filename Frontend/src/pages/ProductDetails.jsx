// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { Link, useNavigate, useParams } from "react-router-dom";
// import { assets } from "../assets/groceries_assets/assets";
// import { ProductCard } from "../components/index";
// import {
//   addToCart,
//   getCartCount,
//   calculateTotals,
// } from "../features/cart/cartSlice";
// import { fetchProducts } from "../features/product/productSlice";

// const ProductDetails = () => {
//   const { products, currency, isLoading } = useSelector(
//     (state) => state.product,
//   );
//   const { cartItems } = useSelector((state) => state.cart);
//   // console.log("useParams", useParams()); //{category: 'instant', id: 'in04i28r'}
//   const { id } = useParams();
//   const [relatedProducts, setRelatedProducts] = useState([]);
//   const [thumbnail, setThumbnail] = useState(null);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   /* ---------- FETCH PRODUCTS ON REFRESH ---------- */
//   useEffect(() => {
//     if (products.length === 0) {
//       dispatch(fetchProducts());
//     }
//   }, [dispatch, products.length]);

//   /* ---------- FIND PRODUCT ---------- */
//   const product = products.find((item) => item._id === id);
//   //{_id: 'in04i28r', name: 'Yippee Noodles 260g', category: 'Instant', price: 50, offerPrice: 45, …}
//   // category : "Instant" createdAt : "2025-03-25T07:17:46.018Z"  description :  (3) ['Non-fried noodles for healthier choice', 'Tasty and filling', 'Convenient for busy schedules']
//   // image : ['/src/assets/groceries_assets/yippee_image.png'] inStock : true  name : "Yippee Noodles 260g" offerPrice :45
//   // price : 50  updatedAt : "2025-03-25T07:18:13.103Z" _id : "in04i28r"

//   /* ---------- CATEGORY HANDLING ---------- */
//   const categoryName = product.category && product.category.toLowerCase();

//   const categorySlug = categoryName.toLowerCase();

//   /* ---------- RELATED PRODUCTS ---------- */
//   useEffect(() => {
//     if (products.length > 0) {
//       const related = products
//         .filter(
//           (item) =>
//             item._id !== product._id &&
//             item.category.toLowerCase() === product.category.toLowerCase(),
//         )
//         .slice(0, 5);

//       setRelatedProducts(related.slice(0, 5));
//     }
//   }, [products, product]);

//   /* ---------- THUMBNAIL ---------- */
//   // useEffect(() => {
//   //   setThumbnail(product.image?.[0] || null);
//   // }, [product]);
//   useEffect(() => {
//     setThumbnail(product?.image[0] ? product.image[0] : null);
//   }, [product]);

//   /* ---------- CART TOTALS ---------- */
//   useEffect(() => {
//     dispatch(getCartCount());
//     dispatch(calculateTotals());
//   }, [cartItems, dispatch]);

//   return (
//     product && (
//       <div className="mt-12">
//         <p>
//           <Link to="/">Home</Link>/<Link to="/products">Products</Link>/
//           <Link to={`/products/${product.category.toLowerCase()}`}>
//             {product.category}
//           </Link>
//           /<span className="text-primary">{product.name}</span>
//         </p>
//         <div className="flex flex-col md:flex-row gap-16 mt-4">
//           <div className="flex gap-3">
//             <div className="flex flex-col gap-3">
//               {product.image.map((image, index) => (
//                 <div
//                   key={image} // image path is unique
//                   onClick={() => setThumbnail(image)}
//                   className="border max-w-24 border-gray-500/30 rounded overflow-hidden cursor-pointer"
//                 >
//                   <img src={image} alt={`Thumbnail ${index + 1}`} />
//                 </div>
//               ))}
//             </div>
//             <div className="border border-gray-500/30 max-w-100 rounded overflow-hidden">
//               <img src={thumbnail} alt="Selected product" />
//             </div>
//           </div>
//           <div className="text-sm w-full md:w-1/2">
//             <h1 className="text-3xl font-medium">{product.name}</h1>
//             <div className="flex items-center gap-0.5 mt-1">
//               {Array(5)
//                 .fill("")
//                 .map((_, i) => (
//                   <img
//                     src={i < 4 ? assets.star_icon : assets.star_dull_icon}
//                     alt=""
//                     className="md:w-4 w-3.5"
//                   />
//                 ))}
//               <p className="text-base ml-2">{4}</p>
//             </div>
//             <div className="mt-6">
//               <p className="text-gray-500/70 line-through">
//                 MRP: {currency} ${product.price}
//               </p>
//               <p className="text-2xl font-medium">MRP: ${product.offerPrice}</p>
//               <span className="text-gray-500/70">includes of all taxes</span>
//             </div>
//             <p className="text-base font-medium mt-6">About Product</p>
//             <ul className="list-disc ml-4 text-gray-500/70">
//               {product.description.map((desc, index) => (
//                 <li key={index}>{desc}</li>
//               ))}
//             </ul>
//             <div className="FLEX items-center mt-10 gap-4 text-base">
//               <button
//                 onClick={() => dispatch(addToCart(product._id))}
//                 className="w-full py-3.5 cursor-pointer font-medium bg-gray-100 text-gray-800/80 hover:bg-gray-200 transition"
//               >
//                 Add to Cart
//               </button>
//               <button
//                 onClick={() => {
//                   dispatch(addToCart(product._id));
//                   navigate("/cart");
//                 }}
//                 className="w-full py-3.5 cursor-pointer font-medium bg-primary text-white hover:bg-primary-dull transition"
//               >
//                 Buy now
//               </button>
//             </div>
//           </div>
//         </div>
//         {/* -------- related products -------- */}
//         <div className="flex flex-col items-center mt-20">
//           <div className="flex flex-col items-center w-max">
//             <p className="text-2xl font-medium">Related Products</p>
//             <div className="w-20 h-0.5 bg-primary rounded-full mt-2"></div>
//           </div>
//           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6 lg:grid-cols-5 mt-6 w-full">
//             {relatedProducts
//               .filter((product) => product.inStock)
//               .map((product, index) => (
//                 <ProductCard key={index} product={product} />
//               ))}
//           </div>
//           <button
//             onClick={() => {
//               navigate("/products");
//               scrollTo(0, 0);
//             }}
//             className="mx-auto cursor-pointer px-12 my-16 py-2.5 border rounded text-primary hover:bg-primary/10 transition"
//           >
//             See more
//           </button>
//         </div>
//       </div>
//     )
//   );
// };

// export default ProductDetails;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { assets } from "../assets/groceries_assets/assets";
import { ProductCard } from "../components";
import { fetchProducts } from "../features/product/productSlice";
import { addToCartBackend, calculateTotals } from "../features/cart/cartSlice";

const ProductDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { products, currency } = useSelector((state) => state.product);
  const { cartItems } = useSelector((state) => state.cart);

  const [relatedProducts, setRelatedProducts] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);

  /* ===== LOAD PRODUCTS ===== */
  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, products.length]);

  /* ===== FIND PRODUCT ===== */
  const product = products.find((p) => p._id === id);

  /* ===== THUMBNAIL ===== */
  useEffect(() => {
    if (product) {
      setThumbnail(product.image?.[0]);
    }
  }, [product]);

  /* ===== RELATED PRODUCTS ===== */
  useEffect(() => {
    if (product && products.length > 0) {
      const related = products.filter(
        (p) =>
          p._id !== product._id &&
          p.category.toLowerCase() === product.category.toLowerCase(),
      );
      setRelatedProducts(related.slice(0, 5));
    }
  }, [product, products]);

  /* ===== RECALCULATE TOTALS ===== */
  useEffect(() => {
    dispatch(calculateTotals());
  }, [cartItems, dispatch]);

  if (!product) return null;

  return (
    <div className="mt-12">
      <p>
        <Link to="/">Home</Link> /<Link to="/products"> Products</Link> /
        <span className="text-primary"> {product.name}</span>
      </p>

      <div className="flex flex-col md:flex-row gap-16 mt-4">
        {/* IMAGES */}
        <div className="flex gap-3">
          <div className="flex flex-col gap-3">
            {product.image.map((img) => (
              <img
                key={img}
                src={img}
                onClick={() => setThumbnail(img)}
                className="w-20 border cursor-pointer"
              />
            ))}
          </div>
          <img src={thumbnail} className="w-80 border" />
        </div>

        {/* DETAILS */}
        <div className="w-full md:w-1/2">
          <h1 className="text-3xl font-medium">{product.name}</h1>

          <p className="mt-4 text-xl font-semibold">
            {currency}
            {product.offerPrice ?? product.price}
          </p>

          <ul className="list-disc ml-4 mt-4 text-gray-600">
            {product.description.map((d, i) => (
              <li key={i}>{d}</li>
            ))}
          </ul>

          <div className="flex gap-4 mt-8">
            <button
              onClick={() => dispatch(addToCartBackend(product._id))}
              className="w-full py-3 bg-gray-100"
            >
              Add to Cart
            </button>

            <button
              onClick={() => {
                dispatch(addToCartBackend(product._id));
                navigate("/cart");
              }}
              className="w-full py-3 bg-primary text-white"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* RELATED */}
      <div className="mt-20">
        <h2 className="text-2xl font-medium">Related Products</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
          {relatedProducts.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
