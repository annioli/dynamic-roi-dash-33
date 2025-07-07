
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Crown, Clock, CheckCircle } from 'lucide-react';

interface PlanSelectionModalProps {
  open: boolean;
  onClose: () => void;
  onSelectPlan: (planType: 'trial' | 'subscription') => void;
  username: string;
}

const PlanSelectionModal: React.FC<PlanSelectionModalProps> = ({ 
  open, 
  onClose, 
  onSelectPlan,
  username 
}) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 shadow-2xl max-w-2xl">
        <DialogHeader className="text-center space-y-4">
          <DialogTitle className="text-2xl font-bold text-white">
            Bem-vindo, {username}!
          </DialogTitle>
          <p className="text-slate-300 text-lg">
            Escolha seu plano para começar a usar a Nexum
          </p>
        </DialogHeader>
        
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          {/* Trial Plan */}
          <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 rounded-xl p-6 border border-blue-500/30 hover:border-blue-400/50 transition-all duration-300">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Teste Gratuito</h3>
              <p className="text-blue-300 text-lg font-semibold">14 dias grátis</p>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span className="text-slate-300">Acesso completo por 14 dias</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span className="text-slate-300">Todas as funcionalidades</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span className="text-slate-300">Sem compromisso</span>
              </div>
            </div>
            
            <Button 
              onClick={() => onSelectPlan('trial')}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3"
            >
              Começar Teste Gratuito
            </Button>
          </div>

          {/* Subscription Plan */}
          <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 rounded-xl p-6 border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                Recomendado
              </span>
            </div>
            
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Assinatura Premium</h3>
              <p className="text-purple-300 text-lg font-semibold">Acesso ilimitado</p>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span className="text-slate-300">Acesso ilimitado</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span className="text-slate-300">Suporte prioritário</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span className="text-slate-300">Atualizações exclusivas</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span className="text-slate-300">Dados salvos permanentemente</span>
              </div>
            </div>
            
            <Button 
              onClick={() => onSelectPlan('subscription')}
              className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold py-3"
            >
              Assinar Nexum
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PlanSelectionModal;
