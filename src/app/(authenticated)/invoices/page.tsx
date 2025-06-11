
"use client";

import { useState } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter as TableSummaryFooter } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Printer, Search, Filter, Edit, DollarSign, XCircle, CheckCircle } from "lucide-react";
import type { Invoice, InvoiceItem } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/shared/DatePickerWithRange";
import { DateRange } from "react-day-picker";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

// Mock data
const mockInvoices: Invoice[] = [
  { id: "inv_1", invoiceNumber: "INV-2024-0001", customerDetails: { name: "John Doe", phone: "1234567890", address: "123 Main St" }, items: [{productId: 'p1', variantId: 'v1', productName: 'Cement Bag', variantDetails: '50kg OPC', quantity: 10, unitPrice: 380, totalPrice: 3800}], subTotal: 3800, taxRate: 0.05, taxAmount: 190, grandTotal: 3990, status: "Paid", createdAt: new Date("2024-07-28"), createdBy: "user_staff_1" },
  { id: "inv_2", invoiceNumber: "INV-2024-0002", customerDetails: { name: "Jane Smith", phone: "0987654321", address: "456 Oak Ave" }, items: [{productId: 'p2', variantId: 'v2', productName: 'Steel Bar', variantDetails: '12mm Fe500', quantity: 5, unitPrice: 58000, totalPrice: 290000}], subTotal: 290000, taxRate: 0.05, taxAmount: 14500, grandTotal: 304500, status: "Unpaid", createdAt: new Date("2024-07-27"), createdBy: "user_admin_1" },
  { id: "inv_3", invoiceNumber: "INV-2024-0003", customerDetails: { name: "Builder Co.", phone: "1122334455", address: "789 Pine Rd" }, items: [], subTotal: 570, taxAmount: 28.5, grandTotal: 598.5, status: "Paid", createdAt: new Date("2024-07-26"), createdBy: "user_staff_1" },
  { id: "inv_4", invoiceNumber: "INV-2024-0004", customerDetails: { name: "Alice Brown", phone: "5544332211", address: "321 Elm St" }, items: [], subTotal: 85, taxAmount: 4.25, grandTotal: 89.25, status: "Cancelled", createdAt: new Date("2024-07-25"), createdBy: "user_admin_1" },
];


function InvoiceDetailModal({ invoice, isOpen, onClose }: { invoice: Invoice | null; isOpen: boolean; onClose: () => void; }) {
  if (!invoice) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Invoice Details: {invoice.invoiceNumber}</DialogTitle>
          <DialogDescription>
            Customer: {invoice.customerDetails.name} | Date: {new Date(invoice.createdAt).toLocaleDateString()}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] p-1">
          <div className="space-y-4 pr-4">
            <Card>
              <CardHeader><CardTitle className="text-base">Customer Information</CardTitle></CardHeader>
              <CardContent className="text-sm space-y-1">
                <p><strong>Name:</strong> {invoice.customerDetails.name}</p>
                <p><strong>Phone:</strong> {invoice.customerDetails.phone}</p>
                <p><strong>Address:</strong> {invoice.customerDetails.address}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-base">Items</CardTitle></CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Qty</TableHead>
                      <TableHead className="text-right">Unit Price</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoice.items.length > 0 ? invoice.items.map((item, index) => (
                      <TableRow key={`${item.variantId}-${index}`}>
                        <TableCell>
                          <div className="font-medium">{item.productName}</div>
                          <div className="text-xs text-muted-foreground">{item.variantDetails}</div>
                        </TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell className="text-right">${item.unitPrice.toLocaleString()}</TableCell>
                        <TableCell className="text-right">${item.totalPrice.toLocaleString()}</TableCell>
                      </TableRow>
                    )) : (
                      <TableRow><TableCell colSpan={4} className="text-center h-20">No items in this invoice.</TableCell></TableRow>
                    )}
                  </TableBody>
                  {invoice.items.length > 0 && (
                  <TableSummaryFooter>
                      <TableRow>
                          <TableCell colSpan={3} className="text-right font-medium">Subtotal</TableCell>
                          <TableCell className="text-right font-medium">${invoice.subTotal.toLocaleString()}</TableCell>
                      </TableRow>
                      <TableRow>
                          <TableCell colSpan={3} className="text-right">Tax ({((invoice.taxRate || 0) * 100).toFixed(2)}%)</TableCell>
                          <TableCell className="text-right">${invoice.taxAmount.toLocaleString()}</TableCell>
                      </TableRow>
                      <TableRow className="text-lg">
                          <TableCell colSpan={3} className="text-right font-bold">Grand Total</TableCell>
                          <TableCell className="text-right font-bold">${invoice.grandTotal.toLocaleString()}</TableCell>
                      </TableRow>
                  </TableSummaryFooter>
                  )}
                </Table>
              </CardContent>
            </Card>
             <div className="text-sm">
                <strong>Status:</strong> <Badge variant={ invoice.status === "Paid" ? "default" : invoice.status === "Unpaid" ? "destructive" : "secondary" }>{invoice.status}</Badge>
            </div>
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
          <Button><Printer className="mr-2 h-4 w-4" /> Print Invoice</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const { toast } = useToast();

  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const handleViewDetails = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsDetailModalOpen(true);
  };

  const handleUpdateInvoiceStatus = (invoiceId: string, newStatus: "Paid" | "Unpaid" | "Cancelled") => {
    setInvoices(prevInvoices => 
      prevInvoices.map(inv => 
        inv.id === invoiceId ? { ...inv, status: newStatus, updatedAt: new Date() } : inv
      )
    );
    toast({ title: "Invoice Status Updated", description: `Invoice ${invoices.find(i=>i.id===invoiceId)?.invoiceNumber} marked as ${newStatus}.` });
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          invoice.customerDetails.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || invoice.status.toLowerCase() === statusFilter;
    const matchesDate = !dateRange || (
      (!dateRange.from || new Date(invoice.createdAt) >= dateRange.from) &&
      (!dateRange.to || new Date(invoice.createdAt) <= new Date(new Date(dateRange.to).setHours(23,59,59,999))) // Ensure end of day
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
                          <DropdownMenuItem onSelect={() => handleViewDetails(invoice)}>
                            <Eye className="mr-2 h-4 w-4" /> View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Printer className="mr-2 h-4 w-4" /> Print Invoice
                          </DropdownMenuItem>
                          {invoice.status !== "Paid" && invoice.status !== "Cancelled" && (
                            <DropdownMenuItem onSelect={() => handleUpdateInvoiceStatus(invoice.id, "Paid")}>
                              <CheckCircle className="mr-2 h-4 w-4" /> Mark as Paid
                            </DropdownMenuItem>
                          )}
                          {invoice.status !== "Unpaid" && invoice.status !== "Cancelled" && (
                             <DropdownMenuItem onSelect={() => handleUpdateInvoiceStatus(invoice.id, "Unpaid")}>
                              <DollarSign className="mr-2 h-4 w-4" /> Mark as Unpaid
                            </DropdownMenuItem>
                          )}
                          {invoice.status !== "Cancelled" && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onSelect={() => handleUpdateInvoiceStatus(invoice.id, "Cancelled")} className="text-destructive">
                                <XCircle className="mr-2 h-4 w-4" /> Cancel Invoice
                              </DropdownMenuItem>
                            </>
                          )}
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
      <InvoiceDetailModal 
        invoice={selectedInvoice} 
        isOpen={isDetailModalOpen} 
        onClose={() => setIsDetailModalOpen(false)} 
      />
    </>
  );
}

