import Sales from "../../Schemas/Sales/SalesSchema.js";
import Purchase from "../../Schemas/PurchaseSchema.js";

// CREATE a new sales record
export const createSales = async (req, res) => {
  try {
    const {
      productName,
      quantity,
      userId,
      orderId,
      billingDate,
      dueDate,
      modeOfPayment,
    } = req.body;

    if (!modeOfPayment) {
      return res.status(400).json({ message: "modeOfPayment is required" });
    }

    if (!["Cash", "Credit"].includes(modeOfPayment)) {
      return res.status(400).json({ message: "Invalid modeOfPayment value" });
    }

    // 1. Find product in Purchase by productName
    const purchase = await Purchase.findOne({ productName });
    if (!purchase) {
      return res
        .status(404)
        .json({ message: "Product not found in Purchase records" });
    }

    // 2. Parse quantity to Number
    const qty = Number(quantity) || 0;

    // 3. Calculate fields as per PurchaseSchema logic:
    const total = qty * purchase.sellingPrice;
    const gstAmount = (total * purchase.gst) / 100;
    const totalAmount = total + gstAmount;
    const profit = (purchase.sellingPrice - purchase.purchasePrice) * qty;

    // 4. Create and save Sales record
    const sales = new Sales({
      userId,
      purchaseId: purchase._id,
      orderId,
      billingDate,
      dueDate,
      quantity: qty,
      gstAmount,
      total,
      totalAmount,
      profit,
      modeOfPayment,
    });

    const savedSales = await sales.save();
    res.status(201).json(savedSales);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

//  GET all sales records
export const getAllSales = async (req, res) => {
  try {
    const sales = await Sales.find().populate("purchaseId").populate("userId");
    res.status(200).json(sales);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

//  GET a single sales record by ID
export const getSalesById = async (req, res) => {
  try {
    const sales = await Sales.findById(req.params.id)
      .populate("purchaseId")
      .populate("userId");
    if (!sales)
      return res.status(404).json({ message: "Sales record not found" });
    res.status(200).json(sales);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

//  UPDATE a sales record by ID
export const updateSales = async (req, res) => {
  try {
    const { modeOfPayment } = req.body;

    // Validate modeOfPayment if it is being updated
    if (modeOfPayment !== undefined) {
      if (!["Cash", "Credit"].includes(modeOfPayment)) {
        return res.status(400).json({ message: "Invalid modeOfPayment value" });
      }
    }

    const updatedSales = await Sales.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedSales)
      return res.status(404).json({ message: "Sales record not found" });
    res.status(200).json(updatedSales);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

//  DELETE a sales record by ID
export const deleteSales = async (req, res) => {
  try {
    const deletedSales = await Sales.findByIdAndDelete(req.params.id);
    if (!deletedSales)
      return res.status(404).json({ message: "Sales record not found" });
    res.status(200).json({ message: "Sales record deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
