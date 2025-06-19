// src/models/Expense.js
import mongoose from 'mongoose';

const splitSchema = new mongoose.Schema({
  person: { type: String, required: true, trim: true },
  share:  { type: Number, required: true, min: 0 }
}, { _id: false });

const expenseSchema = new mongoose.Schema({
  amount:        { type: Number, required: true, min: 0 },
  description:   { type: String, required: true, trim: true },
  paid_by:       { type: String, required: true, trim: true },
  split_between: [{ type: String, trim: true }], //All paid equal
  splits:        [splitSchema], //Splite is different for different
  date:          { type: Date, default: Date.now }
});


expenseSchema.pre('validate', function(next) {
  if ((!this.splits || this.splits.length === 0) &&
      (!this.split_between || this.split_between.length === 0)) {
    this.invalidate('splits',
      'Either split_between (for equal split) or splits (for manual amounts) is required');
  }
  next();
});

export default mongoose.model('Expense', expenseSchema);
