// Mock data for the Loan Management System
import { 
  Customer, 
  Loan, 
  LoanProduct, 
  Payment, 
  SavingsAccount, 
  SavingsTransaction,
  Group,
  GroupMember,
  FinancialTransaction,
  Expense,
  User,
  AuditLog,
  DashboardMetrics,
  LoanSchedule
} from './types';

// Users
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Admin',
    email: 'admin@lms.com',
    role: 'admin',
    phone: '+1234567890',
    createdAt: new Date('2024-01-01')
  },
  {
    id: '2',
    name: 'Sarah Officer',
    email: 'sarah@lms.com',
    role: 'loan_officer',
    phone: '+1234567891',
    createdAt: new Date('2024-01-15')
  },
  {
    id: '3',
    name: 'Mike Teller',
    email: 'mike@lms.com',
    role: 'teller',
    phone: '+1234567892',
    createdAt: new Date('2024-02-01')
  }
];

// Customers
export const mockCustomers: Customer[] = [
  {
    id: 'C001',
    firstName: 'Alice',
    lastName: 'Johnson',
    email: 'alice.johnson@email.com',
    phone: '+1234567800',
    idNumber: 'ID123456',
    address: '123 Main Street',
    city: 'Nairobi',
    dateOfBirth: new Date('1985-03-15'),
    occupation: 'Business Owner',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10')
  },
  {
    id: 'C002',
    firstName: 'Bob',
    lastName: 'Smith',
    email: 'bob.smith@email.com',
    phone: '+1234567801',
    idNumber: 'ID123457',
    address: '456 Oak Avenue',
    city: 'Mombasa',
    dateOfBirth: new Date('1990-07-22'),
    occupation: 'Teacher',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'C003',
    firstName: 'Carol',
    lastName: 'Williams',
    email: 'carol.w@email.com',
    phone: '+1234567802',
    idNumber: 'ID123458',
    address: '789 Pine Road',
    city: 'Kisumu',
    dateOfBirth: new Date('1988-11-30'),
    occupation: 'Farmer',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: 'C004',
    firstName: 'David',
    lastName: 'Brown',
    email: 'david.brown@email.com',
    phone: '+1234567803',
    idNumber: 'ID123459',
    address: '321 Elm Street',
    city: 'Nakuru',
    dateOfBirth: new Date('1992-05-18'),
    occupation: 'Trader',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01')
  },
  {
    id: 'C005',
    firstName: 'Emma',
    lastName: 'Davis',
    email: 'emma.davis@email.com',
    phone: '+1234567804',
    idNumber: 'ID123460',
    address: '654 Maple Drive',
    city: 'Eldoret',
    dateOfBirth: new Date('1987-09-25'),
    occupation: 'Shopkeeper',
    createdAt: new Date('2024-02-05'),
    updatedAt: new Date('2024-02-05')
  }
];

// Loan Products
export const mockLoanProducts: LoanProduct[] = [
  {
    id: 'LP001',
    name: 'Personal Loan',
    description: 'Quick personal loans for individual needs',
    type: 'personal',
    minAmount: 5000,
    maxAmount: 500000,
    interestRate: 12,
    minDuration: 3,
    maxDuration: 36,
    penaltyRate: 2,
    processingFee: 1000,
    isActive: true,
    eligibilityRules: 'Minimum 6 months employment',
    createdAt: new Date('2024-01-01')
  },
  {
    id: 'LP002',
    name: 'Business Loan',
    description: 'Loans for small and medium businesses',
    type: 'business',
    minAmount: 50000,
    maxAmount: 5000000,
    interestRate: 15,
    minDuration: 6,
    maxDuration: 60,
    penaltyRate: 2.5,
    processingFee: 2500,
    isActive: true,
    eligibilityRules: 'Valid business registration',
    createdAt: new Date('2024-01-01')
  },
  {
    id: 'LP003',
    name: 'Group Loan',
    description: 'Loans for registered groups',
    type: 'group',
    minAmount: 100000,
    maxAmount: 10000000,
    interestRate: 10,
    minDuration: 12,
    maxDuration: 48,
    penaltyRate: 1.5,
    processingFee: 5000,
    isActive: true,
    eligibilityRules: 'Minimum 5 members',
    createdAt: new Date('2024-01-01')
  },
  {
    id: 'LP004',
    name: 'Emergency Loan',
    description: 'Fast emergency loans',
    type: 'emergency',
    minAmount: 1000,
    maxAmount: 100000,
    interestRate: 18,
    minDuration: 1,
    maxDuration: 12,
    penaltyRate: 3,
    processingFee: 500,
    isActive: true,
    eligibilityRules: 'Existing customer',
    createdAt: new Date('2024-01-01')
  }
];

// Loans
export const mockLoans: Loan[] = [
  {
    id: 'L001',
    customerId: 'C001',
    customerName: 'Alice Johnson',
    productId: 'LP001',
    productName: 'Personal Loan',
    principal: 100000,
    interestRate: 12,
    duration: 12,
    totalAmount: 112000,
    totalInterest: 12000,
    monthlyPayment: 9333,
    balance: 56000,
    status: 'active',
    disbursementDate: new Date('2024-01-15'),
    maturityDate: new Date('2025-01-15'),
    nextPaymentDate: new Date('2024-08-15'),
    createdAt: new Date('2024-01-10')
  },
  {
    id: 'L002',
    customerId: 'C002',
    customerName: 'Bob Smith',
    productId: 'LP002',
    productName: 'Business Loan',
    principal: 500000,
    interestRate: 15,
    duration: 24,
    totalAmount: 575000,
    totalInterest: 75000,
    monthlyPayment: 23958,
    balance: 430000,
    status: 'active',
    disbursementDate: new Date('2024-02-01'),
    maturityDate: new Date('2026-02-01'),
    nextPaymentDate: new Date('2024-08-01'),
    createdAt: new Date('2024-01-25')
  },
  {
    id: 'L003',
    customerId: 'C003',
    customerName: 'Carol Williams',
    productId: 'LP001',
    productName: 'Personal Loan',
    principal: 50000,
    interestRate: 12,
    duration: 6,
    totalAmount: 53000,
    totalInterest: 3000,
    monthlyPayment: 8833,
    balance: 8833,
    status: 'overdue',
    disbursementDate: new Date('2024-03-01'),
    maturityDate: new Date('2024-09-01'),
    nextPaymentDate: new Date('2024-07-01'),
    createdAt: new Date('2024-02-25')
  },
  {
    id: 'L004',
    customerId: 'C004',
    customerName: 'David Brown',
    productId: 'LP004',
    productName: 'Emergency Loan',
    principal: 25000,
    interestRate: 18,
    duration: 3,
    totalAmount: 26125,
    totalInterest: 1125,
    monthlyPayment: 8708,
    balance: 0,
    status: 'cleared',
    disbursementDate: new Date('2024-04-01'),
    maturityDate: new Date('2024-07-01'),
    nextPaymentDate: new Date('2024-07-01'),
    createdAt: new Date('2024-03-28')
  },
  {
    id: 'L005',
    customerId: 'C005',
    customerName: 'Emma Davis',
    productId: 'LP001',
    productName: 'Personal Loan',
    principal: 75000,
    interestRate: 12,
    duration: 12,
    totalAmount: 84000,
    totalInterest: 9000,
    monthlyPayment: 7000,
    balance: 70000,
    status: 'active',
    disbursementDate: new Date('2024-05-15'),
    maturityDate: new Date('2025-05-15'),
    nextPaymentDate: new Date('2024-08-15'),
    createdAt: new Date('2024-05-10')
  },
  {
    id: 'L006',
    customerId: 'C001',
    customerName: 'Alice Johnson',
    productId: 'LP002',
    productName: 'Business Loan',
    principal: 300000,
    interestRate: 15,
    duration: 18,
    totalAmount: 345000,
    totalInterest: 45000,
    monthlyPayment: 19167,
    balance: 0,
    status: 'pending',
    disbursementDate: new Date('2024-08-01'),
    maturityDate: new Date('2026-02-01'),
    nextPaymentDate: new Date('2024-09-01'),
    createdAt: new Date('2024-07-25')
  }
];

// Loan Schedules
export const mockLoanSchedules: LoanSchedule[] = [
  {
    id: 'LS001',
    loanId: 'L001',
    installmentNumber: 1,
    dueDate: new Date('2024-02-15'),
    principalAmount: 8333,
    interestAmount: 1000,
    totalAmount: 9333,
    balance: 103667,
    isPaid: true,
    paidDate: new Date('2024-02-14')
  },
  {
    id: 'LS002',
    loanId: 'L001',
    installmentNumber: 2,
    dueDate: new Date('2024-03-15'),
    principalAmount: 8333,
    interestAmount: 1000,
    totalAmount: 9333,
    balance: 95334,
    isPaid: true,
    paidDate: new Date('2024-03-15')
  },
  {
    id: 'LS003',
    loanId: 'L001',
    installmentNumber: 3,
    dueDate: new Date('2024-04-15'),
    principalAmount: 8334,
    interestAmount: 1000,
    totalAmount: 9334,
    balance: 87000,
    isPaid: false
  }
];

// Payments
export const mockPayments: Payment[] = [
  {
    id: 'P001',
    loanId: 'L001',
    customerId: 'C001',
    customerName: 'Alice Johnson',
    amount: 9333,
    principalPaid: 8333,
    interestPaid: 1000,
    balanceBefore: 112000,
    balanceAfter: 103667,
    paymentMethod: 'bank_transfer',
    paymentDate: new Date('2024-02-14'),
    receiptNumber: 'RCP001',
    recordedBy: 'Sarah Officer'
  },
  {
    id: 'P002',
    loanId: 'L001',
    customerId: 'C001',
    customerName: 'Alice Johnson',
    amount: 9333,
    principalPaid: 8333,
    interestPaid: 1000,
    balanceBefore: 103667,
    balanceAfter: 95334,
    paymentMethod: 'mobile_money',
    paymentDate: new Date('2024-03-15'),
    receiptNumber: 'RCP002',
    recordedBy: 'Mike Teller'
  },
  {
    id: 'P003',
    loanId: 'L002',
    customerId: 'C002',
    customerName: 'Bob Smith',
    amount: 23958,
    principalPaid: 20833,
    interestPaid: 3125,
    balanceBefore: 575000,
    balanceAfter: 554167,
    paymentMethod: 'bank_transfer',
    paymentDate: new Date('2024-03-01'),
    receiptNumber: 'RCP003',
    recordedBy: 'Sarah Officer'
  },
  {
    id: 'P004',
    loanId: 'L004',
    customerId: 'C004',
    customerName: 'David Brown',
    amount: 26125,
    principalPaid: 25000,
    interestPaid: 1125,
    balanceBefore: 26125,
    balanceAfter: 0,
    paymentMethod: 'cash',
    paymentDate: new Date('2024-06-28'),
    receiptNumber: 'RCP004',
    notes: 'Full payment',
    recordedBy: 'Mike Teller'
  },
  {
    id: 'P005',
    loanId: 'L002',
    customerId: 'C002',
    customerName: 'Bob Smith',
    amount: 23958,
    principalPaid: 20833,
    interestPaid: 3125,
    balanceBefore: 554167,
    balanceAfter: 533334,
    paymentMethod: 'bank_transfer',
    paymentDate: new Date('2024-04-01'),
    receiptNumber: 'RCP005',
    recordedBy: 'Sarah Officer'
  }
];

// Savings Accounts
export const mockSavingsAccounts: SavingsAccount[] = [
  {
    id: 'SA001',
    customerId: 'C001',
    customerName: 'Alice Johnson',
    accountNumber: 'SAV001',
    balance: 85000,
    interestRate: 5,
    minimumBalance: 1000,
    status: 'active',
    createdAt: new Date('2024-01-10')
  },
  {
    id: 'SA002',
    customerId: 'C002',
    customerName: 'Bob Smith',
    accountNumber: 'SAV002',
    balance: 120000,
    interestRate: 5,
    minimumBalance: 1000,
    status: 'active',
    createdAt: new Date('2024-01-15')
  },
  {
    id: 'SA003',
    customerId: 'C003',
    customerName: 'Carol Williams',
    accountNumber: 'SAV003',
    balance: 45000,
    interestRate: 5,
    minimumBalance: 1000,
    status: 'active',
    createdAt: new Date('2024-01-20')
  },
  {
    id: 'SA004',
    customerId: 'C005',
    customerName: 'Emma Davis',
    accountNumber: 'SAV004',
    balance: 62000,
    interestRate: 5,
    minimumBalance: 1000,
    status: 'active',
    createdAt: new Date('2024-02-05')
  }
];

// Savings Transactions
export const mockSavingsTransactions: SavingsTransaction[] = [
  {
    id: 'ST001',
    accountId: 'SA001',
    customerId: 'C001',
    customerName: 'Alice Johnson',
    type: 'deposit',
    amount: 50000,
    balanceBefore: 0,
    balanceAfter: 50000,
    transactionDate: new Date('2024-01-10'),
    description: 'Initial deposit',
    recordedBy: 'Mike Teller'
  },
  {
    id: 'ST002',
    accountId: 'SA001',
    customerId: 'C001',
    customerName: 'Alice Johnson',
    type: 'deposit',
    amount: 35000,
    balanceBefore: 50000,
    balanceAfter: 85000,
    transactionDate: new Date('2024-03-15'),
    description: 'Monthly savings',
    recordedBy: 'Mike Teller'
  },
  {
    id: 'ST003',
    accountId: 'SA002',
    customerId: 'C002',
    customerName: 'Bob Smith',
    type: 'deposit',
    amount: 120000,
    balanceBefore: 0,
    balanceAfter: 120000,
    transactionDate: new Date('2024-01-15'),
    description: 'Initial deposit',
    recordedBy: 'Mike Teller'
  },
  {
    id: 'ST004',
    accountId: 'SA003',
    customerId: 'C003',
    customerName: 'Carol Williams',
    type: 'deposit',
    amount: 50000,
    balanceBefore: 0,
    balanceAfter: 50000,
    transactionDate: new Date('2024-01-20'),
    description: 'Initial deposit',
    recordedBy: 'Mike Teller'
  },
  {
    id: 'ST005',
    accountId: 'SA003',
    customerId: 'C003',
    customerName: 'Carol Williams',
    type: 'withdrawal',
    amount: 5000,
    balanceBefore: 50000,
    balanceAfter: 45000,
    transactionDate: new Date('2024-04-10'),
    description: 'Emergency withdrawal',
    recordedBy: 'Mike Teller'
  }
];

// Groups
export const mockGroups: Group[] = [
  {
    id: 'G001',
    name: 'Women Empowerment Group',
    description: 'Supporting women entrepreneurs',
    memberCount: 12,
    totalLoans: 3,
    activeLoans: 2,
    totalSavings: 450000,
    createdAt: new Date('2024-01-05'),
    status: 'active'
  },
  {
    id: 'G002',
    name: 'Farmers Cooperative',
    description: 'Agricultural lending group',
    memberCount: 25,
    totalLoans: 5,
    activeLoans: 4,
    totalSavings: 1200000,
    createdAt: new Date('2024-01-12'),
    status: 'active'
  },
  {
    id: 'G003',
    name: 'Small Business Alliance',
    description: 'SME support group',
    memberCount: 8,
    totalLoans: 2,
    activeLoans: 1,
    totalSavings: 320000,
    createdAt: new Date('2024-02-20'),
    status: 'active'
  }
];

// Group Members
export const mockGroupMembers: GroupMember[] = [
  {
    id: 'GM001',
    groupId: 'G001',
    customerId: 'C001',
    customerName: 'Alice Johnson',
    role: 'leader',
    joinedAt: new Date('2024-01-05')
  },
  {
    id: 'GM002',
    groupId: 'G001',
    customerId: 'C003',
    customerName: 'Carol Williams',
    role: 'treasurer',
    joinedAt: new Date('2024-01-05')
  },
  {
    id: 'GM003',
    groupId: 'G001',
    customerId: 'C005',
    customerName: 'Emma Davis',
    role: 'member',
    joinedAt: new Date('2024-01-08')
  },
  {
    id: 'GM004',
    groupId: 'G002',
    customerId: 'C002',
    customerName: 'Bob Smith',
    role: 'leader',
    joinedAt: new Date('2024-01-12')
  },
  {
    id: 'GM005',
    groupId: 'G003',
    customerId: 'C004',
    customerName: 'David Brown',
    role: 'secretary',
    joinedAt: new Date('2024-02-20')
  }
];

// Financial Transactions
export const mockFinancialTransactions: FinancialTransaction[] = [
  {
    id: 'FT001',
    accountId: 'FA001',
    accountName: 'Interest Income',
    type: 'income',
    amount: 45000,
    category: 'Loan Interest',
    description: 'Interest collected from loans',
    transactionDate: new Date('2024-06-30'),
    recordedBy: 'John Admin'
  },
  {
    id: 'FT002',
    accountId: 'FA002',
    accountName: 'Processing Fees',
    type: 'income',
    amount: 12000,
    category: 'Fees',
    description: 'Loan processing fees',
    transactionDate: new Date('2024-06-30'),
    recordedBy: 'John Admin'
  },
  {
    id: 'FT003',
    accountId: 'FA003',
    accountName: 'Operating Expenses',
    type: 'expense',
    amount: 85000,
    category: 'Salaries',
    description: 'Staff salaries for June',
    transactionDate: new Date('2024-06-30'),
    recordedBy: 'John Admin'
  },
  {
    id: 'FT004',
    accountId: 'FA004',
    accountName: 'Office Expenses',
    type: 'expense',
    amount: 15000,
    category: 'Utilities',
    description: 'Electricity and water bills',
    transactionDate: new Date('2024-06-15'),
    recordedBy: 'John Admin'
  }
];

// Expenses
export const mockExpenses: Expense[] = [
  {
    id: 'EXP001',
    category: 'Salaries',
    amount: 85000,
    description: 'Staff salaries for June 2024',
    expenseDate: new Date('2024-06-30'),
    recordedBy: 'John Admin',
    approvedBy: 'John Admin',
    status: 'approved'
  },
  {
    id: 'EXP002',
    category: 'Rent',
    amount: 35000,
    description: 'Office rent for June 2024',
    expenseDate: new Date('2024-06-01'),
    recordedBy: 'Sarah Officer',
    approvedBy: 'John Admin',
    status: 'approved'
  },
  {
    id: 'EXP003',
    category: 'Utilities',
    amount: 15000,
    description: 'Electricity and water',
    expenseDate: new Date('2024-06-15'),
    recordedBy: 'Sarah Officer',
    approvedBy: 'John Admin',
    status: 'approved'
  },
  {
    id: 'EXP004',
    category: 'Office Supplies',
    amount: 8500,
    description: 'Stationery and supplies',
    expenseDate: new Date('2024-07-05'),
    recordedBy: 'Mike Teller',
    status: 'pending'
  },
  {
    id: 'EXP005',
    category: 'Marketing',
    amount: 25000,
    description: 'Social media advertising',
    expenseDate: new Date('2024-07-10'),
    recordedBy: 'Sarah Officer',
    status: 'pending'
  }
];

// Audit Logs
export const mockAuditLogs: AuditLog[] = [
  {
    id: 'AL001',
    userId: '2',
    userName: 'Sarah Officer',
    action: 'CREATE',
    module: 'Loans',
    description: 'Created new loan L005 for Emma Davis',
    ipAddress: '192.168.1.100',
    timestamp: new Date('2024-05-10T10:30:00')
  },
  {
    id: 'AL002',
    userId: '3',
    userName: 'Mike Teller',
    action: 'UPDATE',
    module: 'Payments',
    description: 'Recorded payment P005 for loan L002',
    ipAddress: '192.168.1.101',
    timestamp: new Date('2024-04-01T14:15:00')
  },
  {
    id: 'AL003',
    userId: '1',
    userName: 'John Admin',
    action: 'CREATE',
    module: 'Users',
    description: 'Created new user Mike Teller',
    ipAddress: '192.168.1.99',
    timestamp: new Date('2024-02-01T09:00:00')
  },
  {
    id: 'AL004',
    userId: '2',
    userName: 'Sarah Officer',
    action: 'UPDATE',
    module: 'Customers',
    description: 'Updated customer profile for Alice Johnson',
    ipAddress: '192.168.1.100',
    timestamp: new Date('2024-03-20T11:45:00')
  },
  {
    id: 'AL005',
    userId: '1',
    userName: 'John Admin',
    action: 'APPROVE',
    module: 'Expenses',
    description: 'Approved expense EXP002 for office rent',
    ipAddress: '192.168.1.99',
    timestamp: new Date('2024-06-02T08:30:00')
  }
];

// Dashboard Metrics
export const mockDashboardMetrics: DashboardMetrics = {
  totalCustomers: 5,
  activeLoans: 3,
  totalLoanAmount: 750000,
  outstandingBalance: 556000,
  totalPayments: 5,
  paymentsThisMonth: 2,
  overdueLoans: 1,
  portfolioAtRisk: 8833,
  totalSavings: 312000,
  totalGroups: 3
};
