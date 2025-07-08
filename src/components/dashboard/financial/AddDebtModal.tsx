
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFinancialPlanning } from '@/hooks/useFinancialPlanning';
import { Calendar, CreditCard } from 'lucide-react';

interface AddDebtModalProps {
  open: boolean;
  onClose: () => void;
  type: 'fixed' | 'variable';
}

const categories = [
  'Alimentação',
  'Transporte',
  'Moradia',
  'Saúde',
  'Educação',
  'Lazer',
  'Vestuário',
  'Serviços',
  'Outros'
];

export const AddDebtModal: React.FC<AddDebtModalProps> = ({ open, onClose, type }) => {
  const { addFixedDebt, addVariableDebt, loading } = useFinancialPlanning();
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    dueDate: '',
    category: '',
    description: '',
  });

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setFormData({
        name: '',
        amount: '',
        dueDate: '',
        category: '',
        description: '',
      });
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Form data submitted:', formData);
    
    // Validação básica
    if (!formData.name.trim() || !formData.amount.trim() || !formData.dueDate.trim() || !formData.category.trim()) {
      console.log('Campos obrigatórios não preenchidos');
      return;
    }

    const amount = parseFloat(formData.amount);
    console.log('Amount parsed:', amount, 'from:', formData.amount);
    
    if (isNaN(amount) || amount <= 0) {
      console.log('Valor inválido:', amount);
      return;
    }

    try {
      if (type === 'fixed') {
        const dueDate = parseInt(formData.dueDate);
        console.log('Due date parsed for fixed debt:', dueDate);
        
        if (dueDate < 1 || dueDate > 31) {
          console.log('Dia do vencimento deve estar entre 1 e 31');
          return;
        }
        
        console.log('Adding fixed debt...');
        await addFixedDebt({
          name: formData.name.trim(),
          amount,
          dueDate,
          category: formData.category,
          description: formData.description.trim(),
          isPaid: false,
        });
        console.log('Fixed debt added successfully');
      } else {
        console.log('Adding variable debt...');
        await addVariableDebt({
          name: formData.name.trim(),
          amount,
          dueDate: formData.dueDate,
          category: formData.category,
          description: formData.description.trim(),
          isPaid: false,
        });
        console.log('Variable debt added successfully');
      }
      
      console.log('Form reset and modal closing');
      onClose();
    } catch (error) {
      console.error('Error adding debt:', error);
    }
  };

  const handleChange = (field: string, value: string) => {
    console.log(`Updating field ${field} with value:`, value);
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            {type === 'fixed' ? (
              <>
                <Calendar className="w-5 h-5 text-blue-400" />
                <span>Adicionar Dívida Fixa</span>
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5 text-purple-400" />
                <span>Adicionar Dívida</span>
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-slate-300">Nome da Dívida *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Ex: Conta de luz, Cartão de crédito..."
              className="mt-1 bg-slate-800 border-slate-600 text-white"
              required
            />
          </div>

          <div>
            <Label htmlFor="amount" className="text-slate-300">Valor *</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0.01"
              value={formData.amount}
              onChange={(e) => handleChange('amount', e.target.value)}
              placeholder="0.00"
              className="mt-1 bg-slate-800 border-slate-600 text-white"
              required
            />
          </div>

          <div>
            <Label htmlFor="dueDate" className="text-slate-300">
              {type === 'fixed' ? 'Dia do Vencimento (1-31) *' : 'Data de Vencimento *'}
            </Label>
            {type === 'fixed' ? (
              <Input
                id="dueDate"
                type="number"
                min="1"
                max="31"
                value={formData.dueDate}
                onChange={(e) => handleChange('dueDate', e.target.value)}
                placeholder="Ex: 15"
                className="mt-1 bg-slate-800 border-slate-600 text-white"
                required
              />
            ) : (
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleChange('dueDate', e.target.value)}
                className="mt-1 bg-slate-800 border-slate-600 text-white"
                required
              />
            )}
          </div>

          <div>
            <Label htmlFor="category" className="text-slate-300">Categoria *</Label>
            <Select value={formData.category} onValueChange={(value) => handleChange('category', value)} required>
              <SelectTrigger className="mt-1 bg-slate-800 border-slate-600 text-white">
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                {categories.map((category) => (
                  <SelectItem key={category} value={category} className="text-white hover:bg-slate-700">
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description" className="text-slate-300">Descrição (opcional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Detalhes adicionais..."
              className="mt-1 bg-slate-800 border-slate-600 text-white"
              rows={3}
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-700 hover:bg-slate-600"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className={`flex-1 ${
                type === 'fixed'
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-purple-600 hover:bg-purple-700'
              }`}
            >
              {loading ? 'Salvando...' : 'Adicionar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
