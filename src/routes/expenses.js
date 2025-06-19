// src/routes/expenses.js
import { Router } from 'express';
import * as ctrl from '../controllers/expenses.js';
const router = Router();

router.get('/listExprenses',    ctrl.listExpenses);
router.post('/addExpenses',   ctrl.addExpense);
router.put('/updateExpences', ctrl.updateExpense);
router.delete('/:id', ctrl.deleteExpense);

export default router;