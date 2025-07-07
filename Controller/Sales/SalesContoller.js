import Purchase from "../../Schemas/PurchaseSchema.js";
import Sales from "../../Schemas/Sales/SalesSchema.js";

// CREATE a new sales record with multiple items in a single bill
export const createSales = async (req, res) => {
  try {
    const salesArray = Array.isArray(req.body) ? req.body : [req.body];

    if (salesArray.length === 0) {
      return res.status(400).json({ message: "No sales data provided" });
    }

    // Get common fields from the first item in the payload
    const { userId, orderId, billingDate, dueDate, modeOfPayment } =
      salesArray[0];

    if (!modeOfPayment) {
      return res.status(400).json({ message: "modeOfPayment is required" });
    }
    if (!["Cash", "Credit"].includes(modeOfPayment)) {
      return res.status(400).json({ message: "Invalid modeOfPayment value" });
    }

    const items = [];
    let grandTotal = 0;

    for (const salesItem of salesArray) {
      const { productName, quantity } = salesItem;

      console.log(
        `Processing item: ${productName} - Requested qty: ${quantity}`
      );

      const purchase = await Purchase.findOne({ productName });
      if (!purchase) {
        console.error(`Product not found: ${productName}`);
        return res.status(404).json({
          message: `Product '${productName}' not found in Purchase records`,
        });
      }

      const qty = Number(quantity) || 0;

      console.log(
        `Checking stock for ${productName}: available=${purchase.salesQuantity}, requested=${qty}`
      );

      if (purchase.salesQuantity < qty) {
        return res.status(400).json({
          message: `Insufficient stock for product '${productName}'`,
        });
      }

      const total = qty * purchase.sellingPrice;
      const gstAmount = (total * purchase.gst) / 100;
      const totalAmount = total + gstAmount;
      const profit = (purchase.sellingPrice - purchase.purchasePrice) * qty;

      // ✅ Update remaining stock by decreasing salesQuantity instead of quantity
      purchase.salesQuantity -= qty;
      await purchase.save();

      items.push({
        purchaseId: purchase._id,
        productName,
        quantity: qty,
        gstAmount: gstAmount.toFixed(2),
        total: total.toFixed(2),
        totalAmount: totalAmount.toFixed(2),
        profit: profit.toFixed(2),
      });

      grandTotal += totalAmount;
    }

    const salesDoc = new Sales({
      userId,
      orderId,
      billingDate,
      dueDate,
      modeOfPayment,
      grandTotal: grandTotal.toFixed(2),
      items,
    });

    const savedSales = await salesDoc.save();
    res.status(201).json(savedSales);
  } catch (error) {
    console.error("Error in createSales:", error);
    res.status(500).json({ message: "Server error" });
  }
};
// GET all sales records with populated user and each item's purchase info
export const getAllSales = async (req, res) => {
  try {
    const sales = await Sales.find()
      .populate({
        path: "items.purchaseId",
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
      .populate({
        path: "items.purchaseId",
        select: "productName hsnCode sellingPrice gst",
      })
      .populate("userId");
    if (!sales)
      return res.status(404).json({ message: "Sales record not found" });
    res.status(200).json(sales);
  } catch (error) {
    console.error("Error in getSalesById:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE a sales record by ID (updates top-level fields only, not items)
export const updateSales = async (req, res) => {
  try {
    const { modeOfPayment } = req.body;

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
