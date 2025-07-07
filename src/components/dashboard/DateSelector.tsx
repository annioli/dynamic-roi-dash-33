
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ROIData } from '@/hooks/useROIData';
import { Calendar, Eye } from 'lucide-react';

interface DateSelectorProps {
  data: ROIData;
  selectedDate: string | null;
  onDateSelect: (date: string | null) => void;
}

export const DateSelector: React.FC<DateSelectorProps> = ({
  data,
  selectedDate,
  onDateSelect,
}) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00'); // Adiciona hora para evitar problemas de timezone
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatROI = (value: number) => {
    return `${value.toFixed(1)}x`;
  };

  // Get unique dates from entries and sort them (newest first)
  const uniqueDates = [...new Set(data.entries.map(entry => entry.date))]
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  // Get data for selected date
  const getSelectedDateData = () => {
    if (!selectedDate) return null;
    
    const dayEntries = data.entries.filter(entry => entry.date === selectedDate);
    const totalExpense = dayEntries.reduce((sum, entry) => sum + entry.expense, 0);
    const totalReturn = dayEntries.reduce((sum, entry) => sum + entry.return, 0);
    const roi = totalExpense > 0 ? totalReturn / totalExpense : 0;
    
    return {
      totalExpense,
      totalReturn,
      roi,
      profit: totalReturn - totalExpense
    };
  };

  const selectedData = getSelectedDateData();

  return (
    <Card className="bg-gradient-to-br from-slate-900/50 to-slate-800/30 backdrop-blur-xl border border-slate-700/50 shadow-2xl">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center space-x-3 text-white">
          <div className="p-2 bg-blue-500/20 rounded-lg backdrop-blur-sm border border-blue-500/30">
            <Calendar className="w-5 h-5 text-blue-400" />
          </div>
          <span className="text-lg font-semibold">Visualização por Data</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedDate === null ? "default" : "outline"}
            onClick={() => onDateSelect(null)}
            className={`transition-all duration-200 ${
              selectedDate === null
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-slate-800/50 border-slate-600 text-slate-300 hover:bg-slate-700/50 hover:text-white'
            }`}
          >
            <Eye className="w-4 h-4 mr-2" />
            Mostrar Todos
          </Button>
          
          {uniqueDates.map(date => (
            <Button
              key={date}
              variant={selectedDate === date ? "default" : "outline"}
              onClick={() => onDateSelect(date)}
              className={`transition-all duration-200 ${
                selectedDate === date
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-slate-800/50 border-slate-600 text-slate-300 hover:bg-slate-700/50 hover:text-white'
              }`}
            >
              {formatDate(date)}
            </Button>
          ))}
        </div>

        {selectedData && (
          <div className="mt-6 p-6 bg-gradient-to-r from-slate-800/40 to-slate-700/30 rounded-xl border border-slate-600/30 backdrop-blur-sm animate-slide-in-left">
            <div className="flex items-center justify-center mb-4">
              <Badge className="text-sm px-3 py-1 bg-blue-500/20 text-blue-300 border border-blue-500/30">
                Dados de {formatDate(selectedDate!)}
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="text-center">
                <p className="text-slate-400 text-sm mb-1">Gasto Total</p>
                <p className="text-2xl font-bold text-red-400">
                  {formatCurrency(selectedData.totalExpense)}
                </p>
              </div>
              
              <div className="text-center">
                <p className="text-slate-400 text-sm mb-1">Retorno Total</p>
                <p className="text-2xl font-bold text-green-400">
                  {formatCurrency(selectedData.totalReturn)}
                </p>
              </div>
              
              <div className="text-center">
                <p className="text-slate-400 text-sm mb-1">ROI</p>
                <p className={`text-2xl font-bold ${
                  selectedData.roi >= 1 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {formatROI(selectedData.roi)}
                </p>
              </div>
            </div>

            <div className="text-center p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
              <p className="text-slate-300 text-sm mb-2 font-medium">Resumo:</p>
              <p className="text-white text-base leading-relaxed">
                Gasto total foi {formatCurrency(selectedData.totalExpense)}, retornou {formatCurrency(selectedData.totalReturn)}, 
                ROI é de {formatROI(selectedData.roi)} {' '}
                <span className={selectedData.profit >= 0 ? 'text-green-400' : 'text-red-400'}>
                  ({selectedData.profit >= 0 ? 'Lucro' : 'Prejuízo'} de {formatCurrency(Math.abs(selectedData.profit))})
                </span>
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
