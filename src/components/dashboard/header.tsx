
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

export default function Header() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const [initials, setInitials] = useState('');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const name = localStorage.getItem('userName') || '';
    setUserName(name);
    if (name) {
      const names = name.split(' ');
      if (names.length > 1) {
        setInitials(`${names[0][0]}${names[names.length - 1][0]}`);
      } else if (names.length === 1 && names[0].length > 0) {
        setInitials(names[0].substring(0, 2));
      } else {
        setInitials('');
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    localStorage.removeItem('userIdNumber');
    localStorage.removeItem('userEmail');
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

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-card px-4 sticky top-0 z-30 lg:h-[60px] lg:px-6">
      <SidebarTrigger className="md:hidden"/>
      <div className="w-full flex-1">
        {/* Search bar removed as requested */}
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{initials.toUpperCase()}</AvatarFallback>
              </Avatar>
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{userName}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DialogTrigger asChild>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                Cambiar Clave
              </DropdownMenuItem>
            </DialogTrigger>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>Cerrar Sesión</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Cambiar Contraseña</DialogTitle>
            <DialogDescription>
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
      </Dialog>
    </header>
  );
}
