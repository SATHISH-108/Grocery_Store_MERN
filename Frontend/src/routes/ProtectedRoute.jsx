import { Navigate, useLocation } from "react-router-dom";
const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const user = localStorage.getItem("UserDetails")
    ? JSON.parse(localStorage.getItem("UserDetails"))
    : null;
  const seller = localStorage.getItem("SellerDetails")
    ? JSON.parse(localStorage.getItem("SellerDetails"))
    : null;
  const token = (user && user.userToken) || (seller && seller.sellerToken);
  if (!token) {
    // return <Navigate to="/signin" replace />;
    return location.pathname.startsWith("/seller") ? (
      <Navigate to="/seller/signin" replace />
    ) : (
      <Navigate to="/signin" replace />
    );
  }
  return children;
};
export default ProtectedRoute;
