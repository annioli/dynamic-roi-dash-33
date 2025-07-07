
import React, { useState } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AdminSidebar } from './AdminSidebar';
import { UsersTab } from './UsersTab';
import { StatsTab } from './StatsTab';
import { ROITab } from './ROITab';
import { SettingsTab } from './SettingsTab';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Menu, Crown, Users, Activity } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('users');

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'users':
        return <UsersTab />;
      case 'stats':
        return <StatsTab />;
      case 'roi':
        return <ROITab />;
      case 'settings':
        return <SettingsTab />;
      default:
        return <UsersTab />;
    }
  };

  const getTabTitle = () => {
    switch (activeTab) {
      case 'users':
        return 'Gerenciamento de Usuários';
      case 'stats':
        return 'Estatísticas do Sistema';
      case 'roi':
        return 'Monitoramento de ROI';
      case 'settings':
        return 'Configurações';
      default:
        return 'Painel Administrativo';
    }
  };

  const getTabIcon = () => {
    switch (activeTab) {
      case 'users':
        return Users;
      case 'stats':
        return Activity;
      case 'roi':
        return Shield;
      case 'settings':
        return Shield;
      default:
        return Shield;
    }
  };

  const TabIcon = getTabIcon();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Subtle background patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(120,119,198,0.05),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,107,107,0.05),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_80%,rgba(34,197,94,0.03),transparent_50%)]"></div>
      
      <SidebarProvider>
        <div className="flex min-h-screen w-full relative z-10">
          <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />
          
          <main className="flex-1 overflow-auto">
            {/* Modern Header */}
            <div className="sticky top-0 z-10 bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50">
              <div className="flex items-center justify-between p-6">
                <div className="flex items-center space-x-4">
                  <SidebarTrigger className="text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg p-2 transition-all duration-200" />
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full blur-sm opacity-60"></div>
                      <div className="relative bg-gradient-to-r from-purple-600 to-blue-600 p-3 rounded-full">
                        <Crown className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                        {getTabTitle()}
                      </h1>
                      <p className="text-sm text-slate-400 font-medium">Sistema de Gerenciamento Nexum</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  {/* Status Indicator */}
                  <div className="flex items-center space-x-2 bg-slate-800/50 backdrop-blur rounded-full px-4 py-2 border border-slate-700/50">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
                    <span className="text-sm text-slate-300 font-medium">Sistema Online</span>
                  </div>
                  
                  {/* Admin Badge */}
                  <div className="flex items-center space-x-2 bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur rounded-full px-4 py-2 border border-purple-500/30">
                    <Shield className="w-4 h-4 text-purple-400" />
                    <span className="text-sm text-purple-300 font-semibold">Administrador</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Area */}
            <div className="p-6">
              {/* Tab Header Card */}
              <Card className="mb-6 bg-slate-800/30 backdrop-blur-sm border-slate-700/50 shadow-xl">
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg border border-blue-500/30">
                      <TabIcon className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-white font-semibold">
                        {getTabTitle()}
                      </CardTitle>
                      <p className="text-slate-400 mt-1 text-sm">
                        {activeTab === 'users' && 'Visualize e gerencie todos os usuários cadastrados no sistema'}
                        {activeTab === 'stats' && 'Acompanhe métricas detalhadas e análises do sistema'}
                        {activeTab === 'roi' && 'Monitore o ROI de todos os usuários em tempo real'}
                        {activeTab === 'settings' && 'Configure parâmetros e preferências do sistema'}
                      </p>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* Tab Content */}
              <div className="animate-fade-in">
                {renderActiveTab()}
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
};
