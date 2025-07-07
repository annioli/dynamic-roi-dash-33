
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, Database, RefreshCw, Download } from 'lucide-react';
import { useAdminData } from '@/hooks/useAdminData';

export const SettingsTab: React.FC = () => {
  const { refreshData, loading } = useAdminData();

  const handleClearData = () => {
    if (confirm('Tem certeza que deseja limpar todos os dados? Esta ação não pode ser desfeita.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const handleExportData = () => {
    const data = {
      users: JSON.parse(localStorage.getItem('nexum-registered-users') || '[]'),
      adminData: JSON.parse(localStorage.getItem('nexum-admin-data') || '{}'),
      roiData: Object.keys(localStorage)
        .filter(key => key.startsWith('roi-dashboard-data-'))
        .reduce((acc, key) => {
          acc[key] = JSON.parse(localStorage.getItem(key) || '{}');
          return acc;
        }, {} as Record<string, any>)
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexum-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-slate-900/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Configurações do Sistema</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white">Dados do Sistema</h3>
              
              <Button
                onClick={refreshData}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Atualizando...' : 'Atualizar Dados'}
              </Button>

              <Button
                onClick={handleExportData}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                <Download className="h-4 w-4 mr-2" />
                Exportar Backup
              </Button>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white">Operações Avançadas</h3>
              
              <Button
                onClick={handleClearData}
                variant="destructive"
                className="w-full"
              >
                <Database className="h-4 w-4 mr-2" />
                Limpar Todos os Dados
              </Button>

              <div className="text-sm text-slate-400">
                <p>⚠️ Esta operação removerá todos os dados do sistema, incluindo usuários e informações de ROI.</p>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-700 pt-6">
            <h3 className="text-lg font-medium text-white mb-4">Informações do Sistema</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-400">Versão:</span>
                <span className="text-white ml-2">1.0.0</span>
              </div>
              <div>
                <span className="text-slate-400">Última atualização:</span>
                <span className="text-white ml-2">{new Date().toLocaleDateString('pt-BR')}</span>
              </div>
              <div>
                <span className="text-slate-400">Ambiente:</span>
                <span className="text-white ml-2">Produção</span>
              </div>
              <div>
                <span className="text-slate-400">Status:</span>
                <span className="text-green-400 ml-2">Online</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
