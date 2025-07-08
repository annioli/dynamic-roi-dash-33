
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useFinancialPlanning, HistoryEntry } from '@/hooks/useFinancialPlanning';
import { Download, History, Wallet, CreditCard, TrendingUp, TrendingDown, FileText } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface HistoryModalProps {
  open: boolean;
  onClose: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({ open, onClose }) => {
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
        return <Wallet className="w-5 h-5 text-emerald-400" />;
      case 'debt_added':
        return <CreditCard className="w-5 h-5 text-red-400" />;
      case 'debt_paid':
        return <TrendingUp className="w-5 h-5 text-blue-400" />;
      case 'debt_removed':
        return <TrendingDown className="w-5 h-5 text-yellow-400" />;
      default:
        return <History className="w-5 h-5 text-slate-400" />;
    }
  };

  const getHistoryColor = (type: HistoryEntry['type'], amount: number) => {
    if (type === 'cash_update') return 'text-emerald-400';
    if (type === 'debt_paid' && amount > 0) return 'text-emerald-400';
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

  const generatePDF = async () => {
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    // Header
    pdf.setFillColor(15, 23, 42);
    pdf.rect(0, 0, 210, 40, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Relatório Financeiro', 20, 25);
    
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 20, 32);
    
    // Summary section
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Resumo Financeiro', 20, 55);
    
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Saldo em Caixa: ${formatCurrency(data.cashBalance)}`, 20, 65);
    pdf.text(`Dívidas Fixas: ${formatCurrency(data.totalFixedDebts)}`, 20, 72);
    pdf.text(`Outras Dívidas: ${formatCurrency(data.totalVariableDebts)}`, 20, 79);
    pdf.text(`Saldo Disponível: ${formatCurrency(data.availableBalance)}`, 20, 86);
    
    // History section
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Histórico de Movimentações', 20, 105);
    
    let yPosition = 115;
    const pageHeight = 297;
    
    data.history.forEach((entry, index) => {
      if (yPosition > pageHeight - 30) {
        pdf.addPage();
        yPosition = 20;
      }
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`${formatDate(entry.date)}`, 20, yPosition);
      
      pdf.setFont('helvetica', 'normal');
      pdf.text(`${getTypeLabel(entry.type)}: ${entry.description}`, 20, yPosition + 5);
      
      if (entry.amount !== 0) {
        const amountText = `${entry.amount > 0 ? '+' : ''}${formatCurrency(entry.amount)}`;
        pdf.text(amountText, 150, yPosition + 5);
      }
      
      yPosition += 15;
    });
    
    // Footer
    const totalPages = pdf.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.setTextColor(128, 128, 128);
      pdf.text(`Página ${i} de ${totalPages}`, 170, 290);
      pdf.text('Gerado pelo Sistema de Planejamento Financeiro', 20, 290);
    }
    
    pdf.save(`relatorio-financeiro-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl border border-slate-700/50">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between text-white text-xl">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-500/20 rounded-lg backdrop-blur-sm border border-indigo-500/30">
                <FileText className="w-6 h-6 text-indigo-400" />
              </div>
              <span>Histórico Completo</span>
            </div>
            <Button
              onClick={generatePDF}
              className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white border-0"
            >
              <Download className="w-4 h-4 mr-2" />
              Baixar PDF
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="h-full pr-4">
          {data.history.length === 0 ? (
            <div className="text-center py-12">
              <History className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 text-lg">Nenhuma movimentação registrada</p>
            </div>
          ) : (
            <div className="space-y-4">
              {data.history.map((entry) => (
                <div
                  key={entry.id}
                  className="p-4 rounded-xl border bg-slate-800/40 border-slate-600/30 transition-all duration-200 hover:bg-slate-700/40 hover:border-slate-500/50"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="p-2 rounded-lg bg-slate-700/50">
                        {getHistoryIcon(entry.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-1">
                          <p className="text-white font-medium">{entry.description}</p>
                          <Badge variant="outline" className="text-xs bg-slate-700/50 border-slate-600">
                            {getTypeLabel(entry.type)}
                          </Badge>
                          {entry.category && (
                            <Badge variant="outline" className="text-xs bg-slate-600/50 border-slate-500">
                              {entry.category}
                            </Badge>
                          )}
                        </div>
                        <p className="text-slate-400 text-sm">{formatDate(entry.date)}</p>
                      </div>
                    </div>
                    {entry.amount !== 0 && (
                      <div className={`font-bold text-lg ${getHistoryColor(entry.type, entry.amount)}`}>
                        {entry.amount > 0 ? '+' : ''}{formatCurrency(entry.amount)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
