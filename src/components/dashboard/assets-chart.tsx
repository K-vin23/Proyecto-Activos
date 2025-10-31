
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

    const assetDepartments = assets.map(asset => {
        // Find user for asset to get department
        // This is mock logic, in a real app you might have department on the asset or a better join
        return 'TI'; // Mock, needs real logic
    });

    // This is mock logic and should be replaced with something real
    const departments = ["TI", "Marketing", "Ventas", "RRHH", "Operaciones", "Finanzas"];
    const assetsPerDepartment = Math.floor(assets.length / departments.length);
    const remainder = assets.length % departments.length;
    
    return departments.map((dep, index) => ({
      department: dep,
      assets: assetsPerDepartment + (index < remainder ? 1 : 0)
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
            <YAxis />
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
