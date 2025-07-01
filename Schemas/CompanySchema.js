import mongoose from 'mongoose';

const CompanySchema = new mongoose.Schema({
    companyName: String,
    email: String,
    phone: Number,
    address: String,
    gst:Number
});

export default mongoose.model("Company", CompanySchema);
