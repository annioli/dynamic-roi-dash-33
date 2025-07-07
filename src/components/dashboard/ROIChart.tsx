
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ROIData } from '@/hooks/useROIData';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { BarChart3, TrendingUp, Activity } from 'lucide-react';

interface ROIChartProps {
  data: ROIData;
}

export const ROIChart: React.FC<ROIChartProps> = ({ data }) => {
  console.log('[ROIMetrics] Rendering charts with data:', data);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
    });
  };

  const chartData = data.entries.map(entry => ({
    date: formatDate(entry.date),
    fullDate: entry.date,
    roi: parseFloat(entry.dailyROI.toFixed(2)),
    expense: entry.expense,
    return: entry.return,
    profit: entry.profit,
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4 shadow-2xl ring-1 ring-white/10">
          <p className="text-slate-300 text-sm mb-3 font-medium">{`Data: ${label}`}</p>
          <div className="space-y-2">
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex items-center justify-between min-w-[120px]">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full shadow-sm"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-sm text-slate-300">
                    {entry.name === 'roi' && 'ROI'}
                    {entry.name === 'expense' && 'Gasto'}
                    {entry.name === 'return' && 'Retorno'}
                    {entry.name === 'profit' && 'Lucro'}
                  </span>
                </div>
                <span className="text-sm font-semibold text-white ml-4">
                  {entry.name === 'roi' ? `${entry.value}x` : formatCurrency(entry.value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomDot = (props: any) => {
    const { cx, cy, fill } = props;
    return (
      <circle
        cx={cx}
        cy={cy}
        r={6}
        fill={fill}
        stroke="rgba(255,255,255,0.8)"
        strokeWidth={2}
        className="drop-shadow-lg"
        style={{
          filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))'
        }}
      />
    );
  };

  const CustomActiveDot = (props: any) => {
    const { cx, cy, fill } = props;
    return (
      <g>
        <circle
          cx={cx}
          cy={cy}
          r={12}
          fill={fill}
          fillOpacity={0.1}
          className="animate-pulse"
        />
        <circle
          cx={cx}
          cy={cy}
          r={8}
          fill={fill}
          stroke="rgba(255,255,255,0.9)"
          strokeWidth={3}
          className="drop-shadow-xl"
          style={{
            filter: 'drop-shadow(0 0 12px rgba(59, 130, 246, 0.8))'
          }}
        />
      </g>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
      {/* ROI Area Chart */}
      <Card className="bg-gradient-to-br from-slate-900/50 to-slate-800/30 backdrop-blur-xl border border-slate-700/50 shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 hover:border-blue-500/30">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-3 text-white">
            <div className="p-2 bg-blue-500/20 rounded-lg backdrop-blur-sm border border-blue-500/30">
              <TrendingUp className="w-5 h-5 text-blue-400" />
            </div>
            <span className="text-lg font-semibold">ROI Diário</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <defs>
                  <linearGradient id="roiGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="50%" stopColor="#1d4ed8" stopOpacity={0.4}/>
                    <stop offset="100%" stopColor="#1e3a8a" stopOpacity={0.1}/>
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge> 
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke="rgba(148, 163, 184, 0.1)" 
                  horizontal={true}
                  vertical={false}
                />
                <XAxis 
                  dataKey="date" 
                  stroke="#94a3b8"
                  fontSize={12}
                  fontWeight={500}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8' }}
                />
                <YAxis 
                  stroke="#94a3b8"
                  fontSize={12}
                  fontWeight={500}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8' }}
                  tickFormatter={(value) => `${value}x`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="roi"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  fill="url(#roiGradient)"
                  dot={<CustomDot />}
                  activeDot={<CustomActiveDot />}
                  style={{ filter: 'url(#glow)' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Investment vs Return Bar Chart */}
      <Card className="bg-gradient-to-br from-slate-900/50 to-slate-800/30 backdrop-blur-xl border border-slate-700/50 shadow-2xl hover:shadow-green-500/10 transition-all duration-500 hover:border-green-500/30">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-3 text-white">
            <div className="p-2 bg-green-500/20 rounded-lg backdrop-blur-sm border border-green-500/30">
              <BarChart3 className="w-5 h-5 text-green-400" />
            </div>
            <span className="text-lg font-semibold">Gasto vs Retorno</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }} barGap={10}>
                <defs>
                  <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity={0.9}/>
                    <stop offset="100%" stopColor="#dc2626" stopOpacity={0.7}/>
                  </linearGradient>
                  <linearGradient id="returnGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22c55e" stopOpacity={0.9}/>
                    <stop offset="100%" stopColor="#16a34a" stopOpacity={0.7}/>
                  </linearGradient>
                </defs>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke="rgba(148, 163, 184, 0.1)" 
                  horizontal={true}
                  vertical={false}
                />
                <XAxis 
                  dataKey="date" 
                  stroke="#94a3b8"
                  fontSize={12}
                  fontWeight={500}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8' }}
                />
                <YAxis 
                  stroke="#94a3b8"
                  fontSize={12}
                  fontWeight={500}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8' }}
                  tickFormatter={formatCurrency}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{ 
                    paddingTop: '20px',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                />
                <Bar 
                  dataKey="expense" 
                  name="Gasto"
                  fill="url(#expenseGradient)"
                  radius={[6, 6, 0, 0]}
                  className="drop-shadow-lg hover:drop-shadow-xl transition-all duration-300"
                />
                <Bar 
                  dataKey="return" 
                  name="Retorno"
                  fill="url(#returnGradient)"
                  radius={[6, 6, 0, 0]}
                  className="drop-shadow-lg hover:drop-shadow-xl transition-all duration-300"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Profit/Loss Line Chart */}
      <Card className="lg:col-span-2 bg-gradient-to-br from-slate-900/50 to-slate-800/30 backdrop-blur-xl border border-slate-700/50 shadow-2xl hover:shadow-purple-500/10 transition-all duration-500 hover:border-purple-500/30">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-3 text-white">
            <div className="p-2 bg-purple-500/20 rounded-lg backdrop-blur-sm border border-purple-500/30">
              <Activity className="w-5 h-5 text-purple-400" />
            </div>
            <span className="text-lg font-semibold">Evolução do Lucro/Prejuízo</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <defs>
                  <linearGradient id="profitGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#a855f7" stopOpacity={0.8}/>
                    <stop offset="50%" stopColor="#9333ea" stopOpacity={0.6}/>
                    <stop offset="100%" stopColor="#7c3aed" stopOpacity={0.4}/>
                  </linearGradient>
                  <filter id="profitGlow">
                    <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                    <feMerge> 
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke="rgba(148, 163, 184, 0.1)" 
                  horizontal={true}
                  vertical={false}
                />
                <XAxis 
                  dataKey="date" 
                  stroke="#94a3b8"
                  fontSize={12}
                  fontWeight={500}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8' }}
                />
                <YAxis 
                  stroke="#94a3b8"
                  fontSize={12}
                  fontWeight={500}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8' }}
                  tickFormatter={formatCurrency}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="profit"
                  stroke="url(#profitGradient)"
                  strokeWidth={4}
                  dot={<CustomDot />}
                  activeDot={<CustomActiveDot />}
                  style={{ filter: 'url(#profitGlow)' }}
                />
                {/* Zero line reference with enhanced styling */}
                <Line
                  type="monotone"
                  dataKey={() => 0}
                  stroke="rgba(148, 163, 184, 0.4)"
                  strokeWidth={2}
                  strokeDasharray="8 4"
                  dot={false}
                  activeDot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
