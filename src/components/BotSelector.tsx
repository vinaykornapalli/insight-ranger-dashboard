
import { useState, useEffect } from "react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchBots } from "@/services/api";

interface BotSelectorProps {
  selectedBot: string;
  onSelectBot: (botId: string) => void;
}

const BotSelector = ({ selectedBot, onSelectBot }: BotSelectorProps) => {
  const [bots, setBots] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBots = async () => {
      try {
        const botList = await fetchBots();
        setBots(botList);
        setLoading(false);
      } catch (error) {
        console.error("Failed to load bots:", error);
        setLoading(false);
      }
    };

    loadBots();
  }, []);

  return (
    <div className="flex items-center space-x-2">
      <label className="font-medium text-sm">Bot ID:</label>
      <Select
        value={selectedBot}
        onValueChange={onSelectBot}
        disabled={loading}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a bot" />
        </SelectTrigger>
        <SelectContent>
          {bots.map((bot) => (
            <SelectItem key={bot} value={bot}>
              {bot}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default BotSelector;
