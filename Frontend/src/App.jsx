import { Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import {
  Home,
  AllProducts,
  Contact,
  PageNotFound,
  ProductDetails,
  ProductCategory,
  Cart,
  AddAddress,
  MyOrders,
} from "./pages/index";
import {
  Navbar,
  UserDashboard,
  Footer,
  SignUp,
  SignIn,
} from "./components/index";
import {
  SellerDashboard,
  AddProduct,
  ProductList,
  Orders,
} from "./pages/Seller/index";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "./features/user/userSlice";
import {
  hydrateCart,
  getCartCount,
  calculateTotals,
} from "./features/cart/cartSlice";
import { SellerSignIn } from "./components/Seller/index";
import { ProtectedRoute, RoleBasedRoute } from "./routes/index";
import Loading from "./components/Loading";
const App = () => {
  //   // console.log(useLocation());
  //   // {pathname: '/', search: '', hash: '', state: null, key: 'default'}
  const isSellerPath = useLocation().pathname.includes("seller");
  //   // console.log("isSellerPath", isSellerPath);
  const dispatch = useDispatch();
  const { userToken, cartItems } = useSelector((state) => state.user);

  // 1️⃣ Fetch user + backend cart on refresh
  /* ✅ FETCH USER ON REFRESH */
  useEffect(() => {
    if (userToken) {
      dispatch(fetchUser()); // ✅ MUST CALL
    }
  }, [userToken, dispatch]);
  // 2️⃣ Hydrate cartSlice from backend cart
  /* ✅ HYDRATE CART FROM USER */
  useEffect(() => {
    if (cartItems.length >= 0) {
      dispatch(hydrateCart(cartItems));
      dispatch(getCartCount());
      dispatch(calculateTotals());
    }
  }, [cartItems, dispatch]);
  return (
    <div className="min-h-screen bg-white text-gray-700">
      {!isSellerPath && <Navbar />}
      <Toaster />

      <div className={!isSellerPath ? "px-6 md:px-16 lg:px-24 xl:px-32" : ""}>
        <Routes>
          {/* ---------- Public Routes ---------- */}
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* ---------- User Protected Routes ---------- */}
          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <AllProducts />
              </ProtectedRoute>
            }
          />

          <Route
            path="/products/:category"
            element={
              <ProtectedRoute>
                <ProductCategory />
              </ProtectedRoute>
            }
          />

          <Route
            path="/products/:category/:id"
            element={
              <ProtectedRoute>
                <ProductDetails />
              </ProtectedRoute>
            }
          />

          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />

          <Route
            path="/add-address"
            element={
              <ProtectedRoute>
                <AddAddress />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-orders"
            element={
              <ProtectedRoute>
                <MyOrders />
              </ProtectedRoute>
            }
          />
          <Route path="/loader" element={<Loading />} />
          {/* ---------- Seller Routes ---------- */}
          <Route path="/seller/signin" element={<SellerSignIn />} />

          <Route
            path="/seller"
            element={
              <ProtectedRoute>
                <RoleBasedRoute allowedRoles={["Seller"]}>
                  <SellerDashboard />
                </RoleBasedRoute>
              </ProtectedRoute>
            }
          >
            <Route index element={<AddProduct />} />
            <Route path="product-list" element={<ProductList />} />
            <Route path="orders" element={<Orders />} />
          </Route>

          {/* ---------- User Dashboard ---------- */}
          <Route
            path="/user"
            element={
              <ProtectedRoute>
                <RoleBasedRoute allowedRoles={["User", "Seller"]}>
                  <UserDashboard />
                </RoleBasedRoute>
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </div>

      {!isSellerPath && <Footer />}
    </div>
  );
};

export default App;
