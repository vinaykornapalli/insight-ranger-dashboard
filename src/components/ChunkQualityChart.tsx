
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChunkDocument } from "@/types";
import CircularMeter from "./CircularMeter";

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
          Quality scores for selected chunk
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap justify-center gap-4">
          {chartData.map((item) => (
            <CircularMeter
              key={item.subject}
              value={item.score}
              maxValue={10}
              size={80}
              color={
                item.subject === 'Cohesion' ? '#0EA5E9' :
                item.subject === 'Low Noise' ? '#eab308' :
                item.subject === 'Completeness' ? '#ef4444' :
                item.subject === 'Substantiveness' ? '#7E69AB' :
                '#16a34a'
              }
              label={item.subject}
            />
          ))}
        </div>
        
        <div className="mt-6 space-y-2 text-sm">
          <p className="font-medium">Selected Chunk: {chunk._id}</p>
          <p className="text-gray-500">Document: {chunk._source.doc_name}</p>
          <p className="text-gray-500">Size: {(chunk._source.text.length / 1000).toFixed(1)}K characters</p>
          <p className="text-gray-500">Last Evaluated: {new Date(chunk._source.last_eval_time).toLocaleString()}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChunkQualityChart;
