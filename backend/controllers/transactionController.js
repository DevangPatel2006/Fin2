import Transaction from '../models/transactionModel.js';

export const addTransaction = async (req, res) => {
  try {
    const { type, category, amount, note, date } = req.body;
    const newTxn = await Transaction.create({
      userId: req.user.id,
      type,
      category,
      amount,
      note,
      date
    });
    res.status(201).json(newTxn);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUserTransactions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const total = await Transaction.countDocuments({ userId: req.user.id });
    const txns = await Transaction.find({ userId: req.user.id })
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    res.set('X-Total-Count', total);
    res.json(txns);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
