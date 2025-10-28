"use client"

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

const chartData = [
  { department: "TI", assets: 186 },
  { department: "Marketing", assets: 305 },
  { department: "Ventas", assets: 237 },
  { department: "RRHH", assets: 73 },
  { department: "Operaciones", assets: 209 },
  { department: "Finanzas", assets: 214 },
]

const chartConfig = {
  assets: {
    label: "Activos",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

export default function AssetsChart() {
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
