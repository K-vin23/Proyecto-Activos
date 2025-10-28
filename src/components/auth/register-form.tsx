"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { RegisterSchema } from "@/lib/schemas";
import { registerSchema } from "@/lib/schemas";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

// Mock onRegister function as requested
const onRegister = (data: RegisterSchema) => {
  console.log("Registration data submitted:", data);
  // Here you would connect to Firebase, Supabase, PostgreSQL, etc.
  // Example:
  // firebase.auth().createUserWithEmailAndPassword(data.email, data.password)
  //   .then(userCredential => {
  //     // Store additional user data in Firestore/Realtime Database
  //   })
  //   .catch(error => {
  //     console.error("Error during registration:", error);
  //   });
};

export default function RegisterForm() {
  const { toast } = useToast();

  const form = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      idNumber: "",
      firstName: "",
      middleName: "",
      lastName: "",
      secondLastName: "",
      city: "",
      location: "",
      department: "",
      email: "",
      password: "",
    },
  });

  function onSubmit(data: RegisterSchema) {
    onRegister(data);
    toast({
      title: "Registro Exitoso",
      description: "El usuario ha sido registrado correctamente.",
    });
    form.reset();
  }

  return (
    <Card className="relative">
      <CardHeader>
        <Button asChild variant="ghost" size="sm" className="absolute left-2 top-2 md:left-4 md:top-4 text-muted-foreground">
            <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver
            </Link>
        </Button>
        <CardTitle className="text-2xl font-headline pt-12 text-center">Crear una cuenta</CardTitle>
        <CardDescription className="text-center">
            Introduce tus datos para registrar un nuevo usuario en el sistema.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="idNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número de identificación</FormLabel>
                    <FormControl>
                      <Input placeholder="123456789" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo electrónico</FormLabel>
                    <FormControl>
                      <Input placeholder="nombre@empresa.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primer nombre</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="middleName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Segundo nombre (Opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Fitzgerald" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Primer apellido</FormLabel>
                        <FormControl>
                        <Input placeholder="Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="secondLastName"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Segundo apellido (Opcional)</FormLabel>
                        <FormControl>
                        <Input placeholder="Smith" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Ubicación</FormLabel>
                        <FormControl>
                        <Input placeholder="Cra 1 # 1-1, Zona Centro" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            </div>
            <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Área o departamento</FormLabel>
                    <FormControl>
                        <Input placeholder="Tecnología" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
              Registrar
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
