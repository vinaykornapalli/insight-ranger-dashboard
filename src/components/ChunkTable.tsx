
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import ChunkQualityChart from "./ChunkQualityChart";

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedModalChunk, setSelectedModalChunk] = useState<ChunkDocument | null>(null);
  const [chunkSizes, setChunkSizes] = useState<{ size: number; count: number }[]>([]);

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
        
        // Calculate chunk sizes for histogram
        const sizeMap = new Map<number, number>();
        data.forEach(chunk => {
          const size = chunk._source.text.length;
          const sizeCategory = Math.floor(size / 100) * 100; // Group by 100 chars
          sizeMap.set(sizeCategory, (sizeMap.get(sizeCategory) || 0) + 1);
        });
        
        const sizeData = Array.from(sizeMap.entries())
          .map(([size, count]) => ({ size, count }))
          .sort((a, b) => a.size - b.size);
        
        setChunkSizes(sizeData);
        
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
  }, [botId, searchQuery, sortConfig, page, pageSize, onSelectChunk]);

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

  const handleOpenModal = (chunk: ChunkDocument) => {
    setSelectedModalChunk(chunk);
    setIsModalOpen(true);
  };

  const getQualityBadge = (score: number) => {
    if (score >= 8) return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">High</Badge>;
    if (score >= 5) return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Medium</Badge>;
    return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Low</Badge>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getChunkSize = (text: string) => {
    return `${(text.length / 1000).toFixed(1)}K chars`;
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
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Chunk List</CardTitle>
          <CardDescription>
            Viewing {chunks.length} chunks - click on a row to open details
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
                  <TableHead className="hidden lg:table-cell">Size</TableHead>
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
                    onClick={() => handleOpenModal(chunk)}
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
                    <TableCell className="hidden lg:table-cell">{getChunkSize(chunk._source.text)}</TableCell>
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

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chunk Details</DialogTitle>
            <DialogDescription>
              Quality metrics and content for selected chunk
            </DialogDescription>
          </DialogHeader>
          
          {selectedModalChunk && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <ChunkQualityChart chunk={selectedModalChunk} />
              
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-lg">Chunk Text Preview</CardTitle>
                  <CardDescription>Content of the selected chunk</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="max-h-[300px] overflow-y-auto border rounded-md p-4 whitespace-pre-wrap text-sm bg-gray-50">
                    {selectedModalChunk._source.text}
                  </div>
                  
                  <div className="mt-4 space-y-3">
                    <div>
                      <h4 className="font-medium text-sm">Quality Analysis</h4>
                      <div className="mt-2 space-y-2 text-sm text-gray-600">
                        <p><strong>Complete:</strong> {selectedModalChunk._source.eval_metrics.complete_reason}</p>
                        <p><strong>Noise:</strong> {selectedModalChunk._source.eval_metrics.noise_reason}</p>
                        <p><strong>Context:</strong> {selectedModalChunk._source.eval_metrics.context_reason}</p>
                        <p><strong>Substantive:</strong> {selectedModalChunk._source.eval_metrics.substantive_reason}</p>
                        <p><strong>Coherent:</strong> {selectedModalChunk._source.eval_metrics.coherent_reason}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h4 className="font-medium text-sm mb-2">Additional Information</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="bg-gray-50 p-2 rounded">
                        <span className="text-gray-500">Document:</span> {selectedModalChunk._source.doc_name}
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <span className="text-gray-500">Size:</span> {getChunkSize(selectedModalChunk._source.text)}
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <span className="text-gray-500">ID:</span> {selectedModalChunk._id}
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <span className="text-gray-500">Last Evaluated:</span> {new Date(selectedModalChunk._source.last_eval_time).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ChunkTable;
