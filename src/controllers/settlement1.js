// src/controllers/settlement.js
import Expense from '../models/Expense.js';
import { calculate } from '../utils/calculateSettlements.js';

export const getPeople = async (req, res) => {
  const ex = await Expense.find();
  const people = [...new Set(ex.flatMap(e =>
    e.splits && e.splits.length
      ? e.splits.map(s=>s.person).concat(e.paid_by)
      : [e.paid_by, ...e.split_between]
  ))];
  res.json({ success: true, data: people });
};

export const getBalances = async (req, res) => {
  const ex = await Expense.find();
  const people = await getPeople(req, { json: d=>d }); // reuse logic
  const { net } = calculate(people.data, ex);
  res.json({ success: true, data: net });
};

export const getSettlements = async (req, res) => {
  const ex = await Expense.find();
  const people = await getPeople(req, { json: d=>d });
  const { settlements } = calculate(people.data, ex);
  res.json({ success: true, data: settlements });
};
