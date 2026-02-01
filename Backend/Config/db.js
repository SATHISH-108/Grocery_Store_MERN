import mongoose from "mongoose";

const DBConnection = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.log(`MONGODB_URI Not Found`);
    }
    const connect = await mongoose.connect(process.env.MONGODB_URI);
    console.log(
      `Database Connected : ${connect.connection.host}, ${connect.connection.name}`
    );
  } catch (error) {
    console.log(`DB Connection error:`, error);
  }
};

export default DBConnection;
