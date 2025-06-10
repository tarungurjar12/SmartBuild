
"use client";

import { useState } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { PlusCircle, MoreHorizontal, Edit3, Trash2, Search } from "lucide-react";
import type { Supplier } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

// Mock data
const mockSuppliers: Supplier[] = [
  { id: "sup_1", name: "Global Cement Distributors", contactPerson: "Rajesh Kumar", phone: "9876543210", email: "rajesh@globalcement.com", address: "123 Industrial Area, City A", createdAt: new Date() },
  { id: "sup_2", name: "Reliable Steels", contactPerson: "Priya Sharma", phone: "8765432109", email: "priya@reliablesteels.co", address: "456 Steel Mill Road, City B", createdAt: new Date() },
  { id: "sup_3", name: "PaintMax Inc.", contactPerson: "Amit Singh", phone: "7654321098", email: "amit@paintmax.com", address: "789 Chemical Lane, City C", createdAt: new Date() },
];

function SupplierFormModal({ supplier, onSave, trigger }: { supplier?: Supplier; onSave: (data: any) => void; trigger: React.ReactNode }) {
  const [name, setName] = useState(supplier?.name || "");
  const [contactPerson, setContactPerson] = useState(supplier?.contactPerson || "");
  const [phone, setPhone] = useState(supplier?.phone || "");
  const [email, setEmail] = useState(supplier?.email || "");
  const [address, setAddress] = useState(supplier?.address || "");
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ id: supplier?.id, name, contactPerson, phone, email, address });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{supplier ? "Edit Supplier" : "Add New Supplier"}</DialogTitle>
          <DialogDescription>
            {supplier ? "Update the details of this supplier." : "Enter the details for the new supplier."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Supplier Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="contactPerson">Contact Person</Label>
            <Input id="contactPerson" value={contactPerson} onChange={(e) => setContactPerson(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button type="submit">{supplier ? "Save Changes" : "Add Supplier"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}


export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>(mockSuppliers);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSaveSupplier = (data: any) => {
    if (data.id) { // Edit
      setSuppliers(suppliers.map(s => s.id === data.id ? { ...s, ...data } : s));
    } else { // Add
      const newSupplier = { ...data, id: `sup_${Date.now()}`, createdAt: new Date() };
      setSuppliers([newSupplier, ...suppliers]);
    }
  };

  const handleDeleteSupplier = (supplierId: string) => {
    setSuppliers(suppliers.filter(s => s.id !== supplierId));
  };
  
  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.email.toLowerCase().includes(searchTerm.toLowerCase())
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
                  <SupplierFormModal
                    onSave={handleSaveSupplier}
                    trigger={
                      <Button>
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Supplier
                      </Button>
                    }
                  />
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
                          <DropdownMenuItem>
                            <SupplierFormModal
                              supplier={supplier}
                              onSave={handleSaveSupplier}
                              trigger={
                                <div className="flex items-center w-full">
                                  <Edit3 className="mr-2 h-4 w-4" /> Edit
                                </div>
                              }
                            />
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteSupplier(supplier.id)} className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )) : (
                   <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No suppliers found.
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
