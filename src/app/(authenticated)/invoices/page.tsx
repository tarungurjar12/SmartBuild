
"use client";

import { useState } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Printer, Search, Filter } from "lucide-react";
import type { Invoice } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/shared/DatePickerWithRange";
import { DateRange } from "react-day-picker";

// Mock data
const mockInvoices: Invoice[] = [
  { id: "inv_1", invoiceNumber: "INV-2024-0001", customerDetails: { name: "John Doe", phone: "1234567890", address: "123 Main St" }, items: [], subTotal: 250, taxAmount: 12.5, grandTotal: 262.5, status: "Paid", createdAt: new Date("2024-07-28"), createdBy: "user_staff_1" },
  { id: "inv_2", invoiceNumber: "INV-2024-0002", customerDetails: { name: "Jane Smith", phone: "0987654321", address: "456 Oak Ave" }, items: [], subTotal: 1500, taxAmount: 75, grandTotal: 1575, status: "Unpaid", createdAt: new Date("2024-07-27"), createdBy: "user_admin_1" },
  { id: "inv_3", invoiceNumber: "INV-2024-0003", customerDetails: { name: "Builder Co.", phone: "1122334455", address: "789 Pine Rd" }, items: [], subTotal: 570, taxAmount: 28.5, grandTotal: 598.5, status: "Paid", createdAt: new Date("2024-07-26"), createdBy: "user_staff_1" },
  { id: "inv_4", invoiceNumber: "INV-2024-0004", customerDetails: { name: "Alice Brown", phone: "5544332211", address: "321 Elm St" }, items: [], subTotal: 85, taxAmount: 4.25, grandTotal: 89.25, status: "Cancelled", createdAt: new Date("2024-07-25"), createdBy: "user_admin_1" },
];

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          invoice.customerDetails.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || invoice.status.toLowerCase() === statusFilter;
    const matchesDate = !dateRange || (
      (!dateRange.from || invoice.createdAt >= dateRange.from) &&
      (!dateRange.to || invoice.createdAt <= dateRange.to)
    );
    return matchesSearch && matchesStatus && matchesDate;
  });

  return (
    <>
      <AppHeader pageTitle="Invoices" />
      <div className="p-6 space-y-6">
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <CardTitle>Invoice List</CardTitle>
                <CardDescription>View and manage all customer invoices.</CardDescription>
              </div>
              <div className="flex gap-2 items-center w-full md:w-auto flex-wrap">
                 <div className="relative flex-1 md:flex-initial min-w-[200px]">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search invoices or customers..."
                      className="pl-8 w-full"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline">
                        <Filter className="mr-2 h-4 w-4" /> Filters
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80" align="end">
                      <div className="grid gap-4 p-4">
                        <div className="space-y-2">
                          <h4 className="font-medium leading-none">Filter Invoices</h4>
                          <p className="text-sm text-muted-foreground">
                            Refine invoices by status and date range.
                          </p>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="statusFilter">Status</Label>
                           <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger id="statusFilter">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Statuses</SelectItem>
                              <SelectItem value="paid">Paid</SelectItem>
                              <SelectItem value="unpaid">Unpaid</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                           <Label>Date Range</Label>
                           <DatePickerWithRange date={dateRange} onDateChange={setDateRange} />
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.length > 0 ? filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                    <TableCell>{invoice.customerDetails.name}</TableCell>
                    <TableCell>{new Date(invoice.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>${invoice.grandTotal.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          invoice.status === "Paid" ? "default" :
                          invoice.status === "Unpaid" ? "destructive" :
                          "secondary"
                        }
                      >
                        {invoice.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" /> View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Printer className="mr-2 h-4 w-4" /> Print Invoice
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No invoices found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
