
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
import { PlusCircle, X } from 'lucide-react';
import DashboardLayout from '@/components/dashboard-layout';
import Header from '@/components/dashboard/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

// Mock data for companies
const companies = [
  {
    id: 1,
    name: 'Soluciones Tech SAS',
    city: 'Bogotá',
    status: 'Active',
    avatarId: 'company-avatar',
  },
  {
    id: 2,
    name: 'Innovatec Colombia',
    city: 'Medellín',
    status: 'Active',
    avatarId: 'company-avatar',
  },
  {
    id: 3,
    name: 'Sistemas & Consultores',
    city: 'Cali',
    status: 'Inactive',
    avatarId: 'company-avatar',
  },
];

const companySchema = z.object({
  name: z.string().min(1, 'El nombre es requerido.'),
  city: z.string().min(1, 'La ciudad es requerida.'),
});

type CompanySchema = z.infer<typeof companySchema>;

function CompanyForm({ onRegisterSuccess }: { onRegisterSuccess?: () => void }) {
  const { toast } = useToast();

  const form = useForm<CompanySchema>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: '',
      city: '',
    },
  });

  function onSubmit(data: CompanySchema) {
    try {
      console.log('Company data submitted:', data);
      toast({
        title: 'Registro Exitoso',
        description: 'La empresa ha sido registrada correctamente.',
      });
      form.reset();
      if (onRegisterSuccess) {
        onRegisterSuccess();
      }
    } catch (error) {
      console.error('Error during registration:', error);
      toast({
        variant: 'destructive',
        title: 'Error de Registro',
        description: 'No se pudo registrar la empresa. Inténtalo de nuevo.',
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4 px-6 pb-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre / Razón Social</FormLabel>
              <FormControl>
                <Input placeholder="Soluciones Tech SAS" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ciudad</FormLabel>
              <FormControl>
                <Input placeholder="Bogotá" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
          Registrar Empresa
        </Button>
      </form>
    </Form>
  );
}

export default function EmpresasPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const companyAvatar = PlaceHolderImages.find((img) => img.id === 'company-avatar');

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full min-w-[800px]">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold font-headline tracking-tight">Empresas</h1>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Nueva Empresa
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[90vw] max-w-[90vw] md:w-full md:max-w-md rounded-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-headline text-center pt-12">Crear nueva empresa</DialogTitle>
                  <DialogDescription className="text-center">
                    Introduce los datos para registrar una nueva empresa.
                  </DialogDescription>
                </DialogHeader>
                <CompanyForm onRegisterSuccess={() => setIsDialogOpen(false)} />
                 <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                </DialogClose>
              </DialogContent>
            </Dialog>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Listado de Empresas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Empresa</TableHead>
                      <TableHead>Ciudad</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {companies.map((company) => (
                      <TableRow key={company.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                             <Avatar className="h-9 w-9">
                                <AvatarImage src={companyAvatar?.imageUrl} data-ai-hint={companyAvatar?.imageHint} />
                                <AvatarFallback>{company.name.charAt(0)}</AvatarFallback>
                             </Avatar>
                             <div className="grid gap-0.5">
                                <p className="font-medium">{company.name}</p>
                             </div>
                          </div>
                        </TableCell>
                        <TableCell>{company.city}</TableCell>
                        <TableCell>
                          <Badge variant={company.status === 'Active' ? 'default' : 'destructive'}>
                            {company.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            Editar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </DashboardLayout>
  );
}

    