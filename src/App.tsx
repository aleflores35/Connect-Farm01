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
  CheckCircle2,
  AlertTriangle,
  Cpu,
  Zap,
  ClipboardList,
  Droplets,
  Database,
  Settings,
  Dna,
  ShieldCheck,
  Eye,
  DollarSign,
  GraduationCap,
  RefreshCw,
  MapPin,
  Search,
  FileCheck,
  Headset,
  Brain,
  Activity
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/src/lib/utils';

const WHATSAPP_NUMBER = "555136300682";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

// --- Components ---

const WhatsAppIcon = ({ size = 24, className }: { size?: number, className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.438 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const FloatingWhatsApp = () => (
  <motion.a
    href={WHATSAPP_URL}
    target="_blank"
    rel="noopener noreferrer"
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    className="fixed bottom-8 right-8 z-[60] bg-[#25D366] text-white p-4 rounded-full shadow-2xl flex items-center justify-center hover:bg-[#128C7E] transition-colors"
  >
    <WhatsAppIcon size={32} />
  </motion.a>
);

const Logo = ({ className, variant = 'default' }: { className?: string, variant?: 'default' | 'negative' }) => {
  const colors = {
    teal: "#3C9EA0",
    olive: "#868C14",
    yellow: "#F7C424",
    darkGreen: "#064A17",
  };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {/* Official Logo Symbol SVG - Precise Representation */}
      <svg width="44" height="44" viewBox="0 0 100 100" className="shrink-0">
        <defs>
          <clipPath id="brand-circle">
            <circle cx="50" cy="50" r="50" />
          </clipPath>
        </defs>
        <g clipPath="url(#brand-circle)">
          {/* Top Left: Teal */}
          <path d="M50 50 L50 0 A50 50 0 0 0 0 50 Z" fill={colors.teal} />
          {/* Top Right: Olive */}
          <path d="M50 50 L100 50 A50 50 0 0 0 50 0 Z" fill={colors.olive} />
          {/* Bottom Left: Yellow */}
          <path d="M50 50 L0 50 A50 50 0 0 0 50 100 Z" fill={colors.yellow} />
          {/* Bottom Right: Dark Green */}
          <path d="M50 50 L50 100 A50 50 0 0 0 100 50 Z" fill={colors.darkGreen} />
          
          {/* The "Hill" overlay in the bottom half */}
          <path d="M0 70 C20 70 40 60 50 50 L100 50 L100 100 L0 100 Z" fill={colors.darkGreen} />
          
          {/* White Lines (Separators) */}
          <line x1="50" y1="0" x2="50" y2="50" stroke="white" strokeWidth="5" />
          <line x1="0" y1="50" x2="50" y2="50" stroke="white" strokeWidth="5" />
          <line x1="50" y1="50" x2="85" y2="15" stroke="white" strokeWidth="5" />
          
          {/* Furrows (Agricultural Rows) */}
          <path d="M15 100 C15 80 45 70 100 70" stroke="white" strokeWidth="4" fill="none" />
          <path d="M45 100 C45 90 65 85 100 85" stroke="white" strokeWidth="4" fill="none" />
        </g>
      </svg>
      <div className="font-headline font-bold text-2xl tracking-tighter flex items-center">
        <span className={cn(variant === 'negative' ? 'text-white' : 'text-tertiary')}>CONNECT</span>
        <span className={cn(variant === 'negative' ? 'text-white' : 'text-primary')}>FARM</span>
      </div>
    </div>
  );
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Logo />
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-primary font-medium hover:text-tertiary transition-colors">Home</a>
            <a href="#servicos" className="text-on-surface-variant hover:text-primary transition-colors">Serviços</a>
            <a href="#cases" className="text-on-surface-variant hover:text-primary transition-colors">Cases</a>
            <a href="#contato" className="text-on-surface-variant hover:text-primary transition-colors">Contato</a>
            <a 
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-tertiary text-white px-6 py-2.5 rounded-lg font-label text-sm font-semibold tracking-wide hover:bg-primary transition-all flex items-center gap-2"
            >
              <WhatsAppIcon size={16} />
              Whatsapp Suporte
            </a>
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
          <a 
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-tertiary text-white px-6 py-3 rounded-lg font-label text-sm font-semibold tracking-wide flex items-center justify-center gap-2"
          >
            <WhatsAppIcon size={16} />
            Whatsapp Suporte
          </a>
        </motion.div>
      )}
    </nav>
  );
};

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2000&auto=format&fit=crop" 
          alt="Agricultural field at dawn"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/60 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <h1 className="font-headline text-5xl md:text-8xl text-white leading-[1.1] tracking-tight font-bold">
              Você sabe o que tem <br />
              <span className="text-tertiary-fixed">debaixo da sua terra?</span>
            </h1>
            <p className="text-white/90 text-xl md:text-2xl font-body max-w-xl leading-relaxed">
              A ConnectFARM vai até a sua fazenda, coleta os dados do seu solo e te mostra exatamente o que precisa ser feito para produzir mais — gastando menos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <a 
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-tertiary text-white px-8 py-5 rounded-xl font-body font-bold text-lg hover:scale-105 transition-transform shadow-xl flex items-center justify-center gap-3"
              >
                Quero um diagnóstico da minha fazenda
                <ArrowRight size={20} />
              </a>
              <a 
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-panel text-white border border-white/20 px-8 py-4 rounded-xl font-body font-bold text-lg flex items-center justify-center gap-2 hover:bg-white/10 transition-colors"
              >
                <WhatsAppIcon size={20} />
                Falar com um agrônomo
              </a>
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
                    <span className="text-on-surface-variant font-medium">Biomassa</span>
                    <span className="font-bold text-primary">RVI 0,78</span>
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

const ProblemSection = () => {
  return (
    <section className="py-32 bg-surface px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <span className="font-label text-xs uppercase tracking-[0.4em] text-secondary font-bold">O PROBLEMA</span>
            <h2 className="font-headline text-4xl md:text-6xl text-primary font-bold tracking-tight">
              A maioria dos produtores ainda toma decisões no escuro.
            </h2>
            <div className="space-y-6 text-on-surface-variant text-lg leading-relaxed">
              <p>
                Cada safra tem dezenas de escolhas difíceis: qual adubo usar, qual semente plantar, quando e quanto aplicar. Sem dados do seu solo, essas escolhas viram chute — e chute custa caro.
              </p>
              <p className="font-bold text-primary">
                Taxas de juros altas, insumos caros e clima instável não perdoam quem não tem um plano baseado em realidade. A ConnectFARM existe para mudar isso.
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=1000&auto=format&fit=crop" 
                alt="Farmer analyzing crops" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-10 -left-10 bg-tertiary p-8 rounded-2xl shadow-xl text-white max-w-xs hidden md:block">
              <p className="text-3xl font-headline font-bold mb-2">500+</p>
              <p className="text-sm font-label uppercase tracking-wider opacity-80">Novos produtos lançados por ano no mercado agrícola</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const WhyItMattersSection = () => {
  return (
    <section className="py-32 bg-primary text-white px-4 sm:px-6 lg:px-8 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-white/5 -skew-x-12 translate-x-20" />
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <span className="font-label text-xs uppercase tracking-[0.4em] text-tertiary-fixed font-bold">POR QUE ISSO IMPORTA</span>
            <h2 className="font-headline text-4xl md:text-6xl font-bold tracking-tight leading-tight">
              Uma escolha errada no solo pode custar centenas de reais por hectare.
            </h2>
            <p className="text-white/80 text-xl leading-relaxed">
              Produtores que usam o padrão da fazenda sem diagnóstico muitas vezes gastam mais do que precisam — ou gastam no lugar errado. Com o diagnóstico ConnectFARM, um produtor economizou <span className="text-tertiary-fixed font-bold">R$ 259 por hectare</span> só trocando o adubo com base nos dados do solo.
            </p>
            <div className="bg-white/10 p-8 rounded-2xl border border-white/20">
              <p className="text-2xl md:text-3xl font-headline font-bold text-tertiary-fixed italic">
                "Independente de quais sejam os seus cultivos, o clima ou as práticas de manejo, todos os seus dados juntos já garantiram uma economia de até R$ 450,00 por hectare para um produtor ConnectFARM."
              </p>
            </div>
          </div>
          <div className="space-y-12">
            <div className="p-10 bg-white/5 rounded-3xl border border-white/10 space-y-6">
              <p className="text-5xl md:text-7xl font-headline font-bold text-tertiary-fixed">R$ 259</p>
              <p className="text-xl font-label uppercase tracking-widest text-white/60">Economia real por hectare</p>
              <div className="pt-6 border-t border-white/10">
                <p className="text-2xl font-headline font-bold">Agora pensa: quantos hectares você tem?</p>
              </div>
            </div>
            <div className="flex items-center gap-6 p-6 bg-tertiary/20 rounded-2xl border border-tertiary/30">
              <div className="h-12 w-12 rounded-full bg-tertiary flex items-center justify-center shrink-0">
                <CheckCircle2 size={24} />
              </div>
              <p className="text-lg font-medium">Decisões baseadas em realidade, não em palpites.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const DiagnosisIncludesSection = () => {
  const items = [
    {
      title: 'Mapeamento dos ambientes da fazenda',
      description: 'Dividimos sua propriedade em zonas de acordo com o potencial de cada área. Assim você sabe onde pode produzir mais e onde precisa de correção primeiro.',
      icon: <MapIcon size={24} />
    },
    {
      title: 'Análise completa do solo',
      description: 'Coletamos amostras em duas profundidades e analisamos mais de 20 elementos — como pH, matéria orgânica, fósforo, potássio, cálcio, magnésio e muito mais.',
      icon: <Droplets size={24} />
    },
    {
      title: 'Mapa nutricional por talhão',
      description: 'Você vê no mapa quais áreas estão bem e quais estão com deficiência. Fácil de entender, fácil de usar na hora de tomar decisão.',
      icon: <BarChart3 size={24} />
    },
    {
      title: 'Recomendação de correção do solo',
      description: 'Indicamos o que precisa ser aplicado para corrigir o perfil do solo — calcário, gesso, micronutrientes — com base nos dados reais da sua terra.',
      icon: <FileCheck size={24} />
    },
    {
      title: 'Plano de adubação com justificativa',
      description: 'Não entregamos só o número. Explicamos o porquê de cada recomendação, para que você entenda o que está investindo e o retorno que pode esperar.',
      icon: <ClipboardList size={24} />
    },
    {
      title: 'Planos de cobertura e rotação de culturas',
      description: 'Para quem pensa no longo prazo: orientamos sobre o que plantar entre as safras para recuperar e manter o solo produtivo por mais tempo.',
      icon: <RefreshCw size={24} />
    }
  ];

  return (
    <section className="py-32 bg-surface-container-low px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20 space-y-6">
          <span className="font-label text-xs uppercase tracking-[0.4em] text-secondary font-bold">O QUE O DIAGNÓSTICO INCLUI</span>
          <h2 className="font-headline text-4xl md:text-5xl text-primary font-bold tracking-tight">Tudo o que você precisa saber sobre o seu solo — sem complicação.</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item, index) => (
            <motion.div 
              key={index}
              whileHover={{ y: -8 }}
              className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all border border-outline-variant/10 group flex flex-col"
            >
              <div className="h-12 w-12 bg-surface-container rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors mb-6 shrink-0">
                {item.icon}
              </div>
              <h3 className="font-headline font-bold text-xl text-primary mb-4">{item.title}</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed flex-grow">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const HowItWorksSection = () => {
  const steps = [
    {
      id: 'Passo 1',
      title: 'Nossa equipe vai até você',
      description: 'Um agrônomo da ConnectFARM visita sua fazenda, conversa com você sobre seus objetivos e faz a coleta de solo nos seus talhões — em duas profundidades (0–20 cm e 20–40 cm) — para entender o que está acontecendo em cada parte da sua terra.',
      icon: <MapPin size={32} />
    },
    {
      id: 'Passo 2',
      title: 'Analisamos tudo',
      description: 'As amostras vão para laboratório e os resultados entram na nossa plataforma. Nossa tecnologia processa os dados e gera um diagnóstico completo: o que falta, o que está em excesso, e o que precisa ser corrigido em cada talhão.',
      icon: <Search size={32} />
    },
    {
      id: 'Passo 3',
      title: 'Você recebe um plano claro',
      description: 'Sem relatório complicado. Você recebe um mapa visual da sua fazenda e uma recomendação prática: qual adubo usar, em qual quantidade, em qual área. Tudo explicado de forma simples.',
      icon: <FileCheck size={32} />
    },
    {
      id: 'Passo 4',
      title: 'A gente fica do seu lado',
      description: 'Nossos agrônomos acompanham você durante toda a safra. Se surgir uma dúvida ou precisar de ajuste, a ConnectFARM está disponível.',
      icon: <Headset size={32} />
    }
  ];

  return (
    <section className="py-32 bg-surface px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20 space-y-6">
          <span className="font-label text-xs uppercase tracking-[0.4em] text-secondary font-bold">COMO FUNCIONA</span>
          <h2 className="font-headline text-4xl md:text-5xl text-primary font-bold tracking-tight">Coleta de Solo e Diagnóstico Agronômico</h2>
          <p className="text-on-surface-variant max-w-2xl mx-auto">Esse é o coração do nosso trabalho. Antes de qualquer recomendação, a gente vai até a sua propriedade, entende o seu terreno e coleta amostras do solo com precisão. Nada de palpite — só dado real.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative">
          <div className="hidden md:block absolute top-1/4 left-0 w-full h-0.5 bg-outline-variant/20 -z-10" />
          {steps.map((step, i) => (
            <div key={i} className="text-center space-y-6">
              <div className="h-20 w-20 bg-white border-4 border-surface-container-high rounded-full flex items-center justify-center mx-auto text-primary shadow-lg relative">
                {step.icon}
                <span className="absolute -top-2 -right-2 bg-tertiary text-white h-8 w-8 rounded-full flex items-center justify-center font-headline font-bold text-sm">
                  {step.id}
                </span>
              </div>
              <h3 className="font-headline font-bold text-2xl text-primary">{step.title}</h3>
              <p className="text-on-surface-variant leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const PlatformSection = () => {
  const features = [
    'Mapa completo da fertilidade da sua fazenda',
    'Histórico de análises e recomendações por talhão',
    'Comparativo entre áreas de alta, média e baixa produtividade',
    'Relatórios simples, gerados com apoio de inteligência artificial',
    'Arquivos prontos para programar seu maquinário (taxa variável)'
  ];

  return (
    <section className="py-32 bg-surface-container-highest px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="relative order-2 lg:order-1">
            <div className="bg-white p-8 rounded-3xl shadow-2xl border border-outline-variant/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-tertiary/10 rounded-bl-full" />
              <div className="space-y-6 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center text-white">
                    <Database size={24} />
                  </div>
                  <h4 className="font-headline font-bold text-2xl text-primary">Plataforma CFARM</h4>
                </div>
                <ul className="space-y-4">
                  {features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-on-surface-variant">
                      <CheckCircle2 className="text-tertiary shrink-0 mt-1" size={18} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="pt-6 border-t border-outline-variant/20">
                  <p className="text-sm font-medium text-primary">
                    Compatível com as principais marcas de máquinas do mercado — sem complicação técnica.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-8 order-1 lg:order-2">
            <span className="font-label text-xs uppercase tracking-[0.4em] text-secondary font-bold">A PLATAFORMA CFARM</span>
            <h2 className="font-headline text-4xl md:text-6xl text-primary font-bold tracking-tight">
              Seus dados da fazenda, sempre na palma da mão.
            </h2>
            <p className="text-on-surface-variant text-xl leading-relaxed">
              Depois do diagnóstico, tudo fica registrado na plataforma CFARM — uma ferramenta digital onde você e seu agrônomo acessam o histórico da sua propriedade, acompanham os resultados e planejam a próxima safra com segurança.
            </p>
            <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-outline-variant/10 shadow-sm">
              <Brain className="text-tertiary" size={32} />
              <p className="text-sm font-medium text-on-surface-variant">Relatórios inteligentes gerados com apoio de IA.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const OtherServicesSection = () => {
  const services = [
    {
      title: 'Escolha de sementes e cultivares',
      description: 'Saiba quais variedades tiveram melhor resultado na sua região, por data de plantio. Pare de testar na raça — use dados reais para escolher a semente certa para cada talhão.',
      icon: <Dna size={24} />
    },
    {
      title: 'Controle de pragas e doenças',
      description: 'Indicamos o defensivo certo, na dose certa e na hora certa. Sem desperdício, sem risco de resistência.',
      icon: <ShieldCheck size={24} />
    },
    {
      title: 'Planejamento financeiro da safra',
      description: 'Estimativa de custo por talhão, com foco em reduzir desperdícios e aumentar o retorno do investimento.',
      icon: <DollarSign size={24} />
    },
    {
      title: 'Monitoramento durante a safra',
      description: 'Alertas em tempo real sobre o desenvolvimento da lavoura. Se algo sair do esperado, você sabe na hora — não depois da perda.',
      icon: <Eye size={24} />
    },
    {
      title: 'Análise pós-safra',
      description: 'Ao final de cada ciclo, analisamos o desempenho da sua fazenda talhão a talhão e identificamos o que melhorar na próxima safra. Cada safra deixa a próxima mais inteligente.',
      icon: <RefreshCw size={24} />
    }
  ];

  return (
    <section className="py-32 bg-surface px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20 space-y-6">
          <span className="font-label text-xs uppercase tracking-[0.4em] text-secondary font-bold">OUTROS SERVIÇOS</span>
          <h2 className="font-headline text-4xl md:text-5xl text-primary font-bold tracking-tight">Além do diagnóstico de solo, a ConnectFARM também te ajuda com:</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {services.map((service, index) => (
            <motion.div 
              key={index}
              whileHover={{ y: -8 }}
              className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all border border-outline-variant/10 group flex flex-col"
            >
              <div className="h-12 w-12 bg-surface-container rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors mb-6 shrink-0">
                {service.icon}
              </div>
              <h3 className="font-headline font-bold text-xl text-primary mb-4">{service.title}</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed flex-grow">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ResultsSection = () => {
  const stats = [
    { label: 'Hectares analisados', value: '+1 milhão' },
    { label: 'Produtores otimizados', value: '+500' },
    { label: 'Economia em adubação', value: 'Até R$ 450/ha' },
    { label: 'Ganho em produtividade', value: '+5 sacas/ha' },
    { label: 'Aumento no lucro líquido', value: '10 a 15%' },
  ];

  return (
    <section id="cases" className="py-32 bg-surface-container-low px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20 space-y-6">
          <span className="font-label text-xs uppercase tracking-[0.4em] text-secondary font-bold">RESULTADOS REAIS</span>
          <h2 className="font-headline text-4xl md:text-5xl text-primary font-bold tracking-tight">Números de quem já usa a ConnectFARM.</h2>
          <p className="text-on-surface-variant max-w-2xl mx-auto">Nosso sistema é baseado em mais de 400 mil análises de solo e 10 anos de pesquisa no campo.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {stats.map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="p-8 bg-white rounded-2xl shadow-sm border border-outline-variant/10 text-center space-y-4"
            >
              <p className="text-3xl font-headline font-bold text-primary">{stat.value}</p>
              <p className="text-xs font-label uppercase tracking-widest text-on-surface-variant">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const AboutSection = () => {
  return (
    <section className="py-32 bg-surface px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <span className="font-label text-xs uppercase tracking-[0.4em] text-secondary font-bold">QUEM ESTÁ POR TRÁS</span>
            <h2 className="font-headline text-4xl md:text-6xl text-primary font-bold tracking-tight">
              Uma equipe de campo e de tecnologia, trabalhando pela sua fazenda.
            </h2>
            <p className="text-on-surface-variant text-xl leading-relaxed">
              A ConnectFARM tem agrônomos, técnicos, desenvolvedores e biólogos trabalhando juntos para entregar o melhor diagnóstico e o melhor acompanhamento para o produtor rural brasileiro.
            </p>
            <p className="text-on-surface-variant text-lg">
              Estamos em mais de 8 estados, com presença de campo — porque a gente acredita que tecnologia boa é aquela que começa com os pés na terra.
            </p>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8">
              {[
                { label: 'Agrônomos', value: '10' },
                { label: 'Desenvolvedores', value: '5' },
                { label: 'Técnicos Agrícolas', value: '4' },
                { label: 'Biólogo', value: '1' },
              ].map((item, i) => (
                <div key={i} className="text-center p-6 bg-surface-container-low rounded-2xl border border-outline-variant/10">
                  <p className="text-3xl font-headline font-bold text-primary">{item.value}</p>
                  <p className="text-xs font-label uppercase tracking-widest text-on-surface-variant mt-2">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img src="https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?q=80&w=600&auto=format&fit=crop" alt="Field work" className="rounded-2xl h-64 w-full object-cover mt-12" referrerPolicy="no-referrer" />
            <img src="https://images.unsplash.com/photo-1586771107445-d3ca888129ff?q=80&w=600&auto=format&fit=crop" alt="Lab work" className="rounded-2xl h-64 w-full object-cover" referrerPolicy="no-referrer" />
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
            <Logo variant="negative" />
            <p className="text-surface/70 max-w-md text-lg leading-relaxed">
              Transformando a agricultura com inteligência de dados e presença real no campo. 
              AgTech com pé no barro e tecnologia no espaço.
            </p>
            <div className="flex gap-4">
              <a href="http://connectfarm.com.br" target="_blank" rel="noopener noreferrer" className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                <Globe size={20} />
              </a>
              <a href="mailto:contato@connectfarm.com.br" className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                <Mail size={20} />
              </a>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                <WhatsAppIcon size={20} />
              </a>
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
            <h4 className="font-label text-xs uppercase tracking-widest font-bold text-tertiary-fixed">CONTATO</h4>
            <ul className="space-y-4 text-surface/80">
              <li className="flex items-center gap-2"><Phone size={16} className="text-tertiary-fixed" /> (51) 3630-0682</li>
              <li className="flex items-center gap-2"><Globe size={16} className="text-tertiary-fixed" /> connectfarm.com.br</li>
              <li><a href="https://instagram.com/Connectfarm_" target="_blank" rel="noopener noreferrer" className="hover:text-tertiary-fixed transition-colors">Instagram: @Connectfarm_</a></li>
              <li><a href="https://facebook.com/Connectfarmagr" target="_blank" rel="noopener noreferrer" className="hover:text-tertiary-fixed transition-colors">Facebook: @Connectfarmagr</a></li>
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
        <ProblemSection />
        <HowItWorksSection />
        <DiagnosisIncludesSection />
        <WhyItMattersSection />
        <PlatformSection />
        <OtherServicesSection />
        <ResultsSection />
        <AboutSection />
        
        {/* Final CTA Section */}
        <section id="contato" className="py-32 bg-surface-container-low px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-tertiary to-transparent" />
          <div className="max-w-4xl mx-auto space-y-10 relative z-10">
            <h2 className="font-headline text-4xl md:text-7xl text-primary font-bold tracking-tight">
              Vamos descobrir o que o seu solo tem a dizer?
            </h2>
            <p className="text-on-surface-variant text-xl md:text-2xl leading-relaxed">
              O primeiro passo é simples: fale com um agrônomo ConnectFARM. A gente explica como funciona, sem compromisso.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-6">
              <a 
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-tertiary text-white px-10 py-5 rounded-2xl font-body font-bold text-xl hover:scale-105 transition-transform shadow-xl flex items-center justify-center gap-3"
              >
                Quero um diagnóstico da minha fazenda
                <ArrowRight size={24} />
              </a>
              <a 
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-panel text-primary border border-primary/20 px-10 py-5 rounded-2xl font-body font-bold text-xl flex items-center justify-center gap-3 hover:bg-primary/5 transition-colors"
              >
                <WhatsAppIcon size={24} />
                Falar pelo WhatsApp agora
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
