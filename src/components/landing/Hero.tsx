
import React from 'react';
import { Button } from '@/components/ui/button';
import { DollarSign, ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const Hero = () => {
  const navigate = useNavigate();
  const { ref, isVisible } = useScrollAnimation();

  const handleLogin = () => {
    navigate('/dashboard');
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-black">
      {/* Enhanced background with animated gradients */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-slate-800/30 to-blue-900/25 animate-pulse"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>
      
      <div 
        ref={ref}
        className={`relative z-10 text-center max-w-5xl mx-auto transition-all duration-1000 ${
          isVisible 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-10'
        }`}
      >
        {/* Logo with enhanced styling */}
        <div className="flex items-center justify-center mb-12">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl scale-150"></div>
            <img 
              src="/lovable-uploads/8d13554a-6df1-4e26-8bb5-2b8ea7687f01.png" 
              alt="Nexum - Plataforma de ROI" 
              className="relative h-24 w-auto drop-shadow-2xl"
            />
          </div>
        </div>
        
        {/* Enhanced headline */}
        <div className="mb-8 space-y-4">
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center bg-blue-500/10 border border-blue-400/30 rounded-full px-6 py-2 backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-blue-400 mr-2" />
              <span className="text-blue-300 text-sm font-medium">Plataforma #1 em ROI Intelligence</span>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
            Maximize seu
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-300 to-cyan-300">
              ROI com IA
            </span>
          </h1>
        </div>
        
        {/* Enhanced description */}
        <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
          Transforme dados em decisões inteligentes com nossa plataforma de análise de ROI. 
          <span className="text-blue-300 font-semibold"> Aumente seus lucros em até 300%</span> com insights baseados em IA.
        </p>
        
        {/* Social proof */}
        <div className="flex flex-wrap justify-center items-center gap-8 mb-12 text-slate-400">
          <div className="flex items-center">
            <div className="text-2xl font-bold text-blue-400 mr-2">5000+</div>
            <div className="text-sm">Empreendedores</div>
          </div>
          <div className="w-px h-8 bg-slate-600"></div>
          <div className="flex items-center">
            <div className="text-2xl font-bold text-green-400 mr-2">+127%</div>
            <div className="text-sm">ROI Médio</div>
          </div>
          <div className="w-px h-8 bg-slate-600"></div>
          <div className="flex items-center">
            <div className="text-2xl font-bold text-yellow-400 mr-2">24/7</div>
            <div className="text-sm">Monitoramento</div>
          </div>
        </div>
        
        {/* Enhanced CTA */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Button 
            size="lg" 
            onClick={handleLogin}
            className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:from-blue-700 hover:via-blue-800 hover:to-blue-900 text-white px-12 py-6 text-xl font-bold transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-blue-500/50 border border-blue-400/30"
          >
            <DollarSign className="mr-3 h-6 w-6" />
            Começar Agora
            <ArrowRight className="ml-3 h-6 w-6" />
          </Button>
        </div>
        
        {/* Trust indicators */}
        <div className="mt-12 flex flex-wrap justify-center items-center gap-6 text-slate-500 text-sm">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            Teste gratuito por 14 dias
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
            Suporte 24/7
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
            Sem compromisso
          </div>
        </div>
      </div>
      
      {/* Enhanced floating elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full animate-pulse blur-xl"></div>
      <div className="absolute bottom-20 right-10 w-24 h-24 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-full animate-pulse blur-lg" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-5 w-16 h-16 bg-gradient-to-br from-blue-400/10 to-transparent rounded-full animate-pulse blur-md" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/4 right-1/4 w-20 h-20 bg-gradient-to-br from-purple-500/5 to-transparent rounded-full animate-pulse blur-lg" style={{ animationDelay: '3s' }}></div>
    </section>
  );
};

export default Hero;
