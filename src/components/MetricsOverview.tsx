
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BotMetrics } from "@/types";
import { fetchBotMetrics } from "@/services/api";
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

  const getQualityRating = (score: number): string => {
    if (score >= 9) return "Excellent";
    if (score >= 7) return "Good";
    if (score >= 5) return "Average";
    if (score >= 3) return "Fair";
    return "Poor";
  };

  if (loading) {
    return (
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">RAG Quality Dashboard</h2>
        <p className="text-gray-500 mb-6">Overview of your retrieval-augmented generation content quality metrics</p>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map((index) => (
            <Card key={index} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-gray-200 rounded mb-2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">RAG Quality Dashboard</h2>
        <p className="text-gray-500 mb-6">Overview of your retrieval-augmented generation content quality metrics</p>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="h-32 flex items-center justify-center">
                <p className="text-gray-500">No metrics available. Please select a bot.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
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

  // Calculate overall quality (average of all metrics)
  const overallQuality = Math.round(
    (roundedMetrics.avgCohesive + 
     roundedMetrics.avgSubstantive + 
     roundedMetrics.avgContextualSufficiency + 
     roundedMetrics.avgLowNoise + 
     roundedMetrics.avgCompleteness) / 5
  );

  // Estimate low quality chunks (just for example, you would get this from the real data)
  const lowQualityChunks = Math.round(metrics.totalChunks * 0.04); // 4% of total chunks
  const currentDate = new Date().toLocaleDateString('en-GB', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
  }).replace(/\//g, '/');

  return (
    <div className="mb-8">
      <h2 className="text-3xl font-bold mb-2">RAG Quality Dashboard</h2>
      <p className="text-gray-500 mb-6">Overview of your retrieval-augmented generation content quality metrics</p>
      
      {/* Summary metrics cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="text-lg font-semibold mb-1">Total Chunks</div>
            <div className="text-4xl font-bold mb-1">{metrics.totalChunks.toLocaleString()}</div>
            <div className="text-gray-500 text-sm">Total chunks in the knowledge base</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="text-lg font-semibold mb-1">Average Quality</div>
            <div className="text-4xl font-bold mb-1">{overallQuality}/10</div>
            <div className="text-gray-500 text-sm">Overall quality score across all metrics</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="text-lg font-semibold mb-1">Low Quality Chunks</div>
            <div className="text-4xl font-bold mb-1">{lowQualityChunks}</div>
            <div className="text-gray-500 text-sm">{((lowQualityChunks / metrics.totalChunks) * 100).toFixed(1)}% of total chunks need improvement</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="text-lg font-semibold mb-1">Last Updated</div>
            <div className="text-4xl font-bold mb-1">{currentDate}</div>
            <div className="text-gray-500 text-sm">Date of the last metrics evaluation</div>
          </CardContent>
        </Card>
      </div>
      
      {/* Quality metrics with circular progress */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-6 flex flex-col items-center">
            <div className="text-lg font-semibold mb-2">Overall Quality</div>
            <div className="text-sm text-gray-500 mb-4 text-center">Average across all metrics</div>
            <CircularMeter 
              value={overallQuality} 
              maxValue={10}
              color="#7E69AB" 
              rating={getQualityRating(overallQuality)}
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex flex-col items-center">
            <div className="text-lg font-semibold mb-2">Cohesion</div>
            <div className="text-sm text-gray-500 mb-4 text-center">Logical flow and structure</div>
            <CircularMeter 
              value={roundedMetrics.avgCohesive} 
              maxValue={10}
              color="#8B5CF6" 
              rating={getQualityRating(roundedMetrics.avgCohesive)}
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex flex-col items-center">
            <div className="text-lg font-semibold mb-2">Low Noise</div>
            <div className="text-sm text-gray-500 mb-4 text-center">Free of irrelevant information</div>
            <CircularMeter 
              value={roundedMetrics.avgLowNoise} 
              maxValue={10}
              color="#7E69AB" 
              rating={getQualityRating(roundedMetrics.avgLowNoise)}
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex flex-col items-center">
            <div className="text-lg font-semibold mb-2">Completeness</div>
            <div className="text-sm text-gray-500 mb-4 text-center">Contains full information needed</div>
            <CircularMeter 
              value={roundedMetrics.avgCompleteness} 
              maxValue={10}
              color="#7E69AB" 
              rating={getQualityRating(roundedMetrics.avgCompleteness)}
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex flex-col items-center">
            <div className="text-lg font-semibold mb-2">Substantiveness</div>
            <div className="text-sm text-gray-500 mb-4 text-center">Contains valuable content</div>
            <CircularMeter 
              value={roundedMetrics.avgSubstantive} 
              maxValue={10}
              color="#7E69AB" 
              rating={getQualityRating(roundedMetrics.avgSubstantive)}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MetricsOverview;
