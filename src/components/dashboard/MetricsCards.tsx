import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ROIData } from '@/hooks/useROIData';
import { TrendingUp, TrendingDown, DollarSign, Calendar, Target, BarChart3 } from 'lucide-react';

interface MetricsCardsProps {
  data: ROIData;
}

export const MetricsCards: React.FC<MetricsCardsProps> = ({ data }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const formatROI = (value: number) => {
    return `${value.toFixed(1)}x`;
  };

  const metrics = [
    {
      title: 'ROI Diário',
      value: formatROI(data.dailyROI),
      icon: data.dailyROI >= 1 ? TrendingUp : TrendingDown,
      color: data.dailyROI >= 1 ? 'text-green-400' : 'text-red-400',
      bgColor: data.dailyROI >= 1 ? 'bg-green-400/10' : 'bg-red-400/10',
      borderColor: data.dailyROI >= 1 ? 'border-green-400/20' : 'border-red-400/20',
    },
    {
      title: 'ROI Mensal',
      value: formatROI(data.monthlyROI),
      icon: data.monthlyROI >= 1 ? TrendingUp : TrendingDown,
      color: data.monthlyROI >= 1 ? 'text-green-400' : 'text-red-400',
      bgColor: data.monthlyROI >= 1 ? 'bg-green-400/10' : 'bg-red-400/10',
      borderColor: data.monthlyROI >= 1 ? 'border-green-400/20' : 'border-red-400/20',
    },
    {
      title: 'Total Gasto',
      value: formatCurrency(data.totalExpense),
      icon: DollarSign,
      color: 'text-red-400',
      bgColor: 'bg-red-400/10',
      borderColor: 'border-red-400/20',
    },
    {
      title: 'Total Retorno',
      value: formatCurrency(data.totalReturn),
      icon: Target,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10',
      borderColor: 'border-blue-400/20',
    },
    {
      title: 'Lucro/Prejuízo',
      value: formatCurrency(data.totalProfit),
      icon: data.totalProfit >= 0 ? TrendingUp : TrendingDown,
      color: data.totalProfit >= 0 ? 'text-green-400' : 'text-red-400',
      bgColor: data.totalProfit >= 0 ? 'bg-green-400/10' : 'bg-red-400/10',
      borderColor: data.totalProfit >= 0 ? 'border-green-400/20' : 'border-red-400/20',
    },
    {
      title: 'Dias Ativos',
      value: data.entries.length.toString(),
      icon: Calendar,
      color: 'text-orange-400',
      bgColor: 'bg-orange-400/10',
      borderColor: 'border-orange-400/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <Card 
            key={metric.title}
            className={`roi-card ${metric.bgColor} ${metric.borderColor} transform hover:scale-105 transition-all duration-200`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="roi-label mb-2">{metric.title}</p>
                  <p className={`roi-metric ${metric.color}`}>
                    {metric.value}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${metric.bgColor} ${metric.borderColor} border`}>
                  <Icon className={`w-6 h-6 ${metric.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
