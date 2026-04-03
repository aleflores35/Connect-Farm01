import { motion } from 'motion/react';
import { 
  Sprout, 
  Satellite, 
  BarChart3, 
  Map as MapIcon, 
  Users, 
  MessageSquare, 
  Phone,
  Mail,
  Globe,
  Menu,
  X,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/src/lib/utils';

// --- Components ---

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <span className="font-headline font-bold text-2xl text-primary tracking-tight">ConnectFARM</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-primary font-medium hover:text-tertiary transition-colors">Home</a>
            <a href="#servicos" className="text-on-surface-variant hover:text-primary transition-colors">Serviços</a>
            <a href="#cases" className="text-on-surface-variant hover:text-primary transition-colors">Cases</a>
            <a href="#contato" className="text-on-surface-variant hover:text-primary transition-colors">Contato</a>
            <button className="bg-tertiary text-white px-6 py-2.5 rounded-lg font-label text-sm font-semibold tracking-wide hover:bg-primary transition-all flex items-center gap-2">
              <Phone size={16} />
              WHATSAPP SUPPORT
            </button>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-primary">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-surface border-b border-outline-variant/20 px-4 pt-2 pb-6 space-y-4"
        >
          <a href="#" className="block text-primary font-medium">Home</a>
          <a href="#servicos" className="block text-on-surface-variant">Serviços</a>
          <a href="#cases" className="block text-on-surface-variant">Cases</a>
          <a href="#contato" className="block text-on-surface-variant">Contato</a>
          <button className="w-full bg-tertiary text-white px-6 py-3 rounded-lg font-label text-sm font-semibold tracking-wide flex items-center justify-center gap-2">
            <Phone size={16} />
            WHATSAPP SUPPORT
          </button>
        </motion.div>
      )}
    </nav>
  );
};

const Hero = () => {
  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2000&auto=format&fit=crop" 
          alt="Agricultural field at dawn"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/85 via-primary/40 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <h1 className="font-headline text-5xl md:text-7xl text-white leading-[1.1] tracking-tight">
              Sua lavoura tem potencial que você ainda não viu. <br />
              <span className="italic text-tertiary-fixed">A gente vai até o campo te mostrar.</span>
            </h1>
            <p className="text-white/90 text-xl font-body max-w-lg leading-relaxed">
              Analisamos seu solo, monitoramos a lavoura por satélite e entregamos um plano de manejo feito para cada pedaço da sua área.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button className="bg-tertiary-fixed text-on-tertiary-fixed px-8 py-4 rounded-xl font-body font-bold text-lg hover:scale-105 transition-transform shadow-lg">
                Peça uma visita técnica gratuita
              </button>
              <button className="glass-panel text-white border border-white/20 px-8 py-4 rounded-xl font-body font-bold text-lg flex items-center justify-center gap-2 hover:bg-white/10 transition-colors">
                <MessageSquare size={20} />
                Fala com um agrônomo agora
              </button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:flex justify-end"
          >
            <div className="glass-panel p-8 rounded-2xl shadow-2xl max-w-sm border border-white/30 space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-xl bg-primary flex items-center justify-center text-tertiary-fixed shadow-inner">
                  <BarChart3 size={28} />
                </div>
                <div>
                  <p className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-bold">Live Field Data</p>
                  <p className="font-headline font-bold text-2xl text-primary">Talhão 04 - Norte</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-on-surface-variant font-medium">Umidade do Solo</span>
                    <span className="font-bold text-primary">78%</span>
                  </div>
                  <div className="h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: '78%' }}
                      transition={{ duration: 1.5, delay: 1 }}
                      className="h-full bg-tertiary" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-on-surface-variant font-medium">Vigor Vegetativo</span>
                    <span className="font-bold text-primary">NDVI 0.82</span>
                  </div>
                  <div className="h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: '82%' }}
                      transition={{ duration: 1.5, delay: 1.2 }}
                      className="h-full bg-tertiary-fixed" 
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2 text-xs text-on-surface-variant font-medium">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                Sincronizado via Satélite Radar (SAR)
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const JourneySection = () => {
  const steps = [
    {
      id: '01',
      title: 'Coleta de Solo',
      description: 'Nossa equipe vai até a sua fazenda. Coletamos amostras georreferenciadas por zonas de manejo para um diagnóstico cirúrgico.',
      image: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?q=80&w=800&auto=format&fit=crop',
      className: 'md:col-span-8 bg-surface-container-low',
      type: 'featured'
    },
    {
      id: '02',
      title: 'Monitoramento por Satélite',
      description: 'Acompanhamos sua lavoura do plantio à colheita com imagens de satélite e alertas em tempo real direto no celular.',
      icon: <Satellite className="text-tertiary-fixed" size={40} />,
      className: 'md:col-span-4 bg-primary text-white',
      type: 'dark'
    },
    {
      id: '03',
      title: 'Diagnóstico do Talhão',
      description: 'Você recebe um mapa claro mostrando onde está perdendo produção e por quê. Sem achismo.',
      className: 'md:col-span-4 bg-surface-container-highest',
      type: 'standard'
    },
    {
      id: '04',
      title: 'Plano de Manejo Personalizado',
      description: 'Recomendamos genética, nutrição e manejo por zona de manejo, não para a fazenda inteira.',
      className: 'md:col-span-4 bg-secondary/10',
      type: 'accent'
    },
    {
      id: '05',
      title: 'Acompanhamento da Safra',
      description: 'Estamos junto com você durante toda a safra para ajustar o planejamento conforme a lavoura responde.',
      className: 'md:col-span-4 bg-tertiary text-white',
      type: 'dark'
    }
  ];

  return (
    <section id="servicos" className="py-32 bg-surface px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20">
          <span className="font-label text-xs uppercase tracking-[0.4em] text-secondary font-bold">O CAMINHO DO MANEJO</span>
          <h2 className="font-headline text-4xl md:text-6xl text-primary mt-6 tracking-tight">Pé no barro e olho no espaço</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {steps.map((step) => (
            <motion.div 
              key={step.id}
              whileHover={{ y: -5 }}
              className={cn(
                "p-10 rounded-2xl flex flex-col justify-between border border-outline-variant/10 shadow-sm",
                step.className
              )}
            >
              <div className="space-y-6">
                <span className={cn(
                  "text-6xl font-headline italic opacity-20",
                  step.type === 'dark' ? 'text-white' : 'text-primary'
                )}>
                  {step.id}
                </span>
                
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="space-y-4 flex-1">
                    <h3 className={cn(
                      "text-2xl md:text-3xl font-headline font-bold",
                      step.type === 'dark' ? 'text-white' : 'text-primary'
                    )}>
                      {step.title}
                    </h3>
                    <p className={cn(
                      "text-lg leading-relaxed",
                      step.type === 'dark' ? 'text-white/80' : 'text-on-surface-variant'
                    )}>
                      {step.description}
                    </p>
                  </div>
                  
                  {step.image && (
                    <div className="w-full md:w-1/2 h-64 rounded-xl overflow-hidden shadow-inner">
                      <img src={step.image} alt={step.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                  )}

                  {step.icon && (
                    <div className="pt-4">
                      {step.icon}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ServicesSection = () => {
  const tools = [
    {
      title: 'Coleta e Análise de Solo',
      description: 'O alicerce da sua produtividade começa com a análise química e física detalhada.',
      icon: <Sprout size={24} />
    },
    {
      title: 'Monitoramento Satelital',
      description: 'Visão privilegiada do seu talhão com índices de vegetação atualizados periodicamente.',
      icon: <Satellite size={24} />
    },
    {
      title: 'Planejamento de Safra',
      description: 'Estratégia personalizada de insumos e sementes baseada em dados reais.',
      icon: <MapIcon size={24} />
    },
    {
      title: 'Acompanhamento Agronômico',
      description: 'Presença constante na fazenda para garantir que o plano seja executado com perfeição.',
      icon: <Users size={24} />
    }
  ];

  return (
    <section className="py-32 bg-surface-container-low px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20 space-y-6">
          <h2 className="font-headline text-4xl md:text-5xl text-primary font-bold tracking-tight">Nossas Ferramentas de Trabalho</h2>
          <p className="text-on-surface-variant text-xl max-w-2xl mx-auto">
            Tecnologia de ponta com a experiência de quem entende o dia a dia do campo.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {tools.map((tool, index) => (
            <motion.div 
              key={index}
              whileHover={{ y: -8 }}
              className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all border border-outline-variant/10 group"
            >
              <div className="space-y-6">
                <div className="h-14 w-14 bg-surface-container rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors shadow-inner">
                  {tool.icon}
                </div>
                <h3 className="font-headline font-bold text-2xl text-primary">{tool.title}</h3>
                <p className="text-on-surface-variant leading-relaxed">{tool.description}</p>
                <div className="pt-4 flex items-center text-tertiary font-bold gap-2 group-hover:gap-4 transition-all cursor-pointer">
                  Saiba mais <ArrowRight size={18} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const TestimonialSection = () => {
  return (
    <section id="cases" className="py-32 bg-primary text-white overflow-hidden px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-12">
            <div className="space-y-6">
              <span className="font-label text-xs uppercase tracking-[0.4em] text-tertiary-fixed font-bold">RESULTADOS REAIS</span>
              <h2 className="font-headline text-5xl md:text-7xl italic leading-tight">
                "Quem planta com dados, colhe tranquilidade."
              </h2>
            </div>
            
            <div className="flex flex-wrap gap-6">
              <div className="p-8 bg-white/5 rounded-2xl border border-white/10 flex-1 min-w-[200px]">
                <p className="text-5xl font-headline text-tertiary-fixed font-bold">+8 sc/ha</p>
                <p className="text-sm font-label text-white/60 mt-3 uppercase tracking-widest">Média de Aumento</p>
              </div>
              <div className="p-8 bg-white/5 rounded-2xl border border-white/10 flex-1 min-w-[200px]">
                <p className="text-5xl font-headline text-tertiary-fixed font-bold">-15% custo</p>
                <p className="text-sm font-label text-white/60 mt-3 uppercase tracking-widest">Otimização de Fertilizantes</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative z-10 bg-white p-10 rounded-3xl text-on-surface space-y-8 shadow-2xl"
            >
              <div className="flex items-center gap-6">
                <img 
                  src="https://images.unsplash.com/photo-1560493676-04071c5f467b?q=80&w=200&auto=format&fit=crop" 
                  alt="Farmer portrait" 
                  className="h-20 w-20 rounded-2xl object-cover grayscale border-2 border-surface-container"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="font-headline font-bold text-2xl text-primary">José Almirante</h4>
                  <p className="text-on-surface-variant font-medium">Fazenda Santa Fé, Sorriso-MT • 2.400 ha</p>
                </div>
              </div>
              <p className="italic text-xl font-body leading-relaxed text-primary/90">
                "A gente sempre achou que conhecia cada palmo dessa terra, mas o mapa da ConnectFARM mostrou manchas de acidez que a gente não via. No primeiro ano, a economia de adubo pagou o serviço e ainda sobrou margem."
              </p>
              <div className="pt-4 flex items-center gap-2 text-tertiary font-bold">
                <CheckCircle2 size={20} />
                Produtor parceiro desde 2021
              </div>
            </motion.div>
            <div className="absolute -top-6 -right-6 w-full h-full bg-tertiary-fixed/20 rounded-3xl -z-10 translate-x-6 translate-y-6" />
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-primary text-surface py-20 px-4 sm:px-6 lg:px-8 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2 space-y-6">
            <span className="font-headline font-bold text-3xl text-tertiary-fixed">ConnectFARM</span>
            <p className="text-surface/70 max-w-md text-lg leading-relaxed">
              Transformando a agricultura com inteligência de dados e presença real no campo. 
              AgTech com pé no barro e tecnologia no espaço.
            </p>
            <div className="flex gap-4">
              <button className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                <Globe size={20} />
              </button>
              <button className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                <Mail size={20} />
              </button>
              <button className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                <Phone size={20} />
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="font-label text-xs uppercase tracking-widest font-bold text-tertiary-fixed">SERVIÇOS</h4>
            <ul className="space-y-4 text-surface/80">
              <li><a href="#" className="hover:text-tertiary-fixed transition-colors">Análise de Solo</a></li>
              <li><a href="#" className="hover:text-tertiary-fixed transition-colors">Monitoramento Satelital</a></li>
              <li><a href="#" className="hover:text-tertiary-fixed transition-colors">Planejamento de Safra</a></li>
              <li><a href="#" className="hover:text-tertiary-fixed transition-colors">Consultoria Agronômica</a></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="font-label text-xs uppercase tracking-widest font-bold text-tertiary-fixed">EMPRESA</h4>
            <ul className="space-y-4 text-surface/80">
              <li><a href="#" className="hover:text-tertiary-fixed transition-colors">Sobre Nós</a></li>
              <li><a href="#" className="hover:text-tertiary-fixed transition-colors">Cases de Sucesso</a></li>
              <li><a href="#" className="hover:text-tertiary-fixed transition-colors">Blog do Campo</a></li>
              <li><a href="#" className="hover:text-tertiary-fixed transition-colors">Contato</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-surface/50 font-label">
          <p>© 2024 ConnectFARM. Todos os direitos reservados.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-surface transition-colors">Política de Privacidade</a>
            <a href="#" className="hover:text-surface transition-colors">Termos de Uso</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// --- Main App ---

export default function App() {
  return (
    <div className="min-h-screen selection:bg-tertiary-fixed selection:text-on-tertiary-fixed">
      <Navbar />
      <main>
        <Hero />
        <JourneySection />
        <ServicesSection />
        <TestimonialSection />
        
        {/* Final CTA Section */}
        <section className="py-32 bg-surface px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto space-y-10">
            <h2 className="font-headline text-4xl md:text-6xl text-primary font-bold tracking-tight">
              Pronto para descobrir o real potencial da sua terra?
            </h2>
            <p className="text-on-surface-variant text-xl leading-relaxed">
              Nossa equipe está pronta para ir até a sua fazenda. Sem compromisso, sem custo inicial. 
              Apenas dados reais e resultados concretos.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-6">
              <button className="bg-tertiary text-white px-10 py-5 rounded-2xl font-body font-bold text-xl hover:scale-105 transition-transform shadow-xl">
                Agendar Visita Técnica
              </button>
              <button className="bg-surface-container-high text-primary px-10 py-5 rounded-2xl font-body font-bold text-xl hover:bg-surface-container-highest transition-colors flex items-center justify-center gap-3">
                <Phone size={24} />
                Falar com Consultor
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
