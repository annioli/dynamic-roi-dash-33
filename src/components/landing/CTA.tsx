
import React from 'react';
import { Button } from '@/components/ui/button';
import { TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const CTA = () => {
  const navigate = useNavigate();
  const { ref: mainRef, isVisible: mainVisible } = useScrollAnimation();
  const { ref: statsRef, isVisible: statsVisible } = useScrollAnimation();

  const handleLogin = () => {
    navigate('/dashboard');
  };

  return (
    <section className="py-20 px-6 bg-gradient-to-r from-slate-900 via-black to-blue-900">
      <div className="max-w-4xl mx-auto text-center">
        <div 
          ref={mainRef}
          className={`transition-all duration-1000 ${
            mainVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-10'
          }`}
        >
          <img 
            src="/lovable-uploads/8d13554a-6df1-4e26-8bb5-2b8ea7687f01.png" 
            alt="Logo" 
            className="h-16 w-auto mx-auto mb-8"
          />
          
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Pronto para <span className="text-blue-400">Revolucionar</span> 
            <br />seu Negócio?
          </h2>
          
          <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto">
            Junte-se a milhares de empreendedores que já transformaram suas decisões com dados precisos e análises inteligentes.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button 
              size="lg" 
              onClick={handleLogin}
              className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white px-12 py-6 text-xl font-bold transform hover:scale-110 transition-all duration-300 shadow-2xl hover:shadow-blue-500/50 animate-pulse"
            >
              <TrendingUp className="mr-3 h-6 w-6" />
              Acessar Plataforma
            </Button>
          </div>
          
          <p className="text-sm text-slate-400 mt-8">
            Teste gratuito por 14 dias • Sem compromisso • Cancele quando quiser
          </p>
        </div>
        
        {/* Stats */}
        <div 
          ref={statsRef}
          className={`grid md:grid-cols-3 gap-8 mt-16 transition-all duration-1000 delay-500 ${
            statsVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">+500%</div>
            <div className="text-slate-300">Aumento médio de ROI</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-slate-400 mb-2">24/7</div>
            <div className="text-slate-300">Monitoramento contínuo</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-300 mb-2">15min</div>
            <div className="text-slate-300">Para começar a usar</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
