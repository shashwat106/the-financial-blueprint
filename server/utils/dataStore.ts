import fs from "fs";
import path from "path";

// Data directory
const DATA_DIR = path.join(process.cwd(), "data");

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// File paths
const USERS_FILE = path.join(DATA_DIR, "users.json");
const EXPENSES_FILE = path.join(DATA_DIR, "expenses.json");
const BUDGETS_FILE = path.join(DATA_DIR, "budgets.json");
const SAVINGS_GOALS_FILE = path.join(DATA_DIR, "savingsGoals.json");
const ACHIEVEMENTS_FILE = path.join(DATA_DIR, "achievements.json");

// Interfaces
export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  createdAt: string;
}

export interface Expense {
  id: string;
  userId: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  createdAt: string;
}

export interface Budget {
  id: string;
  userId: string;
  category: string;
  limit: number;
  spent: number;
  period: "monthly" | "weekly" | "yearly";
  createdAt: string;
}

export interface SavingsGoal {
  id: string;
  userId: string;
  name: string;
  description?: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: string;
  priority: "low" | "medium" | "high";
  createdAt: string;
  updatedAt: string;
}

export interface Achievement {
  id: string;
  userId: string;
  achievementType: string;
  title: string;
  description: string;
  icon: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  unlockedAt: string;
  progress?: number;
  maxProgress?: number;
}

export interface UserStats {
  userId: string;
  totalExpenses: number;
  totalSavings: number;
  goalsCompleted: number;
  budgetsCreated: number;
  consecutiveDaysTracking: number;
  lastActivityDate: string;
  joinedDate: string;
}

// Helper functions
function readJsonFile<T>(filePath: string, defaultValue: T[]): T[] {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, "utf8");
      return JSON.parse(data);
    }
    return defaultValue;
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return defaultValue;
  }
}

function writeJsonFile<T>(filePath: string, data: T[]): void {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error);
  }
}

// User operations
export function getUsers(): User[] {
  return readJsonFile<User>(USERS_FILE, []);
}

export function saveUser(user: User): void {
  const users = getUsers();
  users.push(user);
  writeJsonFile(USERS_FILE, users);
}

export function findUserByEmail(email: string): User | null {
  const users = getUsers();
  return users.find(user => user.email === email) || null;
}

export function findUserById(id: string): User | null {
  const users = getUsers();
  return users.find(user => user.id === id) || null;
}

// Expense operations
export function getExpenses(): Expense[] {
  return readJsonFile<Expense>(EXPENSES_FILE, []);
}

export function getUserExpenses(userId: string): Expense[] {
  const expenses = getExpenses();
  return expenses.filter(expense => expense.userId === userId);
}

export function saveExpense(expense: Expense): void {
  const expenses = getExpenses();
  expenses.push(expense);
  writeJsonFile(EXPENSES_FILE, expenses);
}

export function updateExpense(expenseId: string, updates: Partial<Expense>): void {
  const expenses = getExpenses();
  const index = expenses.findIndex(expense => expense.id === expenseId);
  if (index !== -1) {
    expenses[index] = { ...expenses[index], ...updates };
    writeJsonFile(EXPENSES_FILE, expenses);
  }
}

export function deleteExpense(expenseId: string): void {
  const expenses = getExpenses();
  const filtered = expenses.filter(expense => expense.id !== expenseId);
  writeJsonFile(EXPENSES_FILE, filtered);
}

// Budget operations
export function getBudgets(): Budget[] {
  return readJsonFile<Budget>(BUDGETS_FILE, []);
}

export function getUserBudgets(userId: string): Budget[] {
  const budgets = getBudgets();
  return budgets.filter(budget => budget.userId === userId);
}

export function saveBudget(budget: Budget): void {
  const budgets = getBudgets();
  budgets.push(budget);
  writeJsonFile(BUDGETS_FILE, budgets);
}

export function updateBudget(budgetId: string, updates: Partial<Budget>): void {
  const budgets = getBudgets();
  const index = budgets.findIndex(budget => budget.id === budgetId);
  if (index !== -1) {
    budgets[index] = { ...budgets[index], ...updates };
    writeJsonFile(BUDGETS_FILE, budgets);
  }
}

export function deleteBudget(budgetId: string): void {
  const budgets = getBudgets();
  const filtered = budgets.filter(budget => budget.id !== budgetId);
  writeJsonFile(BUDGETS_FILE, filtered);
}

// Savings Goals operations
export function getSavingsGoals(): SavingsGoal[] {
  return readJsonFile<SavingsGoal>(SAVINGS_GOALS_FILE, []);
}

export function getUserSavingsGoals(userId: string): SavingsGoal[] {
  const goals = getSavingsGoals();
  return goals.filter(goal => goal.userId === userId);
}

export function saveSavingsGoal(goal: SavingsGoal): void {
  const goals = getSavingsGoals();
  goals.push(goal);
  writeJsonFile(SAVINGS_GOALS_FILE, goals);
}

export function updateSavingsGoal(goalId: string, updates: Partial<SavingsGoal>): void {
  const goals = getSavingsGoals();
  const index = goals.findIndex(goal => goal.id === goalId);
  if (index !== -1) {
    goals[index] = { ...goals[index], ...updates, updatedAt: new Date().toISOString() };
    writeJsonFile(SAVINGS_GOALS_FILE, goals);
  }
}

export function deleteSavingsGoal(goalId: string): void {
  const goals = getSavingsGoals();
  const filtered = goals.filter(goal => goal.id !== goalId);
  writeJsonFile(SAVINGS_GOALS_FILE, filtered);
}

// Achievement operations
export function getAchievements(): Achievement[] {
  return readJsonFile<Achievement>(ACHIEVEMENTS_FILE, []);
}

export function getUserAchievements(userId: string): Achievement[] {
  const achievements = getAchievements();
  return achievements.filter(achievement => achievement.userId === userId);
}

export function saveAchievement(achievement: Achievement): void {
  const achievements = getAchievements();
  achievements.push(achievement);
  writeJsonFile(ACHIEVEMENTS_FILE, achievements);
}

export function getUserStats(userId: string): UserStats {
  const expenses = getUserExpenses(userId);
  const budgets = getUserBudgets(userId);
  const goals = getUserSavingsGoals(userId);
  const achievements = getUserAchievements(userId);
  
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const completedGoals = goals.filter(goal => (goal.currentAmount / goal.targetAmount) >= 1).length;
  
  return {
    userId,
    totalExpenses,
    totalSavings: 0, // Calculate based on income - expenses
    goalsCompleted: completedGoals,
    budgetsCreated: budgets.length,
    consecutiveDaysTracking: 0, // Calculate based on expense dates
    lastActivityDate: new Date().toISOString(),
    joinedDate: new Date().toISOString()
  };
}

// Achievement checking logic
export function checkAndUnlockAchievements(userId: string): Achievement[] {
  const stats = getUserStats(userId);
  const existingAchievements = getUserAchievements(userId);
  const existingTypes = existingAchievements.map(a => a.achievementType);
  const newAchievements: Achievement[] = [];
  
  // Define achievement criteria
  const achievementCriteria = [
    {
      type: "first_expense",
      title: "🎯 First Expense Added!",
      description: "You've tracked your first expense. Great start!",
      icon: "🎯",
      rarity: "common" as const,
      check: () => stats.totalExpenses > 0
    },
    {
      type: "expense_tracker",
      title: "📊 Expense Tracker",
      description: "Tracked 10 expenses. You're building great habits!",
      icon: "📊",
      rarity: "common" as const,
      check: () => getUserExpenses(userId).length >= 10
    },
    {
      type: "budget_master",
      title: "💰 Budget Master",
      description: "Created your first budget. Smart financial planning!",
      icon: "💰",
      rarity: "common" as const,
      check: () => stats.budgetsCreated > 0
    },
    {
      type: "goal_setter",
      title: "🎯 Goal Setter",
      description: "Set your first savings goal. Dream big!",
      icon: "🎯",
      rarity: "common" as const,
      check: () => getUserSavingsGoals(userId).length > 0
    },
    {
      type: "goal_achiever",
      title: "🏆 Goal Achiever",
      description: "Completed your first savings goal. Outstanding!",
      icon: "🏆",
      rarity: "rare" as const,
      check: () => stats.goalsCompleted > 0
    },
    {
      type: "saver_20",
      title: "🔥 Smart Saver",
      description: "Saved 20% this month. You're on fire!",
      icon: "🔥",
      rarity: "rare" as const,
      check: () => {
        // Estimate savings rate (simplified)
        const estimatedIncome = stats.totalExpenses > 0 ? stats.totalExpenses * 1.5 : 0;
        const savingsRate = estimatedIncome > 0 ? ((estimatedIncome - stats.totalExpenses) / estimatedIncome) * 100 : 0;
        return savingsRate >= 20;
      }
    },
    {
      type: "big_spender",
      title: "💳 Big Spender",
      description: "Tracked over $1,000 in expenses. Knowledge is power!",
      icon: "💳",
      rarity: "rare" as const,
      check: () => stats.totalExpenses >= 1000
    },
    {
      type: "financial_guru",
      title: "🧙‍♂️ Financial Guru",
      description: "Completed 5+ goals and maintained 3+ budgets. You're a master!",
      icon: "🧙‍♂️",
      rarity: "epic" as const,
      check: () => stats.goalsCompleted >= 5 && stats.budgetsCreated >= 3
    }
  ];
  
  // Check each achievement
  achievementCriteria.forEach(criteria => {
    if (!existingTypes.includes(criteria.type) && criteria.check()) {
      const achievement: Achievement = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        userId,
        achievementType: criteria.type,
        title: criteria.title,
        description: criteria.description,
        icon: criteria.icon,
        rarity: criteria.rarity,
        unlockedAt: new Date().toISOString()
      };
      
      saveAchievement(achievement);
      newAchievements.push(achievement);
    }
  });
  
  return newAchievements;
}