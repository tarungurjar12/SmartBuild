
"use client"; // For potential client-side data fetching or interactions

import { AppHeader } from "@/components/layout/AppHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Package, ShoppingCart, AlertTriangle, Users, ListChecks } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// Mock data - replace with actual data fetching
const dashboardStats = {
  totalSalesToday: 1250.75,
  lowStockProductsCount: 5,
  activeSuppliers: 12,
  pendingOrders: 3,
};

const salesData = [
  { name: 'Mon', sales: 4000 },
  { name: 'Tue', sales: 3000 },
  { name: 'Wed', sales: 2000 },
  { name: 'Thu', sales: 2780 },
  { name: 'Fri', sales: 1890 },
  { name: 'Sat', sales: 2390 },
  { name: 'Sun', sales: 3490 },
];

const lowStockProducts = [
  { id: '1', name: 'ACC Cement (OPC 43)', variant: '50kg Bag', stock: 8, threshold: 10, supplier: 'Global Cement' },
  { id: '2', name: 'TMT Steel Bar (Fe 500D)', variant: '12mm', stock: 15, threshold: 20, supplier: 'Steel Co.' },
  { id: '3', name: 'Asian Paints Apex', variant: 'White, 20L', stock: 3, threshold: 5, supplier: 'PaintMax' },
];

const recentInvoices = [
  { id: 'INV-2024-0012', customer: 'John Doe', amount: 250.00, status: 'Paid', date: '2024-07-28' },
  { id: 'INV-2024-0011', customer: 'Jane Smith', amount: 175.50, status: 'Paid', date: '2024-07-28' },
  { id: 'INV-2024-0010', customer: 'Builder Corp', amount: 1200.00, status: 'Unpaid', date: '2024-07-27' },
];

export default function DashboardPage() {
  return (
    <>
      <AppHeader pageTitle="Dashboard" />
      <div className="p-6 space-y-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue Today</CardTitle>
              <DollarSign className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${dashboardStats.totalSalesToday.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+5.2% from yesterday</p>
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats.lowStockProductsCount}</div>
              <Link href="/inventory?filter=low_stock" className="text-xs text-primary hover:underline">
                View items
              </Link>
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Suppliers</CardTitle>
              <Users className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats.activeSuppliers}</div>
               <Link href="/suppliers" className="text-xs text-primary hover:underline">
                Manage suppliers
              </Link>
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Invoices</CardTitle>
              <ListChecks className="h-5 w-5 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats.pendingOrders}</div>
              <Link href="/invoices?status=unpaid" className="text-xs text-accent hover:underline">
                View invoices
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="shadow-lg col-span-1 md:col-span-2">
            <CardHeader>
              <CardTitle>Sales Overview (Last 7 Days)</CardTitle>
            </CardHeader>
            <CardContent className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="sales" stroke="hsl(var(--primary))" strokeWidth={2} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Low Stock Products</CardTitle>
              <Link href="/inventory?filter=low_stock">
                <Button variant="outline" size="sm">View All</Button>
              </Link>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Variant</TableHead>
                    <TableHead className="text-right">Stock</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lowStockProducts.slice(0,3).map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.variant}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant={product.stock < product.threshold ? "destructive" : "secondary"}>
                          {product.stock}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Invoices</CardTitle>
              <Link href="/invoices">
                <Button variant="outline" size="sm">View All</Button>
              </Link>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentInvoices.slice(0,3).map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.id}</TableCell>
                      <TableCell>{invoice.customer}</TableCell>
                      <TableCell className="text-right">${invoice.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant={invoice.status === 'Paid' ? 'default' : invoice.status === 'Unpaid' ? 'destructive' : 'secondary'}>
                          {invoice.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
