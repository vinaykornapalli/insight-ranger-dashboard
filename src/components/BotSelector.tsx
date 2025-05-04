
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { fetchBots } from "@/services/api";

interface BotSelectorProps {
  selectedBot: string;
  onSelectBot: (botId: string) => void;
}

const BotSelector = ({ selectedBot, onSelectBot }: BotSelectorProps) => {
  const [botInput, setBotInput] = useState(selectedBot);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setBotInput(selectedBot);
  }, [selectedBot]);

  useEffect(() => {
    const loadBots = async () => {
      try {
        setLoading(true);
        const botList = await fetchBots();
        setSuggestions(botList);
        setLoading(false);
      } catch (error) {
        console.error("Failed to load bots:", error);
        setLoading(false);
      }
    };

    loadBots();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setBotInput(value);
    
    if (value.trim() !== "") {
      const filtered = suggestions.filter(bot => 
        bot.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered.length > 0 ? filtered : suggestions);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (botInput.trim()) {
      onSelectBot(botInput);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (bot: string) => {
    setBotInput(bot);
    onSelectBot(bot);
    setShowSuggestions(false);
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="flex items-center space-x-2">
        <div className="flex items-center space-x-2 relative">
          <label className="font-medium text-sm">Bot ID:</label>
          <div className="relative">
            <Input
              type="text"
              value={botInput}
              onChange={handleInputChange}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Enter bot ID"
              className="w-[180px]"
              disabled={loading}
            />
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200 max-h-60 overflow-auto">
                {suggestions.map((bot) => (
                  <div
                    key={bot}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleSuggestionClick(bot)}
                  >
                    {bot}
                  </div>
                ))}
              </div>
            )}
          </div>
          <Button type="submit" size="sm" disabled={loading}>
            <Search className="h-4 w-4" />
            <span className="sr-only">Search</span>
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BotSelector;
