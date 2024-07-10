import mongoose from "mongoose";
const connectDB = async (retries = 5, delay = 5000) => {
  while (retries) {
    try {
      await mongoose.connect(process.env.DB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("Connected to th DB");
      break;
    } catch (error) {
      console.error("Database connection failed");
      console.error(`Error: ${error.message}`);
      retries -= 1;
      console.log(`Retries left: ${retries}`);
      if (retries === 0) {
        console.error("No more retries left. Exiting now...");
        process.exit(1);
      }
      await new Promise((res) => setTimeout(res, delay));
    }
  }
};
export default connectDB;
