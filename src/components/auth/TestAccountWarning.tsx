
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
import { AlertTriangle } from 'lucide-react';

interface TestAccountWarningProps {
  open: boolean;
  onClose: () => void;
}

const TestAccountWarning: React.FC<TestAccountWarningProps> = ({ open, onClose }) => {
  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 shadow-2xl max-w-md">
        <AlertDialogHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center shadow-lg">
              <AlertTriangle className="h-8 w-8 text-white" />
            </div>
          </div>
          
          <AlertDialogTitle className="text-xl font-bold text-white">
            Conta Demonstração
          </AlertDialogTitle>
          
          <AlertDialogDescription className="text-slate-300 text-base leading-relaxed">
            Você está utilizando uma conta de teste. Os dados inseridos são apenas para demonstração e não serão salvos permanentemente.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <AlertDialogFooter>
          <AlertDialogAction 
            onClick={onClose}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-200"
          >
            OK
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default TestAccountWarning;
