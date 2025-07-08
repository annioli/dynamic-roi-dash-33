
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

export interface HistoryEntry {
  id: string;
  date: string;
  type: 'cash_update' | 'debt_added' | 'debt_paid' | 'debt_removed';
  description: string;
  amount: number;
  category?: string;
}

export interface FinancialData {
  cashBalance: number;
  fixedDebts: FixedDebt[];
  variableDebts: VariableDebt[];
  totalFixedDebts: number;
  totalVariableDebts: number;
  availableBalance: number;
  history: HistoryEntry[];
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
    history: [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load data from localStorage
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(`${STORAGE_KEY}-admin`);
      console.log('Loading saved data:', savedData);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        // Garantir que history existe
        if (!parsedData.history) {
          parsedData.history = [];
        }
        console.log('Parsed data:', parsedData);
        setData(parsedData);
      }
    } catch (err) {
      console.error('Error loading financial data:', err);
      setError('Erro ao carregar dados financeiros');
    }
  }, []);

  // Save data to localStorage
  const saveDataToStorage = useCallback((newData: FinancialData) => {
    try {
      console.log('Saving data to localStorage:', newData);
      localStorage.setItem(`${STORAGE_KEY}-admin`, JSON.stringify(newData));
      console.log('Data saved successfully');
    } catch (err) {
      console.error('Error saving financial data:', err);
      setError('Erro ao salvar dados');
    }
  }, []);

  // Add history entry
  const addHistoryEntry = useCallback((
    type: HistoryEntry['type'],
    description: string,
    amount: number,
    category?: string
  ) => {
    const entry: HistoryEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      type,
      description,
      amount,
      category,
    };
    return entry;
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

    console.log('Calculated totals:', { totalFixedDebts, totalVariableDebts, availableBalance });

    return { totalFixedDebts, totalVariableDebts, availableBalance };
  }, []);

  // Update cash balance
  const updateCashBalance = useCallback(async (amount: number) => {
    console.log('Updating cash balance to:', amount);
    setLoading(true);
    try {
      const totals = calculateTotals(amount, data.fixedDebts, data.variableDebts);
      const historyEntry = addHistoryEntry(
        'cash_update',
        `Saldo atualizado para ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amount)}`,
        amount
      );
      
      const newData = {
        ...data,
        cashBalance: amount,
        ...totals,
        history: [historyEntry, ...data.history].slice(0, 100), // Manter apenas os últimos 100 registros
      };
      console.log('New data after cash balance update:', newData);
      setData(newData);
      saveDataToStorage(newData);
    } catch (err) {
      console.error('Error updating cash balance:', err);
      setError('Erro ao atualizar saldo');
    } finally {
      setLoading(false);
    }
  }, [data, calculateTotals, saveDataToStorage, addHistoryEntry]);

  // Add fixed debt
  const addFixedDebt = useCallback(async (debt: Omit<FixedDebt, 'id'>) => {
    console.log('Adding fixed debt:', debt);
    setLoading(true);
    try {
      const newDebt: FixedDebt = {
        ...debt,
        id: Date.now().toString(),
      };
      console.log('New fixed debt created:', newDebt);
      
      const newFixedDebts = [...data.fixedDebts, newDebt];
      console.log('Updated fixed debts array:', newFixedDebts);
      
      const totals = calculateTotals(data.cashBalance, newFixedDebts, data.variableDebts);
      const historyEntry = addHistoryEntry(
        'debt_added',
        `Dívida fixa adicionada: ${debt.name}`,
        -debt.amount,
        debt.category
      );
      
      const newData = {
        ...data,
        fixedDebts: newFixedDebts,
        ...totals,
        history: [historyEntry, ...data.history].slice(0, 100),
      };
      console.log('Final data after adding fixed debt:', newData);
      
      setData(newData);
      saveDataToStorage(newData);
      console.log('Fixed debt added successfully');
    } catch (err) {
      console.error('Error adding fixed debt:', err);
      setError('Erro ao adicionar dívida fixa');
    } finally {
      setLoading(false);
    }
  }, [data, calculateTotals, saveDataToStorage, addHistoryEntry]);

  // Add variable debt
  const addVariableDebt = useCallback(async (debt: Omit<VariableDebt, 'id'>) => {
    console.log('Adding variable debt:', debt);
    setLoading(true);
    try {
      const newDebt: VariableDebt = {
        ...debt,
        id: Date.now().toString(),
      };
      console.log('New variable debt created:', newDebt);
      
      const newVariableDebts = [...data.variableDebts, newDebt];
      console.log('Updated variable debts array:', newVariableDebts);
      
      const totals = calculateTotals(data.cashBalance, data.fixedDebts, newVariableDebts);
      const historyEntry = addHistoryEntry(
        'debt_added',
        `Dívida adicionada: ${debt.name}`,
        -debt.amount,
        debt.category
      );
      
      const newData = {
        ...data,
        variableDebts: newVariableDebts,
        ...totals,
        history: [historyEntry, ...data.history].slice(0, 100),
      };
      console.log('Final data after adding variable debt:', newData);
      
      setData(newData);
      saveDataToStorage(newData);
      console.log('Variable debt added successfully');
    } catch (err) {
      console.error('Error adding variable debt:', err);
      setError('Erro ao adicionar dívida');
    } finally {
      setLoading(false);
    }
  }, [data, calculateTotals, saveDataToStorage, addHistoryEntry]);

  // Toggle debt payment status
  const toggleDebtPayment = useCallback(async (debtId: string, type: 'fixed' | 'variable') => {
    setLoading(true);
    try {
      let newData = { ...data };
      let debtName = '';
      let debtAmount = 0;
      
      if (type === 'fixed') {
        const debt = data.fixedDebts.find(d => d.id === debtId);
        if (debt) {
          debtName = debt.name;
          debtAmount = debt.amount;
        }
        newData.fixedDebts = data.fixedDebts.map(debt =>
          debt.id === debtId ? { ...debt, isPaid: !debt.isPaid } : debt
        );
      } else {
        const debt = data.variableDebts.find(d => d.id === debtId);
        if (debt) {
          debtName = debt.name;
          debtAmount = debt.amount;
        }
        newData.variableDebts = data.variableDebts.map(debt =>
          debt.id === debtId ? { ...debt, isPaid: !debt.isPaid } : debt
        );
      }

      const totals = calculateTotals(newData.cashBalance, newData.fixedDebts, newData.variableDebts);
      const isPaying = type === 'fixed' 
        ? newData.fixedDebts.find(d => d.id === debtId)?.isPaid
        : newData.variableDebts.find(d => d.id === debtId)?.isPaid;
      
      const historyEntry = addHistoryEntry(
        'debt_paid',
        `${isPaying ? 'Pagamento' : 'Cancelamento do pagamento'} da dívida: ${debtName}`,
        isPaying ? debtAmount : -debtAmount
      );
      
      newData = { 
        ...newData, 
        ...totals,
        history: [historyEntry, ...data.history].slice(0, 100),
      };
      
      setData(newData);
      saveDataToStorage(newData);
    } catch (err) {
      setError('Erro ao atualizar status da dívida');
    } finally {
      setLoading(false);
    }
  }, [data, calculateTotals, saveDataToStorage, addHistoryEntry]);

  // Remove debt
  const removeDebt = useCallback(async (debtId: string, type: 'fixed' | 'variable') => {
    setLoading(true);
    try {
      let newData = { ...data };
      let debtName = '';
      
      if (type === 'fixed') {
        const debt = data.fixedDebts.find(d => d.id === debtId);
        if (debt) debtName = debt.name;
        newData.fixedDebts = data.fixedDebts.filter(debt => debt.id !== debtId);
      } else {
        const debt = data.variableDebts.find(d => d.id === debtId);
        if (debt) debtName = debt.name;
        newData.variableDebts = data.variableDebts.filter(debt => debt.id !== debtId);
      }

      const totals = calculateTotals(newData.cashBalance, newData.fixedDebts, newData.variableDebts);
      const historyEntry = addHistoryEntry(
        'debt_removed',
        `Dívida removida: ${debtName}`,
        0
      );
      
      newData = { 
        ...newData, 
        ...totals,
        history: [historyEntry, ...data.history].slice(0, 100),
      };
      
      setData(newData);
      saveDataToStorage(newData);
    } catch (err) {
      setError('Erro ao remover dívida');
    } finally {
      setLoading(false);
    }
  }, [data, calculateTotals, saveDataToStorage, addHistoryEntry]);

  return {
    data,
    loading,
    error,
    updateCashBalance,
    addFixedDebt,
    addVariableDebt,
    toggleDebtPayment,
    removeDebt,
    saveData: saveDataToStorage,
    clearError: () => setError(null),
  };
};
