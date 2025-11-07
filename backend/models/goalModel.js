import mongoose from 'mongoose';

const goalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  current: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  target: {
    type: Number,
    required: true,
    min: 1
  },
  deadline: {
    type: String,
    required: true
  },
  monthlyContribution: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    maxlength: 500
  },
  color: {
    type: String,
    default: 'from-primary to-secondary'
  },
  status: {
    type: String,
    enum: ['ongoing', 'completed'],
    default: 'ongoing'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Goal', goalSchema);