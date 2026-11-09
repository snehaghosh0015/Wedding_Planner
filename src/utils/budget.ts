import { Expense, ExpenseCategory } from '../types/wedding';

export interface BudgetMetrics {
  totalBudget: number;
  totalEstimated: number;
  totalActual: number;
  totalPaid: number;
  totalRemainingBalance: number;
  totalUpcomingDues: number;
  percentageUsed: number;
  percentagePaid: number;
  categoryBreakdowns: Record<ExpenseCategory, {
    estimated: number;
    actual: number;
    paid: number;
    itemCount: number;
    percentageOfTotal: number;
  }>;
}

export interface UpcomingDueItem {
  id: string;
  title: string;
  vendorName: string;
  category: ExpenseCategory;
  dueDate: string;
  amountDue: number;
  status: 'Overdue' | 'Due Soon' | 'Upcoming';
}

export function calculateBudgetMetrics(totalBudget: number, expenses: Expense[]): BudgetMetrics {
  const safeBudget = Math.max(totalBudget, 1);
  let totalEstimated = 0;
  let totalActual = 0;
  let totalPaid = 0;
  let totalUpcomingDues = 0;

  const categories: ExpenseCategory[] = [
    'Venue',
    'Catering',
    'Outfits',
    'Photography',
    'Flowers & Decor',
    'Entertainment',
    'Stationery',
    'Favors & Gifts',
  ];

  const categoryBreakdowns: Record<ExpenseCategory, {
    estimated: number;
    actual: number;
    paid: number;
    itemCount: number;
    percentageOfTotal: number;
  }> = {} as any;

  for (const cat of categories) {
    categoryBreakdowns[cat] = {
      estimated: 0,
      actual: 0,
      paid: 0,
      itemCount: 0,
      percentageOfTotal: 0,
    };
  }

  for (const item of expenses) {
    totalEstimated += item.estimatedCost;
    totalActual += item.actualCost;
    totalPaid += item.paidAmount;

    const remainingOnItem = Math.max(0, item.actualCost - item.paidAmount);
    if (!item.isPaid && remainingOnItem > 0) {
      totalUpcomingDues += remainingOnItem;
    }

    if (categoryBreakdowns[item.category]) {
      categoryBreakdowns[item.category].estimated += item.estimatedCost;
      categoryBreakdowns[item.category].actual += item.actualCost;
      categoryBreakdowns[item.category].paid += item.paidAmount;
      categoryBreakdowns[item.category].itemCount += 1;
    }
  }

  for (const cat of categories) {
    categoryBreakdowns[cat].percentageOfTotal = Math.round(
      (categoryBreakdowns[cat].actual / safeBudget) * 100
    );
  }

  const totalRemainingBalance = Math.max(0, safeBudget - totalActual);
  const percentageUsed = Math.min(100, Math.round((totalActual / safeBudget) * 100));
  const percentagePaid = Math.min(100, Math.round((totalPaid / safeBudget) * 100));

  return {
    totalBudget,
    totalEstimated,
    totalActual,
    totalPaid,
    totalRemainingBalance,
    totalUpcomingDues,
    percentageUsed,
    percentagePaid,
    categoryBreakdowns,
  };
}

export function getUpcomingDues(expenses: Expense[], referenceDate: Date = new Date()): UpcomingDueItem[] {
  const unpaidItems = expenses.filter(e => !e.isPaid && (e.actualCost - e.paidAmount) > 0);
  const nowMs = referenceDate.getTime();
  const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;

  return unpaidItems
    .map(item => {
      const dueMs = new Date(item.dueDate).getTime();
      const amountDue = item.actualCost - item.paidAmount;
      let status: 'Overdue' | 'Due Soon' | 'Upcoming' = 'Upcoming';

      if (dueMs < nowMs) {
        status = 'Overdue';
      } else if (dueMs - nowMs <= sevenDaysMs) {
        status = 'Due Soon';
      }

      return {
        id: item.id,
        title: item.title,
        vendorName: item.vendorName,
        category: item.category,
        dueDate: item.dueDate,
        amountDue,
        status,
      };
    })
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
}
