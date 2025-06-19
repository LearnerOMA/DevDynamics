// src/controllers/expenses.js
import Expense from '../models/Expense.js';

// List all expenses
export const listExpenses = async (req, res) => {
  const data = await Expense.find().sort({ date: -1 });
  res.json({ success: true, data });
};

// Add new expense
export const addExpense = async (req, res) => {
  const { amount, description, paid_by, split_between, splits } = req.body;

  if (amount <= 0)
    return res.status(400).json({ success: false, message: 'Amount must be positive' });

  // Validate manual splits sum
  if (splits && splits.length) {
    const totalShare = splits.reduce((sum, s) => sum + s.share, 0);
    if (Math.abs(totalShare - amount) > 0.01) {
      return res.status(400).json({
        success: false,
        message: 'Manual splits must sum exactly to total amount'
      });
    }
  }

  const exp = new Expense({ amount, description, paid_by, split_between, splits });
  await exp.save();
  res.status(201).json({ success: true, data: exp, message: 'Expense added' });
};

// Update expense
export const updateExpense = async (req, res) => {
  const id = req.body.id;
  const upd = req.body;

  if (upd.amount !== undefined && upd.amount <= 0)
    return res.status(400).json({ success: false, message: 'Amount must be positive' });

  // If manual splits present, sum‐check again
  if (upd.splits && upd.splits.length) {
    const sum = upd.splits.reduce((s, x) => s + x.share, 0);
    if (Math.abs(sum - upd.amount) > 0.01) {
      return res.status(400).json({
        success: false,
        message: 'Manual splits must sum exactly to total amount'
      });
    }
  }

  const exp = await Expense.findByIdAndUpdate(id, upd, { new: true });
  if (!exp) return res.status(404).json({ success: false, message: 'Not found' });
  res.json({ success: true, data: exp, message: 'Expense updated' });
};

// Delete expense
export const deleteExpense = async (req, res) => {
  const exp = await Expense.findByIdAndDelete(req.params.id);
  if (!exp) return res.status(404).json({ success: false, message: 'Not found' });
  res.json({ success: true, message: 'Expense deleted' });
};
