import { useCities } from "@/hooks/useCities";
import { locationService } from "@/services/company/locations.service";
import { Location } from "@/types/location.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";

interface LocationsProps {
  companyId: number;
}
const locationSchema = z.object({
    cityId: z.string().min(1, 'Seleccione una ciudad'),
    locationName: z.string().min(1, 'La ubicación es requerida')
});

type LocationSchema = z.infer<typeof locationSchema>;

export default function CompanyLocations({companyId}: LocationsProps) {
    const [locations, setLocations] = useState<Location[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const { cities } = useCities();

    const form = useForm<LocationSchema>({
        resolver: zodResolver(locationSchema),
        defaultValues: {
        cityId: '',
        locationName: ''
    }
    });

    const loadLocations = async () => {
        try {
            setIsLoading(true);
            const locs = await locationService.get(companyId);
            setLocations(locs.data);

        } catch (error){
            console.log(error);
        }finally{
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadLocations();
    }, [companyId]);

    const onSubmit = async (data: LocationSchema) => {
        try {
            const location = {
                cityId: data.cityId,
                locationName: data.locationName
            }
            await locationService.create(companyId, location);

            form.reset();

            await loadLocations();

        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
        {/* listado */}
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Ubicaciones registradas</CardTitle>
                </CardHeader>

                <CardContent>
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center min-h-[200px]">
                            <Loader2 className="h-12 w-12 animate-spin" />
                            <span className="mt-3 text-muted-foreground">
                                Cargando localizaciones...
                            </span>
                        </div>
                    ) : locations.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                            No hay ubicaciones registradas.
                        </p>
                    ) : (
                        <div className="space-y-2">
                            {locations.map(location => (
                                <div
                                    key={location.locationId}
                                    className="flex items-center justify-between border rounded-md p-3"
                                >
                                    <div>
                                        <p className="font-medium">
                                            {location.locationName}
                                        </p>

                                        <p className="text-sm text-muted-foreground">
                                            {location.city.city}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
        {/* formulario */}
        <Card>
            <CardHeader>
                <CardTitle>Nueva ubicación</CardTitle>
            </CardHeader>
             <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="locationName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombre de la ubicación</FormLabel>

                                    <FormControl>
                                        <Input
                                            placeholder="Oficina Principal"
                                            {...field}
                                        />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="cityId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Ciudad</FormLabel>
                                    <Select value={field.value ?? ""} onValueChange={field.onChange}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seleccione una ciudad" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {cities.map(city => (
                                                <SelectItem key={city.cityId} value={city.cityId}>
                                                    {city.city}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full">
                            Agregar ubicación
                        </Button>
                    </form>
                </Form>
             </CardContent>
        </Card>

        {/* botones */}
        </>
    );
}