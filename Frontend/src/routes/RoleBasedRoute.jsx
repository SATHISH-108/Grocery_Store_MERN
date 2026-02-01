import { Navigate, useLocation } from "react-router-dom";
const RoleBasedRoute = ({ children, allowedRoles = [] }) => {
  const location = useLocation();

  const userDetails = localStorage.getItem("UserDetails")
    ? JSON.parse(localStorage.getItem("UserDetails"))
    : null;
  const sellerDetails = localStorage.getItem("SellerDetails")
    ? JSON.parse(localStorage.getItem("SellerDetails"))
    : null;

  const user = userDetails || sellerDetails;
  const role = user?.role;
  if (!role) {
    return location.pathname.startsWith("/seller") ? (
      <Navigate to="/seller/signin" replace />
    ) : (
      <Navigate to="/signin" replace />
    );
  }
  if (!allowedRoles.includes(role)) {
    return <Navigate to="/signin" replace />;
  }
  return children;
};
export default RoleBasedRoute;
