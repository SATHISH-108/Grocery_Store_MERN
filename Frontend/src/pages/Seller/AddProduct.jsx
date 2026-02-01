import { useState } from "react";
import axios from "axios";
import { assets, categories } from "../../assets/groceries_assets/assets";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const AddProduct = () => {
  //image Files
  const [files, setFiles] = useState([]);
  const [addProduct, setAddProduct] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    offerPrice: "",
  });
  const { backendUrl } = useSelector((state) => state.product);
  const onSubmitHandler = async (event) => {
    try {
      event.preventDefault();
      const productData = {
        ...addProduct,
        description: addProduct.description.split("\n"),
      };
      console.log("ProductData_addProduct", productData);
      console.log("files_addProduct", files);
      const formData = new FormData();
      formData.append("productData", JSON.stringify(productData));
      for (let i = 0; i < files.length; i++) {
        formData.append("images", files[i]);
      }
      const response = await axios.post(
        `${backendUrl}/api/product/add`,
        formData,
      );
      const { data } = response;
      console.log("response_AddProduct.jsx", response);
      if (data.success) {
        toast.success(data.message);
        setAddProduct({
          name: "",
          description: "",
          category: "",
          price: "",
          offerPrice: "",
        });
        setFiles([]);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.messagee);
    }
  };
  return (
    <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll flex flex-col justify-between">
      <form
        onSubmit={onSubmitHandler}
        className="md:p-10 p-4 space-y-5 max-w-lg"
      >
        <div>
          <p className="text-base font-medium">Product Image</p>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            {Array(4)
              .fill("")
              .map((_, index) => (
                <label key={index} htmlFor={`image${index}`}>
                  <input
                    onChange={(e) => {
                      const updatedFiles = [...files];
                      updatedFiles[index] = e.target.files[0];
                      setFiles(updatedFiles);
                    }}
                    type="file"
                    id={`image${index}`}
                    hidden
                  />
                  <img
                    className="max-w-24 cursor-pointer"
                    src={
                      files[index]
                        ? URL.createObjectURL(files[index])
                        : assets.upload_area
                    }
                    alt="uploadArea"
                    width={100}
                    height={100}
                  />
                </label>
              ))}
          </div>
        </div>
        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium" htmlFor="product-name">
            Product Name
          </label>
          <input
            onChange={(e) =>
              setAddProduct({ ...addProduct, name: e.target.value })
            }
            value={addProduct.name}
            id="product-name"
            type="text"
            placeholder="Type here"
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
            required
          />
        </div>
        <div className="flex flex-col gap-1 max-w-md">
          <label
            className="text-base font-medium"
            htmlFor="product-description"
          >
            Product Description
          </label>
          <textarea
            onChange={(e) =>
              setAddProduct({ ...addProduct, description: e.target.value })
            }
            value={addProduct.description}
            id="product-description"
            rows={4}
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none"
            placeholder="Type here"
          ></textarea>
        </div>
        <div className="w-full flex flex-col gap-1">
          <label className="text-base font-medium" htmlFor="category">
            Category
          </label>
          <select
            onChange={(e) =>
              setAddProduct({ ...addProduct, category: e.target.value })
            }
            value={addProduct.category}
            id="category"
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
          >
            <option value="">Select Category</option>
            {categories.map((item, index) => (
              <option key={index} value={item.path}>
                {item.path}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-5 flex-wrap">
          <div className="flex-1 flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="product-price">
              Product Price
            </label>
            <input
              onChange={(e) =>
                setAddProduct({ ...addProduct, price: e.target.value })
              }
              value={addProduct.price}
              id="product-price"
              type="number"
              placeholder="0"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              required
            />
          </div>
          <div className="flex-1 flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="offer-price">
              Offer Price
            </label>
            <input
              onChange={(e) =>
                setAddProduct({ ...addProduct, offerPrice: e.target.value })
              }
              value={addProduct.offerPrice}
              id="offer-price"
              type="number"
              placeholder="0"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              required
            />
          </div>
        </div>
        <button
          type="submit"
          className="px-8 py-2.5 bg-primary text-white font-medium rounded cursor-pointer"
        >
          ADD
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
