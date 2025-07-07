
import { useState, useEffect, useCallback } from 'react';

export interface ROIEntry {
  id: string;
  date: string;
  expense: number;
  return: number;
  dailyROI: number;
  profit: number;
  isProfit: boolean;
}

export interface ROIData {
  entries: ROIEntry[];
  dailyROI: number;
  monthlyROI: number;
  totalExpense: number;
  totalReturn: number;
  totalProfit: number;
  currentDate: string;
}

const STORAGE_KEY = 'roi-dashboard-data';

// Função para obter a data atual no fuso horário do Brasil
const getCurrentBrazilDate = () => {
  const now = new Date();
  // Ajusta para o fuso horário do Brasil (UTC-3)
  const brazilTime = new Date(now.getTime() - (now.getTimezoneOffset() * 60000) - (3 * 60 * 60 * 1000));
  return brazilTime.toISOString().split('T')[0];
};

export const useROIData = () => {
  const [data, setData] = useState<ROIData>({
    entries: [],
    dailyROI: 0,
    monthlyROI: 0,
    totalExpense: 0,
    totalReturn: 0,
    totalProfit: 0,
    currentDate: getCurrentBrazilDate(),
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load data from localStorage with user-specific key
  useEffect(() => {
    console.log('[ROIMetrics] Loading data from localStorage');
    try {
      const savedData = localStorage.getItem(`${STORAGE_KEY}-admin`);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setData(parsedData);
        console.log('[ROIMetrics] Data loaded successfully:', parsedData);
      }
    } catch (err) {
      console.error('[ROIMetrics] Error loading data:', err);
      setError('Erro ao carregar dados salvos');
    }
  }, []);

  // Save data to localStorage with user-specific key
  const saveData = useCallback((newData: ROIData) => {
    try {
      localStorage.setItem(`${STORAGE_KEY}-admin`, JSON.stringify(newData));
      console.log('[ROIMetrics] Data saved successfully');
    } catch (err) {
      console.error('[ROIMetrics] Error saving data:', err);
      setError('Erro ao salvar dados');
    }
  }, []);

  // Calculate ROI metrics
  const calculateROI = useCallback((expense: number, returnValue: number) => {
    if (expense === 0) return { roi: 0, profit: 0, isProfit: false };
    
    const profit = returnValue - expense;
    const roi = returnValue / expense; // ROI como múltiplo (ex: 5.0 = retornou 5x)
    const isProfit = profit > 0;
    
    return { roi, profit, isProfit };
  }, []);

  // Add new entry
  const addEntry = useCallback(async (expense: number, returnValue: number) => {
    console.log('[ROIMetrics] Adding new entry:', { expense, returnValue });
    setLoading(true);
    setError(null);

    try {
      const currentDate = getCurrentBrazilDate(); // Usar a data correta do Brasil
      console.log('[ROIMetrics] Using current Brazil date:', currentDate);
      
      const { roi, profit, isProfit } = calculateROI(expense, returnValue);

      // Check if entry for today already exists
      const existingEntryIndex = data.entries.findIndex(entry => entry.date === currentDate);
      
      const newEntry: ROIEntry = {
        id: existingEntryIndex >= 0 ? data.entries[existingEntryIndex].id : Date.now().toString(),
        date: currentDate,
        expense,
        return: returnValue,
        dailyROI: roi,
        profit,
        isProfit,
      };

      let updatedEntries = [...data.entries];
      if (existingEntryIndex >= 0) {
        updatedEntries[existingEntryIndex] = newEntry;
        console.log('[ROIMetrics] Updated existing entry for today');
      } else {
        updatedEntries.push(newEntry);
        console.log('[ROIMetrics] Added new entry for today');
      }

      // Calculate monthly ROI (current month)
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      const monthlyEntries = updatedEntries.filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate.getMonth() === currentMonth && entryDate.getFullYear() === currentYear;
      });

      const monthlyROI = monthlyEntries.reduce((sum, entry) => sum + entry.dailyROI, 0);
      const totalExpense = updatedEntries.reduce((sum, entry) => sum + entry.expense, 0);
      const totalReturn = updatedEntries.reduce((sum, entry) => sum + entry.return, 0);
      const totalProfit = updatedEntries.reduce((sum, entry) => sum + entry.profit, 0);

      const newData: ROIData = {
        entries: updatedEntries,
        dailyROI: roi,
        monthlyROI,
        totalExpense,
        totalReturn,
        totalProfit,
        currentDate,
      };

      setData(newData);
      saveData(newData);
      console.log('[ROIMetrics] Entry added successfully, new data:', newData);
    } catch (err) {
      console.error('[ROIMetrics] Error adding entry:', err);
      setError('Erro ao adicionar entrada');
    } finally {
      setLoading(false);
    }
  }, [data.entries, calculateROI, saveData]);

  // Update current date
  useEffect(() => {
    const updateDate = () => {
      const currentDate = getCurrentBrazilDate(); // Usar a data correta do Brasil
      if (data.currentDate !== currentDate) {
        console.log('[ROIMetrics] Date changed, updating current date to:', currentDate);
        setData(prev => ({ ...prev, currentDate }));
      }
    };

    // Update date every minute
    const interval = setInterval(updateDate, 60000);
    updateDate(); // Initial update

    return () => clearInterval(interval);
  }, [data.currentDate]);

  return {
    data,
    loading,
    error,
    addEntry,
    clearError: () => setError(null),
  };
};
