import { useState } from 'react';
import { Plus, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { mockFinancialTransactions, mockExpenses } from '../lib/mock-data';
import { FinancialTransaction, Expense } from '../lib/types';
import { toast } from 'sonner@2.0.3';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(amount);
};

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export function Financial() {
  const [transactions, setTransactions] = useState(mockFinancialTransactions);
  const [expenses, setExpenses] = useState(mockExpenses);
  const [isTransactionDialogOpen, setIsTransactionDialogOpen] = useState(false);
  const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false);

  const handleAddTransaction = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newTransaction: FinancialTransaction = {
      id: `FT${String(transactions.length + 1).padStart(3, '0')}`,
      accountId: 'FA001',
      accountName: formData.get('accountName') as string,
      type: formData.get('type') as 'income' | 'expense',
      amount: parseFloat(formData.get('amount') as string),
      category: formData.get('category') as string,
      description: formData.get('description') as string,
      transactionDate: new Date(formData.get('transactionDate') as string),
      recordedBy: 'Current User',
    };
    
    setTransactions([newTransaction, ...transactions]);
    setIsTransactionDialogOpen(false);
    toast.success('Transaction recorded successfully');
  };

  const handleAddExpense = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newExpense: Expense = {
      id: `EXP${String(expenses.length + 1).padStart(3, '0')}`,
      category: formData.get('category') as string,
      amount: parseFloat(formData.get('amount') as string),
      description: formData.get('description') as string,
      expenseDate: new Date(formData.get('expenseDate') as string),
      recordedBy: 'Current User',
      status: 'pending',
    };
    
    setExpenses([newExpense, ...expenses]);
    setIsExpenseDialogOpen(false);
    toast.success('Expense recorded successfully');
  };

  const approveExpense = (expenseId: string) => {
    setExpenses(expenses.map(e => 
      e.id === expenseId ? { ...e, status: 'approved' as const, approvedBy: 'Current User' } : e
    ));
    toast.success('Expense approved');
  };

  const getTotalIncome = () => transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const getTotalExpenses = () => transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const getNetIncome = () => getTotalIncome() - getTotalExpenses();
  const getPendingExpenses = () => expenses.filter(e => e.status === 'pending').length;

  // Chart data
  const monthlyData = [
    { month: 'Jan', income: 120000, expenses: 85000 },
    { month: 'Feb', income: 180000, expenses: 92000 },
    { month: 'Mar', income: 210000, expenses: 88000 },
    { month: 'Apr', income: 250000, expenses: 95000 },
    { month: 'May', income: 290000, expenses: 105000 },
    { month: 'Jun', income: 310000, expenses: 143500 },
  ];

  const expenseCategories = [
    { name: 'Salaries', value: 85000 },
    { name: 'Rent', value: 35000 },
    { name: 'Utilities', value: 15000 },
    { name: 'Marketing', value: 25000 },
    { name: 'Others', value: 8500 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Financial Management</h1>
          <p className="text-gray-500 mt-1">Track income, expenses, and financial health</p>
        </div>
        <div className="flex gap-3">
          <Dialog open={isTransactionDialogOpen} onOpenChange={setIsTransactionDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Transaction
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
              <DialogHeader>
                <DialogTitle>Record Financial Transaction</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddTransaction} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Transaction Type *</Label>
                  <Select name="type" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="income">Income</SelectItem>
                      <SelectItem value="expense">Expense</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accountName">Account Name *</Label>
                  <Input id="accountName" name="accountName" required />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount *</Label>
                    <Input 
                      id="amount" 
                      name="amount" 
                      type="number"
                      step="0.01"
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="transactionDate">Date *</Label>
                    <Input 
                      id="transactionDate" 
                      name="transactionDate" 
                      type="date"
                      defaultValue={new Date().toISOString().split('T')[0]}
                      required 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Input id="category" name="category" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea 
                    id="description" 
                    name="description"
                    rows={2}
                    required
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsTransactionDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Record Transaction</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={isExpenseDialogOpen} onOpenChange={setIsExpenseDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Expense
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
              <DialogHeader>
                <DialogTitle>Record Expense</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddExpense} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select name="category" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Salaries">Salaries</SelectItem>
                      <SelectItem value="Rent">Rent</SelectItem>
                      <SelectItem value="Utilities">Utilities</SelectItem>
                      <SelectItem value="Office Supplies">Office Supplies</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Transport">Transport</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount *</Label>
                    <Input 
                      id="amount" 
                      name="amount" 
                      type="number"
                      step="0.01"
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expenseDate">Date *</Label>
                    <Input 
                      id="expenseDate" 
                      name="expenseDate" 
                      type="date"
                      defaultValue={new Date().toISOString().split('T')[0]}
                      required 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea 
                    id="description" 
                    name="description"
                    rows={3}
                    required
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsExpenseDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Record Expense</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(getTotalIncome())}
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">All time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-red-600" />
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(getTotalExpenses())}
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">All time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Net Income</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-blue-600" />
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(getNetIncome())}
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">Profit/Loss</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{getPendingExpenses()}</div>
            <p className="text-xs text-gray-500 mt-1">Awaiting approval</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Income vs Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Legend />
                <Bar dataKey="income" fill="#10B981" name="Income" />
                <Bar dataKey="expenses" fill="#EF4444" name="Expenses" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Expense Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={expenseCategories}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${formatCurrency(value)}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {expenseCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="transactions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Account</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Recorded By</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{transaction.transactionDate.toLocaleDateString()}</TableCell>
                      <TableCell className="font-medium">{transaction.accountName}</TableCell>
                      <TableCell>
                        <Badge
                          variant={transaction.type === 'income' ? 'default' : 'secondary'}
                          className="capitalize"
                        >
                          {transaction.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{transaction.category}</TableCell>
                      <TableCell className={`font-medium ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                      </TableCell>
                      <TableCell className="text-sm">{transaction.description}</TableCell>
                      <TableCell className="text-sm text-gray-500">{transaction.recordedBy}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expenses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Expense Records</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Recorded By</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expenses.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell>{expense.expenseDate.toLocaleDateString()}</TableCell>
                      <TableCell className="font-medium">{expense.category}</TableCell>
                      <TableCell className="font-medium text-red-600">
                        {formatCurrency(expense.amount)}
                      </TableCell>
                      <TableCell className="text-sm">{expense.description}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            expense.status === 'approved' ? 'default' :
                            expense.status === 'rejected' ? 'destructive' : 'outline'
                          }
                          className="capitalize"
                        >
                          {expense.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">{expense.recordedBy}</TableCell>
                      <TableCell>
                        {expense.status === 'pending' && (
                          <Button
                            size="sm"
                            onClick={() => approveExpense(expense.id)}
                          >
                            Approve
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
