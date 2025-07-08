
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFinancialPlanning } from '@/hooks/useFinancialPlanning';
import { Wallet, Edit, Check, X } from 'lucide-react';

export const CashBalanceCard: React.FC = () => {
  const { data, updateCashBalance, loading } = useFinancialPlanning();
  const [isEditing, setIsEditing] = useState(false);
  const [newBalance, setNewBalance] = useState(data.cashBalance.toString());

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleSave = async () => {
    const amount = parseFloat(newBalance.replace(/[^\d,-]/g, '').replace(',', '.'));
    if (!isNaN(amount)) {
      await updateCashBalance(amount);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setNewBalance(data.cashBalance.toString());
    setIsEditing(false);
  };

  return (
    <Card className="bg-gradient-to-br from-slate-900/50 to-slate-800/30 backdrop-blur-xl border border-slate-700/50 shadow-2xl">
      <CardHeader>
        <CardTitle className="flex items-center space-x-3 text-white">
          <div className="p-2 bg-green-500/20 rounded-lg backdrop-blur-sm border border-green-500/30">
            <Wallet className="w-5 h-5 text-green-400" />
          </div>
          <span>Saldo em Caixa</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isEditing ? (
          <>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">
                {formatCurrency(data.cashBalance)}
              </div>
              <p className="text-slate-400 text-sm">Valor total disponível</p>
            </div>
            <Button
              onClick={() => setIsEditing(true)}
              className="w-full bg-slate-700 hover:bg-slate-600 text-white"
            >
              <Edit className="w-4 h-4 mr-2" />
              Editar Saldo
            </Button>
          </>
        ) : (
          <div className="space-y-4">
            <div>
              <Label htmlFor="balance" className="text-slate-300">Novo Saldo</Label>
              <Input
                id="balance"
                type="number"
                step="0.01"
                value={newBalance}
                onChange={(e) => setNewBalance(e.target.value)}
                placeholder="0,00"
                className="mt-1 bg-slate-800 border-slate-600 text-white"
              />
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={handleSave}
                disabled={loading}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                <Check className="w-4 h-4 mr-2" />
                Salvar
              </Button>
              <Button
                onClick={handleCancel}
                disabled={loading}
                className="flex-1 bg-slate-600 hover:bg-slate-700"
              >
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
