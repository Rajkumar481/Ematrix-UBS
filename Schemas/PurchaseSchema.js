import mongoose from "mongoose";

const PurchaseSchema = new mongoose.Schema(
  {
    purchaseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    invoiceNo: {
      type: String,
      required: true,
    },
    productName: {
      type: String,
      required: true,
      unique: true,
    },
    despatchedThrough: {
      type: String,
      required: true,
    },
    billingDate: {
      type: String,
      required: true,
    },
    deliveryDate: {
      type: String,
      required: true,
    },
    vehicleNo: {
      type: String,
    },
    driverPhoneNo: {
      type: String,
      required: true,
    },
    purchaseOrderId: {
      type: String,
      required: true,
    },
    hsnCode: {
      type: String,
      required: true,
    },
    quantity: {
      type: String,
      required: true,
    },
    purchasePrice: {
      type: String,
      required: true,
    },
    sellingPrice: {
      type: String,
      required: true,
    },
    gst: {
      type: String,
      required: true,
    },
    gstAmount: {
      type: String,
      required: true,
    },
    total: {
      type: String,
      required: true,
    },
    totalAmount: {
      type: String,
      required: true,
    },
    profit: {
      type: String,
      required: true,
    },
    salesQuantity: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

PurchaseSchema.pre("save", function (next) {
  const { quantity = 0, purchasePrice = 0, gst = 0, sellingPrice = 0 } = this;

  this.salesQuantity = this.salesQuantity ?? this.quantity;

  this.total = quantity * purchasePrice;
  this.gstAmount = (this.total * gst) / 100;
  this.totalAmount = this.total + this.gstAmount;
  this.profit = (sellingPrice - purchasePrice) * quantity;

  next();
});

export default mongoose.model("Purchase", PurchaseSchema);
