import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import CustomerManagement from './components/CustomerManagement';
import ProductManagement from './components/ProductManagement';
import InvoiceManagement from './components/InvoiceManagement';
import Reports from './components/Reports';
import { 
  FileText, 
  Users, 
  Package, 
  BarChart3,
  Home,
  Menu,
  X
} from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { id: 'dashboard', name: 'Dashboard', icon: Home },
    { id: 'invoices', name: 'Invoices', icon: FileText },
    { id: 'customers', name: 'Customers', icon: Users },
    { id: 'products', name: 'Products', icon: Package },
    { id: 'reports', name: 'Reports', icon: BarChart3 },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'customers':
        return <CustomerManagement />;
      case 'products':
        return <ProductManagement />;
      case 'invoices':
        return <InvoiceManagement />;
      case 'reports':
        return <Reports />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-4 border-b">
          <h1 className="text-xl font-bold text-gray-900">InvoiceBuddy</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <nav className="mt-8">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center px-4 py-3 text-left transition-colors ${
                  activeTab === item.id
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="flex items-center justify-between h-16 px-4 bg-white shadow-sm border-b lg:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-500 hover:text-gray-700 lg:hidden"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h2 className="text-lg font-semibold text-gray-900 capitalize">
            {navigation.find(item => item.id === activeTab)?.name}
          </h2>
          <div className="w-6 lg:hidden"></div>
        </div>

        {/* Page content */}
        <main className="p-4 lg:p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;