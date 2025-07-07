
import React from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { TrendingUp, Calendar } from 'lucide-react';

const Features = () => {
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation();
  const { ref: cardsRef, isVisible: cardsVisible } = useScrollAnimation();

  const features = [
    {
      icon: <TrendingUp className="w-8 h-8 text-blue-400" />,
      title: "Múltiplas Métricas",
      description: "ROI diário, mensal, controle de gastos e retornos - tudo em um só lugar para decisões mais inteligentes."
    },
    {
      icon: <Calendar className="w-8 h-8 text-blue-400" />,
      title: "Histórico Completo",
      description: "Mantenha um registro detalhado de todas as suas operações com filtros por data e exportação para Excel."
    }
  ];

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-black to-slate-900">
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
            Recursos <span className="text-blue-400">Poderosos</span>
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Tudo que você precisa para acompanhar e otimizar seus investimentos em um só lugar.
          </p>
        </div>
        
        <div 
          ref={cardsRef}
          className={`grid md:grid-cols-2 gap-8 transition-all duration-1000 delay-300 ${
            cardsVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-10'
          }`}
        >
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-slate-800/50 backdrop-blur-sm border border-blue-500/20 rounded-lg p-8 text-center hover:border-blue-400/40 transition-all duration-300 transform hover:scale-105"
            >
              <div className="flex justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                {feature.title}
              </h3>
              <p className="text-slate-300 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
