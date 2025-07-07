import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useAdminData } from '@/hooks/useAdminData';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Users, Clock, Mail, Calendar, Trash2, Shield } from 'lucide-react';

export const UsersTab: React.FC = () => {
  const { adminData, loading, refreshData } = useAdminData();
  const [actionUser, setActionUser] = useState<string>('');

  const getUserTypeColor = (userType: string) => {
    switch (userType) {
      case 'admin':
        return 'bg-purple-600 text-white';
      case 'subscriber':
        return 'bg-green-600 text-white';
      case 'trial':
        return 'bg-blue-600 text-white';
      case 'test':
        return 'bg-orange-600 text-white';
      case 'blocked':
        return 'bg-red-600 text-white';
      default:
        return 'bg-slate-600 text-white';
    }
  };

  const getUserTypeLabel = (userType: string) => {
    switch (userType) {
      case 'admin':
        return 'Administrador';
      case 'subscriber':
        return 'Assinante';
      case 'trial':
        return 'Teste Gratuito';
      case 'test':
        return 'Conta Teste';
      case 'blocked':
        return 'Bloqueado';
      default:
        return userType;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleDeleteUser = (username: string) => {
    const registeredUsers = JSON.parse(localStorage.getItem('nexum-registered-users') || '[]');
    const updatedUsers = registeredUsers.filter((u: any) => u.username !== username);
    localStorage.setItem('nexum-registered-users', JSON.stringify(updatedUsers));
    
    // Remove ROI data for the user
    localStorage.removeItem(`roi-dashboard-data-${username}`);
    
    refreshData();
  };

  const isDefaultAccount = (username: string) => {
    return username === 'Teste' || username === 'Admin';
  };

  const isBlocked = (userType: string) => {
    return userType === 'blocked';
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
      {/* Header Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-900/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Total de Usuários</CardTitle>
            <Users className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{adminData.totalUsers}</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Assinantes</CardTitle>
            <Users className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{adminData.subscriberUsers}</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Em Teste</CardTitle>
            <Clock className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{adminData.trialUsers}</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Expirados</CardTitle>
            <Clock className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{adminData.expiredUsers}</div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card className="bg-slate-900/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Lista de Usuários</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700">
                <TableHead className="text-slate-300">Usuário</TableHead>
                <TableHead className="text-slate-300">Email</TableHead>
                <TableHead className="text-slate-300">Tipo</TableHead>
                <TableHead className="text-slate-300">Registrado em</TableHead>
                <TableHead className="text-slate-300">Dias Restantes</TableHead>
                <TableHead className="text-slate-300">Status</TableHead>
                <TableHead className="text-slate-300">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {adminData.users.map((user, index) => (
                <TableRow key={index} className="border-slate-700">
                  <TableCell className="text-white font-medium">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      <span>{user.username}</span>
                      {user.userType === 'admin' && (
                        <Shield className="h-4 w-4 text-purple-400" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-slate-300">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-slate-400" />
                      <span>{user.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getUserTypeColor(user.userType)}>
                      {getUserTypeLabel(user.userType)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-300">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-slate-400" />
                      <span>{formatDate(user.registeredAt)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-slate-300">
                    {user.userType === 'admin' ? (
                      <span className="text-purple-400">Ilimitado</span>
                    ) : isBlocked(user.userType) ? (
                      <span className="text-red-400">Bloqueado</span>
                    ) : user.daysRemaining > 0 ? (
                      <span className={user.daysRemaining <= 3 ? 'text-red-400' : 'text-green-400'}>
                        {user.daysRemaining} dias
                      </span>
                    ) : (
                      <span className="text-red-400">Expirado</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      className={
                        isBlocked(user.userType)
                          ? 'bg-red-600 text-white'
                          : user.isExpired 
                          ? 'bg-red-600 text-white' 
                          : 'bg-green-600 text-white'
                      }
                    >
                      {isBlocked(user.userType) ? 'Bloqueado' : user.isExpired ? 'Expirado' : 'Ativo'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {!isDefaultAccount(user.username) && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-red-600 text-red-600 hover:bg-red-600/10"
                            onClick={() => setActionUser(user.username)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-slate-900 border-slate-700">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-white">
                              Excluir Conta
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-slate-400">
                              Tem certeza que deseja excluir permanentemente a conta "{user.username}"? 
                              Esta ação não pode ser desfeita e todos os dados do usuário serão perdidos, 
                              incluindo dados de ROI e configurações.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="bg-slate-800 text-slate-300 border-slate-600 hover:bg-slate-700">
                              Cancelar
                            </AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-red-600 hover:bg-red-700 text-white"
                              onClick={() => handleDeleteUser(user.username)}
                            >
                              Excluir Conta
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                    {isDefaultAccount(user.username) && (
                      <span className="text-slate-500 text-sm">Conta protegida</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
