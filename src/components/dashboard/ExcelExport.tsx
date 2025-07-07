
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { ROIData } from '@/hooks/useROIData';
import * as XLSX from 'xlsx';

interface ExcelExportProps {
  data: ROIData;
}

export const ExcelExport: React.FC<ExcelExportProps> = ({ data }) => {
  const exportToExcel = () => {
    if (data.entries.length === 0) {
      alert('Não há dados para exportar');
      return;
    }

    // Preparar dados para a planilha
    const excelData = data.entries.map((entry, index) => ({
      'Data': new Date(entry.date).toLocaleDateString('pt-BR'),
      'Gasto (R$)': entry.expense.toFixed(2),
      'Retorno (R$)': entry.return.toFixed(2),
      'Lucro/Prejuízo (R$)': entry.profit.toFixed(2),
      'ROI': entry.dailyROI.toFixed(2) + 'x',
      'Status': entry.isProfit ? 'Lucro' : 'Prejuízo'
    }));

    // Calcular resumo mensal
    const currentMonth = new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    const monthlyEntries = data.entries.filter(entry => {
      const entryDate = new Date(entry.date);
      const now = new Date();
      return entryDate.getMonth() === now.getMonth() && entryDate.getFullYear() === now.getFullYear();
    });

    const monthlyExpense = monthlyEntries.reduce((sum, entry) => sum + entry.expense, 0);
    const monthlyReturn = monthlyEntries.reduce((sum, entry) => sum + entry.return, 0);
    const monthlyProfit = monthlyReturn - monthlyExpense;
    const monthlyROI = monthlyExpense > 0 ? monthlyReturn / monthlyExpense : 0;

    // Dados do resumo
    const summaryData = [
      { 'Métrica': 'Período', 'Valor': currentMonth },
      { 'Métrica': 'Total de Dias', 'Valor': data.entries.length },
      { 'Métrica': 'Gasto Total (R$)', 'Valor': data.totalExpense.toFixed(2) },
      { 'Métrica': 'Retorno Total (R$)', 'Valor': data.totalReturn.toFixed(2) },
      { 'Métrica': 'Lucro/Prejuízo Total (R$)', 'Valor': data.totalProfit.toFixed(2) },
      { 'Métrica': 'ROI Médio', 'Valor': (data.totalExpense > 0 ? (data.totalReturn / data.totalExpense).toFixed(2) : '0.00') + 'x' },
      { 'Métrica': 'Status Geral', 'Valor': data.totalProfit >= 0 ? 'Lucro' : 'Prejuízo' },
      { 'Métrica': '', 'Valor': '' },
      { 'Métrica': 'RESUMO MENSAL', 'Valor': '' },
      { 'Métrica': 'Gasto Mensal (R$)', 'Valor': monthlyExpense.toFixed(2) },
      { 'Métrica': 'Retorno Mensal (R$)', 'Valor': monthlyReturn.toFixed(2) },
      { 'Métrica': 'Lucro/Prejuízo Mensal (R$)', 'Valor': monthlyProfit.toFixed(2) },
      { 'Métrica': 'ROI Mensal', 'Valor': monthlyROI.toFixed(2) + 'x' },
      { 'Métrica': 'Status Mensal', 'Valor': monthlyProfit >= 0 ? 'Lucro' : 'Prejuízo' }
    ];

    // Criar workbook
    const wb = XLSX.utils.book_new();

    // Adicionar planilha de dados detalhados
    const ws1 = XLSX.utils.json_to_sheet(excelData);
    XLSX.utils.book_append_sheet(wb, ws1, 'Dados Detalhados');

    // Adicionar planilha de resumo
    const ws2 = XLSX.utils.json_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, ws2, 'Resumo');

    // Adicionar dados para gráfico (formato simples)
    const chartData = data.entries.map(entry => ({
      'Data': new Date(entry.date).toLocaleDateString('pt-BR'),
      'Gasto': entry.expense,
      'Retorno': entry.return,
      'Lucro': entry.profit
    }));
    const ws3 = XLSX.utils.json_to_sheet(chartData);
    XLSX.utils.book_append_sheet(wb, ws3, 'Dados para Gráfico');

    // Gerar arquivo
    const fileName = `ROI_Dashboard_${new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  return (
    <Button
      onClick={exportToExcel}
      className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold transition-all duration-200"
    >
      <Download className="w-4 h-4 mr-2" />
      Exportar Excel
    </Button>
  );
};
