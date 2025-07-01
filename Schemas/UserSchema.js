import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  userName: String,
  email: String,
  phone: Number,
  address: String,
  gst:Number
});

export default mongoose.model('User', userSchema);
