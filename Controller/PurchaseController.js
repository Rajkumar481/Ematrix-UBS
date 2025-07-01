import Purchase from "../Schemas/PurchaseSchema.js";

export const createPurchase = async (req, res) => {
    try {
       const saved = await Purchase.create(req.body);
        res.status(201).json(saved);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const getAllPurchases = async (req, res) => {
    try {
        const purchases = await Purchase.find({}).populate({
            path: 'purchaseId',
            select: 'companyName email phone address'
        })
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
        const updated = await Purchase.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return res.status(404).send('Purchase not found');
        res.json(updated);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const deletePurchase = async (req, res) => {
    try {
        console.log();
        
        const deleted = await Purchase.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).send('Purchase not found');
        res.send('Purchase deleted');
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
