import mongoose from "mongoose";

const SalesSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    orderId: String,
    billingDate: String,
    dueDate: String,
    modeOfPayment: {
      type: String,
      enum: ["Cash", "Credit"],
      required: true,
    },
    grandTotal: Number,
    items: [
      {
        purchaseId: { type: mongoose.Schema.Types.ObjectId, ref: "Purchase" },
        productName: String,
        quantity: Number,
        gstAmount: Number,
        total: Number,
        totalAmount: Number,
        profit: Number,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Sales", SalesSchema);
