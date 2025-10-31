
"use client"

import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart"
import { users } from "@/lib/mock-data";

const chartConfig = {
  assets: {
    label: "Activos",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

interface AssetsChartProps {
    assets: any[];
}

export default function AssetsChart({ assets }: AssetsChartProps) {

  const chartData = useMemo(() => {
    const departmentData: { [key: string]: number } = {};

    assets.forEach(asset => {
      const user = users.find(u => u.name === asset.responsable);
      // Fallback to 'Sin Asignar' if user not found or department not specified
      const department = user?.department || 'Sin Asignar';
      if (departmentData[department]) {
        departmentData[department]++;
      } else {
        departmentData[department] = 1;
      }
    });

    return Object.keys(departmentData).map(department => ({
      department,
      assets: departmentData[department]
    }));

  }, [assets]);
  
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-headline">Activos por Departamento</CardTitle>
        <CardDescription>Un resumen de la distribución de activos.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="department"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              fontSize={12}
            />
            <YAxis allowDecimals={false} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="assets" fill="var(--color-assets)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
