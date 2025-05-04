
import { useState, useEffect } from "react";
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  ResponsiveContainer,
  PolarRadiusAxis,
  Tooltip
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChunkDocument } from "@/types";

interface ChunkQualityChartProps {
  chunk: ChunkDocument;
}

interface ChartData {
  subject: string;
  score: number;
  fullMark: number;
}

const ChunkQualityChart = ({ chunk }: ChunkQualityChartProps) => {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  
  useEffect(() => {
    if (chunk && chunk._source && chunk._source.eval_metrics) {
      setChartData([
        {
          subject: 'Cohesion',
          score: chunk._source.eval_metrics.cohesion_score,
          fullMark: 10,
        },
        {
          subject: 'Low Noise',
          score: chunk._source.eval_metrics.low_noise_score,
          fullMark: 10,
        },
        {
          subject: 'Completeness',
          score: chunk._source.eval_metrics.completeness_score,
          fullMark: 10,
        },
        {
          subject: 'Substantiveness',
          score: chunk._source.eval_metrics.substantiveness_score,
          fullMark: 10,
        },
        {
          subject: 'Context',
          score: chunk._source.eval_metrics.contextual_sufficiency_score,
          fullMark: 10,
        },
      ]);
    }
  }, [chunk]);

  if (!chunk || !chunk._source) {
    return null;
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">Chunk Quality Metrics</CardTitle>
        <CardDescription>
          Radar chart showing the quality scores for selected chunk
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 12 }} />
              <PolarRadiusAxis angle={30} domain={[0, 10]} />
              <Radar
                name="Quality Score"
                dataKey="score"
                stroke="#7E69AB"
                fill="#9b87f5"
                fillOpacity={0.6}
              />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 space-y-2 text-sm">
          <p className="font-medium">Selected Chunk: {chunk._id}</p>
          <p className="text-gray-500">Document: {chunk._source.doc_name}</p>
          <p className="text-gray-500">Last Evaluated: {new Date(chunk._source.last_eval_time).toLocaleString()}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChunkQualityChart;
