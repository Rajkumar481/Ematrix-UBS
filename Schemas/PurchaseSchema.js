import mongoose from 'mongoose';

const PurchaseSchema = new mongoose.Schema({
  purchaseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
  },
  invoiceNo: String,
  productName: String,
  despatchedThrough: String,
  billingDate: Date,
  deliveryDate: Date,
  vehicleNo: Number,
  driverPhoneNo: Number,
  purchaseOrderId: Number,
  hsnCode: Number,
  quantity: Number,
  purchasePrice: Number,
  sellingPrice: Number,
  gst: Number,
  gstAmount: Number,
  total: Number,
  totalAmount: Number,
  profit: Number
});


PurchaseSchema.pre('save', function (next) {
  const { quantity = 0, purchasePrice = 0, gst = 0, sellingPrice = 0 } = this;

  this.total = quantity * purchasePrice;
  this.gstAmount = (this.total * gst) / 100;
  this.totalAmount = this.total + this.gstAmount;
  this.profit = (sellingPrice - purchasePrice) * quantity;

  next();
});


export default mongoose.model('Purchase', PurchaseSchema);



