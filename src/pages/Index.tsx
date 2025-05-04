
import { useState, useEffect } from "react";
import DashboardHeader from "@/components/DashboardHeader";
import MetricsOverview from "@/components/MetricsOverview";
import ChunkQualityChart from "@/components/ChunkQualityChart";
import ChunkTable from "@/components/ChunkTable";
import ActionableInsights from "@/components/ActionableInsights";
import MetricHistogram from "@/components/MetricHistogram";
import { fetchBots, fetchBotMetrics } from "@/services/api";
import { ChunkDocument, BotMetrics } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  const [selectedBot, setSelectedBot] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChunk, setSelectedChunk] = useState<ChunkDocument | null>(null);
  const [botMetrics, setBotMetrics] = useState<BotMetrics | null>(null);
  
  // Initialize with the first available bot
  useEffect(() => {
    const initializeBotSelection = async () => {
      try {
        const bots = await fetchBots();
        if (bots.length > 0) {
          setSelectedBot(bots[0]);
        }
      } catch (error) {
        console.error("Failed to load bots:", error);
      }
    };

    initializeBotSelection();
  }, []);

  // Load bot metrics when bot changes
  useEffect(() => {
    const loadBotMetrics = async () => {
      if (!selectedBot) return;
      
      try {
        const metrics = await fetchBotMetrics(selectedBot);
        setBotMetrics(metrics);
      } catch (error) {
        console.error("Failed to load bot metrics:", error);
      }
    };
    
    loadBotMetrics();
  }, [selectedBot]);

  const handleSelectChunk = (chunk: ChunkDocument) => {
    setSelectedChunk(chunk);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleSelectBot = (botId: string) => {
    setSelectedBot(botId);
    setSelectedChunk(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <DashboardHeader 
        selectedBot={selectedBot} 
        onSelectBot={handleSelectBot} 
        onSearch={handleSearch} 
      />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        {selectedBot ? (
          <>
            <MetricsOverview botId={selectedBot} />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-2">
                <Tabs defaultValue="chunks">
                  <TabsList className="mb-2">
                    <TabsTrigger value="chunks">Chunk Analysis</TabsTrigger>
                    <TabsTrigger value="distribution">Score Distribution</TabsTrigger>
                  </TabsList>
                  <TabsContent value="chunks" className="mt-0">
                    <ChunkTable 
                      botId={selectedBot} 
                      searchQuery={searchQuery}
                      onSelectChunk={handleSelectChunk} 
                    />
                  </TabsContent>
                  <TabsContent value="distribution" className="mt-0">
                    {botMetrics ? (
                      <MetricHistogram botMetrics={botMetrics} />
                    ) : (
                      <Card>
                        <CardContent className="py-6">
                          <div className="flex items-center justify-center">
                            <p className="text-gray-500">Loading metrics data...</p>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
              
              <div className="lg:col-span-1">
                <ActionableInsights botId={selectedBot} />
              </div>
            </div>
            
            {selectedChunk && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChunkQualityChart chunk={selectedChunk} />
                
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="text-lg">Chunk Text Preview</CardTitle>
                    <CardDescription>Content of the selected chunk</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="max-h-[300px] overflow-y-auto border rounded-md p-4 whitespace-pre-wrap text-sm bg-gray-50">
                      {selectedChunk._source.text}
                    </div>
                    
                    <div className="mt-4 space-y-3">
                      <div>
                        <h4 className="font-medium text-sm">Quality Analysis</h4>
                        <div className="mt-2 space-y-2 text-sm text-gray-600">
                          <p><strong>Complete:</strong> {selectedChunk._source.eval_metrics.complete_reason}</p>
                          <p><strong>Noise:</strong> {selectedChunk._source.eval_metrics.noise_reason}</p>
                          <p><strong>Context:</strong> {selectedChunk._source.eval_metrics.context_reason}</p>
                          <p><strong>Substantive:</strong> {selectedChunk._source.eval_metrics.substantive_reason}</p>
                          <p><strong>Coherent:</strong> {selectedChunk._source.eval_metrics.coherent_reason}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-[60vh]">
            <h2 className="text-xl font-bold mb-2">Welcome to RAG Chunk Visualizer</h2>
            <p className="text-gray-500 mb-4">Please select a bot to begin analysis</p>
          </div>
        )}
      </main>
      
      <footer className="bg-white border-t py-4">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-gray-500">
            RAG Chunk Quality Visualizer • Analyzing document chunks for optimal retrieval performance
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
