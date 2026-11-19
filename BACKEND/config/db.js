import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000 // 5 second timeout
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`⚠️  MongoDB not connected on ${process.env.MONGODB_URI}`);
    console.warn(`👉 The server is still running to serve your frontend!`);
    console.warn(`👉 To enable database storage, ensure MongoDB is started or paste your MongoDB Atlas URI in BACKEND/.env\n`);
  }
};

export default connectDB;

