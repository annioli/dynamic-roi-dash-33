
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Crown, Star, Zap } from 'lucide-react';

const SubscriptionCTA = () => {
  const handleSubscribe = () => {
    // Aqui você pode implementar a lógica de redirecionamento para assinatura
    console.log('Redirecting to subscription...');
  };

  return (
    <Card className="bg-gradient-to-br from-slate-800/50 to-blue-900/30 border border-blue-500/30 shadow-2xl backdrop-blur-sm mt-8">
      <CardContent className="p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 rounded-full blur-lg opacity-50 animate-pulse"></div>
            <div className="relative bg-gradient-to-r from-green-500 to-blue-600 p-4 rounded-full">
              <Crown className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>
        
        <h3 className="text-2xl font-bold text-white mb-4">
          Desbloqueie Todo o Potencial da Nexum
        </h3>
        
        <p className="text-slate-300 text-lg mb-6 max-w-md mx-auto">
          Transforme seus dados em decisões inteligentes com acesso completo a todas as funcionalidades, 
          relatórios avançados e armazenamento permanente de dados.
        </p>
        
        <div className="flex justify-center space-x-8 mb-8">
          <div className="flex items-center space-x-2">
            <Star className="h-5 w-5 text-green-400" />
            <span className="text-slate-300">Dados Salvos</span>
          </div>
          <div className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-blue-400" />
            <span className="text-slate-300">Relatórios Avançados</span>
          </div>
          <div className="flex items-center space-x-2">
            <Crown className="h-5 w-5 text-purple-400" />
            <span className="text-slate-300">Suporte Premium</span>
          </div>
        </div>
        
        <Button 
          onClick={handleSubscribe}
          size="lg"
          className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold text-lg px-12 py-4 rounded-full transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-green-500/25"
        >
          Assinar a Nexum
        </Button>
        
        <p className="text-slate-400 text-sm mt-4">
          Comece sua jornada premium hoje mesmo
        </p>
      </CardContent>
    </Card>
  );
};

export default SubscriptionCTA;
