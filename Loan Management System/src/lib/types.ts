// Core type definitions for the Loan Management System

export type UserRole = 'admin' | 'loan_officer' | 'teller' | 'manager';

export type LoanStatus = 'pending' | 'active' | 'overdue' | 'cleared' | 'rejected';

export type PaymentMethod = 'cash' | 'bank_transfer' | 'mobile_money' | 'check';

export type TransactionType = 'deposit' | 'withdrawal' | 'interest' | 'fee';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  createdAt: Date;
}

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  idNumber: string;
  address: string;
  city: string;
  dateOfBirth: Date;
  occupation: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoanProduct {
  id: string;
  name: string;
  description: string;
  type: 'personal' | 'business' | 'group' | 'emergency';
  minAmount: number;
  maxAmount: number;
  interestRate: number;
  minDuration: number;
  maxDuration: number;
  penaltyRate: number;
  processingFee: number;
  isActive: boolean;
  eligibilityRules?: string;
  createdAt: Date;
}

export interface Loan {
  id: string;
  customerId: string;
  customerName: string;
  productId: string;
  productName: string;
  principal: number;
  interestRate: number;
  duration: number;
  totalAmount: number;
  totalInterest: number;
  monthlyPayment: number;
  balance: number;
  status: LoanStatus;
  disbursementDate: Date;
  maturityDate: Date;
  nextPaymentDate: Date;
  createdAt: Date;
}

export interface LoanSchedule {
  id: string;
  loanId: string;
  installmentNumber: number;
  dueDate: Date;
  principalAmount: number;
  interestAmount: number;
  totalAmount: number;
  balance: number;
  isPaid: boolean;
  paidDate?: Date;
}

export interface Payment {
  id: string;
  loanId: string;
  customerId: string;
  customerName: string;
  amount: number;
  principalPaid: number;
  interestPaid: number;
  balanceBefore: number;
  balanceAfter: number;
  paymentMethod: PaymentMethod;
  paymentDate: Date;
  receiptNumber: string;
  notes?: string;
  recordedBy: string;
}

export interface SavingsAccount {
  id: string;
  customerId: string;
  customerName: string;
  accountNumber: string;
  balance: number;
  interestRate: number;
  minimumBalance: number;
  status: 'active' | 'inactive' | 'frozen';
  createdAt: Date;
}

export interface SavingsTransaction {
  id: string;
  accountId: string;
  customerId: string;
  customerName: string;
  type: TransactionType;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  transactionDate: Date;
  description: string;
  recordedBy: string;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  totalLoans: number;
  activeLoans: number;
  totalSavings: number;
  createdAt: Date;
  status: 'active' | 'inactive';
}

export interface GroupMember {
  id: string;
  groupId: string;
  customerId: string;
  customerName: string;
  role: 'leader' | 'secretary' | 'treasurer' | 'member';
  joinedAt: Date;
}

export interface FinancialAccount {
  id: string;
  name: string;
  type: 'asset' | 'liability' | 'income' | 'expense';
  balance: number;
  description: string;
}

export interface FinancialTransaction {
  id: string;
  accountId: string;
  accountName: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  transactionDate: Date;
  recordedBy: string;
}

export interface Expense {
  id: string;
  category: string;
  amount: number;
  description: string;
  expenseDate: Date;
  recordedBy: string;
  approvedBy?: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  module: string;
  description: string;
  ipAddress: string;
  timestamp: Date;
}

export interface DashboardMetrics {
  totalCustomers: number;
  activeLoans: number;
  totalLoanAmount: number;
  outstandingBalance: number;
  totalPayments: number;
  paymentsThisMonth: number;
  overdueLoans: number;
  portfolioAtRisk: number;
  totalSavings: number;
  totalGroups: number;
}

export interface Report {
  id: string;
  name: string;
  type: 'loan' | 'customer' | 'payment' | 'financial' | 'portfolio';
  generatedBy: string;
  generatedAt: Date;
  parameters: Record<string, any>;
}
