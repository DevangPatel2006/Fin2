import Goal from '../models/goalModel.js';

// Add a new goal
export const addGoal = async (req, res) => {
  try {
    const { name, target, current, deadline, monthlyContribution, description, color } = req.body;
    
    const status = current >= target ? 'completed' : 'ongoing';
    
    const newGoal = await Goal.create({
      userId: req.user.id,
      name,
      current: current || 0,
      target,
      deadline,
      monthlyContribution,
      description,
      color: color || 'from-primary to-secondary',
      status
    });
    
    res.status(201).json(newGoal);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all goals for a user
export const getUserGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(goals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single goal
export const getGoalById = async (req, res) => {
  try {
    const goal = await Goal.findOne({ _id: req.params.id, userId: req.user.id });
    
    if (!goal) {
      return res.status(404).json({ error: 'Goal not found' });
    }
    
    res.json(goal);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a goal
export const updateGoal = async (req, res) => {
  try {
    const { name, target, current, deadline, monthlyContribution, description } = req.body;
    
    const goal = await Goal.findOne({ _id: req.params.id, userId: req.user.id });
    
    if (!goal) {
      return res.status(404).json({ error: 'Goal not found' });
    }
    
    const status = current >= target ? 'completed' : 'ongoing';
    
    goal.name = name || goal.name;
    goal.target = target || goal.target;
    goal.current = current !== undefined ? current : goal.current;
    goal.deadline = deadline || goal.deadline;
    goal.monthlyContribution = monthlyContribution || goal.monthlyContribution;
    goal.description = description !== undefined ? description : goal.description;
    goal.status = status;
    
    await goal.save();
    
    res.json(goal);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a goal
export const deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    
    if (!goal) {
      return res.status(404).json({ error: 'Goal not found' });
    }
    
    res.json({ message: 'Goal deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};