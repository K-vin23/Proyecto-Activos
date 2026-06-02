
'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { getSession } from '@/lib/session';
import { AuthUser } from '@/types/auth.types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function Header() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const session = getSession();

    if(!session) {
      console.log(session);
      console.log('no esta cargando');
      return;
    }

    setUser(session.user);
  }, []);

  useEffect(() => {
    setCurrentDate(
      format(
      new Date(),
      "d 'de' MMMM 'a las' h:mm a",
      { locale: es }
    ));
  })

  function nameInitials(name?: string) {
      if(!name?.trim()) return "NA";

      const names = name.trim().split(" ");

      if(names.length === 1){
        return names[0][0];
      }

        return `${names[0][0]}${names[names.length - 1][0]}`;
  }

  const handleLogout = () => {
    router.replace('/login');
    toast({
      title: 'Sesión Cerrada',
      description: 'Has cerrado sesión exitosamente.',
    });
  };

  const handleChangePassword = () => {
    // Lógica para cambiar contraseña
    console.log("Password change requested");
    toast({
      title: "Contraseña Actualizada",
      description: "Tu contraseña ha sido cambiada exitosamente.",
    });
    setIsDialogOpen(false);
  };

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const firstname = user?.name?.split(' ')[0] ?? '';

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 sticky top-0 z-40 lg:h-[60px] lg:px-6">
      <SidebarTrigger />
      <div className="w-full flex-1">
        <h2 className="text-lg font-semibold">
          Bienvenido, {firstname}
        </h2>
        <p className="text-sm text-muted-foreground">
          {currentDate || 'cargando fecha..'}
        </p>
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{nameInitials(user?.name).toUpperCase()}</AvatarFallback>
              </Avatar>
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DialogTrigger asChild>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                Cambiar Clave
              </DropdownMenuItem>
            </DialogTrigger>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>Cerrar Sesión</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {mounted && (
          <DialogContent 
            className="sm:max-w-[425px]"
            aria-labelledby="dialog-title"
            aria-describedby="dialog-description"
          >
            <DialogHeader>
              <DialogTitle id="dialog-title">Cambiar Contraseña</DialogTitle>
              <DialogDescription id="dialog-description">
                Asegúrate de que tu nueva contraseña sea segura.
              </DialogDescription>
            </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="current-password" className="text-right">
                Actual
              </Label>
              <Input
                id="current-password"
                type="password"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-password" className="text-right">
                Nueva
              </Label>
              <Input
                id="new-password"
                type="password"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="confirm-password" className="text-right">
                Confirmar
              </Label>
              <Input
                id="confirm-password"
                type="password"
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancelar
              </Button>
            </DialogClose>
            <Button type="button" onClick={handleChangePassword}>
              Guardar Cambios
            </Button>
          </DialogFooter>
        </DialogContent>
        )}      </Dialog>
    </header>
  );
}
