
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogClose,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Box, Loader2, X } from 'lucide-react';
import RegisterForm from '@/components/auth/register-form';
import { companies } from '@/lib/mock-data';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      if (username === '94432420' && password === 'wwpq12345') {
        toast({
          title: 'Inicio de Sesión Exitoso',
          description: 'Bienvenido, Whashintong Palma.',
        });
        localStorage.setItem('isAuthenticated', 'true');
        router.replace('/');
      } else {
        toast({
          variant: 'destructive',
          title: 'Error de Autenticación',
          description: 'Usuario o contraseña incorrectos.',
        });
        setIsLoading(false);
      }
    }, 1000);
  };
  
  const handleForgotPassword = () => {
    if (forgotEmail) {
        console.log(`Password reset link sent to: ${forgotEmail}`)
        toast({
            title: 'Enlace Enviado',
            description: `Se ha enviado un enlace para restablecer la contraseña a ${forgotEmail}.`,
        });
        setIsForgotOpen(false);
    } else {
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Por favor, introduce un correo electrónico.',
        });
    }
  }


  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-sm mx-auto">
        <CardHeader className="text-center">
            <Box className="mx-auto h-12 w-12 text-primary" />
            <CardTitle className="text-2xl font-headline mt-2">Activos Pro</CardTitle>
            <CardDescription>
                Introduce tus credenciales para acceder al panel.
            </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Usuario</Label>
              <Input
                id="username"
                type="text"
                placeholder="Tu ID de usuario"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <Label htmlFor="password">Contraseña</Label>
                     <Dialog open={isForgotOpen} onOpenChange={setIsForgotOpen}>
                        <DialogTrigger asChild>
                            <Button variant="link" className="p-0 h-auto text-xs">
                                ¿Olvidaste tu contraseña?
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Recuperar Contraseña</DialogTitle>
                                <DialogDescription>
                                    Introduce tu correo electrónico para enviarte un enlace de recuperación.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-2">
                                <Label htmlFor="forgot-email">Correo Electrónico</Label>
                                <Input 
                                    id="forgot-email"
                                    type="email"
                                    placeholder="tu@correo.com"
                                    value={forgotEmail}
                                    onChange={(e) => setForgotEmail(e.target.value)}
                                />
                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline">Cancelar</Button>
                                </DialogClose>
                                <Button onClick={handleForgotPassword}>Enviar Enlace</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verificando...
                </>
              ) : (
                'Iniciar Sesión'
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center justify-center text-sm">
            <p className="text-muted-foreground">¿No tienes una cuenta?</p>
             <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
                <DialogTrigger asChild>
                    <Button variant="link">Regístrate</Button>
                </DialogTrigger>
                <DialogContent className="w-[90vw] max-w-[90vw] md:w-full md:max-w-3xl rounded-lg max-h-[90vh] overflow-y-auto">
                    <DialogHeader className="p-6 pb-0">
                        <DialogTitle className="text-2xl font-headline text-center">Crear una cuenta</DialogTitle>
                        <DialogDescription className="text-center">
                            Introduce los datos para registrar un nuevo usuario en el sistema.
                        </DialogDescription>
                    </DialogHeader>
                    <RegisterForm onRegisterSuccess={() => setIsRegisterOpen(false)} companies={companies} />
                    <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                        <X className="h-4 w-4" />
                        <span className="sr-only">Close</span>
                    </DialogClose>
                </DialogContent>
            </Dialog>
        </CardFooter>
      </Card>
    </div>
  );
}
