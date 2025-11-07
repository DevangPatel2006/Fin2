import express from 'express';
import { 
  addGoal, 
  getUserGoals, 
  getGoalById, 
  updateGoal, 
  deleteGoal 
} from '../controllers/goalController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/add', protect, addGoal);
router.get('/my', protect, getUserGoals);
router.get('/:id', protect, getGoalById);
router.put('/:id', protect, updateGoal);
router.delete('/:id', protect, deleteGoal);

export default router;