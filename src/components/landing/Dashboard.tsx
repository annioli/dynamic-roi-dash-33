
import React from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import ImageModal from '@/components/ui/image-modal';

const Dashboard = () => {
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation();
  const { ref: contentRef, isVisible: contentVisible } = useScrollAnimation();

  return (
    <section className="py-20 px-6 bg-gradient-to-r from-slate-900 via-black to-blue-900">
      <div className="max-w-6xl mx-auto">
        <div 
          ref={titleRef}
          className={`text-center mb-16 transition-all duration-1000 ${
            titleVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Veja nossa <span className="text-blue-400">plataforma</span> em Ação
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Dashboard intuitivo com métricas em tempo real para você acompanhar o crescimento do seu negócio.
          </p>
        </div>
        
        <div 
          ref={contentRef}
          className={`grid lg:grid-cols-2 gap-8 items-center transition-all duration-1000 delay-300 ${
            contentVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="space-y-6">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-blue-500/20 rounded-lg p-6 shadow-lg">
              <h3 className="text-2xl font-bold text-white mb-4">Métricas que Importam</h3>
              <ul className="space-y-3 text-slate-300">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                  ROI Diário e Mensal automaticamente calculado
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-slate-400 rounded-full mr-3"></div>
                  Controle total de gastos e retornos
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-300 rounded-full mr-3"></div>
                  Gráficos interativos para análise detalhada
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-slate-500 rounded-full mr-3"></div>
                  Dias ativos e período de análise personalizável
                </li>
              </ul>
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <ImageModal 
                src="/lovable-uploads/a195b550-87c0-47b6-bce5-54d7969dbef9.png"
                alt="Dashboard de Métricas ROI"
              >
                <img 
                  src="/lovable-uploads/a195b550-87c0-47b6-bce5-54d7969dbef9.png" 
                  alt="Dashboard de Métricas ROI" 
                  className="rounded-lg shadow-xl border border-blue-400/20 hover:border-blue-400/40 transition-all duration-300 transform hover:scale-105 cursor-pointer"
                />
              </ImageModal>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <ImageModal 
                  src="/lovable-uploads/a8182f40-7f7d-46c1-9149-df06f090c2e7.png"
                  alt="Gráficos ROI Diário"
                >
                  <img 
                    src="/lovable-uploads/a8182f40-7f7d-46c1-9149-df06f090c2e7.png" 
                    alt="Gráficos ROI Diário" 
                    className="rounded-lg shadow-xl border border-blue-400/20 hover:border-blue-400/40 transition-all duration-300 transform hover:scale-105 cursor-pointer"
                  />
                </ImageModal>
              </div>
              
              <div>
                <ImageModal 
                  src="/lovable-uploads/29bd0fc6-fae1-4ca1-8d3c-92856fe6c2f6.png"
                  alt="Visualização por Data"
                >
                  <img 
                    src="/lovable-uploads/29bd0fc6-fae1-4ca1-8d3c-92856fe6c2f6.png" 
                    alt="Visualização por Data" 
                    className="rounded-lg shadow-xl border border-blue-400/20 hover:border-blue-400/40 transition-all duration-300 transform hover:scale-105 cursor-pointer"
                  />
                </ImageModal>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
