import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"; // Adjusted import path
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs"; // Adjusted import path
import { Avatar } from "./ui/avatar"; // Adjusted import path

// Sample performers data
const performers = [
  {
    id: 1,
    name: "Emma Samuel",
    avatar: "ES",
    score: "10,578",
    percentage: 88.5,
    color: "#FF6B72",
  },
  {
    id: 2,
    name: "Cayla Brister",
    avatar: "CB",
    score: "9,245",
    percentage: 80.72,
    color: "#6B7AFF",
  },
  {
    id: 3,
    name: "Kathryn Hahn",
    avatar: "KH",
    score: "8,978",
    percentage: 75.5,
    color: "#3DD598",
  },
];

const TopPerformers = () => {
  return (
    <Card className="h-[400px]">
      {/* Header Section */}
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Top Performers</CardTitle>
        <Tabs defaultValue="month" className="w-fit">
          <TabsList>
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="day">Day</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex items-center gap-2">
          <button className="text-sm text-gray-400 hover:text-gray-900">•••</button>
        </div>
      </CardHeader>

      {/* Content Section */}
      <CardContent>
        <div className="space-y-4 mt-4">
          {/* Table Header */}
          <div className="grid grid-cols-4 gap-4 text-sm text-gray-500 px-2">
            <div>Player</div>
            <div>Score</div>
            <div className="col-span-2">Percentage</div>
          </div>

          {/* Performers List */}
          {performers.map((performer) => (
            <div key={performer.id} className="grid grid-cols-4 gap-4 items-center">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8 bg-blue-100 text-blue-600">
                  <span className="text-xs">{performer.avatar}</span>
                </Avatar>
                <span className="text-sm font-medium">{performer.name}</span>
              </div>
              <div className="text-sm font-medium">{performer.score}</div>
              <div className="col-span-2 flex items-center gap-2">
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="h-2 rounded-full"
                    style={{
                      width: `${performer.percentage}%`,
                      backgroundColor: performer.color,
                    }}
                  ></div>
                </div>
                <span className="text-xs font-medium text-gray-500">
                  {performer.percentage}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TopPerformers;
