
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface QualityMetricCardProps {
  title: string;
  value: number;
  maxValue: number;
  description?: string;
  colorClass?: string;
  iconComponent?: React.ReactNode;
}

const QualityMetricCard = ({
  title,
  value,
  maxValue = 1,
  description,
  colorClass = "bg-rag-purple",
  iconComponent,
}: QualityMetricCardProps) => {
  const percentage = Math.round((value / maxValue) * 100);
  
  // Determine color class for the progress bar
  let progressColorClass = "bg-rag-purple";
  if (colorClass.includes("blue")) progressColorClass = "bg-rag-blue";
  if (colorClass.includes("green")) progressColorClass = "bg-rag-green";
  if (colorClass.includes("red")) progressColorClass = "bg-rag-red";
  if (colorClass.includes("yellow")) progressColorClass = "bg-rag-yellow";
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm font-medium text-gray-500">{title}</CardTitle>
          {iconComponent && <div className="text-gray-400">{iconComponent}</div>}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline">
            <span className={`text-2xl font-bold ${colorClass.replace('bg-', 'text-')}`}>
              {value.toFixed(2)}
            </span>
            <span className="text-sm text-gray-500 ml-1">/ {maxValue.toFixed(1)}</span>
          </div>
          <span className="text-sm font-medium text-gray-700">{percentage}%</span>
        </div>
        <Progress
          value={percentage}
          className="h-2 mt-2"
          indicatorClassName={progressColorClass}
        />
        {description && <p className="text-xs mt-2 text-gray-500">{description}</p>}
      </CardContent>
    </Card>
  );
};

export default QualityMetricCard;
