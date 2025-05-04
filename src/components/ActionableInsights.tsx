
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle, Info } from "lucide-react";
import { InsightItem } from "@/types";
import { fetchInsights } from "@/services/api";

interface ActionableInsightsProps {
  botId: string;
}

const ActionableInsights = ({ botId }: ActionableInsightsProps) => {
  const [insights, setInsights] = useState<InsightItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInsights = async () => {
      if (!botId) return;
      
      setLoading(true);
      try {
        const data = await fetchInsights(botId);
        setInsights(data);
      } catch (error) {
        console.error("Failed to load insights:", error);
      } finally {
        setLoading(false);
      }
    };

    loadInsights();
  }, [botId]);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-amber-500" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getInsightBgColor = (type: string) => {
    switch (type) {
      case 'warning':
        return 'bg-amber-50 border-amber-200';
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'info':
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">Actionable Insights</CardTitle>
        <CardDescription>
          Recommendations to improve your RAG chunks
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-32 flex items-center justify-center">
            <p className="text-gray-500">Loading insights...</p>
          </div>
        ) : insights.length > 0 ? (
          <div className="space-y-3">
            {insights.map((insight, index) => (
              <div 
                key={index} 
                className={`p-3 rounded-lg border ${getInsightBgColor(insight.type)}`}
              >
                <div className="flex items-start gap-3">
                  <div className="shrink-0 mt-0.5">
                    {getInsightIcon(insight.type)}
                  </div>
                  <div>
                    <div className="font-medium flex items-center">
                      {insight.metric}
                      <span className="ml-2 px-2 py-0.5 text-xs rounded bg-white border">
                        {insight.affectedChunks} chunks
                      </span>
                    </div>
                    <p className="text-sm mt-1">{insight.message}</p>
                    <p className="text-xs mt-1 text-gray-600">
                      <strong>Recommendation:</strong> {insight.recommendation}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-32 flex items-center justify-center">
            <p className="text-gray-500">No insights available for this bot.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActionableInsights;
