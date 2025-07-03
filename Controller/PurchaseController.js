import CompanySchema from "../Schemas/CompanySchema.js";
import Purchase from "../Schemas/PurchaseSchema.js";
import UserSchema from "../Schemas/UserSchema.js";

export const createPurchase = async (req, res) => {
  try {
    const company = await CompanySchema.findById(req.body.purchaseId);

    if (!company) {
      return res
        .status(400)
        .json({ error: "Company not found with the given ID" });
    }

    const existingProduct = await Purchase.findOne({
      productName: req.body.productName,
    });

    if (existingProduct) {
      return res.status(409).json({ error: "Product name already exists" });
    }

    const quantity = parseFloat(req.body.quantity) || 0;
    const purchasePrice = parseFloat(req.body.purchasePrice) || 0;
    const sellingPrice = parseFloat(req.body.sellingPrice) || 0;
    const gst = parseFloat(req.body.gst) || 0;

    const total = quantity * purchasePrice;
    const gstAmount = (total * gst) / 100;
    const totalAmount = total + gstAmount;
    const profit = (sellingPrice - purchasePrice) * quantity;

    req.body.total = total.toFixed(2);
    req.body.gstAmount = gstAmount.toFixed(2);
    req.body.totalAmount = totalAmount.toFixed(2);
    req.body.profit = profit.toFixed(2);
    req.body.salesQuantity = req.body.quantity;

    const saved = await Purchase.create(req.body);
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getAllPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find({}).populate({
      path: "purchaseId",
      select: "companyName email phone address",
    });
    res.json(purchases);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getPurchaseById = async (req, res) => {
  try {
    const purchase = await Purchase.findById(req.params.id);
    if (!purchase) return res.status(404).send("Purchase not found");
    res.json(purchase);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updatePurchase = async (req, res) => {
  try {
    const quantity = parseFloat(req.body.quantity) || 0;
    const purchasePrice = parseFloat(req.body.purchasePrice) || 0;
    const sellingPrice = parseFloat(req.body.sellingPrice) || 0;
    const gst = parseFloat(req.body.gst) || 0;

    const total = quantity * purchasePrice;
    const gstAmount = (total * gst) / 100;
    const totalAmount = total + gstAmount;
    const profit = (sellingPrice - purchasePrice) * quantity;

    req.body.total = total.toFixed(2);
    req.body.gstAmount = gstAmount.toFixed(2);
    req.body.totalAmount = totalAmount.toFixed(2);
    req.body.profit = profit.toFixed(2);

    const updated = await Purchase.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ error: "Purchase not found" });
    }

    res.status(200).json(updated);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: "Duplicate field value entered" });
    }
    res.status(400).json({ error: err.message });
  }
};

export const deletePurchase = async (req, res) => {
  try {
    console.log();

    const deleted = await Purchase.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).send("Purchase not found");
    res.send("Purchase deleted");
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
