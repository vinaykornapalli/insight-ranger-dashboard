
import { useState, useEffect } from "react";
import DashboardHeader from "@/components/DashboardHeader";
import MetricsOverview from "@/components/MetricsOverview";
import ChunkQualityChart from "@/components/ChunkQualityChart";
import ChunkTable from "@/components/ChunkTable";
import ActionableInsights from "@/components/ActionableInsights";
import MetricHistogram from "@/components/MetricHistogram";
import ChunkSizeHistogram from "@/components/ChunkSizeHistogram";
import { fetchBots, fetchBotMetrics } from "@/services/api";
import { ChunkDocument, BotMetrics } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

const Index = () => {
  const [selectedBot, setSelectedBot] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChunk, setSelectedChunk] = useState<ChunkDocument | null>(null);
  const [botMetrics, setBotMetrics] = useState<BotMetrics | null>(null);
  const [chunkSizeData, setChunkSizeData] = useState<{ size: number; count: number }[]>([]);
  
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
        
        // Generate mock chunk size data
        const sizeData = [
          { size: 100, count: 5 },
          { size: 200, count: 12 },
          { size: 300, count: 18 },
          { size: 400, count: 23 },
          { size: 500, count: 19 },
          { size: 600, count: 14 },
          { size: 700, count: 9 },
          { size: 800, count: 5 },
          { size: 900, count: 2 },
          { size: 1000, count: 1 },
        ];
        setChunkSizeData(sizeData);
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
                    <TabsTrigger value="metrics">Score Distribution</TabsTrigger>
                    <TabsTrigger value="sizes">Size Distribution</TabsTrigger>
                  </TabsList>
                  <TabsContent value="chunks" className="mt-0">
                    <ChunkTable 
                      botId={selectedBot} 
                      searchQuery={searchQuery}
                      onSelectChunk={handleSelectChunk} 
                    />
                  </TabsContent>
                  <TabsContent value="metrics" className="mt-0">
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
                  <TabsContent value="sizes" className="mt-0">
                    <ChunkSizeHistogram sizeData={chunkSizeData} />
                  </TabsContent>
                </Tabs>
              </div>
              
              <div className="lg:col-span-1">
                <ActionableInsights botId={selectedBot} />
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-[60vh]">
            <h2 className="text-xl font-bold mb-2">Welcome to RAG Chunk Visualizer</h2>
            <p className="text-gray-500 mb-4">Please enter a bot ID to begin analysis</p>
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
