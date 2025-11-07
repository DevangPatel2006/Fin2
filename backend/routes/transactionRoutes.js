import express from 'express';
import { addTransaction, getUserTransactions } from '../controllers/transactionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/add', protect, addTransaction);
router.get('/my', protect, getUserTransactions);

export default router;
