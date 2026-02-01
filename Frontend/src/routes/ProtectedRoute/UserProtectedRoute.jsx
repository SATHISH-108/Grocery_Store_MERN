import { Navigate } from "react-router-dom";
const UserProtectedRoute = ({ children }) => {
  const user = localStorage.getItem("UserDetails")
    ? JSON.parse(localStorage.getItem("UserDetails"))
    : null;
  const token = user && user.userToken;
  if (!token) {
    return <Navigate to="/signin" replace />;
  }
  return children;
};
export default UserProtectedRoute;
