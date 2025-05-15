import type { Transaction, Budget, Investment, ExpenseDataPoint } from '@/types';

export const mockTransactions: Transaction[] = [
  { id: '1', date: '2024-07-01', category: 'Groceries', amount: 75.50, description: 'Weekly shopping', type: 'expense' },
  { id: '2', date: '2024-07-02', category: 'Salary', amount: 2500, description: 'Monthly salary', type: 'income' },
  { id: '3', date: '2024-07-03', category: 'Dining Out', amount: 45.00, description: 'Dinner with friends', type: 'expense' },
  { id: '4', date: '2024-07-05', category: 'Utilities', amount: 120.00, description: 'Electricity bill', type: 'expense' },
  { id: '5', date: '2024-07-10', category: 'Transport', amount: 30.00, description: 'Metro card top-up', type: 'expense' },
  { id: '6', date: '2024-07-15', category: 'Entertainment', amount: 60.00, description: 'Movie tickets', type: 'expense' },
  { id: '7', date: '2024-06-01', category: 'Groceries', amount: 80.00, description: 'Monthly shopping', type: 'expense' },
  { id: '8', date: '2024-06-15', category: 'Dining Out', amount: 55.00, description: 'Lunch meeting', type: 'expense' },
];

export const mockBudgets: Budget[] = [
  { id: '1', category: 'Groceries', limit: 300, spent: 150.50 },
  { id: '2', category: 'Dining Out', limit: 150, spent: 100.00 },
  { id: '3', category: 'Entertainment', limit: 100, spent: 60.00 },
  { id: '4', category: 'Transport', limit: 80, spent: 95.00 }, // Exceeded
];

export const mockInvestments: Investment[] = [
  { id: '1', symbol: 'AAPL', name: 'Apple Inc.', shares: 10, avgPrice: 150.00, currentPrice: 175.20, logoUrl: 'https://placehold.co/32x32.png' },
  { id: '2', symbol: 'MSFT', name: 'Microsoft Corp.', shares: 5, avgPrice: 300.00, currentPrice: 330.50, logoUrl: 'https://placehold.co/32x32.png' },
  { id: '3', symbol: 'GOOGL', name: 'Alphabet Inc.', shares: 2, avgPrice: 2500.00, currentPrice: 2550.75, logoUrl: 'https://placehold.co/32x32.png' },
  { id: '4', symbol: 'TSLA', name: 'Tesla Inc.', shares: 8, avgPrice: 200.00, currentPrice: 180.00, logoUrl: 'https://placehold.co/32x32.png' },
];

export const mockCategoryExpenseData: ExpenseDataPoint[] = [
  { category: 'Groceries', amount: 150.50 },
  { category: 'Dining Out', amount: 100.00 },
  { category: 'Utilities', amount: 120.00 },
  { category: 'Transport', amount: 95.00 },
  { category: 'Entertainment', amount: 60.00 },
  { category: 'Other', amount: 40.00 },
];

export const mockSpendingTrendData: ExpenseDataPoint[] = [
  { date: 'Jan', amount: 450 },
  { date: 'Feb', amount: 400 },
  { date: 'Mar', amount: 520 },
  { date: 'Apr', amount: 480 },
  { date: 'May', amount: 550 },
  { date: 'Jun', amount: 500 },
  { date: 'Jul', amount: 565.50 },
];

export const mockPortfolioSummary = JSON.stringify(mockInvestments.map(inv => ({ symbol: inv.symbol, shares: inv.shares, value: inv.shares * inv.currentPrice })));
export const mockFinancialGoals = "Looking for long-term growth, moderate risk tolerance. Planning for retirement in 20 years and a down payment on a house in 5 years.";
export const mockSpendingHabitsForAI = JSON.stringify(
  mockTransactions
    .filter(t => t.type === 'expense')
    .map(t => ({ category: t.category, amount: t.amount, date: t.date }))
);

export const mockMonthlySpendingDataForAI = JSON.stringify(
  mockTransactions
    .filter(t => t.type === 'expense' && new Date(t.date).getMonth() === new Date().getMonth() -1 ) // Previous month's data
    .map(t => ({ category: t.category, amount: t.amount, date: t.date, description: t.description }))
);

// If no transactions for previous month, use current month for demo
export const getDemoMonthlySpendingData = () => {
  const prevMonthData = mockTransactions
    .filter(t => t.type === 'expense' && new Date(t.date).getMonth() === new Date().getMonth() -1 && new Date(t.date).getFullYear() === new Date().getFullYear());
  
  if (prevMonthData.length > 0) {
    return JSON.stringify(prevMonthData.map(t => ({ category: t.category, amount: t.amount, date: t.date, description: t.description })));
  }
  // Fallback to current month's data if previous month is empty, for demo purposes
  return JSON.stringify(
    mockTransactions
      .filter(t => t.type === 'expense')
      .map(t => ({ category: t.category, amount: t.amount, date: t.date, description: t.description }))
  );
}
