// import mongoose from "mongoose";

// const DBConnection = async () => {
//   try {
//     if (!process.env.MONGODB_URI) {
//       console.log(`MONGODB_URI Not Found`);
//     }
//     const connect = await mongoose.connect(process.env.MONGODB_URI);
//     console.log(
//       `Database Connected : ${connect.connection.host}, ${connect.connection.name}`
//     );
//   } catch (error) {
//     console.log(`DB Connection error:`, error);
//   }
// };

// export default DBConnection;

import mongoose from "mongoose";

let isConnected = false;

const DBConnection = async () => {
  if (isConnected) {
    return;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error("❌ MONGODB_URI not found in environment variables");
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      bufferCommands: false, // ⬅️ VERY IMPORTANT
    });

    isConnected = true;

    console.log(
      `✅ Database Connected: ${conn.connection.host} / ${conn.connection.name}`,
    );
  } catch (error) {
    console.error("❌ DB Connection error:", error.message);
    throw error; // ⬅️ DO NOT swallow the error
  }
};

export default DBConnection;
