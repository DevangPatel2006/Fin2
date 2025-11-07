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
    const txns = await Transaction.find({ userId: req.user.id }).sort({ date: -1 });
    res.json(txns);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
