
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  FileSearch,
} from "lucide-react";
import { ChunkDocument, ApiFilters } from "@/types";
import { fetchChunks } from "@/services/api";
import { Badge } from "@/components/ui/badge";

interface ChunkTableProps {
  botId: string;
  searchQuery?: string;
  onSelectChunk: (chunk: ChunkDocument) => void;
}

const ChunkTable = ({ botId, searchQuery, onSelectChunk }: ChunkTableProps) => {
  const [chunks, setChunks] = useState<ChunkDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedChunkId, setSelectedChunkId] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({
    key: 'last_eval_time',
    direction: 'desc',
  });
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    if (!botId) return;
    
    const loadChunks = async () => {
      setLoading(true);
      try {
        const filters: ApiFilters = {
          botId,
          searchQuery,
          sortBy: sortConfig.key,
          sortDirection: sortConfig.direction,
          page,
          pageSize,
        };
        
        const data = await fetchChunks(filters);
        setChunks(data);
        if (data.length > 0 && !selectedChunkId) {
          setSelectedChunkId(data[0]._id);
          onSelectChunk(data[0]);
        }
      } catch (error) {
        console.error("Failed to load chunks:", error);
      } finally {
        setLoading(false);
      }
    };

    loadChunks();
  }, [botId, searchQuery, sortConfig, page, pageSize]);

  const handleSort = (key: string) => {
    setSortConfig((prevConfig) => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const renderSortIcon = (key: string) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? 
      <ChevronUp className="h-4 w-4" /> : 
      <ChevronDown className="h-4 w-4" />;
  };

  const handleSelectChunk = (chunk: ChunkDocument) => {
    setSelectedChunkId(chunk._id);
    onSelectChunk(chunk);
  };

  const getQualityBadge = (score: number) => {
    if (score >= 8) return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">High</Badge>;
    if (score >= 5) return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Medium</Badge>;
    return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Low</Badge>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Chunk List</CardTitle>
          <CardDescription>
            Documents and their quality metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-32 flex items-center justify-center">
            <p className="text-gray-500">Loading chunks...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Chunk List</CardTitle>
        <CardDescription>
          Viewing {chunks.length} chunks - select to see details
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">#</TableHead>
                <TableHead className="w-[220px]">
                  <button
                    className="flex items-center space-x-1"
                    onClick={() => handleSort('doc_name')}
                  >
                    <span>Document</span>
                    {renderSortIcon('doc_name')}
                  </button>
                </TableHead>
                <TableHead className="hidden md:table-cell">
                  <button
                    className="flex items-center space-x-1"
                    onClick={() => handleSort('substantive')}
                  >
                    <span>Substantive</span>
                    {renderSortIcon('substantive')}
                  </button>
                </TableHead>
                <TableHead className="hidden md:table-cell">
                  <button
                    className="flex items-center space-x-1"
                    onClick={() => handleSort('cohesive')}
                  >
                    <span>Cohesive</span>
                    {renderSortIcon('cohesive')}
                  </button>
                </TableHead>
                <TableHead className="hidden lg:table-cell">
                  <button
                    className="flex items-center space-x-1"
                    onClick={() => handleSort('last_eval_time')}
                  >
                    <span>Evaluated</span>
                    {renderSortIcon('last_eval_time')}
                  </button>
                </TableHead>
                <TableHead className="text-right">Quality</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {chunks.map((chunk, index) => (
                <TableRow 
                  key={chunk._id}
                  className={`cursor-pointer ${selectedChunkId === chunk._id ? 'bg-rag-purple-light' : ''}`}
                  onClick={() => handleSelectChunk(chunk)}
                >
                  <TableCell>{(page - 1) * pageSize + index + 1}</TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-2">
                      <FileSearch className="h-4 w-4 text-gray-400" />
                      <span className="truncate max-w-[180px]">{chunk._source.doc_name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{chunk._source.substantive.toFixed(2)}</TableCell>
                  <TableCell className="hidden md:table-cell">{chunk._source.cohesive.toFixed(2)}</TableCell>
                  <TableCell className="hidden lg:table-cell">{formatDate(chunk._source.last_eval_time)}</TableCell>
                  <TableCell className="text-right">
                    {getQualityBadge(chunk._source.eval_metrics.substantiveness_score)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-500">
            Showing {chunks.length} of many results
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous</span>
            </Button>
            <span className="text-sm text-gray-600">
              Page {page}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChunkTable;
