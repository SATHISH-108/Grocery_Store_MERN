import jwt from "jsonwebtoken";
const authSeller = async (request, response, next) => {
  console.log("request.cookies_authSeller.js", request.cookies);
  //    cookies:{
  //   sellerToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5NTBiNjM0NzZkMDEyYjU0ZjQ4NDkwYyIsImVtYWlsIjoic2F0aHlhQGdtYWlsLmNvbSIsInJvbGUiOiJVc2VyIiwiaWF0IjoxNzY4NjM4ODIyLCJleHAiOjE3NjkyNDM2MjJ9.TutJIFCLpX914mnbn8xYuwaCkrsuNf9IcYVHcTxeBR0'
  // }
  const { sellerToken } = request.cookies;
  if (!sellerToken) {
    return response.json({ success: false, message: "Seller token missing" });
  }
  try {
    const decoded = jwt.verify(sellerToken, process.env.JWT_SECRET);
    request.seller = { sellerId: decoded.id, role: decoded.role };
    console.log("request.seller_authSeller.js", request.seller);
    return next();
  } catch (error) {
    console.log(error.message);
    response.json({ success: false, message: error.message });
  }
};

export default authSeller;
