
"use client";

import type { FC, ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Users,
  Archive,
  LogOut,
  Box,
  Building,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const DashboardLayout: FC<{ children: ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState<string | null>(null);
  const [initials, setInitials] = useState('');

  useEffect(() => {
    const name = localStorage.getItem('userName') || '';
    setUserName(name);
    setUserEmail(localStorage.getItem('userEmail') || '');
    setUserRole(localStorage.getItem('userRole') || null);
    
    if (name) {
      const names = name.split(' ');
      if (names.length > 1) {
        setInitials(`${names[0][0]}${names[names.length - 1][0]}`);
      } else if (names.length === 1 && names[0].length > 0) {
        setInitials(name.substring(0, 2));
      } else {
        setInitials('');
      }
    }

  }, []);

  const isActive = (path: string) => pathname === path;

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    localStorage.removeItem('userIdNumber');
    localStorage.removeItem('userEmail');
    router.replace('/login');
  };

  const canViewEmpresas = userRole === 'admin';
  const canViewUsers = userRole === 'admin' || userRole === 'tecnico';
  const canViewDashboard = userRole !== 'estandar';


  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background">
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-3 p-2">
              <Box className="size-8 text-primary-foreground" />
              <h1 className="text-xl font-bold font-headline text-primary-foreground">
                Activos Pro
              </h1>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {canViewDashboard && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isActive('/') || isActive('/dashboard')} tooltip="Inicio">
                    <Link href="/">
                      <LayoutDashboard />
                      <span>Inicio</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
              {canViewEmpresas && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isActive('/empresas')} tooltip="Empresas">
                    <Link href="/empresas">
                      <Building />
                      <span>Empresas</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
              {canViewUsers && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isActive('/users')} tooltip="Usuarios">
                    <Link href="/users">
                      <Users />
                      <span>Usuarios</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive('/assets')} tooltip="Activos">
                  <Link href="/assets">
                    <Archive />
                    <span>Activos</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <div className="flex items-center gap-3 p-2">
              <Avatar className="h-10 w-10">
                <AvatarFallback>{initials.toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-semibold text-sidebar-foreground truncate">
                  {userName}
                </span>
                <span className="text-xs text-sidebar-foreground/70 truncate">
                  {userEmail}
                </span>
              </div>
            </div>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout}>
                  <LogOut />
                  <span>Cerrar Sesión</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset className="overflow-auto">{children}</SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
