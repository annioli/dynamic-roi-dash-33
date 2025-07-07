
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { BarChart3, FileText, CheckSquare, Webhook, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TopNavigation = () => {
  const { logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-700/50">
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <Link 
              to="/dashboard" 
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                isActive('/dashboard') 
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <BarChart3 className="h-4 w-4" />
              <span className="font-medium">Dashboard ROI</span>
            </Link>
            
            <Link 
              to="/anotacoes" 
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                isActive('/anotacoes') 
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <FileText className="h-4 w-4" />
              <span className="font-medium">Anotações</span>
            </Link>

            <Link 
              to="/tarefas" 
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                isActive('/tarefas') 
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <CheckSquare className="h-4 w-4" />
              <span className="font-medium">Tarefas</span>
            </Link>

            <Link 
              to="/integracoes" 
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                isActive('/integracoes') 
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Webhook className="h-4 w-4" />
              <span className="font-medium">Integrações</span>
            </Link>
          </div>

          <Button
            onClick={handleLogout}
            variant="outline"
            className="flex items-center space-x-2 bg-red-600/10 border-red-500/30 text-red-400 hover:bg-red-600/20 hover:text-red-300 hover:border-red-500/50"
          >
            <LogOut className="h-4 w-4" />
            <span>Sair</span>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default TopNavigation;
