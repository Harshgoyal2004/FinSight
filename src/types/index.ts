export interface Transaction {
  id: string;
  date: string; // ISO string format
  category: string;
  amount: number;
  description: string;
  type: 'income' | 'expense';
}

export interface Budget {
  id: string;
  category: string;
  limit: number;
  spent: number;
  startDate?: string; // ISO string format
  endDate?: string; // ISO string format
}

export interface Investment {
  id:string;
  symbol: string;
  name: string;
  shares: number;
  avgPrice: number;
  currentPrice: number;
  logoUrl?: string;
}

export interface ExpenseDataPoint {
  date: string; // e.g., "Jan", "Feb" or "YYYY-MM-DD"
  category?: string; // For category breakdown
  amount: number;
}

export interface SpendingHabitsSummary {
  summary: string;
}

export interface InvestmentTips {
  investmentTips: string;
  riskAssessment: string;
  recommendationsDisclaimer: string;
}
