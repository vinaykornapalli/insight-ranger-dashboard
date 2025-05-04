
import { useState, useEffect } from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BotMetrics } from "@/types";

interface MetricHistogramProps {
  botMetrics: BotMetrics;
}

interface HistogramData {
  name: string;
  cohesion?: number;
  lowNoise?: number;
  completeness?: number;
  substantiveness?: number;
  contextual?: number;
}

const MetricHistogram = ({ botMetrics }: MetricHistogramProps) => {
  const [chartData, setChartData] = useState<HistogramData[]>([]);
  
  useEffect(() => {
    if (botMetrics && botMetrics.scoresDistribution) {
      const newChartData: HistogramData[] = [];
      
      // Scores from 1-10
      for (let i = 0; i < 10; i++) {
        newChartData.push({
          name: `${i + 1}`,
          cohesion: botMetrics.scoresDistribution.cohesion[i],
          lowNoise: botMetrics.scoresDistribution.lowNoise[i],
          completeness: botMetrics.scoresDistribution.completeness[i],
          substantiveness: botMetrics.scoresDistribution.substantiveness[i],
          contextual: botMetrics.scoresDistribution.contextualSufficiency[i],
        });
      }
      
      setChartData(newChartData);
    }
  }, [botMetrics]);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">Score Distribution</CardTitle>
        <CardDescription>
          Distribution of quality scores across all chunks
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" label={{ value: 'Score (1-10)', position: 'insideBottom', offset: -5 }} />
              <YAxis label={{ value: 'Number of Chunks', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="cohesion" name="Cohesion" fill="#0EA5E9" />
              <Bar dataKey="lowNoise" name="Low Noise" fill="#eab308" />
              <Bar dataKey="completeness" name="Completeness" fill="#ef4444" />
              <Bar dataKey="substantiveness" name="Substantiveness" fill="#7E69AB" />
              <Bar dataKey="contextual" name="Contextual" fill="#16a34a" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricHistogram;
