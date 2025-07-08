
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useFinancialPlanning } from '@/hooks/useFinancialPlanning';
import { CashBalanceCard } from './financial/CashBalanceCard';
import { FixedDebtsCard } from './financial/FixedDebtsCard';
import { VariableDebtsCard } from './financial/VariableDebtsCard';
import { FinancialHistoryCard } from './financial/FinancialHistoryCard';
import { AddDebtModal } from './financial/AddDebtModal';
import { 
  Wallet, 
  Calendar, 
  CreditCard, 
  Plus,
  TrendingUp,
  TrendingDown,
  AlertTriangle 
} from 'lucide-react';

export const FinancialPlanning: React.FC = () => {
  const { data, loading } = useFinancialPlanning();
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalType, setModalType] = useState<'fixed' | 'variable'>('fixed');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getBalanceStatus = () => {
    if (data.availableBalance > 0) {
      return { color: 'text-green-400', icon: TrendingUp, status: 'Positivo' };
    } else if (data.availableBalance < 0) {
      return { color: 'text-red-400', icon: TrendingDown, status: 'Negativo' };
    } else {
      return { color: 'text-yellow-400', icon: AlertTriangle, status: 'Neutro' };
    }
  };

  const balanceStatus = getBalanceStatus();
  const BalanceIcon = balanceStatus.icon;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Planejamento Financeiro</h2>
          <p className="text-slate-400">Gerencie seu caixa e controle suas dívidas</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            onClick={() => {
              setModalType('fixed');
              setShowAddModal(true);
            }}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Dívida Fixa
          </Button>
          <Button
            onClick={() => {
              setModalType('variable');
              setShowAddModal(true);
            }}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Dívida
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Saldo em Caixa</CardTitle>
            <Wallet className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{formatCurrency(data.cashBalance)}</div>
            <p className="text-xs text-slate-400">Valor total disponível</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Dívidas Fixas</CardTitle>
            <Calendar className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-400">{formatCurrency(data.totalFixedDebts)}</div>
            <p className="text-xs text-slate-400">{data.fixedDebts.filter(d => !d.isPaid).length} dívidas mensais</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Outras Dívidas</CardTitle>
            <CreditCard className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-400">{formatCurrency(data.totalVariableDebts)}</div>
            <p className="text-xs text-slate-400">{data.variableDebts.filter(d => !d.isPaid).length} dívidas pontuais</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Saldo Disponível</CardTitle>
            <BalanceIcon className={`h-4 w-4 ${balanceStatus.color}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${balanceStatus.color}`}>
              {formatCurrency(data.availableBalance)}
            </div>
            <div className="flex items-center space-x-1">
              <Badge className={`${balanceStatus.color.replace('text-', 'bg-').replace('-400', '-600')} text-white`}>
                {balanceStatus.status}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Financial Management Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
        <CashBalanceCard />
        <FixedDebtsCard />
        <VariableDebtsCard />
        <FinancialHistoryCard />
      </div>

      {/* Add Debt Modal */}
      <AddDebtModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        type={modalType}
      />
    </div>
  );
};
