
import { useState, useEffect, useCallback } from 'react';

export interface FixedDebt {
  id: string;
  name: string;
  amount: number;
  dueDate: number; // dia do mês (1-31)
  category: string;
  isPaid: boolean;
  description?: string;
}

export interface VariableDebt {
  id: string;
  name: string;
  amount: number;
  dueDate: string; // data específica
  category: string;
  isPaid: boolean;
  description?: string;
}

export interface FinancialData {
  cashBalance: number;
  fixedDebts: FixedDebt[];
  variableDebts: VariableDebt[];
  totalFixedDebts: number;
  totalVariableDebts: number;
  availableBalance: number;
}

const STORAGE_KEY = 'financial-planning-data';

export const useFinancialPlanning = () => {
  const [data, setData] = useState<FinancialData>({
    cashBalance: 0,
    fixedDebts: [],
    variableDebts: [],
    totalFixedDebts: 0,
    totalVariableDebts: 0,
    availableBalance: 0,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load data from localStorage
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(`${STORAGE_KEY}-admin`);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setData(parsedData);
      }
    } catch (err) {
      console.error('Error loading financial data:', err);
      setError('Erro ao carregar dados financeiros');
    }
  }, []);

  // Save data to localStorage
  const saveData = useCallback((newData: FinancialData) => {
    try {
      localStorage.setItem(`${STORAGE_KEY}-admin`, JSON.stringify(newData));
    } catch (err) {
      console.error('Error saving financial data:', err);
      setError('Erro ao salvar dados');
    }
  }, []);

  // Calculate totals and available balance
  const calculateTotals = useCallback((
    cashBalance: number,
    fixedDebts: FixedDebt[],
    variableDebts: VariableDebt[]
  ) => {
    const totalFixedDebts = fixedDebts
      .filter(debt => !debt.isPaid)
      .reduce((sum, debt) => sum + debt.amount, 0);
    
    const totalVariableDebts = variableDebts
      .filter(debt => !debt.isPaid)
      .reduce((sum, debt) => sum + debt.amount, 0);
    
    const availableBalance = cashBalance - totalFixedDebts - totalVariableDebts;

    return { totalFixedDebts, totalVariableDebts, availableBalance };
  }, []);

  // Update cash balance
  const updateCashBalance = useCallback(async (amount: number) => {
    setLoading(true);
    try {
      const totals = calculateTotals(amount, data.fixedDebts, data.variableDebts);
      const newData = {
        ...data,
        cashBalance: amount,
        ...totals,
      };
      setData(newData);
      saveData(newData);
    } catch (err) {
      setError('Erro ao atualizar saldo');
    } finally {
      setLoading(false);
    }
  }, [data, calculateTotals, saveData]);

  // Add fixed debt
  const addFixedDebt = useCallback(async (debt: Omit<FixedDebt, 'id'>) => {
    setLoading(true);
    try {
      const newDebt: FixedDebt = {
        ...debt,
        id: Date.now().toString(),
      };
      const newFixedDebts = [...data.fixedDebts, newDebt];
      const totals = calculateTotals(data.cashBalance, newFixedDebts, data.variableDebts);
      
      const newData = {
        ...data,
        fixedDebts: newFixedDebts,
        ...totals,
      };
      setData(newData);
      saveData(newData);
    } catch (err) {
      setError('Erro ao adicionar dívida fixa');
    } finally {
      setLoading(false);
    }
  }, [data, calculateTotals, saveData]);

  // Add variable debt
  const addVariableDebt = useCallback(async (debt: Omit<VariableDebt, 'id'>) => {
    setLoading(true);
    try {
      const newDebt: VariableDebt = {
        ...debt,
        id: Date.now().toString(),
      };
      const newVariableDebts = [...data.variableDebts, newDebt];
      const totals = calculateTotals(data.cashBalance, data.fixedDebts, newVariableDebts);
      
      const newData = {
        ...data,
        variableDebts: newVariableDebts,
        ...totals,
      };
      setData(newData);
      saveData(newData);
    } catch (err) {
      setError('Erro ao adicionar dívida');
    } finally {
      setLoading(false);
    }
  }, [data, calculateTotals, saveData]);

  // Toggle debt payment status
  const toggleDebtPayment = useCallback(async (debtId: string, type: 'fixed' | 'variable') => {
    setLoading(true);
    try {
      let newData = { ...data };
      
      if (type === 'fixed') {
        newData.fixedDebts = data.fixedDebts.map(debt =>
          debt.id === debtId ? { ...debt, isPaid: !debt.isPaid } : debt
        );
      } else {
        newData.variableDebts = data.variableDebts.map(debt =>
          debt.id === debtId ? { ...debt, isPaid: !debt.isPaid } : debt
        );
      }

      const totals = calculateTotals(newData.cashBalance, newData.fixedDebts, newData.variableDebts);
      newData = { ...newData, ...totals };
      
      setData(newData);
      saveData(newData);
    } catch (err) {
      setError('Erro ao atualizar status da dívida');
    } finally {
      setLoading(false);
    }
  }, [data, calculateTotals, saveData]);

  // Remove debt
  const removeDebt = useCallback(async (debtId: string, type: 'fixed' | 'variable') => {
    setLoading(true);
    try {
      let newData = { ...data };
      
      if (type === 'fixed') {
        newData.fixedDebts = data.fixedDebts.filter(debt => debt.id !== debtId);
      } else {
        newData.variableDebts = data.variableDebts.filter(debt => debt.id !== debtId);
      }

      const totals = calculateTotals(newData.cashBalance, newData.fixedDebts, newData.variableDebts);
      newData = { ...newData, ...totals };
      
      setData(newData);
      saveData(newData);
    } catch (err) {
      setError('Erro ao remover dívida');
    } finally {
      setLoading(false);
    }
  }, [data, calculateTotals, saveData]);

  return {
    data,
    loading,
    error,
    updateCashBalance,
    addFixedDebt,
    addVariableDebt,
    toggleDebtPayment,
    removeDebt,
    clearError: () => setError(null),
  };
};
