// src/controllers/settlement.js
import Expense from '../models/Expense.js';
import { calculate } from '../utils/calculateSettlements.js';

/**
 * Helper: collect all unique participant names from expenses
 */
function collectPeople(expenses) {
  return [...new Set(
    expenses.flatMap(e => {
      if (e.splits && e.splits.length) {
        // manual splits → use the person field
        return [...e.splits.map(s => s.person), e.paid_by];
      } else {
        // equal split → paid_by + split_between[]
        return [e.paid_by, ...e.split_between];
      }
    })
  )];
}

// GET /people
export const getPeople = async (req, res) => {
  const expenses = await Expense.find();
  const people = collectPeople(expenses);
  return res.json({ success: true, data: people });
};

// GET /balances
export const getBalances = async (req, res) => {
  const expenses = await Expense.find();
  const people   = collectPeople(expenses);
  const { net }  = calculate(people, expenses);
  return res.json({ success: true, data: net });
};

// GET /settlements
export const getSettlements = async (req, res) => {
  const expenses    = await Expense.find();
  const people      = collectPeople(expenses);
  const { settlements } = calculate(people, expenses);
  return res.json({ success: true, data: settlements });
};
