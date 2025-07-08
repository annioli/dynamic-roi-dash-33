
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useFinancialPlanning, HistoryEntry } from '@/hooks/useFinancialPlanning';
import { History, TrendingUp, TrendingDown, CreditCard, Wallet } from 'lucide-react';

export const FinancialHistoryCard: React.FC = () => {
  const { data } = useFinancialPlanning();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(Math.abs(value));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getHistoryIcon = (type: HistoryEntry['type']) => {
    switch (type) {
      case 'cash_update':
        return <Wallet className="w-4 h-4 text-green-400" />;
      case 'debt_added':
        return <CreditCard className="w-4 h-4 text-red-400" />;
      case 'debt_paid':
        return <TrendingUp className="w-4 h-4 text-blue-400" />;
      case 'debt_removed':
        return <TrendingDown className="w-4 h-4 text-yellow-400" />;
      default:
        return <History className="w-4 h-4 text-slate-400" />;
    }
  };

  const getHistoryColor = (type: HistoryEntry['type'], amount: number) => {
    if (type === 'cash_update') return 'text-green-400';
    if (type === 'debt_paid' && amount > 0) return 'text-green-400';
    if (type === 'debt_added' || amount < 0) return 'text-red-400';
    return 'text-slate-400';
  };

  const getTypeLabel = (type: HistoryEntry['type']) => {
    switch (type) {
      case 'cash_update':
        return 'Saldo';
      case 'debt_added':
        return 'Dívida';
      case 'debt_paid':
        return 'Pagamento';
      case 'debt_removed':
        return 'Remoção';
      default:
        return 'Outros';
    }
  };

  return (
    <Card className="bg-gradient-to-br from-slate-900/50 to-slate-800/30 backdrop-blur-xl border border-slate-700/50 shadow-2xl">
      <CardHeader>
        <CardTitle className="flex items-center space-x-3 text-white">
          <div className="p-2 bg-indigo-500/20 rounded-lg backdrop-blur-sm border border-indigo-500/30">
            <History className="w-5 h-5 text-indigo-400" />
          </div>
          <span>Histórico Financeiro</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data.history.length === 0 ? (
          <div className="text-center py-8">
            <History className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">Nenhuma movimentação registrada</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {data.history.slice(0, 20).map((entry) => (
              <div
                key={entry.id}
                className="p-3 rounded-lg border bg-slate-800/30 border-slate-600/50 transition-all duration-200 hover:bg-slate-700/30"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1">
                    {getHistoryIcon(entry.type)}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <p className="text-white text-sm font-medium">{entry.description}</p>
                        <Badge variant="outline" className="text-xs">
                          {getTypeLabel(entry.type)}
                        </Badge>
                        {entry.category && (
                          <Badge variant="outline" className="text-xs bg-slate-700">
                            {entry.category}
                          </Badge>
                        )}
                      </div>
                      <p className="text-slate-400 text-xs">{formatDate(entry.date)}</p>
                    </div>
                  </div>
                  {entry.amount !== 0 && (
                    <div className={`font-bold text-sm ${getHistoryColor(entry.type, entry.amount)}`}>
                      {entry.amount > 0 ? '+' : ''}{formatCurrency(entry.amount)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        {data.history.length > 20 && (
          <div className="text-center mt-4">
            <p className="text-slate-500 text-xs">Mostrando os últimos 20 registros</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
