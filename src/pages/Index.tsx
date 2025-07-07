
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import LoginForm from '@/components/auth/LoginForm';
import ROIMetrics from '@/components/dashboard/ROIMetrics';
import Header from '@/components/dashboard/Header';
import TopNavigation from '@/components/dashboard/TopNavigation';
import SubscriptionCTA from '@/components/dashboard/SubscriptionCTA';
import TestAccountWarning from '@/components/auth/TestAccountWarning';
import TrialExpiredModal from '@/components/auth/TrialExpiredModal';
import { AdminDashboard } from '@/components/admin/AdminDashboard';

const Index = () => {
  const { isAuthenticated, loading, userType, trialDaysLeft, trialExpired } = useAuth();
  const [showTestWarning, setShowTestWarning] = useState(false);

  useEffect(() => {
    if (isAuthenticated && userType === 'test') {
      setShowTestWarning(true);
    }
  }, [isAuthenticated, userType]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  // Show trial expired modal
  if (trialExpired) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <TrialExpiredModal 
          open={trialExpired} 
          onSubscribe={() => {
            // Redirect to subscription page or handle subscription
            window.open('https://pay.kiwify.com.br/your-subscription-link', '_blank');
          }}
        />
      </div>
    );
  }

  // Show admin panel for admin users
  if (userType === 'admin') {
    return <AdminDashboard />;
  }

  return (
    <div className="dark min-h-screen bg-black">
      <Header />
      <TopNavigation />
      
      {/* Trial Warning Banner */}
      {userType === 'trial' && trialDaysLeft > 0 && (
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 text-center">
          <p className="font-semibold">
            🎉 Você está no período de teste gratuito! Restam {trialDaysLeft} dias.
          </p>
        </div>
      )}
      
      <ROIMetrics />
      
      {/* Show subscription CTA for test and trial accounts */}
      {(userType === 'test' || userType === 'trial') && (
        <div className="container mx-auto px-6 pb-8">
          <SubscriptionCTA />
        </div>
      )}

      {/* Test Account Warning Popup */}
      <TestAccountWarning 
        open={showTestWarning} 
        onClose={() => setShowTestWarning(false)} 
      />
    </div>
  );
};

export default Index;
