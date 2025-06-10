
"use client";

import { useState, useEffect, useMemo } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableFooter as TableSummaryFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Trash2, Search, Printer, Send } from "lucide-react";
import type { Product, ProductVariant, InvoiceItem } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";

// Mock data - replace with actual data fetching logic
const mockProducts: Product[] = [
  { id: "prod_1", name: "ACC Cement", description: "High-quality Ordinary Portland Cement", category: "Cement", supplierId: "sup_1", isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { id: "prod_2", name: "TMT Steel Bar", description: "High-strength TMT steel bars", category: "Steel", supplierId: "sup_2", isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { id: "prod_3", name: "Asian Paints Apex", description: "Exterior weather-proof paint", category: "Paints", supplierId: "sup_3", isActive: true, createdAt: new Date(), updatedAt: new Date() },
];

const mockVariants: ProductVariant[] = [
    { id: "var_1_1", productId: "prod_1", sku: "ACC-50KG-OPC43", size: "50kg", variety: "OPC 43 Grade", purchasePrice: 350, sellingPrice: 380, quantityInStock: 50, lowStockThreshold: 10, imageUrl: "https://placehold.co/100x100.png" },
    { id: "var_1_2", productId: "prod_1", sku: "ACC-50KG-OPC53", size: "50kg", variety: "OPC 53 Grade", purchasePrice: 370, sellingPrice: 400, quantityInStock: 30, lowStockThreshold: 10, imageUrl: "https://placehold.co/100x100.png" },
    { id: "var_2_1", productId: "prod_2", sku: "TMT-12MM-FE500D", size: "12mm", variety: "Fe 500D", purchasePrice: 55000, sellingPrice: 58000, quantityInStock: 25, lowStockThreshold: 5, imageUrl: "https://placehold.co/100x100.png" },
    { id: "var_3_1", productId: "prod_3", sku: "AP-APEX-WHT-20L", size: "20 Litre", variety: "White, Matte", purchasePrice: 2800, sellingPrice: 3200, quantityInStock: 15, lowStockThreshold: 3, imageUrl: "https://placehold.co/100x100.png" },
];


export default function BillingPage() {
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [taxRate, setTaxRate] = useState(0.05); // 5% tax rate
  const { toast } = useToast();

  const availableProductsForSearch = useMemo(() => {
    return mockVariants
      .map(variant => {
        const product = mockProducts.find(p => p.id === variant.productId);
        return product ? { ...variant, productName: product.name } : null;
      })
      .filter(Boolean) as (ProductVariant & { productName: string })[];
  }, []);
  
  const filteredProducts = useMemo(() => {
    if (!searchTerm) return [];
    return availableProductsForSearch.filter(
      (variant) =>
        variant.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        variant.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        variant.size.toLowerCase().includes(searchTerm.toLowerCase()) ||
        variant.variety.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, availableProductsForSearch]);

  const addItemToBill = (variant: ProductVariant & { productName: string }) => {
    const existingItem = items.find(item => item.variantId === variant.id);
    if (existingItem) {
      // Optionally increase quantity or show a message
      toast({ title: "Item already added", description: "Increase quantity in the bill if needed.", variant: "default" });
      return;
    }
    if (variant.quantityInStock <= 0) {
      toast({ title: "Out of Stock", description: `${variant.productName} (${variant.size}) is out of stock.`, variant: "destructive" });
      return;
    }
    const newItem: InvoiceItem = {
      productId: variant.productId,
      variantId: variant.id,
      productName: variant.productName,
      variantDetails: `${variant.size}${variant.variety ? ', ' + variant.variety : ''}`,
      quantity: 1,
      unitPrice: variant.sellingPrice,
      totalPrice: variant.sellingPrice,
    };
    setItems([...items, newItem]);
    setSearchTerm(""); // Clear search after adding
  };

  const updateItemQuantity = (variantId: string, quantity: number) => {
    const variant = availableProductsForSearch.find(v => v.id === variantId);
    if (variant && quantity > variant.quantityInStock) {
      toast({ title: "Insufficient Stock", description: `Only ${variant.quantityInStock} units available for ${variant.productName}.`, variant: "destructive"});
      setItems(items.map(item => item.variantId === variantId ? { ...item, quantity: variant.quantityInStock, totalPrice: item.unitPrice * variant.quantityInStock } : item));
      return;
    }
    if (quantity <= 0) {
      removeItemFromBill(variantId); // Remove if quantity is 0 or less
      return;
    }
    setItems(
      items.map(item =>
        item.variantId === variantId ? { ...item, quantity, totalPrice: item.unitPrice * quantity } : item
      )
    );
  };

  const removeItemFromBill = (variantId: string) => {
    setItems(items.filter(item => item.variantId !== variantId));
  };

  const subTotal = useMemo(() => items.reduce((sum, item) => sum + item.totalPrice, 0), [items]);
  const taxAmount = useMemo(() => subTotal * taxRate, [subTotal, taxRate]);
  const grandTotal = useMemo(() => subTotal + taxAmount, [subTotal, taxAmount]);

  const handleGenerateBill = async () => {
    if (items.length === 0) {
      toast({ title: "Empty Bill", description: "Please add items to the bill.", variant: "destructive" });
      return;
    }
    if (!customerName || !customerPhone) {
      toast({ title: "Customer Info Missing", description: "Please enter customer name and phone.", variant: "destructive" });
      return;
    }

    const invoiceData = {
      customerDetails: { name: customerName, phone: customerPhone, address: customerAddress },
      items,
      subTotal,
      taxRate,
      taxAmount,
      grandTotal,
      status: "Paid", // Or implement payment status logic
    };

    // Placeholder for calling createInvoice Cloud Function
    console.log("Generating bill:", invoiceData);
    toast({ title: "Bill Generated (Mock)", description: `Invoice for ${customerName} created successfully.` });
    
    // Reset form after successful bill generation
    setItems([]);
    setCustomerName("");
    setCustomerPhone("");
    setCustomerAddress("");
  };

  return (
    <>
      <AppHeader pageTitle="Create New Bill" />
      <div className="p-6 grid md:grid-cols-3 gap-6">
        {/* Left Column: Product Search & Bill Items */}
        <div className="md:col-span-2 space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Add Products to Bill</CardTitle>
            </CardHeader>
            <CardContent>
              <Popover>
                <PopoverTrigger asChild>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search products by name, SKU, size..."
                      className="w-full pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </PopoverTrigger>
                {searchTerm && filteredProducts.length > 0 && (
                  <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                    <ScrollArea className="h-[200px]">
                      <div className="p-2 space-y-1">
                        {filteredProducts.map(variant => (
                          <Button
                            key={variant.id}
                            variant="ghost"
                            className="w-full justify-start h-auto p-2 text-left"
                            onClick={() => addItemToBill(variant)}
                          >
                            <Image src={variant.imageUrl || "https://placehold.co/40x40.png"} alt={variant.productName} width={40} height={40} className="mr-2 rounded" data-ai-hint="product construction" />
                            <div>
                              <div className="font-medium">{variant.productName}</div>
                              <div className="text-xs text-muted-foreground">
                                {variant.size} ({variant.variety}) - SKU: {variant.sku} - Stock: {variant.quantityInStock}
                              </div>
                              <div className="text-xs font-semibold">Price: ${variant.sellingPrice.toLocaleString()}</div>
                            </div>
                          </Button>
                        ))}
                      </div>
                    </ScrollArea>
                  </PopoverContent>
                )}
              </Popover>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Bill Items</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead className="w-[100px]">Quantity</TableHead>
                    <TableHead className="text-right">Unit Price</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.length > 0 ? items.map(item => (
                    <TableRow key={item.variantId}>
                      <TableCell>
                        <div className="font-medium">{item.productName}</div>
                        <div className="text-xs text-muted-foreground">{item.variantDetails}</div>
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateItemQuantity(item.variantId, parseInt(e.target.value))}
                          min="1"
                          className="w-20 h-8"
                        />
                      </TableCell>
                      <TableCell className="text-right">${item.unitPrice.toLocaleString()}</TableCell>
                      <TableCell className="text-right">${item.totalPrice.toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => removeItemFromBill(item.variantId)} className="text-destructive h-8 w-8">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                        No items added to the bill yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
                 {items.length > 0 && (
                  <TableSummaryFooter>
                    <TableRow>
                      <TableCell colSpan={3} className="text-right font-medium">Subtotal</TableCell>
                      <TableCell className="text-right font-medium">${subTotal.toLocaleString()}</TableCell>
                      <TableCell />
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={2} className="text-right">Tax Rate</TableCell>
                      <TableCell className="text-right">
                        <Input type="number" value={taxRate * 100} onChange={e => setTaxRate(parseFloat(e.target.value) / 100)} className="w-20 h-8 text-right" step="0.01" />%
                      </TableCell>
                      <TableCell className="text-right">${taxAmount.toLocaleString()}</TableCell>
                      <TableCell />
                    </TableRow>
                     <TableRow className="text-lg">
                      <TableCell colSpan={3} className="text-right font-bold">Grand Total</TableCell>
                      <TableCell className="text-right font-bold">${grandTotal.toLocaleString()}</TableCell>
                      <TableCell />
                    </TableRow>
                  </TableSummaryFooter>
                )}
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Customer Info & Summary */}
        <div className="md:col-span-1 space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="customerName">Name</Label>
                <Input id="customerName" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="John Doe" />
              </div>
              <div>
                <Label htmlFor="customerPhone">Phone</Label>
                <Input id="customerPhone" type="tel" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} placeholder="123-456-7890" />
              </div>
              <div>
                <Label htmlFor="customerAddress">Address (Optional)</Label>
                <Input id="customerAddress" value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)} placeholder="123 Main St, City" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg sticky top-[calc(theme(spacing.16)_+_theme(spacing.6))]"> {/* h-16 (header) + p-6 (main padding) */}
            <CardHeader>
              <CardTitle>Bill Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between"><span>Subtotal:</span><span>${subTotal.toLocaleString()}</span></div>
              <div className="flex justify-between"><span>Tax ({ (taxRate * 100).toFixed(2) }%):</span><span>${taxAmount.toLocaleString()}</span></div>
              <hr className="my-2"/>
              <div className="flex justify-between text-xl font-bold"><span>Grand Total:</span><span>${grandTotal.toLocaleString()}</span></div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button onClick={handleGenerateBill} className="w-full text-lg py-3" size="lg">
                <Send className="mr-2 h-5 w-5" /> Generate Bill
              </Button>
              <Button variant="outline" className="w-full">
                <Printer className="mr-2 h-4 w-4" /> Print Preview
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
}
