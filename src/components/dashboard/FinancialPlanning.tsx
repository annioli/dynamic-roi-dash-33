
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useFinancialPlanning } from '@/hooks/useFinancialPlanning';
import { CashBalanceCard } from './financial/CashBalanceCard';
import { FixedDebtsCard } from './financial/FixedDebtsCard';
import { VariableDebtsCard } from './financial/VariableDebtsCard';
import { FinancialHistoryCard } from './financial/FinancialHistoryCard';
import { FinancialChart } from './financial/FinancialChart';
import { HistoryModal } from './financial/HistoryModal';
import { AddDebtModal } from './financial/AddDebtModal';
import { toast } from '@/hooks/use-toast';
import { 
  Wallet, 
  Calendar, 
  CreditCard, 
  Plus,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Save,
  History,
  Eye
} from 'lucide-react';

export const FinancialPlanning: React.FC = () => {
  const { data, loading, saveData } = useFinancialPlanning();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [modalType, setModalType] = useState<'fixed' | 'variable'>('fixed');
  const [saving, setSaving] = useState(false);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getBalanceStatus = () => {
    if (data.availableBalance > 0) {
      return { color: 'text-emerald-400', icon: TrendingUp, status: 'Positivo' };
    } else if (data.availableBalance < 0) {
      return { color: 'text-red-400', icon: TrendingDown, status: 'Negativo' };
    } else {
      return { color: 'text-yellow-400', icon: AlertTriangle, status: 'Neutro' };
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Simular salvamento (já está sendo salvo automaticamente no localStorage)
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "✅ Dados salvos com sucesso!",
        description: "Todas as suas informações financeiras foram salvas.",
      });
    } catch (error) {
      toast({
        title: "❌ Erro ao salvar",
        description: "Ocorreu um erro ao salvar os dados. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">💰 Planejamento Financeiro</h2>
          <p className="text-slate-400 text-lg">Gerencie seu caixa e controle suas dívidas de forma inteligente</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-6 py-2 rounded-xl transition-all duration-200"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {saving ? 'Salvando...' : 'Salvar'}
          </Button>
          <Button
            onClick={() => setShowHistoryModal(true)}
            className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white px-6 py-2 rounded-xl transition-all duration-200"
          >
            <Eye className="w-4 h-4 mr-2" />
            Ver Histórico
          </Button>
          <Button
            onClick={() => {
              setModalType('fixed');
              setShowAddModal(true);
            }}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-2 rounded-xl transition-all duration-200"
          >
            <Plus className="w-4 h-4 mr-2" />
            Dívida Fixa
          </Button>
          <Button
            onClick={() => {
              setModalType('variable');
              setShowAddModal(true);
            }}
            className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-6 py-2 rounded-xl transition-all duration-200"
          >
            <Plus className="w-4 h-4 mr-2" />
            Dívida
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-slate-800/60 to-slate-700/40 backdrop-blur-sm border border-slate-600/50 hover:border-slate-500/60 transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Saldo em Caixa</CardTitle>
            <div className="p-2 bg-emerald-500/20 rounded-lg">
              <Wallet className="h-4 w-4 text-emerald-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-400">{formatCurrency(data.cashBalance)}</div>
            <p className="text-xs text-slate-400 mt-1">Valor total disponível</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-800/60 to-slate-700/40 backdrop-blur-sm border border-slate-600/50 hover:border-slate-500/60 transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Dívidas Fixas</CardTitle>
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Calendar className="h-4 w-4 text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">{formatCurrency(data.totalFixedDebts)}</div>
            <p className="text-xs text-slate-400 mt-1">{data.fixedDebts.filter(d => !d.isPaid).length} dívidas mensais</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-800/60 to-slate-700/40 backdrop-blur-sm border border-slate-600/50 hover:border-slate-500/60 transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Outras Dívidas</CardTitle>
            <div className="p-2 bg-amber-500/20 rounded-lg">
              <CreditCard className="h-4 w-4 text-amber-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-400">{formatCurrency(data.totalVariableDebts)}</div>
            <p className="text-xs text-slate-400 mt-1">{data.variableDebts.filter(d => !d.isPaid).length} dívidas pontuais</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-800/60 to-slate-700/40 backdrop-blur-sm border border-slate-600/50 hover:border-slate-500/60 transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Saldo Disponível</CardTitle>
            <div className={`p-2 rounded-lg ${balanceStatus.color.includes('emerald') ? 'bg-emerald-500/20' : balanceStatus.color.includes('red') ? 'bg-red-500/20' : 'bg-yellow-500/20'}`}>
              <BalanceIcon className={`h-4 w-4 ${balanceStatus.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${balanceStatus.color}`}>
              {formatCurrency(data.availableBalance)}
            </div>
            <div className="flex items-center space-x-2 mt-1">
              <Badge className={`${balanceStatus.color.replace('text-', 'bg-').replace('-400', '-600')} text-white text-xs`}>
                {balanceStatus.status}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Financial Management Cards and Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <CashBalanceCard />
        <FixedDebtsCard />
        <VariableDebtsCard />
      </div>

      {/* Chart and History */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <FinancialChart />
        <FinancialHistoryCard />
      </div>

      {/* Modals */}
      <AddDebtModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        type={modalType}
      />
      
      <HistoryModal
        open={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
      />
    </div>
  );
};
