
"use client";

import { useState, useEffect } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { PlusCircle, MoreHorizontal, Edit3, Trash2, Search } from "lucide-react";
import type { Supplier } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

// Mock data
const mockSuppliers: Supplier[] = [
  { id: "sup_1", name: "Global Cement Distributors", contactPerson: "Rajesh Kumar", phone: "9876543210", email: "rajesh@globalcement.com", address: "123 Industrial Area, City A", createdAt: new Date(), updatedAt: new Date() },
  { id: "sup_2", name: "Reliable Steels", contactPerson: "Priya Sharma", phone: "8765432109", email: "priya@reliablesteels.co", address: "456 Steel Mill Road, City B", createdAt: new Date(), updatedAt: new Date() },
  { id: "sup_3", name: "PaintMax Inc.", contactPerson: "Amit Singh", phone: "7654321098", email: "amit@paintmax.com", address: "789 Chemical Lane, City C", createdAt: new Date(), updatedAt: new Date() },
];

function SupplierFormFields({ supplier, onSave, onCancel }: { 
  supplier?: Supplier; 
  onSave: (data: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => void; 
  onCancel: () => void;
}) {
  const [name, setName] = useState(supplier?.name || "");
  const [contactPerson, setContactPerson] = useState(supplier?.contactPerson || "");
  const [phone, setPhone] = useState(supplier?.phone || "");
  const [email, setEmail] = useState(supplier?.email || "");
  const [address, setAddress] = useState(supplier?.address || "");

  useEffect(() => {
    setName(supplier?.name || "");
    setContactPerson(supplier?.contactPerson || "");
    setPhone(supplier?.phone || "");
    setEmail(supplier?.email || "");
    setAddress(supplier?.address || "");
  }, [supplier]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ id: supplier?.id, name, contactPerson, phone, email, address });
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>{supplier ? "Edit Supplier" : "Add New Supplier"}</DialogTitle>
        <DialogDescription>
          {supplier ? "Update the details of this supplier." : "Enter the details for the new supplier."}
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="s_name">Supplier Name</Label>
          <Input id="s_name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="s_contactPerson">Contact Person</Label>
          <Input id="s_contactPerson" value={contactPerson} onChange={(e) => setContactPerson(e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="s_phone">Phone</Label>
            <Input id="s_phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="s_email">Email</Label>
            <Input id="s_email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="s_address">Address</Label>
          <Input id="s_address" value={address} onChange={(e) => setAddress(e.target.value)} />
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit">{supplier ? "Save Changes" : "Add Supplier"}</Button>
        </DialogFooter>
      </form>
    </>
  );
}


export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>(mockSuppliers);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [supplierToDelete, setSupplierToDelete] = useState<Supplier | null>(null);


  const handleSaveSupplier = (data: Omit<Supplier, 'createdAt' | 'updatedAt'> & { id?: string }) => {
    if (data.id) { // Edit
      setSuppliers(suppliers.map(s => s.id === data.id ? { ...s, ...data, updatedAt: new Date() } : s));
      toast({ title: "Supplier Updated", description: `${data.name} has been updated successfully.` });
      setEditingSupplier(null);
    } else { // Add
      const newSupplier = { ...data, id: `sup_${Date.now()}`, createdAt: new Date(), updatedAt: new Date() } as Supplier;
      setSuppliers([newSupplier, ...suppliers]);
      toast({ title: "Supplier Added", description: `${data.name} has been added successfully.` });
      setIsAddModalOpen(false);
    }
  };

  const confirmDeleteSupplier = () => {
    if (supplierToDelete) {
      setSuppliers(suppliers.filter(s => s.id !== supplierToDelete.id));
      toast({ title: "Supplier Deleted", description: `${supplierToDelete.name} has been deleted.`, variant: "destructive" });
      setSupplierToDelete(null);
    }
  };
  
  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (supplier.contactPerson && supplier.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (supplier.email && supplier.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <>
      <AppHeader pageTitle="Supplier Management" />
      <div className="p-6 space-y-6">
        <Card className="shadow-lg">
          <CardHeader>
           <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <CardTitle>Suppliers</CardTitle>
                <CardDescription>Manage your supplier information.</CardDescription>
              </div>
              <div className="flex gap-2 items-center w-full md:w-auto">
                 <div className="relative flex-1 md:flex-initial">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search suppliers..."
                      className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button onClick={() => setIsAddModalOpen(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Supplier
                  </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact Person</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSuppliers.length > 0 ? filteredSuppliers.map((supplier) => (
                  <TableRow key={supplier.id}>
                    <TableCell className="font-medium">{supplier.name}</TableCell>
                    <TableCell>{supplier.contactPerson}</TableCell>
                    <TableCell>{supplier.phone}</TableCell>
                    <TableCell>{supplier.email}</TableCell>
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
                          <DropdownMenuItem onSelect={() => setEditingSupplier(supplier)}>
                            <Edit3 className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onSelect={() => setSupplierToDelete(supplier)} className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )) : (
                   <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No suppliers found. Add one to get started.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Add Supplier Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <SupplierFormFields 
            onSave={handleSaveSupplier}
            onCancel={() => setIsAddModalOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Supplier Modal */}
      {editingSupplier && (
        <Dialog open={!!editingSupplier} onOpenChange={(open) => { if(!open) setEditingSupplier(null); }}>
          <DialogContent className="sm:max-w-lg" key={editingSupplier.id}>
             <SupplierFormFields 
              supplier={editingSupplier}
              onSave={handleSaveSupplier}
              onCancel={() => setEditingSupplier(null)}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      {supplierToDelete && (
        <AlertDialog open={!!supplierToDelete} onOpenChange={(open) => {if (!open) setSupplierToDelete(null)}}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the supplier "{supplierToDelete.name}".
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setSupplierToDelete(null)}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDeleteSupplier} className="bg-destructive hover:bg-destructive/90">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}
