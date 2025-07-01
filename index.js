import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
// import connectDB from './db.js';

import userRoutes from './Routes/UserRoutes.js';
import purchaseRoutes from './Routes/PurchaseRoutes.js';
import companyRoutes from './Routes/CompanyRoutes.js';
import mongoose from 'mongoose';


const app = express();
// connectDB();

app.use(cors());
app.use(express.json());

app.use('/user', userRoutes);
app.use('/purchase', purchaseRoutes);
app.use('/company', companyRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 3000;

try {
  await mongoose.connect(process.env.MONGO_URI)
  
  app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


} catch (error) { 
  console.log(error);
  process.exit(1);//close server
  
}
