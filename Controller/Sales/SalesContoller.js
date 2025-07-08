import PurchaseSchema from "../../Schemas/PurchaseSchema.js";
import Purchase from "../../Schemas/PurchaseSchema.js";
import Sales from "../../Schemas/Sales/SalesSchema.js";

// CREATE a new sales record with multiple items in a single bill
export const createSales = async (req, res) => {
  try {
    const salesArray = Array.isArray(req.body) ? req.body : [req.body];

    if (salesArray.length === 0) {
      return res.status(400).json({ message: "No sales data provided" });
    }

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
      const { productName, quantity, purchaseId } = salesItem;

      const purchase = await Purchase.findById(purchaseId);
      if (!purchase) {
        return res.status(404).json({
          message: `Purchase with ID '${purchaseId}' not found`,
        });
      }

      const matchingItem = purchase.items.find(
        (item) =>
          item.productName.trim().toLowerCase() ===
          productName.trim().toLowerCase()
      );

      if (!matchingItem) {
        return res.status(404).json({
          message: `Product '${productName}' not found in Purchase items`,
        });
      }

      const qty = Number(quantity) || 0;

      if (matchingItem.salesQuantity === undefined) {
        return res.status(400).json({
          message: `salesQuantity not initialized for product '${productName}'`,
        });
      }

      if (matchingItem.salesQuantity < qty) {
        return res.status(400).json({
          message: `Insufficient stock for product '${productName}'`,
        });
      }

      const total = qty * matchingItem.sellingPrice;
      const gstAmount = (total * matchingItem.gst) / 100;
      const totalAmount = total + gstAmount;
      const profit =
        (matchingItem.sellingPrice - matchingItem.purchasePrice) * qty;

      // ✅ Decrease salesQuantity
      matchingItem.salesQuantity -= qty;
      purchase.markModified("items");
      await purchase.save();

      items.push({
        purchaseId: purchase._id,
        productName,
        quantity: qty,
        hsnCode: matchingItem.hsnCode,
        gst: matchingItem.gst,
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
      })
      .lean()
      .exec();

    // console.dir(sales, { depth: null, colors: true }); // helpful debug

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
    const salesId = req.params.id;
    const updatedData = req.body;

    const existingSale = await Sales.findById(salesId);
    if (!existingSale) {
      return res.status(404).json({ message: "Sales record not found" });
    }

    // 1. Revert stock: Add back original quantities
    for (const item of existingSale.items) {
      const purchase = await Purchase.findById(item.purchaseId);
      if (purchase) {
        const matchingItem = purchase.items.find(
          (i) =>
            i.productName.trim().toLowerCase() ===
            item.productName.trim().toLowerCase()
        );

        if (matchingItem) {
          matchingItem.salesQuantity += item.quantity;
          purchase.markModified("items");
          await purchase.save();
        }
      }
    }

    // 2. Validate and apply new changes
    const { items: newItems = [] } = updatedData;
    let grandTotal = 0;

    const updatedItems = [];

    for (const item of newItems) {
      const { productName, quantity, purchaseId } = item;

      const purchase = await Purchase.findById(purchaseId);
      if (!purchase) {
        return res.status(404).json({
          message: `Purchase with ID '${purchaseId}' not found`,
        });
      }

      const matchingItem = purchase.items.find(
        (i) =>
          i.productName.trim().toLowerCase() ===
          productName.trim().toLowerCase()
      );

      if (!matchingItem) {
        return res.status(404).json({
          message: `Product '${productName}' not found in Purchase items`,
        });
      }

      const qty = Number(quantity) || 0;

      if (matchingItem.salesQuantity < qty) {
        return res.status(400).json({
          message: `Insufficient stock for product '${productName}'`,
        });
      }

      const total = qty * matchingItem.sellingPrice;
      const gstAmount = (total * matchingItem.gst) / 100;
      const totalAmount = total + gstAmount;
      const profit =
        (matchingItem.sellingPrice - matchingItem.purchasePrice) * qty;

      // Update stock
      matchingItem.salesQuantity -= qty;
      purchase.markModified("items");
      await purchase.save();

      updatedItems.push({
        purchaseId: purchase._id,
        productName,
        quantity: qty,
        hsnCode: matchingItem.hsnCode,
        gst: matchingItem.gst,
        gstAmount: gstAmount.toFixed(2),
        total: total.toFixed(2),
        totalAmount: totalAmount.toFixed(2),
        profit: profit.toFixed(2),
      });

      grandTotal += totalAmount;
    }

    // 3. Update sales doc
    existingSale.orderId = updatedData.orderId || existingSale.orderId;
    existingSale.billingDate =
      updatedData.billingDate || existingSale.billingDate;
    existingSale.dueDate = updatedData.dueDate || existingSale.dueDate;
    existingSale.modeOfPayment =
      updatedData.modeOfPayment || existingSale.modeOfPayment;
    existingSale.items = updatedItems;
    existingSale.grandTotal = grandTotal.toFixed(2);

    const saved = await existingSale.save();

    res.status(200).json(saved);
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
