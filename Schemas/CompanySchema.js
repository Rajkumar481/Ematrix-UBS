import mongoose from "mongoose";

const CompanySchema = new mongoose.Schema({
  companyName: {
    type: String,
    unique: true,
  },
  email: String,
  phone: Number,
  address: String,
  gst: Number,
});

export default mongoose.model("Company", CompanySchema);
