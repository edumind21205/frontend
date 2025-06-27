import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"; // Adjusted import path
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs"; // Adjusted import path
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

// Sample data for the chart
const data = [
  { month: "Jan", Income: 220, Expense: 200 },
  { month: "Feb", Income: 300, Expense: 220 },
  { month: "Mar", Income: 250, Expense: 180 },
  { month: "Apr", Income: 350, Expense: 280 },
  { month: "May", Income: 280, Expense: 240 },
  { month: "Jun", Income: 300, Expense: 280 },
  { month: "Jul", Income: 320, Expense: 250 },
  { month: "Aug", Income: 380, Expense: 300 },
  { month: "Sep", Income: 270, Expense: 200 },
  { month: "Oct", Income: 350, Expense: 260 },
  { month: "Nov", Income: 300, Expense: 220 },
  { month: "Dec", Income: 340, Expense: 260 },
];

const EarningsChart = () => {
  const [year, setYear] = useState("2022");

  return (
    <Card className="col-span-1 lg:col-span-2 h-[400px]">
      {/* Header Section */}
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Total Earnings</CardTitle>
        <Tabs defaultValue="earnings" className="w-fit">
          <TabsList>
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
            <TabsTrigger value="expense">Expense</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex items-center gap-2">
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="border border-gray-200 rounded-md p-1 text-sm"
          >
            <option value="2022">2022</option>
            <option value="2023">2023</option>
            <option value="2024">2024</option>
          </select>
        </div>
      </CardHeader>

      {/* Chart Section */}
      <CardContent className="px-2 pt-4">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              fontSize={12}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              fontSize={12}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip />
            <Legend />
            <Bar dataKey="Income" fill="#3DD598" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Expense" fill="#FFC542" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default EarningsChart;
