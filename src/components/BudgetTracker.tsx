import React, { useState } from 'react';
import { 
  DollarSign, 
  CreditCard, 
  Calendar, 
  Plus, 
  CheckCircle2, 
  AlertCircle, 
  PieChart, 
  Tag, 
  TrendingUp, 
  Clock 
} from 'lucide-react';
import { Expense, ExpenseCategory, UserRole } from '../types/wedding';
import { calculateBudgetMetrics, getUpcomingDues } from '../utils/budget';
import { SupportedCurrency, formatGlobalCurrency, CURRENCIES } from '../utils/globalization';

interface BudgetTrackerProps {
  expenses: Expense[];
  totalBudget: number;
  userRole: UserRole;
  currency?: SupportedCurrency;
  onUpdateTotalBudget: (newBudget: number) => void;
  onAddExpense: (expense: Expense) => void;
  onToggleExpensePaid: (expenseId: string) => void;
}

export const BudgetTracker: React.FC<BudgetTrackerProps> = ({
  expenses,
  totalBudget,
  userRole,
  currency = 'EUR',
  onUpdateTotalBudget,
  onAddExpense,
  onToggleExpensePaid,
}) => {
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [budgetValue, setBudgetValue] = useState(totalBudget.toString());
  const fmt = (amt: number) => formatGlobalCurrency(amt, currency);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');

  // New Expense form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('Venue');
  const [vendorName, setVendorName] = useState('');
  const [actualCost, setActualCost] = useState('');
  const [paidAmount, setPaidAmount] = useState('');
  const [dueDate, setDueDate] = useState('2027-08-01');

  const metrics = calculateBudgetMetrics(totalBudget, expenses);
  const upcomingDues = getUpcomingDues(expenses);

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

  const handleBudgetSave = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(budgetValue);
    if (!isNaN(val) && val > 0) {
      onUpdateTotalBudget(val);
      setIsEditingBudget(false);
    }
  };

  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const cost = parseFloat(actualCost);
    const paid = parseFloat(paidAmount || '0');
    if (!title.trim() || isNaN(cost) || cost <= 0) return;

    const newExp: Expense = {
      id: `e-${Date.now()}`,
      title: title.trim(),
      category,
      vendorName: vendorName.trim() || 'Tuscan Vendor',
      estimatedCost: cost,
      actualCost: cost,
      paidAmount: isNaN(paid) ? 0 : paid,
      dueDate,
      isPaid: paid >= cost,
    };

    onAddExpense(newExp);
    setTitle('');
    setVendorName('');
    setActualCost('');
    setPaidAmount('');
    setIsAddExpenseOpen(false);
  };

  const filteredExpenses = expenses.filter(
    (e) => selectedCategoryFilter === 'All' || e.category === selectedCategoryFilter
  );

  return (
    <section className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-stone-200">
        <div>
          <span className="text-xs uppercase tracking-widest text-rose-800 font-semibold font-mono">
            Financial Management
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif text-stone-900 mt-1">
            The Budget Tracker
          </h2>
          <p className="text-sm text-stone-600 mt-1">
            Real-time expenditure tracking, category allocations, and upcoming vendor due dates.
          </p>
        </div>

        {userRole === 'Couple' && (
          <button
            onClick={() => setIsAddExpenseOpen(true)}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-xl transition-all shadow-sm active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Expense</span>
          </button>
        )}
      </div>

      {/* Primary KPI Budget Overview Banner */}
      <div className="bg-gradient-to-br from-stone-900 via-stone-800 to-stone-950 text-white rounded-3xl p-6 sm:p-7 shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-rose-300 font-medium">
                Total Budget Capacity
              </span>
              {userRole === 'Couple' && !isEditingBudget && (
                <button
                  onClick={() => setIsEditingBudget(true)}
                  className="text-[11px] underline text-stone-400 hover:text-white"
                >
                  Adjust Budget
                </button>
              )}
            </div>

            {isEditingBudget ? (
              <form onSubmit={handleBudgetSave} className="flex items-center gap-2 mt-1">
                <div className="relative">
                  <DollarSign className="w-4 h-4 absolute left-2.5 top-2.5 text-stone-400" />
                  <input
                    type="number"
                    value={budgetValue}
                    onChange={(e) => setBudgetValue(e.target.value)}
                    className="w-40 pl-7 pr-2 py-1.5 text-lg font-serif bg-stone-800 border border-stone-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-rose-400"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 rounded-xl text-xs font-medium"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingBudget(false)}
                  className="px-2 text-xs text-stone-400 hover:text-white"
                >
                  Cancel
                </button>
              </form>
            ) : (
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-serif text-white tabular-nums">
                  {fmt(metrics.totalBudget)}
                </span>
                <span className="text-xs text-stone-400 font-mono">
                  Target Fund ({currency})
                </span>
              </div>
            )}

            <div className="flex items-center gap-4 text-xs text-stone-300 pt-1">
              <span>Spent: <strong className="text-white">{fmt(metrics.totalActual)}</strong></span>
              <span>·</span>
              <span>Paid Out: <strong className="text-emerald-400">{fmt(metrics.totalPaid)}</strong></span>
              <span>·</span>
              <span>Remaining: <strong className="text-rose-300">{fmt(metrics.totalRemainingBalance)}</strong></span>
            </div>
          </div>

          {/* Quick Progress Ring or Bar */}
          <div className="md:w-64 space-y-2 bg-white/5 backdrop-blur-xs p-4 rounded-2xl border border-white/10">
            <div className="flex items-center justify-between text-xs">
              <span className="text-stone-300">Committed / Budgeted</span>
              <span className="font-mono font-semibold text-rose-300 tabular-nums">
                {metrics.percentageUsed}%
              </span>
            </div>
            <div className="h-2 w-full bg-stone-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(metrics.percentageUsed, 100)}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-stone-400">
              <span>Paid: {metrics.percentagePaid}%</span>
              <span>Dues Left: {fmt(metrics.totalUpcomingDues)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Vendor Dues Timeline */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-rose-600" />
            <h3 className="text-base font-serif text-stone-900">
              Upcoming Vendor Payment Milestones
            </h3>
          </div>
          <span className="text-xs font-mono text-stone-500">
            {upcomingDues.length} pending milestone{upcomingDues.length === 1 ? '' : 's'}
          </span>
        </div>

        {upcomingDues.length === 0 ? (
          <p className="text-xs text-stone-500 py-3 text-center">
            All vendor installments are fully settled! 🎉
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {upcomingDues.map((due) => (
              <div
                key={due.id}
                className="p-3.5 rounded-2xl border border-stone-200/90 bg-stone-50/50 hover:bg-stone-50 transition-colors flex flex-col justify-between space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-mono text-stone-500 block">
                      {due.category}
                    </span>
                    <h4 className="text-xs font-semibold text-stone-900 mt-0.5 leading-snug">
                      {due.title}
                    </h4>
                    <p className="text-[11px] text-stone-600">
                      {due.vendorName}
                    </p>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-semibold whitespace-nowrap ${
                      due.status === 'Overdue'
                        ? 'bg-rose-100 text-rose-700'
                        : due.status === 'Due Soon'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-stone-200 text-stone-700'
                    }`}
                  >
                    {due.status}
                  </span>
                </div>

                <div className="flex items-baseline justify-between pt-2 border-t border-stone-200/60 text-xs">
                  <span className="text-stone-500 flex items-center gap-1 text-[11px]">
                    <Calendar className="w-3 h-3 text-stone-400" />
                    Due {due.dueDate}
                  </span>
                  <span className="font-serif font-bold text-stone-900 tabular-nums">
                    {fmt(due.amountDue)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Category Allocation Grid */}
      <div className="space-y-3">
        <h3 className="text-base font-serif text-stone-900">
          Budget Category Allocations
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {categories.map((cat) => {
            const data = metrics.categoryBreakdowns[cat];
            return (
              <div
                key={cat}
                onClick={() => setSelectedCategoryFilter(selectedCategoryFilter === cat ? 'All' : cat)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  selectedCategoryFilter === cat
                    ? 'border-rose-600 bg-rose-50/50 shadow-xs ring-1 ring-rose-600'
                    : 'border-stone-200 bg-white hover:border-stone-300'
                }`}
              >
                <div className="flex items-center justify-between text-xs text-stone-500">
                  <span className="font-medium truncate">{cat}</span>
                  <span className="font-mono text-[11px]">{data.percentageOfTotal}%</span>
                </div>
                <p className="text-lg font-serif text-stone-900 mt-1 tabular-nums">
                  {fmt(data.actual)}
                </p>
                <div className="flex items-center justify-between text-[11px] text-stone-400 mt-1">
                  <span>Paid: {fmt(data.paid)}</span>
                  <span>{data.itemCount} items</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Expenses Breakdown List */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-serif text-stone-900">
              Itemized Expenses ({filteredExpenses.length})
            </h3>
            {selectedCategoryFilter !== 'All' && (
              <span className="text-xs text-stone-500">
                Filtered by: {selectedCategoryFilter} ·{' '}
                <button
                  onClick={() => setSelectedCategoryFilter('All')}
                  className="text-rose-700 underline"
                >
                  Clear filter
                </button>
              </span>
            )}
          </div>
        </div>

        <div className="divide-y divide-stone-100">
          {filteredExpenses.map((expense) => (
            <div
              key={expense.id}
              className="p-4 hover:bg-stone-50/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-stone-900 text-sm">
                    {expense.title}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 text-[10px] font-mono">
                    {expense.category}
                  </span>
                </div>
                <p className="text-stone-500 text-[11px]">
                  Vendor: {expense.vendorName} · Due Date: {expense.dueDate}
                </p>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-5">
                <div className="text-right">
                  <p className="font-serif font-bold text-stone-900 text-sm tabular-nums">
                    {fmt(expense.actualCost)}
                  </p>
                  <p className="text-[11px] text-stone-500">
                    Paid: {fmt(expense.paidAmount)} (
                    {Math.round((expense.paidAmount / expense.actualCost) * 100)}%)
                  </p>
                </div>

                {userRole === 'Couple' && (
                  <button
                    onClick={() => onToggleExpensePaid(expense.id)}
                    className={`px-3 py-1.5 rounded-xl font-medium text-xs flex items-center gap-1.5 transition-colors ${
                      expense.isPaid
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                    }`}
                  >
                    <CheckCircle2
                      className={`w-3.5 h-3.5 ${
                        expense.isPaid ? 'text-emerald-600' : 'text-stone-400'
                      }`}
                    />
                    <span>{expense.isPaid ? 'Settled' : 'Mark Paid'}</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Expense Modal */}
      {isAddExpenseOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <h3 className="text-lg font-serif text-stone-900">Add Wedding Expense</h3>
              <button
                onClick={() => setIsAddExpenseOpen(false)}
                className="text-stone-400 hover:text-stone-600 text-sm font-medium"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleCreateExpense} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Expense Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Wedding Cake & Dessert Table"
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                    className="w-full px-3 py-2 text-sm border border-stone-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Vendor Name
                  </label>
                  <input
                    type="text"
                    value={vendorName}
                    onChange={(e) => setVendorName(e.target.value)}
                    placeholder="e.g. Dolce Siena Pasticceria"
                    className="w-full px-3 py-2 text-sm border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Total Cost ($) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={actualCost}
                    onChange={(e) => setActualCost(e.target.value)}
                    placeholder="2400"
                    className="w-full px-3 py-2 text-sm border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Amount Paid ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={paidAmount}
                    onChange={(e) => setPaidAmount(e.target.value)}
                    placeholder="1200"
                    className="w-full px-3 py-2 text-sm border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Milestone Due Date
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddExpenseOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-sm"
                >
                  Add Expense Line
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
