import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAdminData } from '@/hooks/useAdminData';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { TrendingUp, TrendingDown, DollarSign, Target } from 'lucide-react';

export const ROITab: React.FC = () => {
  const { adminData, loading } = useAdminData();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getTotalROI = () => {
    const totals = adminData.users.reduce((acc, user) => ({
      expense: acc.expense + user.roi.totalExpense,
      return: acc.return + user.roi.totalReturn,
      profit: acc.profit + user.roi.totalProfit
    }), { expense: 0, return: 0, profit: 0 });

    return totals;
  };

  const getProfitableUsers = () => {
    return adminData.users.filter(user => user.roi.isProfit).length;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  const totalROI = getTotalROI();
  const profitableUsers = getProfitableUsers();

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Total Investido</CardTitle>
            <DollarSign className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{formatCurrency(totalROI.expense)}</div>
            <p className="text-xs text-slate-400">Soma de todos os usuários</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Total Retorno</CardTitle>
            <Target className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{formatCurrency(totalROI.return)}</div>
            <p className="text-xs text-slate-400">Soma de todos os retornos</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={`text-sm font-medium text-slate-300`}>
              Lucro Total
            </CardTitle>
            {totalROI.profit >= 0 ? 
              <TrendingUp className="h-4 w-4 text-green-400" /> : 
              <TrendingDown className="h-4 w-4 text-red-400" />
            }
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalROI.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {formatCurrency(totalROI.profit)}
            </div>
            <p className={`text-xs ${totalROI.profit >= 0 ? 'text-green-400/70' : 'text-red-400/70'}`}>
              {totalROI.profit >= 0 ? 'Sistema em lucro' : 'Sistema em prejuízo'}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Usuários Lucrativos</CardTitle>
            <TrendingUp className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{profitableUsers}</div>
            <p className="text-xs text-slate-400">
              {adminData.totalUsers > 0 ? ((profitableUsers / adminData.totalUsers) * 100).toFixed(1) : 0}% dos usuários
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ROI Table */}
      <Card className="bg-slate-900/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>ROI por Usuário (Tempo Real)</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700">
                <TableHead className="text-slate-300">Usuário</TableHead>
                <TableHead className="text-slate-300">Tipo</TableHead>
                <TableHead className="text-slate-300">Investimento</TableHead>
                <TableHead className="text-slate-300">Retorno</TableHead>
                <TableHead className="text-slate-300">Lucro/Prejuízo</TableHead>
                <TableHead className="text-slate-300">Status</TableHead>
                <TableHead className="text-slate-300">ROI</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {adminData.users.map((user, index) => {
                const roiMultiplier = user.roi.totalExpense > 0 ? 
                  (user.roi.totalReturn / user.roi.totalExpense) : 0;
                
                return (
                  <TableRow key={index} className="border-slate-700">
                    <TableCell className="text-white font-medium">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                        <span>{user.username}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={
                        user.userType === 'admin' ? 'bg-purple-600' :
                        user.userType === 'subscriber' ? 'bg-green-600' :
                        user.userType === 'trial' ? 'bg-blue-600' : 'bg-orange-600'
                      }>
                        {user.userType === 'admin' ? 'Admin' :
                         user.userType === 'subscriber' ? 'Assinante' :
                         user.userType === 'trial' ? 'Teste' : 'Demo'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-300">
                      {formatCurrency(user.roi.totalExpense)}
                    </TableCell>
                    <TableCell className="text-slate-300">
                      {formatCurrency(user.roi.totalReturn)}
                    </TableCell>
                    <TableCell className={user.roi.isProfit ? 'text-green-400' : 'text-red-400'}>
                      {formatCurrency(user.roi.totalProfit)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        {user.roi.isProfit ? (
                          <>
                            <TrendingUp className="h-4 w-4 text-green-400" />
                            <Badge className="bg-green-600 text-white">Lucro</Badge>
                          </>
                        ) : user.roi.totalProfit < 0 ? (
                          <>
                            <TrendingDown className="h-4 w-4 text-red-400" />
                            <Badge className="bg-red-600 text-white">Prejuízo</Badge>
                          </>
                        ) : (
                          <Badge className="bg-slate-600 text-white">Neutro</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-300">
                      {roiMultiplier > 0 ? (
                        <span className={roiMultiplier >= 1 ? 'text-green-400' : 'text-red-400'}>
                          {roiMultiplier.toFixed(2)}x
                        </span>
                      ) : (
                        <span className="text-slate-500">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {adminData.users.length === 0 && (
            <div className="text-center py-12">
              <TrendingUp className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                Nenhum dado de ROI disponível
              </h3>
              <p className="text-slate-400">
                Os usuários ainda não adicionaram dados de investimento.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
