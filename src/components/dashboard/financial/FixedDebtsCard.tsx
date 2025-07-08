
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useFinancialPlanning } from '@/hooks/useFinancialPlanning';
import { Calendar, Check, X, Trash2 } from 'lucide-react';

export const FixedDebtsCard: React.FC = () => {
  const { data, toggleDebtPayment, removeDebt, loading } = useFinancialPlanning();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDueDate = (day: number) => {
    return `Todo dia ${day}`;
  };

  return (
    <Card className="bg-gradient-to-br from-slate-900/50 to-slate-800/30 backdrop-blur-xl border border-slate-700/50 shadow-2xl">
      <CardHeader>
        <CardTitle className="flex items-center space-x-3 text-white">
          <div className="p-2 bg-blue-500/20 rounded-lg backdrop-blur-sm border border-blue-500/30">
            <Calendar className="w-5 h-5 text-blue-400" />
          </div>
          <span>Dívidas Fixas</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data.fixedDebts.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">Nenhuma dívida fixa cadastrada</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {data.fixedDebts.map((debt) => (
              <div
                key={debt.id}
                className={`p-3 rounded-lg border transition-all duration-200 ${
                  debt.isPaid
                    ? 'bg-green-900/20 border-green-500/30'
                    : 'bg-slate-800/50 border-slate-600/50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex-1">
                    <h4 className={`font-medium ${debt.isPaid ? 'text-green-300 line-through' : 'text-white'}`}>
                      {debt.name}
                    </h4>
                    <p className="text-sm text-slate-400">{formatDueDate(debt.dueDate)}</p>
                    {debt.description && (
                      <p className="text-xs text-slate-500 mt-1">{debt.description}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <div className={`font-bold ${debt.isPaid ? 'text-green-400' : 'text-red-400'}`}>
                      {formatCurrency(debt.amount)}
                    </div>
                    <Badge className="mt-1" variant="outline">
                      {debt.category}
                    </Badge>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    onClick={() => toggleDebtPayment(debt.id, 'fixed')}
                    disabled={loading}
                    className={`flex-1 ${
                      debt.isPaid
                        ? 'bg-slate-600 hover:bg-slate-700'
                        : 'bg-green-600 hover:bg-green-700'
                    }`}
                  >
                    {debt.isPaid ? (
                      <>
                        <X className="w-3 h-3 mr-1" />
                        Desfazer
                      </>
                    ) : (
                      <>
                        <Check className="w-3 h-3 mr-1" />
                        Pagar
                      </>
                    )}
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => removeDebt(debt.id, 'fixed')}
                    disabled={loading}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
