
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import QualityMetricCard from "./QualityMetricCard";
import { BotMetrics } from "@/types";
import { fetchBotMetrics } from "@/services/api";
import { CircleGauge } from "lucide-react";

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

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-4">Bot Metrics Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
        
        <QualityMetricCard 
          title="Cohesiveness" 
          value={metrics.avgCohesive} 
          maxValue={10}
          description="Average logical flow and organization of content" 
          colorClass="bg-rag-blue"
          iconComponent={<CircleGauge className="h-5 w-5" />}
        />
        
        <QualityMetricCard 
          title="Substantiveness" 
          value={metrics.avgSubstantive} 
          maxValue={10}
          description="Average information density and value" 
          colorClass="bg-rag-purple"
          iconComponent={<CircleGauge className="h-5 w-5" />}
        />
        
        <QualityMetricCard 
          title="Contextual Sufficiency" 
          value={metrics.avgContextualSufficiency} 
          maxValue={10}
          description="Self-contained understanding without external context" 
          colorClass="bg-rag-green"
          iconComponent={<CircleGauge className="h-5 w-5" />}
        />
        
        <QualityMetricCard 
          title="Low Noise" 
          value={metrics.avgLowNoise} 
          maxValue={10}
          description="Free from irrelevant or distracting content" 
          colorClass="bg-rag-yellow"
          iconComponent={<CircleGauge className="h-5 w-5" />}
        />
        
        <QualityMetricCard 
          title="Completeness" 
          value={metrics.avgCompleteness} 
          maxValue={10}
          description="Contains all necessary information for the topic" 
          colorClass="bg-rag-red"
          iconComponent={<CircleGauge className="h-5 w-5" />}
        />
      </div>
    </div>
  );
};

export default MetricsOverview;
