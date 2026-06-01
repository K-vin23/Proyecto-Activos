'use client';

import { useEffect } from 'react';
import { companiesService } from '@/services/company/companies.service';
import { CompanyList } from '@/types/company.types';
import { useState, useMemo } from 'react';
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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { PlusCircle, X, Pencil, Trash2, Search, Filter, ArrowBigLeft, ArrowBigRight, RotateCcw, Loader2, MapPinned } from 'lucide-react';
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
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import CompanyLocations from '@/components/companies/company-locations';
import { useCities } from "@/hooks/useCities";

const companySchema = z.object({
  company: z.string().min(1, 'El nombre es requerido.'),
  cityId: z.string().optional(),
});

type CompanySchema = z.infer<typeof companySchema>;

function CompanyForm({ onSaveSuccess, companyToEdit }: { onSaveSuccess?: () => void, companyToEdit?: CompanyList | null }) {  
  const { toast } = useToast();
  const isEditMode = !!companyToEdit;
  const { cities } = useCities();

  const form = useForm<CompanySchema>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      company: companyToEdit?.company || '',
      cityId: "", 
    },
  });

  async function onSubmit(data: CompanySchema) {
    try {
      if(isEditMode && companyToEdit) {
        console.log('company', companyToEdit.companyId, 'edit', {company: data.company})
        await companiesService.update(Number(companyToEdit.companyId), {company: data.company});
        
        toast({
          title: 'Actualizacion exitosa',
          description: 'La empresa ha sido actualizada correctamente.',
        });

        onSaveSuccess?.();
      } else {

        if(!data.cityId) {
          toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Debe seleccionar una ciudad'
          });

          return;
        }
        
        await companiesService.create({company: data.company, cityId: data.cityId});

        toast({
          title: 'Registro exitoso',
          description: 'La empresa ha sido registrada correctamente'
        });

        onSaveSuccess?.();
      }

      form.reset();

    } catch (error) {

      console.error(error);

      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo guardar la empresa',
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4 px-6 pb-6">
        <FormField
          control={form.control}
          name="company"
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
        {!isEditMode && (
          <FormField
            control={form.control}
            name="cityId"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Ciudad Sede Principal</FormLabel>
                <Select onValueChange={field.onChange} value={field.value ?? ""}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Selecciona una ciudad" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        {cities.map((cit) => (
                        <SelectItem key={cit.cityId} value={cit.cityId}>
                            {cit.city}
                        </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
            />
        )}
        <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
          {isEditMode ? 'Guardar Cambios' : 'Registrar Empresa'}
        </Button>
      </form>
    </Form>
  );
}

export default function EmpresasPage() {
  const { toast } = useToast();
  const [companies, setCompanies] = useState<CompanyList[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [advancedFilters, setAdvancedFilters] = useState({
      status: '',
      search: '',
      city: ''
    });
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
      current_page: 1,
      last_page: 1,
      per_page: 15,
      total: 0,
    });
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<CompanyList | null>(null);
  const [isLocationsDialogOpen, setIsLocationsDialogOpen] = useState(false);
  const [companyToEdit, setCompanyToEdit] = useState<CompanyList | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const { cities } = useCities();

  const loadCompanies = async () => {
    try {
      setIsLoading(true);
      const comp = await companiesService.list({
          search: debouncedSearch,
          status: advancedFilters.status,
          city: advancedFilters.city
      });
      setCompanies(comp.data);
      setPagination(comp.meta);

    } catch(e){
      console.error(e);

      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudieron cargar las empresas',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCompanies();
  }, [currentPage, debouncedSearch, advancedFilters]);

  // ============== Handles ================
  const handleEditClick = (company: any) => {
    setCompanyToEdit(company);
    setIsEditDialogOpen(true);
  };

  const handleOpenLocations = (company: CompanyList) => {
    setSelectedCompany(company);
    setIsLocationsDialogOpen(true);
  };

  const handleDelete = async (companyId: number) => {
    try {
      await companiesService.delete(companyId);

      await loadCompanies();

      toast({
        title: 'Empresa eliminada',
        description: 'La empresa ha sido eliminada correctamente',
      });
    } catch (e){
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo eliminar la empresa',
      })
    }
  }

  const handleRestore = async (companyId: number, restoreAssets: boolean) => {
    try {
      await companiesService.restore(companyId, {restoreAll: restoreAssets});
      if(restoreAssets){
        toast({
          title: 'Empresa Restaurada',
          description: 'La empresa ha sido restaurada correctamente.',
        });
      }else{
        toast({
          title: 'Empresa Restaurada',
          description: 'La empresa y sus activos han sido restaurados correctamente.',
        });
      }

      loadCompanies();
    } catch (error) {
      console.error(error)

      console.error(error);

      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo restaurar la empresa.',
      });
    }
    
  }

  const handleSaveSuccess = async () => {
    setIsCreateDialogOpen(false);
    setIsEditDialogOpen(false);
    setCompanyToEdit(null);

    await loadCompanies();
  };

  const handleAdvancedFilterChange = (key: string, value: string) => {
    setCurrentPage(1);
    setAdvancedFilters(prev => ({ 
      ...prev, 
      [key]: value || undefined
    }));
  };
  
  const clearAdvancedFilters = () => {
    setAdvancedFilters({ status: '', search: '', city: ''});
  };

  // DEBOUNCE SEARCH
  useEffect(() => {
    const timeout = setTimeout(() => {
        setDebouncedSearch(searchTerm);
    }, 600); 
  
    return () => clearTimeout(timeout);
  }, [searchTerm]);

  // const filteredCompanies = useMemo(() => {
  //   return companies.filter(company => {
  //       // Advanced filters
  //       const matchesStatus = advancedFilters.status ? company.status === advancedFilters.status : true;

  //       // Simple search term filter
  //       const matchesSearchTerm = searchTerm ? Object.values(company).some(value =>
  //           String(value).toLowerCase().includes(searchTerm.toLowerCase())
  //       ) : true;

  //       return matchesStatus && matchesSearchTerm;
  //   });
  // }, [searchTerm, companies, advancedFilters]);

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full min-w-[800px]">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold font-headline tracking-tight">Empresas</h1>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Nueva Empresa
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[90vw] max-w-[90vw] md:w-full md:max-w-md rounded-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader className="p-6 pb-0">
                  <DialogTitle className="text-2xl font-headline text-center">Crear nueva empresa</DialogTitle>
                  <DialogDescription className="text-center">
                    Introduce los datos para registrar una nueva empresa.
                  </DialogDescription>
                </DialogHeader>
                <CompanyForm onSaveSuccess={handleSaveSuccess} />
                 <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                    <span className="sr-only">Close</span>
                </DialogClose>
              </DialogContent>
            </Dialog>
          </div>
          <Card>
             <CardHeader>
                <CardTitle>Listado de Empresas</CardTitle>
                <div className="space-y-4 pt-2">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                        type="search"
                        placeholder="Buscar empresa por nombre"
                        className="w-full appearance-none bg-background pl-8 shadow-none md:w-1/3"
                        value={searchTerm}
                        onChange={(e) => {setCurrentPage(1); setSearchTerm(e.target.value)}}
                        />
                    </div>
                     <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="advanced-search">
                            <AccordionTrigger>
                                <div className="flex items-center gap-2">
                                    <Filter className="h-4 w-4" />
                                    Búsqueda Avanzada
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pt-4">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <Select value={advancedFilters.city} onValueChange={(value) => handleAdvancedFilterChange('city', value)}>
                                        <SelectTrigger><SelectValue placeholder="Sede principal" /></SelectTrigger>
                                        <SelectContent>
                                            {cities.map(city => <SelectItem key={city.cityId} value={city.cityId}>{city.city}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                    <Select value={advancedFilters.status} onValueChange={(value) => handleAdvancedFilterChange('status', value)}>
                                        <SelectTrigger><SelectValue placeholder="Estado" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Active">Activo</SelectItem>
                                            <SelectItem value="Inactive">Inactivo</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="pt-4 flex justify-end">
                                    <Button variant="ghost" onClick={clearAdvancedFilters}>Limpiar filtros</Button>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Empresa</TableHead>
                      {/* <TableHead>ID Empresa</TableHead> */}
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                          <TableCell colSpan={4}>
                              <div className="flex flex-col items-center justify-center min-h-[200px]">
                              <Loader2 className="h-12 w-12 animate-spin" />
                              <span className="mt-3 text-muted-foreground">
                                  Cargando empresas...
                              </span>
                              </div>
                          </TableCell>
                        </TableRow>
                    ) : companies.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-6">
                          No hay empresas registradas.
                        </TableCell>
                      </TableRow>
                    ): (
                      companies.map((company) => (
                        <TableRow key={company.companyId}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-9 w-9">
                                  <AvatarFallback>{company.company.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div className="grid gap-0.5">
                                  <p className="font-medium">{company.company}</p>
                              </div>
                            </div>
                          </TableCell>
                          {/* <TableCell>EMP-{String(company.companyId).padStart(4, '0')}</TableCell> */}
                          <TableCell>
                            <Badge variant={company.status === 'Active' ? 'default' : 'destructive'}>
                              {company.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <TooltipProvider>
                                  <div className="flex justify-end gap-2">
                                    {/* Ver localizaciones */}
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button
                                            variant="secondary"
                                            size="icon"
                                            onClick={() => handleOpenLocations(company)}
                                          >
                                            <MapPinned className="h-4 w-4" />
                                          </Button>
                                        </TooltipTrigger>

                                        <TooltipContent>
                                          <p>Gestionar ubicaciones</p>
                                        </TooltipContent>
                                      </Tooltip>
                                      {/* Editar empresa */}
                                      <Tooltip>
                                          <TooltipTrigger asChild>
                                            <Button variant="outline" size="icon" onClick={() => handleEditClick(company)}>
                                                  <Pencil className="h-4 w-4" />
                                              </Button>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                              <p>Editar Empresa</p>
                                          </TooltipContent>
                                      </Tooltip>

                                    {/* Eliminar o restaurar empresa */}
                                    {company.status === 'Active' ? (
                                      <AlertDialog>
                                          <Tooltip>
                                              <TooltipTrigger asChild>
                                                  <AlertDialogTrigger asChild>
                                                      <Button variant="destructive" size="icon">
                                                          <Trash2 className="h-4 w-4" />
                                                      </Button>
                                                  </AlertDialogTrigger>
                                              </TooltipTrigger>
                                              <TooltipContent>
                                                  <p>Eliminar Empresa</p>
                                              </TooltipContent>
                                          </Tooltip>
                                          <AlertDialogContent>
                                              <AlertDialogHeader>
                                              <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                              <AlertDialogDescription>
                                                  Se deshabilitara la empresa <span className="font-semibold">{company.company}</span>. <br /> adicionalmente, todos los <span className="font-semibold">activos asociados</span> a la empresa serán <span className="font-semibold">inhabilitados</span>.
                                              </AlertDialogDescription>
                                              </AlertDialogHeader>
                                              <AlertDialogFooter>
                                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                              <AlertDialogAction onClick={() => handleDelete(company.companyId)}>Confirmar</AlertDialogAction>
                                              </AlertDialogFooter>
                                          </AlertDialogContent>
                                      </AlertDialog>
                                    ) : (
                                      <AlertDialog>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <AlertDialogTrigger asChild>
                                              <Button variant="outline" size="icon" onClick={() => {}}>
                                                <RotateCcw className="h-4 w-4" />
                                              </Button>
                                            </AlertDialogTrigger>   
                                          </TooltipTrigger>
                                            <TooltipContent>
                                              <p>Restaurar Empresa</p>
                                            </TooltipContent>
                                        </Tooltip>
                                        <AlertDialogContent>
                                          <AlertDialogHeader>
                                            <AlertDialogTitle>¿Deseas resturar esta empresa?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Se resturará la empresa <span className="font-semibold">{company.company}</span>. <br /> adicionalmente, tienes la opcion de <span className="font-semibold">reactivar los activos</span> asociados a la misma.
                                            </AlertDialogDescription>
                                          </AlertDialogHeader>
                                          <AlertDialogFooter>
                                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleRestore(company.companyId, true)}>Restaurar activos</AlertDialogAction>
                                            <AlertDialogAction onClick={() => handleRestore(company.companyId, false)}>Solo resturar</AlertDialogAction>
                                          </AlertDialogFooter>
                                        </AlertDialogContent>
                                      </AlertDialog>
                                    )
                                    }
                                  </div>
                            </TooltipProvider>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
                <div className="flex items-center justify-between mt-4">
                    <p className="text-sm text-muted-foreground">
                        Página {pagination.current_page} de {pagination.last_page}
                    </p>
                    <div className="flex gap-2">
                        <Button variant="outline" disabled={pagination.current_page === 1} onClick={() => setCurrentPage((prev) => prev - 1)}>
                            <ArrowBigLeft className="mr-2 h-4 w-4"/>
                            Anterior
                        </Button>
                        <Button variant="outline" disabled={pagination.current_page === pagination.last_page} onClick={() => setCurrentPage((prev) => prev + 1)}>
                            Siguiente
                            <ArrowBigRight className="mr-2 h-4 w-4"/>
                        </Button>
                    </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
      
      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="w-[90vw] max-w-[90vw] md:w-full md:max-w-md rounded-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader className="p-6 pb-0">
                <DialogTitle className="text-2xl font-headline text-center">Editar empresa</DialogTitle>
                <DialogDescription className="text-center">
                    Modifica los datos de la empresa.
                </DialogDescription>
            </DialogHeader>
            <CompanyForm onSaveSuccess={handleSaveSuccess} companyToEdit={companyToEdit} />
            <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                <span className="sr-only">Close</span>
            </DialogClose>
        </DialogContent>
      </Dialog>

      {/* Locations Dialog */}
      <Dialog
        open={isLocationsDialogOpen}
        onOpenChange={setIsLocationsDialogOpen}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              Ubicaciones
            </DialogTitle>

            <DialogDescription>
              {selectedCompany?.company}
            </DialogDescription>
          </DialogHeader>

          {selectedCompany && (
            <CompanyLocations
              companyId={selectedCompany.companyId}
            />
          )}
        </DialogContent>
      </Dialog>

    </DashboardLayout>
  );
}
