const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const __dirname = __dirname || path.resolve();
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Data file paths
const dataDir = path.join(__dirname, 'data');
const customersFile = path.join(dataDir, 'customers.json');
const productsFile = path.join(dataDir, 'products.json');
const invoicesFile = path.join(dataDir, 'invoices.json');

// Initialize data files
async function initializeDataFiles() {
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }

  const initialData = {
    customers: [],
    products: [],
    invoices: []
  };

  for (const [key, filepath] of Object.entries({
    customers: customersFile,
    products: productsFile,
    invoices: invoicesFile
  })) {
    try {
      await fs.access(filepath);
    } catch {
      await fs.writeFile(filepath, JSON.stringify(initialData[key], null, 2));
    }
  }
}

// Helper functions
async function readJsonFile(filepath) {
  try {
    const data = await fs.readFile(filepath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filepath}:`, error);
    return [];
  }
}

async function writeJsonFile(filepath, data) {
  try {
    await fs.writeFile(filepath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(`Error writing ${filepath}:`, error);
    throw error;
  }
}

// Customer routes
app.get('/api/customers', async (req, res) => {
  const customers = await readJsonFile(customersFile);
  res.json(customers);
});

app.post('/api/customers', async (req, res) => {
  const customers = await readJsonFile(customersFile);
  const newCustomer = {
    id: Date.now().toString(),
    ...req.body,
    createdAt: new Date().toISOString()
  };
  customers.push(newCustomer);
  await writeJsonFile(customersFile, customers);
  res.json(newCustomer);
});

app.put('/api/customers/:id', async (req, res) => {
  const customers = await readJsonFile(customersFile);
  const index = customers.findIndex(c => c.id === req.params.id);
  if (index !== -1) {
    customers[index] = { ...customers[index], ...req.body };
    await writeJsonFile(customersFile, customers);
    res.json(customers[index]);
  } else {
    res.status(404).json({ error: 'Customer not found' });
  }
});

app.delete('/api/customers/:id', async (req, res) => {
  const customers = await readJsonFile(customersFile);
  const filteredCustomers = customers.filter(c => c.id !== req.params.id);
  await writeJsonFile(customersFile, filteredCustomers);
  res.json({ success: true });
});

// Product routes
app.get('/api/products', async (req, res) => {
  const products = await readJsonFile(productsFile);
  res.json(products);
});

app.post('/api/products', async (req, res) => {
  const products = await readJsonFile(productsFile);
  const newProduct = {
    id: Date.now().toString(),
    ...req.body,
    createdAt: new Date().toISOString()
  };
  products.push(newProduct);
  await writeJsonFile(productsFile, products);
  res.json(newProduct);
});

app.put('/api/products/:id', async (req, res) => {
  const products = await readJsonFile(productsFile);
  const index = products.findIndex(p => p.id === req.params.id);
  if (index !== -1) {
    products[index] = { ...products[index], ...req.body };
    await writeJsonFile(productsFile, products);
    res.json(products[index]);
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  const products = await readJsonFile(productsFile);
  const filteredProducts = products.filter(p => p.id !== req.params.id);
  await writeJsonFile(productsFile, filteredProducts);
  res.json({ success: true });
});

// Invoice routes
app.get('/api/invoices', async (req, res) => {
  const invoices = await readJsonFile(invoicesFile);
  res.json(invoices);
});

app.post('/api/invoices', async (req, res) => {
  const invoices = await readJsonFile(invoicesFile);
  const newInvoice = {
    id: Date.now().toString(),
    ...req.body,
    createdAt: new Date().toISOString()
  };
  invoices.push(newInvoice);
  await writeJsonFile(invoicesFile, invoices);
  res.json(newInvoice);
});

app.put('/api/invoices/:id', async (req, res) => {
  const invoices = await readJsonFile(invoicesFile);
  const index = invoices.findIndex(i => i.id === req.params.id);
  if (index !== -1) {
    invoices[index] = { ...invoices[index], ...req.body };
    await writeJsonFile(invoicesFile, invoices);
    res.json(invoices[index]);
  } else {
    res.status(404).json({ error: 'Invoice not found' });
  }
});

app.delete('/api/invoices/:id', async (req, res) => {
  const invoices = await readJsonFile(invoicesFile);
  const filteredInvoices = invoices.filter(i => i.id !== req.params.id);
  await writeJsonFile(invoicesFile, filteredInvoices);
  res.json({ success: true });
});

// Reports routes
app.get('/api/reports/sales', async (req, res) => {
  const { period, startDate, endDate } = req.query;
  const invoices = await readJsonFile(invoicesFile);
  
  let filteredInvoices = invoices;
  const now = new Date();
  
  if (period === 'daily') {
    const today = new Date().toISOString().split('T')[0];
    filteredInvoices = invoices.filter(invoice => 
      invoice.date === today
    );
  } else if (period === 'monthly') {
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    filteredInvoices = invoices.filter(invoice => {
      const invoiceDate = new Date(invoice.date);
      return invoiceDate.getMonth() === currentMonth && 
             invoiceDate.getFullYear() === currentYear;
    });
  } else if (period === 'yearly') {
    const currentYear = now.getFullYear();
    filteredInvoices = invoices.filter(invoice => {
      const invoiceDate = new Date(invoice.date);
      return invoiceDate.getFullYear() === currentYear;
    });
  } else if (startDate && endDate) {
    filteredInvoices = invoices.filter(invoice => 
      invoice.date >= startDate && invoice.date <= endDate
    );
  }

  const totalRevenue = filteredInvoices.reduce((sum, invoice) => sum + invoice.total, 0);
  const totalInvoices = filteredInvoices.length;

  res.json({
    totalRevenue,
    totalInvoices,
    invoices: filteredInvoices
  });
});

app.get('/api/reports/customers', async (req, res) => {
  const invoices = await readJsonFile(invoicesFile);
  const customers = await readJsonFile(customersFile);
  
  const customerReports = customers.map(customer => {
    const customerInvoices = invoices.filter(invoice => invoice.customerId === customer.id);
    const totalAmount = customerInvoices.reduce((sum, invoice) => sum + invoice.total, 0);
    const totalInvoices = customerInvoices.length;
    
    return {
      ...customer,
      totalInvoices,
      totalAmount,
      invoices: customerInvoices
    };
  });

  res.json(customerReports);
});

app.get('/api/reports/products', async (req, res) => {
  const invoices = await readJsonFile(invoicesFile);
  const products = await readJsonFile(productsFile);
  
  const productStats = {};
  
  invoices.forEach(invoice => {
    invoice.items.forEach(item => {
      if (!productStats[item.productId]) {
        productStats[item.productId] = {
          totalQuantity: 0,
          totalRevenue: 0,
          invoiceCount: 0
        };
      }
      productStats[item.productId].totalQuantity += item.quantity;
      productStats[item.productId].totalRevenue += item.quantity * item.price;
      productStats[item.productId].invoiceCount += 1;
    });
  });

  const productReports = products.map(product => ({
    ...product,
    ...productStats[product.id] || { totalQuantity: 0, totalRevenue: 0, invoiceCount: 0 }
  }));

  res.json(productReports);
});

// Initialize and start server
initializeDataFiles().then(() => {
  app.listen(PORT, () => {
    console.log(`InvoiceBuddy API server running on http://localhost:${PORT}`);
  });
});