import React, { useState, useEffect } from 'react';
import { FileText, Users, Package, TrendingUp } from 'lucide-react';

interface DashboardStats {
  totalInvoices: number;
  totalCustomers: number;
  totalProducts: number;
  totalRevenue: number;
  recentInvoices: Array<{
    id: string;
    invoiceNumber: string;
    customerName: string;
    total: number;
    date: string;
  }>;
}

function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalInvoices: 0,
    totalCustomers: 0,
    totalProducts: 0,
    totalRevenue: 0,
    recentInvoices: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [invoicesRes, customersRes, productsRes] = await Promise.all([
        fetch('http://localhost:3001/api/invoices'),
        fetch('http://localhost:3001/api/customers'),
        fetch('http://localhost:3001/api/products')
      ]);

      const invoices = await invoicesRes.json();
      const customers = await customersRes.json();
      const products = await productsRes.json();

      const totalRevenue = invoices.reduce((sum: number, invoice: any) => sum + invoice.total, 0);
      const recentInvoices = invoices
        .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);

      setStats({
        totalInvoices: invoices.length,
        totalCustomers: customers.length,
        totalProducts: products.length,
        totalRevenue,
        recentInvoices
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      name: 'Total Invoices',
      value: stats.totalInvoices,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      name: 'Total Customers',
      value: stats.totalCustomers,
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      name: 'Total Products',
      value: stats.totalProducts,
      icon: Package,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      name: 'Total Revenue',
      value: `$${stats.totalRevenue.toFixed(2)}`,
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
              <div className="flex items-center">
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Invoices */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Invoices</h3>
        </div>
        <div className="overflow-x-auto">
          {stats.recentInvoices.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No invoices found
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Invoice #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stats.recentInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {invoice.invoiceNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {invoice.customerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      ${invoice.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(invoice.date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;