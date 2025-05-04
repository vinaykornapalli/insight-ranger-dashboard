
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ChunkSizeHistogramProps {
  sizeData: {
    size: number;
    count: number;
  }[];
}

const ChunkSizeHistogram = ({ sizeData }: ChunkSizeHistogramProps) => {
  const formatXAxis = (value: number) => `${value / 1000}K`;
  
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">Chunk Size Distribution</CardTitle>
        <CardDescription>
          Distribution of document chunks by character count
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={sizeData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 25,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="size" 
                tickFormatter={formatXAxis} 
                label={{ value: 'Chunk Size (characters)', position: 'insideBottom', offset: -15 }} 
              />
              <YAxis label={{ value: 'Number of Chunks', angle: -90, position: 'insideLeft' }} />
              <Tooltip 
                formatter={(value) => [value, 'Chunks']}
                labelFormatter={(value) => `Size: ${formatXAxis(value)} characters`}
              />
              <Bar dataKey="count" name="Chunks" fill="#7E69AB" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChunkSizeHistogram;
