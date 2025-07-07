
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Clock } from 'lucide-react';

interface TrialExpiredModalProps {
  open: boolean;
  onSubscribe: () => void;
}

const TrialExpiredModal: React.FC<TrialExpiredModalProps> = ({ open, onSubscribe }) => {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 shadow-2xl max-w-md">
        <AlertDialogHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center shadow-lg">
              <Clock className="h-8 w-8 text-white" />
            </div>
          </div>
          
          <AlertDialogTitle className="text-xl font-bold text-white">
            Seu tempo de 14 dias acabou
          </AlertDialogTitle>
          
          <AlertDialogDescription className="text-slate-300 text-base leading-relaxed">
            Assine para liberar seu acesso e garantir atualizações exclusivas
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <AlertDialogFooter>
          <AlertDialogAction 
            onClick={onSubscribe}
            className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition-all duration-200"
          >
            Assinar NEXUM
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default TrialExpiredModal;
