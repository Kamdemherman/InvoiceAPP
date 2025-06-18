
import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  iconColor?: string;
}

export function StatsCard({ 
  title, 
  value, 
  change, 
  changeType = 'neutral', 
  icon: Icon,
  iconColor = 'text-primary-600'
}: StatsCardProps) {
  const changeColors = {
    positive: 'text-success-600',
    negative: 'text-red-600',
    neutral: 'text-gray-500'
  };

  return (
    <Card className="bg-white shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {change && (
              <p className={`text-sm mt-1 ${changeColors[changeType]}`}>
                {change}
              </p>
            )}
          </div>
          <div className={`p-3 rounded-lg bg-primary-50 ${iconColor}`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
