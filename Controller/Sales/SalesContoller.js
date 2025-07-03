import Sales from "../../Schemas/Sales/SalesSchema.js";
import Purchase from "../../Schemas/PurchaseSchema.js";

// CREATE a new sales record
export const createSales = async (req, res) => {
  try {
    const salesArray = Array.isArray(req.body) ? req.body : [req.body];
    const savedSalesRecords = [];

    for (const salesItem of salesArray) {
      const {
        productName,
        quantity,
        userId,
        orderId,
        billingDate,
        dueDate,
        modeOfPayment,
      } = salesItem;

      if (!modeOfPayment) {
        return res.status(400).json({ message: "modeOfPayment is required" });
      }

      if (!["Cash", "Credit"].includes(modeOfPayment)) {
        return res.status(400).json({ message: "Invalid modeOfPayment value" });
      }

      const purchase = await Purchase.findOne({ productName });
      if (!purchase) {
        return res.status(404).json({
          message: `Product '${productName}' not found in Purchase records`,
        });
      }

      const qty = Number(quantity) || 0;

      if (purchase.quantity < qty) {
        return res.status(400).json({
          message: `Insufficient stock for product '${productName}'`,
        });
      }

      const total = qty * purchase.sellingPrice;
      const gstAmount = (total * purchase.gst) / 100;
      const totalAmount = total + gstAmount;
      const profit = (purchase.sellingPrice - purchase.purchasePrice) * qty;

      purchase.quantity -= qty;
      await purchase.save();

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

      const saved = await sales.save();
      savedSalesRecords.push(saved);
    }

    res.status(201).json(savedSalesRecords);
  } catch (error) {
    console.error("Error in createSales:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET all sales records with populated user and purchase info
export const getAllSales = async (req, res) => {
  try {
    const sales = await Sales.find()
      .populate({
        path: "purchaseId",
        select: "productName hsnCode sellingPrice gst",
      })
      .populate({
        path: "userId",
        select: "userName email phone address gst",
      });
    res.status(200).json(sales);
  } catch (error) {
    console.error("Error in getAllSales:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET a single sales record by ID
export const getSalesById = async (req, res) => {
  try {
    const sales = await Sales.findById(req.params.id)
      .populate("purchaseId")
      .populate("userId");
    if (!sales)
      return res.status(404).json({ message: "Sales record not found" });
    res.status(200).json(sales);
  } catch (error) {
    console.error("Error in getSalesById:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE a sales record by ID
export const updateSales = async (req, res) => {
  try {
    const { modeOfPayment } = req.body;

    // Validate modeOfPayment if updating
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
    console.error("Error in updateSales:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE a sales record by ID
export const deleteSales = async (req, res) => {
  try {
    const deletedSales = await Sales.findByIdAndDelete(req.params.id);
    if (!deletedSales)
      return res.status(404).json({ message: "Sales record not found" });
    res.status(200).json({ message: "Sales record deleted successfully" });
  } catch (error) {
    console.error("Error in deleteSales:", error);
    res.status(500).json({ message: "Server error" });
  }
};
