import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Leaf, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react";
import { useEffect, useState } from "react";

interface EcoScoreData {
  ecoScore: number;
  carbonEmissions: number;
  riskLevel: string;
  details: {
    transportation: number;
    materials: number;
    supplierRisk: string;
    distanceRisk?: string;
    emissionRisk?: string;
    supplierScore?: number;
  };
  recommendations?: string[];
}

interface EcoScoreDisplayProps {
  data: EcoScoreData;
}

export const EcoScoreDisplay = ({ data }: EcoScoreDisplayProps) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    let startTime: number;
    const duration = 1500;
    const targetScore = data.ecoScore;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setAnimatedScore(Math.round(easeOutQuart * targetScore));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [data.ecoScore]);

  const chartData = [
    { name: "Transportation", value: data.details.transportation, color: "hsl(var(--primary))" },
    { name: "Materials", value: data.details.materials, color: "hsl(var(--secondary))" },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-secondary";
    if (score >= 60) return "text-primary";
    if (score >= 40) return "text-accent";
    return "text-destructive";
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return "from-secondary/20 to-secondary/5";
    if (score >= 60) return "from-primary/20 to-primary/5";
    if (score >= 40) return "from-accent/20 to-accent/5";
    return "from-destructive/20 to-destructive/5";
  };

  const getRiskBadge = (risk: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      low: "secondary",
      medium: "default",
      high: "destructive",
    };
    return <Badge variant={variants[risk] || "default"}>{risk.toUpperCase()}</Badge>;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Main EcoScore Card */}
      <Card className={`shadow-eco border-primary/20 bg-gradient-to-br ${getScoreGradient(data.ecoScore)}`}>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="relative">
              <div className="absolute inset-0 animate-pulse-glow rounded-full" />
              <div className={`text-7xl font-bold ${getScoreColor(data.ecoScore)} relative z-10`}>
                {animatedScore}
              </div>
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-semibold flex items-center gap-2 justify-center">
                <Leaf className="w-6 h-6 text-primary" />
                EcoScore
              </h3>
              <p className="text-muted-foreground">
                {data.ecoScore >= 80 ? "Excellent" : data.ecoScore >= 60 ? "Good" : data.ecoScore >= 40 ? "Fair" : "Needs Improvement"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="shadow-eco border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-destructive" />
              Carbon Emissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive">{data.carbonEmissions} kg CO₂</div>
            <p className="text-sm text-muted-foreground mt-2">Total estimated emissions</p>
          </CardContent>
        </Card>

        <Card className="shadow-eco border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-accent" />
              Risk Level
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {getRiskBadge(data.riskLevel)}
              <span className="text-sm text-muted-foreground">Overall sustainability risk</span>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Supplier Risk:</span>
                {getRiskBadge(data.details.supplierRisk)}
              </div>
              {data.details.distanceRisk && (
                <div className="flex justify-between text-sm">
                  <span>Distance Risk:</span>
                  {getRiskBadge(data.details.distanceRisk)}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Emissions Breakdown Chart */}
      <Card className="shadow-eco border-primary/20">
        <CardHeader>
          <CardTitle>Emissions Breakdown</CardTitle>
          <CardDescription>Carbon footprint by category</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--foreground))" />
              <YAxis stroke="hsl(var(--foreground))" label={{ value: 'kg CO₂', angle: -90, position: 'insideLeft' }} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                }}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recommendations */}
      {data.recommendations && data.recommendations.length > 0 && (
        <Card className="shadow-eco border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Recommendations
            </CardTitle>
            <CardDescription>Actions to improve your supply chain sustainability</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {data.recommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <p className="text-sm">{recommendation}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
};