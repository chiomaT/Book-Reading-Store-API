import mongoose from 'mongoose';
const connectDB = async () => {
    try {
      await mongoose.connect(process.env.DB, {
      });
      console.log('Connected to th DB');
    } catch (error) {
        console.error(err.message);
        process.exit(1);
    }
  };
export default connectDB;