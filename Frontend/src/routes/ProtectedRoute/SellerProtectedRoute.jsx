import { Navigate } from "react-router-dom";
const SellerProtectedRoute = ({ children }) => {
  const seller = localStorage.getItem("SellerDetails")
    ? JSON.parse(localStorage.getItem("SellerDetails"))
    : null;
  const token = seller && seller.sellerToken;
  if (!token) {
    return <Navigate to="/seller/signin" replace />;
  }
  return children;
};
export default SellerProtectedRoute;
