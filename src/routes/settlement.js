// src/routes/settlement.js
import { Router } from 'express';
import * as ctrl from '../controllers/settlement.js';
const router = Router();

router.get('/people',     ctrl.getPeople);
router.get('/balances',   ctrl.getBalances);
router.get('/settlements',ctrl.getSettlements);

export default router;
