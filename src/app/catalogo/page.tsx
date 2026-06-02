'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard-layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BookOpenText, Cpu,  Book, BadgeCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { catalog as initialCatalog } from '@/lib/mock-data';
import { catalogService } from '@/services/asset/catalog.service';
import { ComponentList, ModelList } from '@/types/catalog.type';
import ModelsCard from '@/components/catalogs/models-card';
import BrandsCard from '@/components/catalogs/brands-card';
import ComponentsCard from '@/components/catalogs/components-card';

type CatalogKey = keyof typeof initialCatalog;

export default function CatalogoPage() {
  const { toast } = useToast();
  const [models, setModels] = useState<ModelList[]>([]);
  const [components, setComponents] = useState<ComponentList[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingComponents, setLoadingComponents] = useState(false);

  const loadModels = async() => {
    try {
      setIsLoading(true);
      const mds =  await catalogService.getModels({ search: '', page: 1 });
      setModels(mds.data);
    } catch (error) {
      console.error(error);

      toast({
            variant: 'destructive',
            title: 'Error',
            description: 'No se pudieron cargar los activos',
        });
    }finally{
      setIsLoading(false);
    }
  }

  const loadComps = async () => {
    try {
      setLoadingComponents(true);
      const cms =  await catalogService.getAllComponents();
      setComponents(cms);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudieron cargar los activos',
      });
    }finally{
      setLoadingComponents(false);
    }
  }
  useEffect(() => {   
      loadModels();
  }, [currentPage]);

  useEffect(() => {   
      loadComps();
  },[]);

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full min-w-[800px]">
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="flex items-center gap-4 mb-8">
            <BookOpenText className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold font-headline tracking-tight">Catálogo Técnico</h1>
              <p className="text-muted-foreground">Gestiona las opciones disponibles para el registro de activos.</p>
            </div>
          </div>
          <Tabs defaultValue="models" className="space-y-6">
            <TabsList className="bg-muted p-1 rounded-lg">
              <TabsTrigger value="models" className="flex gap-2">
                <Book className="h-4 w-4" /> 
                Modelos de activo
              </TabsTrigger>
              <TabsTrigger value="brands" className="flex gap-2">
                <BadgeCheck className="h-4 w-4" /> 
                Marcas
              </TabsTrigger>
              <TabsTrigger value="components" className="flex gap-2">
                <Cpu className="h-4 w-4" /> 
                Componentes
              </TabsTrigger>
            </TabsList>
            <TabsContent value="models">
                <ModelsCard
                  models={models}
                  onRefresh={loadModels}
                />
            </TabsContent>
            <TabsContent value="brands">
                <BrandsCard
                />
            </TabsContent>
            <TabsContent value="components">
                <ComponentsCard
                  components={components}
                  onRefresh={loadComps}
                />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </DashboardLayout>
  );
}
