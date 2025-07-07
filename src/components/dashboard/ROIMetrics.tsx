
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useROIData } from '@/hooks/useROIData';
import { ROIChart } from './ROIChart';
import { MetricsCards } from './MetricsCards';
import { DateSelector } from './DateSelector';
import { ExcelExport } from './ExcelExport';
import { Calendar, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ROIMetrics = () => {
  const [expense, setExpense] = useState<string>('');
  const [returnValue, setReturnValue] = useState<string>('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const { data, loading, error, addEntry, clearError } = useROIData();
  const { toast } = useToast();

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Show error toast
  useEffect(() => {
    if (error) {
      toast({
        title: "Erro",
        description: error,
        variant: "destructive",
      });
      clearError();
    }
  }, [error, toast, clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('[ROIMetrics] Form submitted');

    // Validation
    const expenseNum = parseFloat(expense);
    const returnNum = parseFloat(returnValue);

    if (isNaN(expenseNum) || isNaN(returnNum)) {
      toast({
        title: "Erro de Validação",
        description: "Por favor, preencha todos os campos com valores numéricos válidos.",
        variant: "destructive",
      });
      return;
    }

    if (expenseNum <= 0) {
      toast({
        title: "Erro de Validação",
        description: "O gasto deve ser maior que zero.",
        variant: "destructive",
      });
      return;
    }

    try {
      await addEntry(expenseNum, returnNum);
      
      // Clear form
      setExpense('');
      setReturnValue('');

      toast({
        title: "Sucesso",
        description: "Dados salvos com sucesso!",
        variant: "default",
      });
    } catch (err) {
      console.error('[ROIMetrics] Error in form submission:', err);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  // Filtrar dados baseado na data selecionada
  const getFilteredData = () => {
    if (!selectedDate) return data;
    
    const filteredEntries = data.entries.filter(entry => entry.date === selectedDate);
    return {
      ...data,
      entries: filteredEntries
    };
  };

  const filteredData = getFilteredData();

  return (
    <div className="min-h-screen bg-black p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="animate-fade-in">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Dashboard ROI
              </h1>
              <p className="text-slate-400 text-lg">
                Análise de Retorno sobre Investimento em Tempo Real
              </p>
            </div>
            
            <div className="mt-4 md:mt-0 flex items-center space-x-4">
              {/* Excel Export Button */}
              {data.entries.length > 0 && (
                <ExcelExport data={data} />
              )}
              
              <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-blue-400" />
                <div>
                  <div className="text-sm text-slate-400">
                    {formatDate(currentTime)}
                  </div>
                  <div className="text-lg font-mono text-white">
                    {formatTime(currentTime)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Input Form */}
        <Card className="bg-slate-900/50 border-slate-800 animate-slide-in">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <DollarSign className="w-5 h-5 text-green-400" />
              <span>Entrada de Dados</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-slate-300 font-medium text-sm">Gasto (R$)</label>
                <Input
                  type="number"
                  step="0.01"
                  value={expense}
                  onChange={(e) => setExpense(e.target.value)}
                  placeholder="0.00"
                  className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-slate-300 font-medium text-sm">Retorno (R$)</label>
                <Input
                  type="number"
                  step="0.01"
                  value={returnValue}
                  onChange={(e) => setReturnValue(e.target.value)}
                  placeholder="0.00"
                  className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20"
                  required
                />
              </div>
              
              <div className="flex items-end">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 transition-all duration-200"
                >
                  {loading ? 'Salvando...' : 'Salvar Dados'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Date Selector */}
        <div className="animate-fade-in">
          <DateSelector 
            data={data}
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
          />
        </div>

        {/* Metrics Cards */}
        <div className="animate-fade-in">
          <MetricsCards data={selectedDate ? filteredData : data} />
        </div>

        {/* ROI Status Badge */}
        {data.entries.length > 0 && (
          <div className="flex justify-center animate-fade-in">
            <Badge 
              className={`roi-badge text-lg py-2 px-6 ${
                data.dailyROI >= 1 
                  ? 'roi-success' 
                  : data.dailyROI < 1 
                    ? 'roi-danger' 
                    : 'bg-slate-600 text-slate-200'
              }`}
            >
              {data.dailyROI >= 1 ? (
                <>
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Lucro
                </>
              ) : data.dailyROI < 1 ? (
                <>
                  <TrendingDown className="w-4 h-4 mr-2" />
                  Prejuízo
                </>
              ) : (
                'Neutro'
              )}
            </Badge>
          </div>
        )}

        {/* Charts */}
        {(selectedDate ? filteredData.entries.length > 0 : data.entries.length > 0) && (
          <div className="animate-fade-in">
            <ROIChart data={selectedDate ? filteredData : data} />
          </div>
        )}

        {/* Empty State */}
        {data.entries.length === 0 && (
          <div className="text-center py-12 animate-fade-in">
            <div className="roi-card max-w-md mx-auto">
              <TrendingUp className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                Comece a Acompanhar seu ROI
              </h3>
              <p className="text-slate-400">
                Adicione seus primeiros dados para visualizar gráficos e métricas em tempo real.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ROIMetrics;
