import { v2 as cloudinary } from "cloudinary";
import ProductModel from "../Models/productModel.js";

// Add Product : http://localhost:7001/api/product/add
export const addProduct = async (request, response) => {
  try {
    let productData = JSON.parse(request.body.productData);
    const images = request.files;
    let imagesUrl = await Promise.all(
      images.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });
        return result.secure_url;
      }),
    );
    await ProductModel.create({ ...productData, image: imagesUrl });
    response.json({ success: true, message: "Product Added" });
  } catch (error) {
    console.log(error.message);
    response.json({ success: false, message: error.message });
  }
};
// Get Product : /api/product/list
export const productList = async (request, response) => {
  try {
    const products = await ProductModel.find({});
    response.json({ success: true, products });
  } catch (error) {
    console.log(error.message);
    response.json({ success: false, message: error.message });
  }
};
// Get Single Product : /api/product/id
export const productById = async (request, response) => {
  try {
    const { id } = request.body;
    const product = await ProductModel.findById(id);
    response.json({ success: true, product });
  } catch (error) {
    console.log(error.message);
    response.json({ success: false, message: error.message });
  }
};
// Change Product inStock : /api/product/stock
export const changeStock = async (request, response) => {
  try {
    const { id, inStock } = request.body;
    await ProductModel.findByIdAndUpdate(id, { inStock });
    response.json({ success: true, message: "Stock Updated" });
  } catch (error) {
    console.log(error.message);
    response.json({ success: false, message: error.message });
  }
};
