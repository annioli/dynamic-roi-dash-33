import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Badge } from '@/components/ui/badge';
import { Zap, Globe, ShoppingCart, BarChart3, Webhook, Settings } from 'lucide-react';
import ImageModal from '@/components/ui/image-modal';

const Integrations = () => {
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation();
  const { ref: carouselRef, isVisible: carouselVisible } = useScrollAnimation();

  const integrations = [
    {
      name: "Shopify",
      icon: ShoppingCart,
      description: "Conecte sua loja Shopify e monitore vendas em tempo real",
      category: "E-commerce",
      color: "bg-green-500/10 border-green-500/20",
      iconColor: "text-green-400"
    },
    {
      name: "WooCommerce",
      icon: Globe,
      description: "Integração completa com WordPress WooCommerce",
      category: "E-commerce",
      color: "bg-purple-500/10 border-purple-500/20",
      iconColor: "text-purple-400"
    },
    {
      name: "Mercado Livre",
      icon: ShoppingCart,
      description: "Acompanhe suas vendas no Mercado Livre automaticamente",
      category: "Marketplace",
      color: "bg-yellow-500/10 border-yellow-500/20",
      iconColor: "text-yellow-400"
    },
    {
      name: "Zapier",
      icon: Zap,
      description: "Conecte milhares de aplicativos via Zapier",
      category: "Automação",
      color: "bg-orange-500/10 border-orange-500/20",
      iconColor: "text-orange-400"
    },
    {
      name: "API Personalizada",
      icon: Settings,
      description: "Configure suas próprias integrações via API REST",
      category: "Personalizado",
      color: "bg-blue-500/10 border-blue-500/20",
      iconColor: "text-blue-400"
    },
    {
      name: "Webhook",
      icon: Webhook,
      description: "Receba dados em tempo real via webhooks",
      category: "Automação",
      color: "bg-cyan-500/10 border-cyan-500/20",
      iconColor: "text-cyan-400"
    },
    {
      name: "Google Analytics",
      icon: BarChart3,
      description: "Conecte com Google Analytics para dados completos",
      category: "Analytics",
      color: "bg-red-500/10 border-red-500/20",
      iconColor: "text-red-400"
    },
    {
      name: "Facebook Ads",
      icon: BarChart3,
      description: "Monitore o ROI dos seus anúncios no Facebook",
      category: "Publicidade",
      color: "bg-blue-600/10 border-blue-600/20",
      iconColor: "text-blue-500"
    }
  ];

  return (
    <section className="py-20 px-6 bg-gradient-to-br from-slate-900 via-blue-900 to-black">
      <div className="max-w-7xl mx-auto">
        <div 
          ref={titleRef}
          className={`text-center mb-16 transition-all duration-1000 ${
            titleVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Integrações <span className="text-blue-400">Poderosas</span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Conecte todas as suas plataformas de venda e ferramentas favoritas. 
            Centralize dados e automatize o cálculo do seu ROI.
          </p>
        </div>
        
        <div 
          ref={carouselRef}
          className={`transition-all duration-1000 delay-300 ${
            carouselVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-10'
          }`}
        >
          <Carousel className="w-full max-w-6xl mx-auto">
            <CarouselContent className="-ml-2 md:-ml-4">
              {integrations.map((integration, index) => (
                <CarouselItem key={index} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                  <Card className={`${integration.color} backdrop-blur-sm transform hover:scale-105 transition-all duration-500 h-full`}>
                    <CardContent className="p-8 text-center h-full flex flex-col justify-between">
                      <div>
                        <div className="mx-auto mb-6 p-4 rounded-full bg-white/5 w-fit">
                          <integration.icon className={`w-10 h-10 ${integration.iconColor}`} />
                        </div>
                        <Badge className="mb-4 bg-white/10 text-white/80 hover:bg-white/20">
                          {integration.category}
                        </Badge>
                        <h3 className="text-2xl font-bold text-white mb-4">{integration.name}</h3>
                        <p className="text-slate-300 leading-relaxed">{integration.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="bg-slate-800/50 border-blue-500/20 hover:bg-slate-700/50 text-white" />
            <CarouselNext className="bg-slate-800/50 border-blue-500/20 hover:bg-slate-700/50 text-white" />
          </Carousel>
        </div>

        {/* Features Preview */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
          <div className="text-center">
            <ImageModal 
              src="/lovable-uploads/6cf2c273-d555-490d-8070-96cecb2ff09e.png"
              alt="Cálculo de ROI Inteligente"
            >
              <img 
                src="/lovable-uploads/6cf2c273-d555-490d-8070-96cecb2ff09e.png" 
                alt="Cálculo de ROI Inteligente" 
                className="w-full h-32 object-cover rounded-lg mb-4 shadow-2xl border border-blue-500/20 cursor-pointer hover:border-blue-500/40 transition-all duration-300 transform hover:scale-105"
              />
            </ImageModal>
            <h4 className="text-lg font-semibold text-white mb-2">Cálculo Automático</h4>
            <p className="text-slate-400 text-sm">Algoritmos avançados calculam seu ROI automaticamente</p>
          </div>
          
          <div className="text-center">
            <ImageModal 
              src="/lovable-uploads/7258afd5-b74b-46ed-a51c-cfa532406dba.png"
              alt="Sistema de Anotações"
            >
              <img 
                src="/lovable-uploads/7258afd5-b74b-46ed-a51c-cfa532406dba.png" 
                alt="Sistema de Anotações" 
                className="w-full h-32 object-cover rounded-lg mb-4 shadow-2xl border border-blue-500/20 cursor-pointer hover:border-blue-500/40 transition-all duration-300 transform hover:scale-105"
              />
            </ImageModal>
            <h4 className="text-lg font-semibold text-white mb-2">Anotações Inteligentes</h4>
            <p className="text-slate-400 text-sm">Organize insights e observações importantes</p>
          </div>
          
          <div className="text-center">
            <ImageModal 
              src="/lovable-uploads/72596218-8435-4f08-9479-ade355808fe4.png"
              alt="Gestão de Tarefas"
            >
              <img 
                src="/lovable-uploads/72596218-8435-4f08-9479-ade355808fe4.png" 
                alt="Gestão de Tarefas" 
                className="w-full h-32 object-cover rounded-lg mb-4 shadow-2xl border border-blue-500/20 cursor-pointer hover:border-blue-500/40 transition-all duration-300 transform hover:scale-105"
              />
            </ImageModal>
            <h4 className="text-lg font-semibold text-white mb-2">Tarefas Organizadas</h4>
            <p className="text-slate-400 text-sm">Gerencie tarefas com sistema de prioridades</p>
          </div>
          
          <div className="text-center">
            <ImageModal 
              src="/lovable-uploads/73e02dd6-91c6-4ca4-b683-8e25a51fc105.png"
              alt="Painel de Integrações"
            >
              <img 
                src="/lovable-uploads/73e02dd6-91c6-4ca4-b683-8e25a51fc105.png" 
                alt="Painel de Integrações" 
                className="w-full h-32 object-cover rounded-lg mb-4 shadow-2xl border border-blue-500/20 cursor-pointer hover:border-blue-500/40 transition-all duration-300 transform hover:scale-105"
              />
            </ImageModal>
            <h4 className="text-lg font-semibold text-white mb-2">Hub de Integrações</h4>
            <p className="text-slate-400 text-sm">Configure webhooks e APIs personalizadas</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Integrations;
