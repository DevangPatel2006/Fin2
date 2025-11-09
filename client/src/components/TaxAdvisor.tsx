import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Calculator, TrendingUp, AlertCircle, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export default function TaxAdvisor() {
  const { toast } = useToast();
  const [taxData, setTaxData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    employmentType: '',
    annualRentPaid: '',
    investments80C: '',
    healthInsurance80D: '',
    homeLoanInterest: '',
    educationLoanInterest: '',
    npsContribution: ''
  });

  const fetchTaxAnalysis = async (inputs = {}) => {
    setLoading(true);
    try {
      const res = await API.post('/tax/analyze', inputs);
      setTaxData(res.data);
      if (res.data.status === 'NEEDS_INPUTS') {
        setShowForm(true);
      } else if (res.data.status === 'READY') {
        setShowForm(false);
        toast({ title: 'Tax Analysis Complete!', description: 'Your personalized tax plan is ready.' });
      }
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to analyze tax data', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTaxAnalysis();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const inputs: any = {};
    Object.keys(formData).forEach(key => {
      inputs[key] = formData[key as keyof typeof formData];
    });
    fetchTaxAnalysis(inputs);
  };

  if (loading && !taxData) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8"
      >
        <div className="flex items-center justify-center gap-3">
          <Calculator className="w-6 h-6 text-primary animate-pulse" />
          <p className="text-muted-foreground">Loading tax analysis...</p>
        </div>
      </motion.div>
    );
  }

  if (taxData?.status === 'ERROR') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8"
      >
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-destructive/10">
            <AlertCircle className="w-6 h-6 text-destructive" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Unable to Analyze Tax</h3>
            <p className="text-muted-foreground">{taxData.message}</p>
          </div>
        </div>
      </motion.div>
    );
  }

  if (taxData?.status === 'NEEDS_INPUTS') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-secondary">
              <Calculator className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">AI Tax Advisor</h3>
              <p className="text-sm text-muted-foreground">Get personalized tax-saving recommendations</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="space-y-4 pt-4 border-t border-primary/10">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="employmentType">{taxData.fieldLabels?.employmentType || 'Employment Type'}</Label>
                <select
                  id="employmentType"
                  value={formData.employmentType}
                  onChange={(e) => setFormData({ ...formData, employmentType: e.target.value })}
                  className="w-full h-10 px-3 rounded-md bg-background border border-input text-foreground"
                  required
                >
                  <option value="">Select Type</option>
                  <option value="salaried">Salaried</option>
                  <option value="self-employed">Self-Employed</option>
                </select>
              </div>

              {taxData.requiredFields?.includes('annualRentPaid') && (
                <div className="space-y-2">
                  <Label htmlFor="annualRentPaid">{taxData.fieldLabels?.annualRentPaid}</Label>
                  <Input
                    id="annualRentPaid"
                    type="number"
                    placeholder="0"
                    value={formData.annualRentPaid}
                    onChange={(e) => setFormData({ ...formData, annualRentPaid: e.target.value })}
                  />
                </div>
              )}

              {taxData.requiredFields?.includes('investments80C') && (
                <div className="space-y-2">
                  <Label htmlFor="investments80C">{taxData.fieldLabels?.investments80C}</Label>
                  <Input
                    id="investments80C"
                    type="number"
                    placeholder="0"
                    value={formData.investments80C}
                    onChange={(e) => setFormData({ ...formData, investments80C: e.target.value })}
                  />
                </div>
              )}

              {taxData.requiredFields?.includes('healthInsurance80D') && (
                <div className="space-y-2">
                  <Label htmlFor="healthInsurance80D">{taxData.fieldLabels?.healthInsurance80D}</Label>
                  <Input
                    id="healthInsurance80D"
                    type="number"
                    placeholder="0"
                    value={formData.healthInsurance80D}
                    onChange={(e) => setFormData({ ...formData, healthInsurance80D: e.target.value })}
                  />
                </div>
              )}

              {taxData.requiredFields?.includes('homeLoanInterest') && (
                <div className="space-y-2">
                  <Label htmlFor="homeLoanInterest">{taxData.fieldLabels?.homeLoanInterest}</Label>
                  <Input
                    id="homeLoanInterest"
                    type="number"
                    placeholder="0"
                    value={formData.homeLoanInterest}
                    onChange={(e) => setFormData({ ...formData, homeLoanInterest: e.target.value })}
                  />
                </div>
              )}

              {taxData.requiredFields?.includes('educationLoanInterest') && (
                <div className="space-y-2">
                  <Label htmlFor="educationLoanInterest">{taxData.fieldLabels?.educationLoanInterest}</Label>
                  <Input
                    id="educationLoanInterest"
                    type="number"
                    placeholder="0"
                    value={formData.educationLoanInterest}
                    onChange={(e) => setFormData({ ...formData, educationLoanInterest: e.target.value })}
                  />
                </div>
              )}

              {taxData.requiredFields?.includes('npsContribution') && (
                <div className="space-y-2">
                  <Label htmlFor="npsContribution">{taxData.fieldLabels?.npsContribution}</Label>
                  <Input
                    id="npsContribution"
                    type="number"
                    placeholder="0"
                    value={formData.npsContribution}
                    onChange={(e) => setFormData({ ...formData, npsContribution: e.target.value })}
                  />
                </div>
              )}
            </div>

            <Button type="submit" variant="luxury" className="w-full" disabled={loading}>
              {loading ? 'Analyzing...' : 'Calculate Tax Plan'}
            </Button>
          </form>
        )}
      </motion.div>
    );
  }

  if (taxData?.status === 'READY') {
    return (
      <div className="space-y-6">
        {/* Tax Health Score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 hover:neon-border-cyan transition-all duration-500"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-secondary">
                <Calculator className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Your Tax Health Score</h3>
                <p className="text-sm text-muted-foreground">Based on your financial data</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-gradient-indigo">{taxData.taxHealthScore}</p>
              <p className="text-sm text-muted-foreground">out of 100</p>
            </div>
          </div>

          <div className="relative h-4 bg-muted/30 rounded-full overflow-hidden mb-6">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${taxData.taxHealthScore}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary via-secondary to-accent rounded-full"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="p-4 rounded-xl bg-muted/30">
              <p className="text-sm text-muted-foreground mb-1">Old Regime Tax</p>
              <p className="text-2xl font-bold text-foreground">₹{taxData.oldRegimeTax.toLocaleString()}</p>
            </div>
            <div className="p-4 rounded-xl bg-muted/30">
              <p className="text-sm text-muted-foreground mb-1">New Regime Tax</p>
              <p className="text-2xl font-bold text-foreground">₹{taxData.newRegimeTax.toLocaleString()}</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-accent/10 border border-accent/20">
            <p className="text-sm text-accent mb-1">Recommended: {taxData.optimalRegime === 'old' ? 'Old Regime' : 'New Regime'}</p>
            <p className="text-xl font-bold text-foreground">You'll pay ₹{taxData.currentTax.toLocaleString()}</p>
            {taxData.potentialSavings > 0 && (
              <p className="text-sm text-muted-foreground mt-2">Potential savings: ₹{taxData.potentialSavings.toLocaleString()}</p>
            )}
          </div>
        </motion.div>

        {/* Section Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-8"
        >
          <h3 className="text-lg font-semibold text-foreground mb-6">Tax Deduction Utilization</h3>
          
          <div className="space-y-6">
            {/* 80C */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">Section 80C</span>
                <span className="text-sm text-muted-foreground">
                  ₹{taxData.sectionBreakdown['80C'].used.toLocaleString()} / ₹{taxData.sectionBreakdown['80C'].limit.toLocaleString()}
                </span>
              </div>
              <div className="relative h-3 bg-muted/30 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(taxData.sectionBreakdown['80C'].used / taxData.sectionBreakdown['80C'].limit) * 100}%` }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-secondary rounded-full"
                />
              </div>
              {taxData.sectionBreakdown['80C'].remaining > 0 && (
                <p className="text-xs text-muted-foreground mt-1">₹{taxData.sectionBreakdown['80C'].remaining.toLocaleString()} remaining</p>
              )}
            </div>

            {/* 80D */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">Section 80D</span>
                <span className="text-sm text-muted-foreground">
                  ₹{taxData.sectionBreakdown['80D'].used.toLocaleString()} / ₹{taxData.sectionBreakdown['80D'].limit.toLocaleString()}
                </span>
              </div>
              <div className="relative h-3 bg-muted/30 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(taxData.sectionBreakdown['80D'].used / taxData.sectionBreakdown['80D'].limit) * 100}%` }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-accent to-primary rounded-full"
                />
              </div>
              {taxData.sectionBreakdown['80D'].remaining > 0 && (
                <p className="text-xs text-muted-foreground mt-1">₹{taxData.sectionBreakdown['80D'].remaining.toLocaleString()} remaining</p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Recommended Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-8"
        >
          <h3 className="text-lg font-semibold text-foreground mb-6">Recommended Actions</h3>
          <div className="space-y-3">
            {taxData.recommendedActions.map((action: string, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="flex items-start gap-3 p-4 rounded-xl bg-muted/30"
              >
                <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <p className="text-sm text-foreground leading-relaxed">{action}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Additional Deductions */}
        {(taxData.hraAdvice || taxData.homeLoanAdvice || taxData.eduLoanAdvice) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-8"
          >
            <h3 className="text-lg font-semibold text-foreground mb-6">Additional Deductions</h3>
            <div className="space-y-4">
              {taxData.hraAdvice && (
                <div className="p-4 rounded-xl bg-muted/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-foreground">HRA Exemption</span>
                    <span className="text-accent font-semibold">₹{taxData.hraAdvice.exemption.toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{taxData.hraAdvice.advice}</p>
                </div>
              )}

              {taxData.homeLoanAdvice && (
                <div className="p-4 rounded-xl bg-muted/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-foreground">Home Loan Interest</span>
                    <span className="text-accent font-semibold">₹{taxData.homeLoanAdvice.deduction.toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{taxData.homeLoanAdvice.advice}</p>
                </div>
              )}

              {taxData.eduLoanAdvice && (
                <div className="p-4 rounded-xl bg-muted/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-foreground">Education Loan Interest</span>
                    <span className="text-accent font-semibold">₹{taxData.eduLoanAdvice.deduction.toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{taxData.eduLoanAdvice.advice}</p>
                </div>
              )}

              {taxData.npsAdvice && (
                <div className="p-4 rounded-xl bg-muted/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-foreground">NPS (80CCD1B)</span>
                    <span className="text-accent font-semibold">₹{taxData.npsAdvice.additional80CCD1B.toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{taxData.npsAdvice.advice}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Goal Impact */}
        {taxData.goalImpactInsights && taxData.goalImpactInsights.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-8"
          >
            <h3 className="text-lg font-semibold text-foreground mb-6">How Tax Planning Affects Your Goals</h3>
            <div className="space-y-4">
              {taxData.goalImpactInsights.map((insight: any, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="p-4 rounded-xl bg-muted/30"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-foreground">{insight.goalName}</span>
                    <span className="text-sm text-accent font-semibold">{insight.impact}</span>
                  </div>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>Current monthly: ₹{Math.round(insight.currentMonthly).toLocaleString()}</p>
                    <p>With tax savings: ₹{Math.round(insight.withTaxSavings).toLocaleString()}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Beginner Guide */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-8"
        >
          <h3 className="text-lg font-semibold text-foreground mb-6">Tax Terms Explained</h3>
          <div className="space-y-3">
            {taxData.beginnerGuide.map((guide: string, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.05 }}
                className="flex items-start gap-3"
              >
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <p className="text-sm text-muted-foreground leading-relaxed">{guide}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Simple Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-card p-8 bg-gradient-to-br from-primary/5 to-secondary/5"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-accent to-primary">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Your Tax Plan in Simple Words</h3>
              <p className="text-foreground/90 leading-relaxed">{taxData.childFriendlySummary}</p>
            </div>
          </div>
        </motion.div>

        {/* Refresh Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex justify-center"
        >
          <Button
            variant="outline"
            onClick={() => {
              setTaxData(null);
              setFormData({
                employmentType: '',
                annualRentPaid: '',
                investments80C: '',
                healthInsurance80D: '',
                homeLoanInterest: '',
                educationLoanInterest: '',
                npsContribution: ''
              });
              fetchTaxAnalysis();
            }}
          >
            Update Tax Information
          </Button>
        </motion.div>
      </div>
    );
  }

  return null;
}
