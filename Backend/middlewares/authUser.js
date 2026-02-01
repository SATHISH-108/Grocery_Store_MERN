import jwt from "jsonwebtoken";
export const authUser = async (request, response, next) => {
  //if you want to use cookies then uncomment below code
  // const { userToken } = request.cookies;
  // console.log("request.cookies_authUser.js", request.cookies);
  //   cookies: {
  //   userToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5NTBiNjM0NzZkMDEyYjU0ZjQ4NDkwYyIsImVtYWlsIjoic2F0aHlhQGdtYWlsLmNvbSIsInJvbGUiOiJVc2VyIiwiaWF0IjoxNzY4NjM3NzEzLCJleHAiOjE3NjkyNDI1MTN9.F5kr6iJ9SmxZN0LLfsUDl60lQlzM5wxfLB7l2yTkeD0'
  // }

  // if (!userToken) {
  //   return response.json({ success: false, message: "User token missing" });
  // }
  try {
    const authHeaders = request.headers.authorization;
    if (!authHeaders || !authHeaders.startsWith("Bearer ")) {
      return response
        .status(401)
        .json({ success: false, message: "Authorization token missing" });
    }
    const userToken = authHeaders.split(" ")[1];
    const decoded = jwt.verify(userToken, process.env.JWT_SECRET);
    request.user = { userId: decoded.id, role: decoded.role };
    // console.log("request.user", request.user);
    // user: { userId: '6950b63476d012b54f48490c', role: 'User' },
    return next();
  } catch (error) {
    console.log(error);
    return response.json({ success: false, message: error.message });
  }
};
export default authUser;

/**
 * =========================
 * AUTHENTICATION MIDDLEWARE
 * =========================
 */
import express from "express";
// import jwt from "jsonwebtoken";
export const Protected = async (request, response, next) => {
  console.log("request_auth.js", request);
  try {
    const authHeaders =
      request.headers.authorization || request.headers.Authorization;
    // console.log("authHeaders", authHeaders); // Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5NTBiNjI5NzZkMDEyYjU0ZjQ4NDkwOSIsImVtYWlsIjoic2F0aGlzaEBnbWFpbC5jb20iLCJyb2xlIjoiVXNlciIsImlhdCI6MTc2NzA4NzE4NSwiZXhwIjoxNzY3MTczNTg1fQ.JCRsdTZmeU0igL1zYWPbaar5dHmClsHLKbIeJgj6B_g
    if (!authHeaders || !authHeaders.startsWith("Bearer ")) {
      return response.status(401).json({
        success: false,
        message: "AuthHeaders Not Found / JWT Token not found",
      });
    }
    const token = authHeaders.split(" ")[1];
    //console.log(token); // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5NTBiNjI5NzZkMDEyYjU0ZjQ4NDkwOSIsImVtYWlsIjoic2F0aGlzaEBnbWFpbC5jb20iLCJyb2xlIjoiVXNlciIsImlhdCI6MTc2NzA4NzE4NSwiZXhwIjoxNzY3MTczNTg1fQ.JCRsdTZmeU0igL1zYWPbaar5dHmClsHLKbIeJgj6B_g
    if (!token) {
      return response
        .status(401)
        .json({ success: false, message: "JWT Token Missing" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("decoded_Protected", decoded);
    //decoded_Protected {
    //   id: '6950b62976d012b54f484909',
    //   email: 'sathish@gmail.com',
    //   role: 'User',
    //   iat: 1767087185,
    //   exp: 1767173585
    // }
    request.user = { id: decoded.id, role: decoded.role };
    // console.log(request.user); //{ id: '6950b62976d012b54f484909', role: 'User' }
    return next();
  } catch (error) {
    console.log("Protected middleware error :", error);
    return response
      .status(401)
      .json({
        success: false,
        message: "Authentication Failed / Invalid or expired token",
      });
  }
};

/**
 * =========================
 * AUTHORIZATION MIDDLEWARE
 * =========================
 */

export const AuthorizedRoles = (allowedRoles) => {
  // console.log("allowedRole_53", allowedRoles);
  // allowedRole_53["User", "Seller"];
  // allowedRole_53["Seller"];
  const arrayOfRoles = allowedRoles.map(
    (r) => r[0].toUpperCase() + r.slice(1).toLowerCase(),
  );
  // console.log(arrayOfRoles);
  //   [ 'User', 'Seller' ]
  // [ 'Seller' ]
  return (request, response, next) => {
    if (!request.user || !request.user.role) {
      return response.status(401).json({
        success: false,
        message: "unauthorized: No user information found",
      });
    }
    const userRole = request.user.role;
    if (!arrayOfRoles.includes(userRole)) {
      return response
        .status(403)
        .json({ success: false, message: "Forbidden: Insufficient Roles" });
    }
    return next();
  };
};
