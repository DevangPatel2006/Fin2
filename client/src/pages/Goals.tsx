import { motion } from 'framer-motion';
import { Target, Plus, TrendingUp, Edit } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import DashboardLayout from '@/components/DashboardLayout';
import { useEffect, useState } from 'react';
import { getUserGoals } from '@/api/goals';

interface Goal {
  _id: string;
  name: string;
  current: number;
  target: number;
  color: string;
  deadline: string;
  monthlyContribution: number;
  status?: string;
}

export default function Goals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const res = await getUserGoals();
        setGoals(res.data);
      } catch (err) {
        console.error('Failed to fetch goals:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGoals();
  }, []);

  const totalSaved = goals.reduce((sum, goal) => sum + goal.current, 0);
  const totalTarget = goals.reduce((sum, goal) => sum + goal.target, 0);
  const overallProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96 text-lg text-muted-foreground">
          Loading goals...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Financial <span className="text-gradient-indigo">Goals</span>
          </h1>
          <p className="text-muted-foreground">Track your progress towards your dreams</p>
        </motion.div>

        {goals.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-8 hover:neon-border-indigo transition-all duration-500"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-1">Overall Progress</h2>
                <p className="text-muted-foreground">Combined progress across all goals</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-gradient-indigo">{overallProgress.toFixed(1)}%</p>
                <p className="text-sm text-muted-foreground">₹{totalSaved.toLocaleString()} / ₹{totalTarget.toLocaleString()}</p>
              </div>
            </div>
            <div className="relative h-4 bg-muted/30 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${overallProgress}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary via-secondary to-accent rounded-full"
              />
            </div>
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Link to="/add-goal">
            <Button variant="luxury" className="w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Create New Goal
            </Button>
          </Link>
        </motion.div>

        {goals.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-12 text-center"
          >
            <Target className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No Goals Yet</h3>
            <p className="text-muted-foreground mb-6">Start your financial journey by creating your first goal</p>
            <Link to="/add-goal">
              <Button variant="luxury">
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Goal
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {goals.map((goal, index) => {
              const progress = (goal.current / goal.target) * 100;
              const monthsRemaining = Math.ceil(
                (new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24 * 30)
              );
              const onTrack = (goal.target - goal.current) / monthsRemaining <= goal.monthlyContribution;

              return (
                <motion.div
                  key={goal._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  onClick={() => navigate(`/add-goal/${goal._id}`)}
                  className="glass-card p-6 hover:neon-border-cyan transition-all duration-500 group relative cursor-pointer"
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/add-goal/${goal._id}`);
                    }}
                    className="absolute top-4 right-4 p-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Edit or Delete Goal"
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <Target className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">{goal.name}</h3>
                        <p className="text-sm text-muted-foreground">Due: {goal.deadline}</p>
                      </div>
                    </div>

                    {goal.status === 'completed' ? (
                      <div className="px-2 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-semibold">
                        Completed
                      </div>
                    ) : onTrack ? (
                      <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold">
                        <TrendingUp className="w-3 h-3" />
                        On Track
                      </div>
                    ) : (
                      <div className="px-2 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-semibold">
                        Behind
                      </div>
                    )}
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-semibold text-foreground">{progress.toFixed(1)}%</span>
                    </div>
                    <div className="relative h-3 bg-muted/30 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${progress}%` }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 + index * 0.1, duration: 0.8 }}
                        className={`absolute inset-y-0 left-0 bg-gradient-to-r ${goal.color} rounded-full`}
                      />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-foreground font-medium">₹{goal.current.toLocaleString()}</span>
                      <span className="text-muted-foreground">₹{goal.target.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Monthly Contribution</span>
                      <span className="text-foreground font-medium">₹{goal.monthlyContribution.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Remaining</span>
                      <span className="text-foreground font-medium">₹{(goal.target - goal.current).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Time Left</span>
                      <span className="text-foreground font-medium">{monthsRemaining} months</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}