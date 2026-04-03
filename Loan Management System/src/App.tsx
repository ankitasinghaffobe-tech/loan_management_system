import { useState } from 'react';
import { AuthProvider } from './lib/auth-context';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { Customers } from './components/Customers';
import { Loans } from './components/Loans';
import { LoanProducts } from './components/LoanProducts';
import { Payments } from './components/Payments';
import { Savings } from './components/Savings';
import { Groups } from './components/Groups';
import { Financial } from './components/Financial';
import { Reports } from './components/Reports';
import { Administration } from './components/Administration';
import { Toaster } from './components/ui/sonner';

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'customers':
        return <Customers />;
      case 'loans':
        return <Loans />;
      case 'products':
        return <LoanProducts />;
      case 'payments':
        return <Payments />;
      case 'savings':
        return <Savings />;
      case 'groups':
        return <Groups />;
      case 'financial':
        return <Financial />;
      case 'reports':
        return <Reports />;
      case 'administration':
        return <Administration />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <AuthProvider>
      <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
        {renderPage()}
      </Layout>
      <Toaster />
    </AuthProvider>
  );
}
