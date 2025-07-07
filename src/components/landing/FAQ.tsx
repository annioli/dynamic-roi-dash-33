
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { ChevronDown } from 'lucide-react';

const FAQ = () => {
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation();
  const { ref: faqRef, isVisible: faqVisible } = useScrollAnimation();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "Como nossa plataforma calcula o ROI do meu negócio?",
      answer: "Utilizamos algoritmos avançados que analisam seus gastos e retornos em tempo real, calculando automaticamente o ROI diário e mensal com base nos dados inseridos na plataforma. Nossa IA considera múltiplas variáveis como custos de aquisição, lifetime value e sazonalidade."
    },
    {
      question: "Posso integrar a plataforma com outras ferramentas?",
      answer: "Sim! Nossa plataforma oferece integrações nativas com principais plataformas de e-commerce (Shopify, WooCommerce, Mercado Livre), sistemas de pagamento, Google Analytics, Facebook Ads, e muito mais. Também suportamos integrações via API e webhooks personalizados."
    },
    {
      question: "É seguro armazenar meus dados financeiros na plataforma?",
      answer: "Absolutamente. Utilizamos criptografia de ponta a ponta (AES-256), certificação SSL, e seguimos os mais rigorosos padrões de segurança bancária (PCI DSS). Seus dados são protegidos com a mesma tecnologia usada por grandes instituições financeiras e bancos digitais."
    },
    {
      question: "Existe um período de teste gratuito?",
      answer: "Sim! Oferecemos 14 dias de teste gratuito com acesso completo a todas as funcionalidades da plataforma, incluindo integrações, relatórios avançados e suporte prioritário. Não é necessário cartão de crédito para começar."
    },
    {
      question: "A plataforma é adequada para que tipos de negócio?",
      answer: "Nossa solução é ideal para e-commerces, dropshipping, afiliados digitais, infoprodutos, prestadores de serviços, consultores, agências digitais e qualquer empreendedor que precise acompanhar ROI e métricas financeiras de forma profissional e automatizada."
    },
    {
      question: "Como funciona o sistema de anotações e tarefas?",
      answer: "Você pode criar anotações personalizadas para registrar insights importantes sobre campanhas, estratégias e resultados. O sistema de tarefas permite organizar ações por prioridade, definir prazos e acompanhar o progresso. Tudo integrado com seus dados de ROI."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 px-6 bg-gradient-to-br from-blue-900 via-slate-900 to-black">
      <div className="max-w-5xl mx-auto">
        <div 
          ref={titleRef}
          className={`text-center mb-16 transition-all duration-1000 ${
            titleVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Dúvidas <span className="text-blue-400">Frequentes</span>
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Tudo que você precisa saber sobre nossa plataforma de ROI Intelligence
          </p>
        </div>
        
        <div 
          ref={faqRef}
          className={`space-y-4 transition-all duration-1000 delay-300 ${
            faqVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-10'
          }`}
        >
          {faqs.map((faq, index) => (
            <Card 
              key={index} 
              className="bg-slate-800/50 backdrop-blur-sm border border-blue-500/20 transition-all duration-300 hover:border-blue-400/40 overflow-hidden"
              style={{ 
                transitionDelay: faqVisible ? `${index * 0.1}s` : '0s'
              }}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full text-left p-6 hover:bg-slate-700/30 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 rounded-lg"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white pr-4">{faq.question}</h3>
                  <ChevronDown 
                    className={`w-6 h-6 text-blue-400 transform transition-transform duration-300 flex-shrink-0 ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                  />
                </div>
              </button>
              
              {/* Animated Answer */}
              <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
                openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}>
                <div className="px-6 pb-6">
                  <div className="pt-2 border-t border-blue-500/10">
                    <p className="text-slate-300 leading-relaxed animate-fade-in">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
