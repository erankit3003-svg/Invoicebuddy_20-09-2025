import React, { useState, useEffect } from 'react';
import { Download, Calendar, Users, Package, TrendingUp } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

interface SalesReport {
  totalRevenue: number;
  totalInvoices: number;
  invoices: Array<{
    id: string;
    invoiceNumber: string;
    customerName: string;
    date: string;
    total: number;
  }>;
}

interface CustomerReport {
  id: string;
  name: string;
  email: string;
  totalInvoices: number;
  totalAmount: number;
}

interface ProductReport {
  id: string;
  name: string;
  category: string;
  price: number;
  totalQuantity: number;
  totalRevenue: number;
  invoiceCount: number;
}

function Reports() {
  const [activeReport, setActiveReport] = useState<'sales' | 'customers' | 'products'>('sales');
  const [salesReport, setSalesReport] = useState<SalesReport>({ totalRevenue: 0, totalInvoices: 0, invoices: [] });
  const [customerReports, setCustomerReports] = useState<CustomerReport[]>([]);
  const [productReports, setProductReports] = useState<ProductReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState({
    period: 'monthly' as 'daily' | 'monthly' | 'yearly' | 'custom',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    fetchReports();
  }, [activeReport, dateRange]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      if (activeReport === 'sales') {
        const params = new URLSearchParams();
        params.append('period', dateRange.period);
        if (dateRange.period === 'custom' && dateRange.startDate && dateRange.endDate) {
          params.append('startDate', dateRange.startDate);
          params.append('endDate', dateRange.endDate);
        }

        const response = await fetch(`http://localhost:3001/api/reports/sales?${params}`);
        const data = await response.json();
        setSalesReport(data);
      } else if (activeReport === 'customers') {
        const response = await fetch('http://localhost:3001/api/reports/customers');
        const data = await response.json();
        setCustomerReports(data);
      } else if (activeReport === 'products') {
        const response = await fetch('http://localhost:3001/api/reports/products');
        const data = await response.json();
        setProductReports(data);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const pageTitle = `${activeReport.charAt(0).toUpperCase() + activeReport.slice(1)} Report`;
    
    doc.setFontSize(20);
    doc.text(pageTitle, 20, 20);
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 35);

    if (activeReport === 'sales') {
      doc.text(`Total Revenue: $${salesReport.totalRevenue.toFixed(2)}`, 20, 50);
      doc.text(`Total Invoices: ${salesReport.totalInvoices}`, 20, 60);

      const tableColumn = ['Invoice #', 'Customer', 'Date', 'Amount'];
      const tableRows = salesReport.invoices.map(invoice => [
        invoice.invoiceNumber,
        invoice.customerName,
        new Date(invoice.date).toLocaleDateString(),
        `$${invoice.total.toFixed(2)}`
      ]);

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 75,
      });
    } else if (activeReport === 'customers') {
      const tableColumn = ['Customer Name', 'Email', 'Total Invoices', 'Total Amount'];
      const tableRows = customerReports.map(customer => [
        customer.name,
        customer.email,
        customer.totalInvoices.toString(),
        `$${customer.totalAmount.toFixed(2)}`
      ]);

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 50,
      });
    } else if (activeReport === 'products') {
      const tableColumn = ['Product Name', 'Category', 'Total Sold', 'Total Revenue'];
      const tableRows = productReports.map(product => [
        product.name,
        product.category,
        product.totalQuantity.toString(),
        `$${product.totalRevenue.toFixed(2)}`
      ]);

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 50,
      });
    }

    doc.save(`${activeReport}-report-${new Date().getTime()}.pdf`);
  };

  const exportToExcel = () => {
    let data: any[] = [];
    let filename = '';

    if (activeReport === 'sales') {
      data = salesReport.invoices.map(invoice => ({
        'Invoice Number': invoice.invoiceNumber,
        'Customer': invoice.customerName,
        'Date': new Date(invoice.date).toLocaleDateString(),
        'Amount': invoice.total
      }));
      filename = `sales-report-${new Date().getTime()}.xlsx`;
    } else if (activeReport === 'customers') {
      data = customerReports.map(customer => ({
        'Customer Name': customer.name,
        'Email': customer.email,
        'Total Invoices': customer.totalInvoices,
        'Total Amount': customer.totalAmount
      }));
      filename = `customers-report-${new Date().getTime()}.xlsx`;
    } else if (activeReport === 'products') {
      data = productReports.map(product => ({
        'Product Name': product.name,
        'Category': product.category,
        'Total Sold': product.totalQuantity,
        'Total Revenue': product.totalRevenue
      }));
      filename = `products-report-${new Date().getTime()}.xlsx`;
    }

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');
    XLSX.writeFile(workbook, filename);
  };

  const reportTabs = [
    { id: 'sales', name: 'Sales Reports', icon: TrendingUp },
    { id: 'customers', name: 'Customer Reports', icon: Users },
    { id: 'products', name: 'Product Reports', icon: Package }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
        <div className="flex space-x-2">
          <button
            onClick={exportToPDF}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </button>
          <button
            onClick={exportToExcel}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Excel
          </button>
        </div>
      </div>

      {/* Report Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {reportTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveReport(tab.id as any)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                  activeReport === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-5 h-5 mr-2" />
                {tab.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Date Range Selector (for sales reports) */}
      {activeReport === 'sales' && (
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium mb-4">Date Range</h3>
          <div className="flex flex-wrap gap-4">
            <select
              value={dateRange.period}
              onChange={(e) => setDateRange({ ...dateRange, period: e.target.value as any })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="daily">Today</option>
              <option value="monthly">This Month</option>
              <option value="yearly">This Year</option>
              <option value="custom">Custom Range</option>
            </select>
            
            {dateRange.period === 'custom' && (
              <>
                <input
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </>
            )}
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          {/* Sales Report */}
          {activeReport === 'sales' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg border border-gray-100">
                  <div className="flex items-center">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <TrendingUp className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                      <p className="text-2xl font-semibold text-gray-900">
                        ${salesReport.totalRevenue.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-100">
                  <div className="flex items-center">
                    <div className="bg-green-50 p-3 rounded-lg">
                      <Calendar className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Invoices</p>
                      <p className="text-2xl font-semibold text-gray-900">
                        {salesReport.totalInvoices}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Sales Details</h3>
                </div>
                <div className="overflow-x-auto">
                  {salesReport.invoices.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">No sales data found</div>
                  ) : (
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Invoice #
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Customer
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Date
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                            Amount
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {salesReport.invoices.map((invoice) => (
                          <tr key={invoice.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {invoice.invoiceNumber}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {invoice.customerName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(invoice.date).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                              ${invoice.total.toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Customer Report */}
          {activeReport === 'customers' && (
            <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Customer Analysis</h3>
              </div>
              <div className="overflow-x-auto">
                {customerReports.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">No customer data found</div>
                ) : (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Customer Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Email
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                          Total Invoices
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                          Total Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {customerReports.map((customer) => (
                        <tr key={customer.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {customer.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {customer.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                            {customer.totalInvoices}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                            ${customer.totalAmount.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/* Product Report */}
          {activeReport === 'products' && (
            <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Product Performance</h3>
              </div>
              <div className="overflow-x-auto">
                {productReports.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">No product data found</div>
                ) : (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Product Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Category
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                          Units Sold
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                          Total Revenue
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {productReports
                        .sort((a, b) => b.totalRevenue - a.totalRevenue)
                        .map((product) => (
                        <tr key={product.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{product.name}</div>
                              <div className="text-sm text-gray-500">${product.price.toFixed(2)} each</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {product.category}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                            {product.totalQuantity || 0}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                            ${(product.totalRevenue || 0).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Reports;