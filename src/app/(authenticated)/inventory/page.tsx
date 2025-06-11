
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AppHeader } from "@/components/layout/AppHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { PlusCircle, MoreHorizontal, Search, Edit3, Trash2 } from "lucide-react";
import type { Product } from "@/lib/types";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

// Mock data
const mockProducts: Product[] = [
  { id: "prod_1", name: "ACC Cement", description: "High-quality Ordinary Portland Cement", category: "Cement", supplierId: "sup_1", supplierName: "Global Cement Distributors", isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { id: "prod_2", name: "TMT Steel Bar", description: "High-strength TMT steel bars", category: "Steel", supplierId: "sup_2", supplierName: "Reliable Steels", isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { id: "prod_3", name: "Asian Paints Apex", description: "Exterior weather-proof paint", category: "Paints", supplierId: "sup_3", supplierName: "PaintMax Inc.", isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { id: "prod_4", name: "PVC Pipes", description: "Durable PVC pipes for plumbing", category: "Pipes", supplierId: "sup_1", supplierName: "Global Cement Distributors", isActive: false, createdAt: new Date(), updatedAt: new Date() },
];

const mockSuppliers = [
  { id: "sup_1", name: "Global Cement Distributors" },
  { id: "sup_2", name: "Reliable Steels" },
  { id: "sup_3", name: "PaintMax Inc." },
];


function ProductFormFields({ product, suppliers, onSave, onCancel }: { 
  product?: Product; 
  suppliers: {id: string, name: string}[]; 
  onSave: (data: any) => void; 
  onCancel: () => void;
}) {
  const [name, setName] = useState(product?.name || "");
  const [description, setDescription] = useState(product?.description || "");
  const [category, setCategory] = useState(product?.category || "");
  const [supplierId, setSupplierId] = useState(product?.supplierId || "");
  const [isActive, setIsActive] = useState(product?.isActive !== undefined ? product.isActive : true);

  useEffect(() => {
    setName(product?.name || "");
    setDescription(product?.description || "");
    setCategory(product?.category || "");
    setSupplierId(product?.supplierId || "");
    setIsActive(product?.isActive !== undefined ? product.isActive : true);
  }, [product]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ id: product?.id, name, description, category, supplierId, isActive });
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>{product ? "Edit Product" : "Add New Product"}</DialogTitle>
        <DialogDescription>
          {product ? "Update the details of this product." : "Enter the details for the new product."}
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="grid gap-6 py-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Product Name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="category">Category</Label>
            <Input id="category" value={category} onChange={(e) => setCategory(e.target.value)} required />
          </div>
           <div className="grid gap-2">
            <Label htmlFor="supplierId">Supplier</Label>
            <select
              id="supplierId"
              value={supplierId}
              onChange={(e) => setSupplierId(e.target.value)}
              required
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="" disabled>Select supplier</option>
              {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Switch id="isActive" checked={isActive} onCheckedChange={setIsActive} />
          <Label htmlFor="isActive">Active</Label>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit">{product ? "Save Changes" : "Add Product"}</Button>
        </DialogFooter>
      </form>
    </>
  );
}


export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);


  const handleSaveProduct = (data: any) => {
    const supplierName = mockSuppliers.find(s => s.id === data.supplierId)?.name || 'N/A';
    if (data.id) { // Edit
      setProducts(products.map(p => p.id === data.id ? { ...p, ...data, supplierName } : p));
      toast({ title: "Product Updated", description: `${data.name} has been updated.` });
      setEditingProduct(null); // Close edit modal
    } else { // Add
      const newProduct = { ...data, id: `prod_${Date.now()}`, createdAt: new Date(), updatedAt: new Date(), supplierName };
      setProducts([newProduct, ...products]);
      toast({ title: "Product Added", description: `${data.name} has been added.` });
      setIsAddProductModalOpen(false); // Close add modal
    }
  };
  
  const handleDeleteProduct = (productId: string) => {
    // Add confirmation dialog before deleting
    const productToDelete = products.find(p => p.id === productId);
    setProducts(products.filter(p => p.id !== productId));
    toast({ title: "Product Deleted", description: `${productToDelete?.name} has been deleted.`, variant: "destructive" });
  };


  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.supplierName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <AppHeader pageTitle="Inventory Management" />
      <div className="p-6 space-y-6">
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <CardTitle>Products</CardTitle>
                <CardDescription>Manage your products and their variants.</CardDescription>
              </div>
              <div className="flex gap-2 items-center w-full md:w-auto">
                 <div className="relative flex-1 md:flex-initial">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search products..."
                      className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Dialog open={isAddProductModalOpen} onOpenChange={setIsAddProductModalOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Product
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-lg">
                      <ProductFormFields
                        suppliers={mockSuppliers}
                        onSave={handleSaveProduct}
                        onCancel={() => setIsAddProductModalOpen(false)}
                      />
                    </DialogContent>
                  </Dialog>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length > 0 ? filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">
                       <Link href={`/inventory/${product.id}`} className="hover:underline text-primary">
                        {product.name}
                      </Link>
                    </TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>{product.supplierName || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge variant={product.isActive ? "default" : "secondary"}>
                        {product.isActive ? "Active" : "Inactive"}
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
                          <DropdownMenuItem asChild>
                            <Link href={`/inventory/${product.id}`} className="flex items-center w-full cursor-pointer">
                              <Edit3 className="mr-2 h-4 w-4" /> View/Edit Variants
                            </Link>
                          </DropdownMenuItem>
                           <DropdownMenuItem
                             onSelect={(e) => {
                               e.preventDefault();
                               setEditingProduct(product);
                             }}
                             className="flex items-center w-full cursor-pointer"
                           >
                              <Edit3 className="mr-2 h-4 w-4" /> Edit Product
                           </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleDeleteProduct(product.id)} className="text-destructive flex items-center w-full cursor-pointer">
                            <Trash2 className="mr-2 h-4 w-4" /> Delete Product
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No products found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {editingProduct && (
        <Dialog open={!!editingProduct} onOpenChange={(open) => { if(!open) setEditingProduct(null); }}>
          <DialogContent className="sm:max-w-lg">
            <ProductFormFields
              product={editingProduct}
              suppliers={mockSuppliers}
              onSave={handleSaveProduct}
              onCancel={() => setEditingProduct(null)}
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

    