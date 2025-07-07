
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdminData } from '@/hooks/useAdminData';
import { BarChart3, TrendingUp, Users, Clock } from 'lucide-react';

export const StatsTab: React.FC = () => {
  const { adminData, loading } = useAdminData();

  const getGrowthRate = () => {
    // Simular taxa de crescimento baseada nos usuários
    const totalUsers = adminData.totalUsers;
    return totalUsers > 2 ? ((totalUsers - 2) / 2 * 100).toFixed(1) : '0';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Total de Usuários</CardTitle>
            <Users className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{adminData.totalUsers}</div>
            <p className="text-xs text-slate-400">+{getGrowthRate()}% do inicial</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Assinantes Ativos</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{adminData.subscriberUsers}</div>
            <p className="text-xs text-slate-400">
              {adminData.totalUsers > 0 ? 
                ((adminData.subscriberUsers / adminData.totalUsers) * 100).toFixed(1) : 0}% dos usuários
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Em Período de Teste</CardTitle>
            <Clock className="h-4 w-4 text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{adminData.trialUsers}</div>
            <p className="text-xs text-slate-400">
              {adminData.totalUsers > 0 ? 
                ((adminData.trialUsers / adminData.totalUsers) * 100).toFixed(1) : 0}% dos usuários
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Usuários Expirados</CardTitle>
            <Clock className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{adminData.expiredUsers}</div>
            <p className="text-xs text-slate-400">Necessitam renovação</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 shadow-xl">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-purple-400" />
              <span>Distribuição de Usuários</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-200">Administradores</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-purple-500" 
                      style={{ width: `${(1 / adminData.totalUsers) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-slate-300">1</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-200">Assinantes</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500" 
                      style={{ width: `${(adminData.subscriberUsers / adminData.totalUsers) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-slate-300">{adminData.subscriberUsers}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-200">Em Teste</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500" 
                      style={{ width: `${(adminData.trialUsers / adminData.totalUsers) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-slate-300">{adminData.trialUsers}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-200">Contas Teste</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-orange-500" 
                      style={{ width: `${(adminData.testUsers / adminData.totalUsers) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-slate-300">{adminData.testUsers}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 shadow-xl">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-400" />
              <span>Métricas de Conversão</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-200">Taxa de Conversão (Teste → Assinante)</span>
                  <span className="text-green-400 font-semibold">
                    {adminData.trialUsers > 0 ? 
                      ((adminData.subscriberUsers / (adminData.trialUsers + adminData.subscriberUsers)) * 100).toFixed(1) : 0}%
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500" 
                    style={{ width: `${adminData.trialUsers > 0 ? 
                      ((adminData.subscriberUsers / (adminData.trialUsers + adminData.subscriberUsers)) * 100) : 0}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-200">Taxa de Expiração</span>
                  <span className="text-red-400 font-semibold">
                    {adminData.totalUsers > 0 ? 
                      ((adminData.expiredUsers / adminData.totalUsers) * 100).toFixed(1) : 0}%
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-red-500" 
                    style={{ width: `${(adminData.expiredUsers / adminData.totalUsers) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-200">Usuários Ativos</span>
                  <span className="text-blue-400 font-semibold">
                    {adminData.totalUsers > 0 ? 
                      (((adminData.totalUsers - adminData.expiredUsers) / adminData.totalUsers) * 100).toFixed(1) : 0}%
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500" 
                    style={{ width: `${((adminData.totalUsers - adminData.expiredUsers) / adminData.totalUsers) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
