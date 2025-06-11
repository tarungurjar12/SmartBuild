
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { AppHeader } from "@/components/layout/AppHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PlusCircle, Edit3, Trash2, MoreHorizontal, ArrowLeft, Lightbulb, PackageCheck } from "lucide-react";
import type { Product, ProductVariant } from "@/lib/types";
import { getReorderSuggestions, GetReorderSuggestionsInput, GetReorderSuggestionsOutput } from "@/ai/flows/low-stock-reorder-suggestions";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

// Mock data - replace with actual data fetching logic
const mockProducts: Product[] = [
  { id: "prod_1", name: "ACC Cement", description: "High-quality Ordinary Portland Cement", category: "Cement", supplierId: "sup_1", supplierName: "Global Cement Distributors", isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { id: "prod_2", name: "TMT Steel Bar", description: "High-strength TMT steel bars", category: "Steel", supplierId: "sup_2", supplierName: "Reliable Steels", isActive: true, createdAt: new Date(), updatedAt: new Date() },
];

const mockVariants: { [productId: string]: ProductVariant[] } = {
  "prod_1": [
    { id: "var_1_1", productId: "prod_1", sku: "ACC-50KG-OPC43", size: "50kg", variety: "OPC 43 Grade", purchasePrice: 350, sellingPrice: 380, quantityInStock: 50, lowStockThreshold: 10, averageDailySales: 5, leadTimeDays: 3, imageUrl: "https://placehold.co/400x300.png" },
    { id: "var_1_2", productId: "prod_1", sku: "ACC-50KG-OPC53", size: "50kg", variety: "OPC 53 Grade", purchasePrice: 370, sellingPrice: 400, quantityInStock: 30, lowStockThreshold: 10, averageDailySales: 2, leadTimeDays: 3, imageUrl: "https://placehold.co/400x300.png" },
  ],
  "prod_2": [
    { id: "var_2_1", productId: "prod_2", sku: "TMT-12MM-FE500D", size: "12mm", variety: "Fe 500D", purchasePrice: 55000, sellingPrice: 58000, quantityInStock: 25, lowStockThreshold: 5, averageDailySales: 1, leadTimeDays: 7, imageUrl: "https://placehold.co/400x300.png" },
  ],
};

function VariantFormModal({ variant, productId, onSave, trigger }: { variant?: ProductVariant; productId: string; onSave: (data: Partial<ProductVariant> & {id?: string}) => void; trigger: React.ReactNode }) {
  const [sku, setSku] = useState(variant?.sku || "");
  const [size, setSize] = useState(variant?.size || "");
  const [variety, setVariety] = useState(variant?.variety || "");
  const [purchasePrice, setPurchasePrice] = useState(variant?.purchasePrice || 0);
  const [sellingPrice, setSellingPrice] = useState(variant?.sellingPrice || 0);
  const [quantityInStock, setQuantityInStock] = useState(variant?.quantityInStock || 0);
  const [lowStockThreshold, setLowStockThreshold] = useState(variant?.lowStockThreshold || 0);
  const [averageDailySales, setAverageDailySales] = useState(variant?.averageDailySales || 0);
  const [leadTimeDays, setLeadTimeDays] = useState(variant?.leadTimeDays || 0);
  const [imageUrl, setImageUrl] = useState(variant?.imageUrl || "https://placehold.co/400x300.png");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (variant) {
      setSku(variant.sku);
      setSize(variant.size);
      setVariety(variant.variety);
      setPurchasePrice(variant.purchasePrice);
      setSellingPrice(variant.sellingPrice);
      setQuantityInStock(variant.quantityInStock);
      setLowStockThreshold(variant.lowStockThreshold);
      setAverageDailySales(variant.averageDailySales || 0);
      setLeadTimeDays(variant.leadTimeDays || 0);
      setImageUrl(variant.imageUrl || "https://placehold.co/400x300.png");
    } else {
        // Reset for new variant
        setSku("");
        setSize("");
        setVariety("");
        setPurchasePrice(0);
        setSellingPrice(0);
        setQuantityInStock(0);
        setLowStockThreshold(0);
        setAverageDailySales(0);
        setLeadTimeDays(0);
        setImageUrl("https://placehold.co/400x300.png");
    }
  }, [variant, isOpen]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ 
        id: variant?.id, 
        productId, 
        sku, 
        size, 
        variety, 
        purchasePrice, 
        sellingPrice, 
        quantityInStock, 
        lowStockThreshold, 
        averageDailySales, 
        leadTimeDays, 
        imageUrl 
    });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{variant ? "Edit Variant" : "Add New Variant"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
          <div className="grid gap-2">
            <Label htmlFor="sku">SKU</Label>
            <Input id="sku" value={sku} onChange={(e) => setSku(e.target.value)} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="size">Size</Label>
              <Input id="size" value={size} onChange={(e) => setSize(e.target.value)} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="variety">Variety</Label>
              <Input id="variety" value={variety} onChange={(e) => setVariety(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="purchasePrice">Purchase Price</Label>
              <Input id="purchasePrice" type="number" value={purchasePrice} onChange={(e) => setPurchasePrice(parseFloat(e.target.value))} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="sellingPrice">Selling Price</Label>
              <Input id="sellingPrice" type="number" value={sellingPrice} onChange={(e) => setSellingPrice(parseFloat(e.target.value))} required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="quantityInStock">Quantity In Stock</Label>
              <Input id="quantityInStock" type="number" value={quantityInStock} onChange={(e) => setQuantityInStock(parseInt(e.target.value))} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lowStockThreshold">Low Stock Threshold</Label>
              <Input id="lowStockThreshold" type="number" value={lowStockThreshold} onChange={(e) => setLowStockThreshold(parseInt(e.target.value))} required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="averageDailySales">Avg. Daily Sales</Label>
              <Input id="averageDailySales" type="number" value={averageDailySales} onChange={(e) => setAverageDailySales(parseFloat(e.target.value))} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="leadTimeDays">Lead Time (Days)</Label>
              <Input id="leadTimeDays" type="number" value={leadTimeDays} onChange={(e) => setLeadTimeDays(parseInt(e.target.value))} />
            </div>
          </div>
           <div className="grid gap-2">
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input id="imageUrl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
            {imageUrl && <Image src={imageUrl} alt="Product Variant" width={100} height={100} className="rounded-md mt-2" data-ai-hint="product construction" />}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button type="submit">{variant ? "Save Changes" : "Add Variant"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function ReorderSuggestionModal({ variant, productName, onReorder }: { variant: ProductVariant; productName: string; onReorder: (quantity: number) => void; }) {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestion, setSuggestion] = useState<GetReorderSuggestionsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGetSuggestion = async () => {
    setIsLoading(true);
    setSuggestion(null);
    try {
      const input: GetReorderSuggestionsInput = {
        productId: variant.productId,
        variantId: variant.id,
        productName: productName,
        variantDetails: `${variant.size}, ${variant.variety}`,
        quantityInStock: variant.quantityInStock,
        lowStockThreshold: variant.lowStockThreshold,
        averageDailySales: variant.averageDailySales || 0,
        leadTimeDays: variant.leadTimeDays || 0,
      };
      const result = await getReorderSuggestions(input);
      setSuggestion(result);
    } catch (error) {
      console.error("Error getting reorder suggestion:", error);
      toast({ title: "Error", description: "Failed to get reorder suggestion.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (isOpen && !suggestion && !isLoading) {
      handleGetSuggestion();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);


  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" >
          <Lightbulb className="mr-2 h-4 w-4" /> AI Suggestion
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>AI Reorder Suggestion</DialogTitle>
          <DialogDescription>
            For {productName} - {variant.size} ({variant.variety})
          </DialogDescription>
        </DialogHeader>
        {isLoading && <div className="py-4 text-center">Loading suggestion...</div>}
        {suggestion && !isLoading && (
          <div className="space-y-4 py-4">
            <p><strong>Suggested Reorder Quantity:</strong> <span className="text-primary text-xl font-bold">{suggestion.reorderQuantity}</span> units</p>
            <p><strong>Reasoning:</strong> {suggestion.reasoning}</p>
          </div>
        )}
        {!suggestion && !isLoading && <div className="py-4 text-center">No suggestion available or average daily sales/lead time not set.</div>}
        <DialogFooter className="sm:justify-between">
          <Button type="button" variant="ghost" onClick={handleGetSuggestion} disabled={isLoading}>
            {isLoading ? "Fetching..." : "Refresh Suggestion"}
          </Button>
          <div>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="mr-2">Close</Button>
            {suggestion && <Button type="button" onClick={() => { onReorder(suggestion.reorderQuantity); setIsOpen(false); }}><PackageCheck className="mr-2 h-4 w-4" /> Create Reorder</Button>}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const productId = params.productId as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [variants, setVariants] = useState<ProductVariant[]>([]);

  useEffect(() => {
    const foundProduct = mockProducts.find(p => p.id === productId);
    if (foundProduct) {
      setProduct(foundProduct);
      setVariants(mockVariants[productId] || []);
    } else {
      // Consider redirecting if product not found, or showing a "not found" message
      // router.push('/inventory'); 
      toast({ title: "Product not found", variant: "destructive"});
    }
  }, [productId, toast]);

  const handleSaveVariant = (data: Partial<ProductVariant> & {id?: string}) => {
    if (data.id) { // Edit
      setVariants(variants.map(v => v.id === data.id ? { ...v, ...data } as ProductVariant : v));
      toast({ title: "Success", description: `Variant updated successfully.` });
    } else { // Add
      const newVariant = { 
        ...data, 
        id: `var_${productId}_${Date.now()}`,
        productId: productId,
      } as ProductVariant;
      setVariants([newVariant, ...variants]);
      toast({ title: "Success", description: `Variant added successfully.` });
    }
    // In a real app, you'd save this to your backend (e.g., Firestore)
    // For mock data, updating mockVariants might be needed if you navigate away and back
    // Or manage this in a global state / context
  };
  
  const handleDeleteVariant = (variantId: string) => {
    // Add confirmation dialog here if desired
    setVariants(variants.filter(v => v.id !== variantId));
    toast({ title: "Success", description: "Variant deleted successfully.", variant: "destructive" });
  };

  const handleCreateReorder = (quantity: number) => {
    toast({ title: "Reorder Initiated", description: `Reorder for ${quantity} units has been initiated (mock action).` });
  };

  if (!product) {
    return (
      <>
        <AppHeader />
        <div className="p-6 text-center">Loading product details or product not found...</div>
      </>
    );
  }

  return (
    <>
      <AppHeader pageTitle={`Product: ${product.name}`} />
      <div className="p-6 space-y-6">
        <Button variant="outline" onClick={() => router.push('/inventory')} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Inventory
        </Button>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">{product.name}</CardTitle>
            <CardDescription>{product.description}</CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4">
            <div><strong>Category:</strong> {product.category}</div>
            <div><strong>Supplier:</strong> {product.supplierName}</div>
            <div><strong>Status:</strong> <Badge variant={product.isActive ? "default" : "secondary"}>{product.isActive ? "Active" : "Inactive"}</Badge></div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Product Variants</CardTitle>
              <VariantFormModal
                productId={product.id}
                onSave={handleSaveVariant}
                trigger={
                  <Button size="sm">
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Variant
                  </Button>
                }
              />
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SKU</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Variety</TableHead>
                  <TableHead>Selling Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {variants.length > 0 ? variants.map((variant) => (
                  <TableRow key={variant.id}>
                    <TableCell className="font-medium">{variant.sku}</TableCell>
                    <TableCell>{variant.size}</TableCell>
                    <TableCell>{variant.variety}</TableCell>
                    <TableCell>${variant.sellingPrice.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant={variant.quantityInStock <= variant.lowStockThreshold ? "destructive" : "default"}>
                        {variant.quantityInStock}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                       <ReorderSuggestionModal variant={variant} productName={product.name} onReorder={handleCreateReorder} />
                       <VariantFormModal
                        variant={variant}
                        productId={product.id}
                        onSave={handleSaveVariant}
                        trigger={
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Edit3 className="h-4 w-4" />
                          </Button>
                        }
                      />
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDeleteVariant(variant.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No variants found for this product. Add one to get started.
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
