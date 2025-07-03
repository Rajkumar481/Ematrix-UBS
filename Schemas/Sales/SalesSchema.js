import mongoose from "mongoose";

const SalesSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    purchaseId: { type: mongoose.Schema.Types.ObjectId, ref: "Purchase" },
    orderId: String,
    productName: String,
    billingDate: String,
    dueDate: String,
    quantity: String,
    gstAmount: String,
    total: String,
    totalAmount: String,
    profit: String,
    modeOfPayment: {
      type: String,
      enum: ["Cash", "Credit"],
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Sales", SalesSchema);
