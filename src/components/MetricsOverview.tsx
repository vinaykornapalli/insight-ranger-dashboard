
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BotMetrics } from "@/types";
import { fetchBotMetrics } from "@/services/api";
import { CircleGauge } from "lucide-react";
import CircularMeter from "./CircularMeter";

interface MetricsOverviewProps {
  botId: string;
}

const MetricsOverview = ({ botId }: MetricsOverviewProps) => {
  const [metrics, setMetrics] = useState<BotMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMetrics = async () => {
      if (!botId) return;
      
      setLoading(true);
      try {
        const data = await fetchBotMetrics(botId);
        setMetrics(data);
      } catch (error) {
        console.error("Failed to load bot metrics:", error);
      } finally {
        setLoading(false);
      }
    };

    loadMetrics();
  }, [botId]);

  if (loading) {
    return (
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle>Bot Metrics Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-32 flex items-center justify-center">
            <p className="text-gray-500">Loading metrics...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!metrics) {
    return (
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle>Bot Metrics Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-32 flex items-center justify-center">
            <p className="text-gray-500">No metrics available. Please select a bot.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Round the metric values to whole numbers for display
  const roundedMetrics = {
    ...metrics,
    avgCohesive: Math.round(metrics.avgCohesive),
    avgSubstantive: Math.round(metrics.avgSubstantive),
    avgContextualSufficiency: Math.round(metrics.avgContextualSufficiency),
    avgLowNoise: Math.round(metrics.avgLowNoise),
    avgCompleteness: Math.round(metrics.avgCompleteness),
  };

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-4">Bot Metrics Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <div className="col-span-1">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Chunks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold">{metrics.totalChunks.toLocaleString()}</span>
                <span className="text-sm px-2 py-1 rounded bg-rag-purple-light text-rag-purple font-medium">
                  Bot: {metrics.botId}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="col-span-1">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Cohesiveness</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center pt-4">
              <CircularMeter 
                value={roundedMetrics.avgCohesive} 
                maxValue={10}
                color="#7E69AB" 
                label="Logical flow"
                valueLabel={`${roundedMetrics.avgCohesive}`}
              />
            </CardContent>
          </Card>
        </div>
        
        <div className="col-span-1">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Substantiveness</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center pt-4">
              <CircularMeter 
                value={roundedMetrics.avgSubstantive} 
                maxValue={10}
                color="#4C6FFF" 
                label="Information density"
                valueLabel={`${roundedMetrics.avgSubstantive}`}
              />
            </CardContent>
          </Card>
        </div>
        
        <div className="col-span-1">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Context Sufficiency</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center pt-4">
              <CircularMeter 
                value={roundedMetrics.avgContextualSufficiency} 
                maxValue={10}
                color="#10B981" 
                label="Self-contained"
                valueLabel={`${roundedMetrics.avgContextualSufficiency}`}
              />
            </CardContent>
          </Card>
        </div>
        
        <div className="col-span-1">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Low Noise</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center pt-4">
              <CircularMeter 
                value={roundedMetrics.avgLowNoise} 
                maxValue={10}
                color="#FBBF24" 
                label="Relevance"
                valueLabel={`${roundedMetrics.avgLowNoise}`}
              />
            </CardContent>
          </Card>
        </div>
        
        <div className="col-span-1">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Completeness</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center pt-4">
              <CircularMeter 
                value={roundedMetrics.avgCompleteness} 
                maxValue={10}
                color="#EF4444" 
                label="Coverage"
                valueLabel={`${roundedMetrics.avgCompleteness}`}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MetricsOverview;
