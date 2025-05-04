
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import BotSelector from "./BotSelector";

interface DashboardHeaderProps {
  selectedBot: string;
  onSelectBot: (botId: string) => void;
  onSearch: (query: string) => void;
}

const DashboardHeader = ({ selectedBot, onSelectBot, onSearch }: DashboardHeaderProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">RAG Chunk Visualizer</h1>
            <p className="text-gray-500 text-sm">Analyze and improve your RAG document quality metrics</p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-3">
            <BotSelector selectedBot={selectedBot} onSelectBot={onSelectBot} />
            
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="text"
                placeholder="Search chunks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full"
              />
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Button 
                type="submit" 
                variant="ghost" 
                size="sm" 
                className="absolute right-0 top-0 h-full"
              >
                Search
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
