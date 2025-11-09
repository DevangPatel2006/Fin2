import Transaction from "../models/transactionModel.js";
import Goal from "../models/goalModel.js";

const OLD_REGIME_SLABS = [
  { min: 0, max: 250000, rate: 0 },
  { min: 250000, max: 500000, rate: 0.05 },
  { min: 500000, max: 1000000, rate: 0.2 },
  { min: 1000000, max: Infinity, rate: 0.3 }
];

const NEW_REGIME_SLABS = [
  { min: 0, max: 300000, rate: 0 },
  { min: 300000, max: 600000, rate: 0.05 },
  { min: 600000, max: 900000, rate: 0.1 },
  { min: 900000, max: 1200000, rate: 0.15 },
  { min: 1200000, max: 1500000, rate: 0.2 },
  { min: 1500000, max: Infinity, rate: 0.3 }
];

function calculateTax(income, slabs) {
  let tax = 0;
  for (const slab of slabs) {
    if (income > slab.min) {
      const taxableInSlab = Math.min(income, slab.max) - slab.min;
      tax += taxableInSlab * slab.rate;
    }
  }
  return tax * 1.04;
}

export const analyzeTaxSavings = async (req, res) => {
  try {
    const userId = req.user._id;
    const taxInputs = req.body;

    const requiredFields = [
      'employmentType',
      'annualRentPaid',
      'investments80C',
      'healthInsurance80D',
      'homeLoanInterest',
      'educationLoanInterest',
      'npsContribution'
    ];

    const missingFields = requiredFields.filter(field => 
      taxInputs[field] === undefined || taxInputs[field] === null || taxInputs[field] === ''
    );

    if (missingFields.length > 0) {
      return res.json({
        status: "NEEDS_INPUTS",
        requiredFields: missingFields,
        fieldLabels: {
          employmentType: "Employment Type",
          annualRentPaid: "Annual Rent Paid (₹)",
          investments80C: "80C Investments (PPF, ELSS, etc.) (₹)",
          healthInsurance80D: "Health Insurance Premium (₹)",
          homeLoanInterest: "Home Loan Interest Paid (₹)",
          educationLoanInterest: "Education Loan Interest (₹)",
          npsContribution: "NPS Contribution (₹)"
        }
      });
    }

    const transactions = await Transaction.find({ userId });
    const goals = await Goal.find({ userId });

    const annualIncome = transactions
      .filter(t => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const annualExpense = transactions
      .filter(t => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    if (annualIncome === 0) {
      return res.json({
        status: "ERROR",
        message: "No income data found. Please add income transactions first."
      });
    }

    const {
      employmentType,
      annualRentPaid,
      investments80C,
      healthInsurance80D,
      homeLoanInterest,
      educationLoanInterest,
      npsContribution
    } = taxInputs;

    // Section 80C calculations
    const limit80C = 150000;
    const used80C = Math.min(Number(investments80C) || 0, limit80C);
    const remaining80C = limit80C - used80C;

    // Section 80D calculations
    const limit80D = 25000;
    const used80D = Math.min(Number(healthInsurance80D) || 0, limit80D);
    const remaining80D = limit80D - used80D;

    // HRA calculation (only for salaried)
    let hraExemption = 0;
    let hraAdvice = null;
    if (employmentType === 'salaried' && annualRentPaid > 0) {
      const basicSalary = annualIncome * 0.5;
      const rentPaid = Number(annualRentPaid);
      const tenPercentBasic = basicSalary * 0.1;
      const rentMinusTenPercent = rentPaid - tenPercentBasic;
      const fortyPercentBasic = basicSalary * 0.4;
      hraExemption = Math.max(0, Math.min(rentMinusTenPercent, fortyPercentBasic));
      
      hraAdvice = {
        exemption: Math.round(hraExemption),
        rentPaid: rentPaid,
        canClaim: hraExemption > 0,
        advice: hraExemption > 0 
          ? `You can claim ₹${Math.round(hraExemption).toLocaleString()} as HRA exemption.`
          : "Your rent is too low to claim HRA exemption effectively."
      };
    }

    // Home loan advice
    const homeLoanInt = Number(homeLoanInterest) || 0;
    const homeLoanAdvice = homeLoanInt > 0 ? {
      deduction: Math.min(homeLoanInt, 200000),
      limit: 200000,
      advice: homeLoanInt > 200000 
        ? `You can deduct ₹2,00,000 (maximum limit) from ₹${homeLoanInt.toLocaleString()} paid.`
        : `You can deduct the full ₹${homeLoanInt.toLocaleString()} as home loan interest.`
    } : null;

    // Education loan advice
    const eduLoanInt = Number(educationLoanInterest) || 0;
    const eduLoanAdvice = eduLoanInt > 0 ? {
      deduction: eduLoanInt,
      advice: `Full education loan interest of ₹${eduLoanInt.toLocaleString()} is deductible (no limit).`
    } : null;

    // NPS advice
    const nps = Number(npsContribution) || 0;
    const npsAdvice = {
      current: nps,
      additional80CCD1B: Math.min(nps, 50000),
      canIncrease: nps < 50000,
      advice: nps < 50000 
        ? `Invest ₹${(50000 - nps).toLocaleString()} more in NPS for additional 80CCD(1B) benefit.`
        : "You've maxed out NPS 80CCD(1B) benefit."
    };

    // Old regime taxable income
    const oldRegimeDeductions = used80C + used80D + (homeLoanInt > 0 ? Math.min(homeLoanInt, 200000) : 0) + eduLoanInt + hraExemption;
    const oldRegimeTaxableIncome = Math.max(0, annualIncome - oldRegimeDeductions - Math.min(nps, 50000));
    const oldRegimeTax = calculateTax(oldRegimeTaxableIncome, OLD_REGIME_SLABS);

    // New regime taxable income (no deductions except standard deduction)
    const newRegimeTaxableIncome = annualIncome;
    const newRegimeTax = calculateTax(newRegimeTaxableIncome, NEW_REGIME_SLABS);

    const optimalRegime = oldRegimeTax < newRegimeTax ? "old" : "new";
    const currentTax = Math.min(oldRegimeTax, newRegimeTax);
    const optimalTax = currentTax;
    const potentialSavings = Math.abs(oldRegimeTax - newRegimeTax);

    // Tax health score
    let taxHealthScore = 50;
    if (used80C > 100000) taxHealthScore += 15;
    else if (used80C > 50000) taxHealthScore += 10;
    else if (used80C > 0) taxHealthScore += 5;

    if (used80D > 15000) taxHealthScore += 10;
    else if (used80D > 0) taxHealthScore += 5;

    if (nps >= 50000) taxHealthScore += 15;
    else if (nps > 0) taxHealthScore += 8;

    if (hraExemption > 0) taxHealthScore += 10;
    if (homeLoanInt > 0) taxHealthScore += 5;
    if (eduLoanInt > 0) taxHealthScore += 5;

    taxHealthScore = Math.min(100, taxHealthScore);

    // Goal impact insights
    const goalImpactInsights = goals.length > 0 ? goals.map(g => {
      const monthlyTaxSavings = potentialSavings / 12;
      const monthsToGoal = g.monthlyContribution > 0 
        ? Math.ceil((g.target - g.current) / g.monthlyContribution)
        : 0;
      const monthsWithSavings = g.monthlyContribution + monthlyTaxSavings > 0
        ? Math.ceil((g.target - g.current) / (g.monthlyContribution + monthlyTaxSavings))
        : 0;
      const timeSaved = monthsToGoal - monthsWithSavings;

      return {
        goalName: g.name,
        currentMonthly: g.monthlyContribution,
        withTaxSavings: g.monthlyContribution + monthlyTaxSavings,
        timeSaved: Math.max(0, timeSaved),
        impact: timeSaved > 0 
          ? `Reach ${timeSaved} months earlier!`
          : "Optimize tax planning to accelerate this goal."
      };
    }) : [];

    // Recommended actions
    const recommendedActions = [];
    if (remaining80C > 0) {
      recommendedActions.push(`Invest ₹${remaining80C.toLocaleString()} more in 80C options (PPF, ELSS, Tax-saver FD) to save ₹${Math.round(remaining80C * 0.3).toLocaleString()} in tax.`);
    }
    if (remaining80D > 0) {
      recommendedActions.push(`Increase health insurance coverage by ₹${remaining80D.toLocaleString()} to utilize full 80D benefit.`);
    }
    if (nps < 50000) {
      recommendedActions.push(`Add ₹${(50000 - nps).toLocaleString()} to NPS for extra 80CCD(1B) deduction.`);
    }
    if (employmentType === 'salaried' && !annualRentPaid) {
      recommendedActions.push("Provide rent details to check HRA exemption eligibility.");
    }
    if (optimalRegime === "new") {
      recommendedActions.push("New tax regime is better for you. Skip deductions and pay lower tax.");
    } else {
      recommendedActions.push("Old tax regime with deductions saves you more. Keep investing in 80C, 80D.");
    }

    // Beginner guide
    const beginnerGuide = [
      "80C: Investments up to ₹1.5L in PPF, ELSS, Tax-saver FD, etc. reduce your taxable income.",
      "80D: Health insurance premiums up to ₹25K are tax-deductible.",
      "HRA: House rent paid can reduce your tax if you're salaried.",
      "Home Loan: Interest up to ₹2L is deductible under old regime.",
      "NPS: Extra ₹50K deduction under 80CCD(1B) over and above 80C."
    ];

    // Child-friendly summary
    const childFriendlySummary = `You earn ₹${annualIncome.toLocaleString()} per year. ${optimalRegime === "old" 
      ? `Using smart investments (80C, 80D, NPS), you can reduce your tax to ₹${Math.round(currentTax).toLocaleString()}. Without these, you'd pay ₹${Math.round(newRegimeTax).toLocaleString()}.`
      : `The new tax system is simpler and better for you - pay ₹${Math.round(currentTax).toLocaleString()} without worrying about deductions.`} Your tax health score is ${taxHealthScore}/100. ${recommendedActions[0] || "You're doing great!"}`;

    res.json({
      status: "READY",
      taxHealthScore,
      currentTax: Math.round(currentTax),
      optimalTax: Math.round(optimalTax),
      potentialSavings: Math.round(potentialSavings),
      optimalRegime,
      oldRegimeTax: Math.round(oldRegimeTax),
      newRegimeTax: Math.round(newRegimeTax),
      sectionBreakdown: {
        "80C": { used: used80C, limit: limit80C, remaining: remaining80C },
        "80D": { used: used80D, limit: limit80D, remaining: remaining80D }
      },
      hraAdvice,
      homeLoanAdvice,
      eduLoanAdvice,
      npsAdvice,
      goalImpactInsights,
      recommendedActions,
      beginnerGuide,
      childFriendlySummary
    });

  } catch (err) {
    console.error("Tax analysis error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};