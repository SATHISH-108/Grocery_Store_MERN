import AddressModel from "../Models/addressModel.js";

//POST // Add Address : /api/address/add
export const addAddress = async (request, response) => {
  try {
    const userId = request.user.userId; // From Token
    const { address } = request.body;
    if (!address) {
      return response
        .status(400)
        .json({ success: false, message: "Address is required" });
    }
    await AddressModel.create({ ...address, userId });
    response.json({ success: true, message: "Address added successfully" });
  } catch (error) {
    console.log(error.message);
    response.status(500).json({ success: false, message: error.message });
  }
};

// Get Address : /api/address/get

export const getAddress = async (request, response) => {
  try {
    const userId = request.user.userId;
    const addresses = await AddressModel.find({ userId });
    response.json({ success: true, addresses });
  } catch (error) {
    console.log(error.message);
    response.status(500).json({ success: false, message: error.message });
  }
};
