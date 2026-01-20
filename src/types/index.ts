// types/index.ts

/**
 * 🔥 CORE DATA MODELS (Database schemas)
 */
export interface Transaction {
  id: string;
  amount: number;
  category: string;
  expenseDate: string;
  description?: string;
  userID: string;
  merchant?: string;
  createdAt?: string;
}

export interface FixedCost {
  id: string;
  name: string;
  cost: number;
  userID: string;
}

export interface UserProfile {
  email: string;
  name?: string;
  currency: string;
  budgetMonthly: number;
  timezone: string;
}

/**
 * 🎨 UI STATE MODELS (Modal + Forms)
 */
export interface ManualEntry {
  date: string;
  desc: string;
  amount: string;
  cat: string;
}

export interface ReviewTransaction {
  id: number;
  date: string;
  desc: string;
  amount: number;
  cat: string;
  approved: boolean;
}

/**
 * 🧭 APP STATE (Routing + Views)
 */
export type View = 'landing' | 'signup' | 'login' | 'dashboard';
export type Tab = 'analysis' | 'forecast' | 'expenses' | 'settings';


/**
 * 📊 CHART DATA (useChartData hook output)
 */
export interface ChartData {
  category: {
    labels: string[];
    values: number[];
    total: number;
  };
  line: {
    labels: string[];
    inflow: number[];
    outflow: number[];
  };
  budget: {
    current: number;
    limit: number;
    percentage: number;
  };
  netLiquidity: number;
  heatmap: HeatmapDay[];
}

/**
 * 🌡️ HEATMAP DATA
 */
export interface HeatmapDay {
  value: number;
  date: string;
}

/**
 * 🖼️ COMPONENT PROPS (Reusable UI)
 */
export interface StatCardProps {
  label: string;
  value: string | number;
  trend: string;
  isPositive: boolean;
}

export interface BudgetGaugeProps {
  current: number;
  limit: number;
}

export interface IncomeVsExpenseProps {
  lineData: {
    labels: string[];
    inflow: number[];
    outflow: number[];
  };
}

export interface CategoryDonutProps {
  categoryData: {
    labels: string[];
    values: number[];
    total: number;
  };
}
