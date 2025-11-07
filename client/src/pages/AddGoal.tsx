import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Target, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/DashboardLayout';
import { z } from 'zod';
import { addGoal, getGoalById, updateGoal, deleteGoal } from '@/api/goals';

const goalSchema = z.object({
  name: z.string().trim().min(1, 'Goal name is required').max(100),
  targetAmount: z
    .number()
    .positive('Target amount must be positive')
    .max(100000000),
  currentAmount: z
    .number()
    .min(0, 'Current amount cannot be negative')
    .max(100000000),
  deadline: z.string().min(1, 'Deadline is required'),
  monthlyContribution: z
    .number()
    .positive('Monthly contribution must be positive')
    .max(10000000),
  description: z
    .string()
    .max(500, 'Description must be less than 500 characters')
    .optional(),
});

const colorGradients = [
  'from-primary to-secondary',
  'from-accent to-primary',
  'from-secondary to-violet',
  'from-violet to-accent',
  'from-primary via-secondary to-accent',
];

export default function AddGoal() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();

  const [formData, setFormData] = useState<any>({
    name: '',
    targetAmount: '',
    currentAmount: '0',
    deadline: '',
    monthlyContribution: '',
    description: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchGoal = async () => {
      try {
        const res = await getGoalById(id);
        const goal = res.data;

        setFormData({
          name: goal.name ?? '',
          targetAmount: goal.target?.toString() ?? '0',
          currentAmount: goal.current?.toString() ?? '0',
          deadline: goal.deadline ?? '',
          monthlyContribution: goal.monthlyContribution?.toString() ?? '0',
          description: goal.description ?? '',
        });

        setIsEditMode(true);
      } catch (err) {
        console.error('Failed to fetch goal:', err);
        toast({
          title: 'Error',
          description: 'Failed to load goal details',
          variant: 'destructive',
        });
      }
    };

    fetchGoal();
  }, [id, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const validatedData = goalSchema.parse({
        name: formData.name,
        targetAmount: parseFloat(formData.targetAmount),
        currentAmount: parseFloat(formData.currentAmount),
        deadline: formData.deadline,
        monthlyContribution: parseFloat(formData.monthlyContribution),
        description: formData.description,
      });

      setLoading(true);

      const goalData = {
        name: validatedData.name,
        target: validatedData.targetAmount,
        current: validatedData.currentAmount,
        deadline: validatedData.deadline,
        monthlyContribution: validatedData.monthlyContribution,
        description: validatedData.description,
      };

      if (isEditMode) {
        await updateGoal(id!, goalData);
        toast({
          title: 'Goal Updated!',
          description: `Your goal "${validatedData.name}" has been updated successfully.`,
        });
      } else {
        // Add color for new goals
        const randomColor = colorGradients[Math.floor(Math.random() * colorGradients.length)];
        await addGoal({ ...goalData, color: randomColor });
        toast({
          title: 'Goal Created!',
          description: `Your goal "${validatedData.name}" has been created successfully.`,
        });
      }

      navigate('/goals');
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(newErrors);
      } else {
        toast({
          title: 'Error',
          description: 'Failed to save goal',
          variant: 'destructive',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteGoal(id!);
      setShowDeleteConfirm(false);
      toast({
        title: 'Goal Deleted',
        description: `"${formData.name}" has been successfully deleted.`,
      });
      navigate('/goals');
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to delete goal',
        variant: 'destructive',
      });
    }
  };

  const calculateMonthsNeeded = () => {
    const target = parseFloat(formData.targetAmount) || 0;
    const current = parseFloat(formData.currentAmount) || 0;
    const monthly = parseFloat(formData.monthlyContribution) || 0;

    if (monthly > 0 && target > current) {
      return Math.ceil((target - current) / monthly);
    }
    return 0;
  };

  return (
    <>
      <DashboardLayout>
        <div className="max-w-2xl mx-auto space-y-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4"
          >
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate('/goals')}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-2xl sm:text-3xl font-bold">
              {isEditMode ? 'Edit Goal' : 'Create New Goal'}
            </h1>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onSubmit={handleSubmit}
            className="glass-card p-6 sm:p-8 space-y-6"
          >
            <div className="space-y-2">
              <Label htmlFor="name">Goal Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g., New Laptop, Vacation Fund"
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="targetAmount">Target Amount (₹)</Label>
                <Input
                  id="targetAmount"
                  type="number"
                  value={formData.targetAmount}
                  onChange={(e) =>
                    setFormData({ ...formData, targetAmount: e.target.value })
                  }
                  placeholder="50000"
                />
                {errors.targetAmount && (
                  <p className="text-sm text-destructive">
                    {errors.targetAmount}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="currentAmount">Current Amount (₹)</Label>
                <Input
                  id="currentAmount"
                  type="number"
                  value={formData.currentAmount}
                  onChange={(e) =>
                    setFormData({ ...formData, currentAmount: e.target.value })
                  }
                  placeholder="0"
                />
                {errors.currentAmount && (
                  <p className="text-sm text-destructive">
                    {errors.currentAmount}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="deadline">Deadline</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={(e) =>
                    setFormData({ ...formData, deadline: e.target.value })
                  }
                />
                {errors.deadline && (
                  <p className="text-sm text-destructive">{errors.deadline}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="monthlyContribution">
                  Monthly Contribution (₹)
                </Label>
                <Input
                  id="monthlyContribution"
                  type="number"
                  value={formData.monthlyContribution}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      monthlyContribution: e.target.value,
                    })
                  }
                  placeholder="5000"
                />
                {errors.monthlyContribution && (
                  <p className="text-sm text-destructive">
                    {errors.monthlyContribution}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="A short note about this goal..."
                className="min-h-[100px]"
              />
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description}</p>
              )}
            </div>

            {calculateMonthsNeeded() > 0 && (
              <div className="p-4 rounded-lg border border-primary/20 bg-primary/10 text-primary-foreground">
                <p>
                  At this rate, it will take you{' '}
                  <span className="font-bold">{calculateMonthsNeeded()} months</span>{' '}
                  to reach your goal.
                </p>
              </div>
            )}

            <div className="flex flex-col-reverse sm:flex-row sm:justify-between sm:items-center gap-4 pt-4">
              <Button
                type="submit"
                variant="luxury"
                className="w-full sm:w-auto"
                disabled={loading}
              >
                <Target className="w-4 h-4 mr-2" />
                {loading ? 'Saving...' : isEditMode ? 'Update Goal' : 'Save Goal'}
              </Button>
              {isEditMode && (
                <Button
                  type="button"
                  variant="destructive"
                  className="w-full sm:w-auto"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Goal
                </Button>
              )}
            </div>
          </motion.form>
        </div>
      </DashboardLayout>

      {showDeleteConfirm && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
          onClick={() => setShowDeleteConfirm(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-card p-6 max-w-md w-full space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-destructive/10">
                <Trash2 className="w-6 h-6 text-destructive" />
              </div>
              <h3 className="text-xl font-bold">Delete Goal?</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete "{formData.name}"? This action
              cannot be undone.
            </p>
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={handleDeleteConfirm}
              >
                Delete
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}