
import { useState, useEffect, useCallback } from 'react';

export interface UserStats {
  username: string;
  email: string;
  userType: 'test' | 'admin' | 'trial' | 'subscriber';
  registeredAt: string;
  trialStartDate?: string;
  subscriptionStartDate?: string;
  lastLogin?: string;
  daysRemaining: number;
  isExpired: boolean;
  roi: {
    totalExpense: number;
    totalReturn: number;
    totalProfit: number;
    isProfit: boolean;
  };
}

export interface AdminData {
  totalUsers: number;
  testUsers: number;
  trialUsers: number;
  subscriberUsers: number;
  expiredUsers: number;
  users: UserStats[];
}

const ADMIN_STORAGE_KEY = 'nexum-admin-data';
const USERS_STORAGE_KEY = 'nexum-registered-users';
const ROI_STORAGE_KEY = 'roi-dashboard-data';

export const useAdminData = () => {
  const [adminData, setAdminData] = useState<AdminData>({
    totalUsers: 0,
    testUsers: 0,
    trialUsers: 0,
    subscriberUsers: 0,
    expiredUsers: 0,
    users: []
  });
  const [loading, setLoading] = useState(false);

  const calculateDaysRemaining = (userType: string, startDate?: string, subscriptionDate?: string) => {
    if (userType === 'admin') return -1; // Admin nunca expira
    if (userType === 'test') return 14; // Conta teste tem 14 dias fixos
    
    if (userType === 'trial' && startDate) {
      const start = new Date(startDate);
      const now = new Date();
      const diffTime = now.getTime() - start.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      return Math.max(0, 14 - diffDays);
    }
    
    if (userType === 'subscriber' && subscriptionDate) {
      const start = new Date(subscriptionDate);
      const now = new Date();
      const diffTime = now.getTime() - start.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      return Math.max(0, 30 - diffDays);
    }
    
    return 0;
  };

  const getUserROI = (username: string) => {
    try {
      const roiData = localStorage.getItem(`${ROI_STORAGE_KEY}-${username}`);
      if (roiData) {
        const data = JSON.parse(roiData);
        return {
          totalExpense: data.totalExpense || 0,
          totalReturn: data.totalReturn || 0,
          totalProfit: data.totalProfit || 0,
          isProfit: (data.totalProfit || 0) > 0
        };
      }
    } catch (error) {
      console.error('Error loading ROI data for user:', username, error);
    }
    
    return {
      totalExpense: 0,
      totalReturn: 0,
      totalProfit: 0,
      isProfit: false
    };
  };

  const loadAdminData = useCallback(() => {
    setLoading(true);
    try {
      // Carregar usuários registrados
      const registeredUsers = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]');
      
      // Adicionar contas padrão
      const defaultUsers = [
        {
          username: 'Teste',
          email: 'teste@nexum.com',
          userType: 'test',
          registeredAt: new Date().toISOString()
        },
        {
          username: 'Admin',
          email: 'admin@nexum.com',
          userType: 'admin',
          registeredAt: new Date().toISOString()
        }
      ];

      const allUsers = [...defaultUsers, ...registeredUsers];
      
      const userStats: UserStats[] = allUsers.map(user => {
        const daysRemaining = calculateDaysRemaining(
          user.userType, 
          user.trialStartDate, 
          user.subscriptionStartDate
        );
        
        const isExpired = user.userType === 'trial' && daysRemaining === 0;
        const roi = getUserROI(user.username);

        return {
          username: user.username,
          email: user.email,
          userType: user.userType as 'test' | 'admin' | 'trial' | 'subscriber',
          registeredAt: user.registeredAt,
          trialStartDate: user.trialStartDate,
          subscriptionStartDate: user.subscriptionStartDate,
          lastLogin: user.lastLogin,
          daysRemaining,
          isExpired,
          roi
        };
      });

      // Calcular estatísticas
      const stats = {
        totalUsers: userStats.length,
        testUsers: userStats.filter(u => u.userType === 'test').length,
        trialUsers: userStats.filter(u => u.userType === 'trial').length,
        subscriberUsers: userStats.filter(u => u.userType === 'subscriber').length,
        expiredUsers: userStats.filter(u => u.isExpired).length,
        users: userStats
      };

      setAdminData(stats);
      
      // Salvar dados administrativos
      localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(stats));
      
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Carregar dados na inicialização
  useEffect(() => {
    loadAdminData();
  }, [loadAdminData]);

  // Atualizar dados a cada 30 segundos
  useEffect(() => {
    const interval = setInterval(loadAdminData, 30000);
    return () => clearInterval(interval);
  }, [loadAdminData]);

  return {
    adminData,
    loading,
    refreshData: loadAdminData
  };
};
