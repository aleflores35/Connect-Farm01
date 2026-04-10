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
const WHATSAPP_DISPLAY = "+55 51 3630-0682";
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
  return (
    <div className={cn("flex items-center", className)}>
      <img 
        src="/logo.png" 
        alt="ConnectFARM Logo" 
        className={cn(
          "h-10 md:h-12 w-auto object-contain",
          variant === 'negative' && "brightness-0 invert"
        )}
        referrerPolicy="no-referrer"
      />
    </div>
  );
};

const Navbar = ({ activePage, setActivePage }: { activePage: string, setActivePage: (page: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'HOME', id: 'home' },
    { name: 'QUEM SOMOS', id: 'quem-somos' },
    { name: 'CASES', id: 'cases' },
    { name: 'CONTATO', id: 'contato' },
    { name: 'PROGRAMA DE INTEGRIDADE', id: 'integridade' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-outline-variant/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-24">
          <div className="flex items-center">
            <button onClick={() => setActivePage('home')}>
              <Logo />
            </button>
          </div>
          
          <div className="hidden lg:flex items-center space-x-6">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => setActivePage(link.id)}
                className={cn(
                  "text-xs font-bold tracking-wider transition-colors hover:text-[#868C14]",
                  activePage === link.id ? "text-[#868C14]" : "text-[#064A17]"
                )}
              >
                {link.name}
              </button>
            ))}
            
            <div className="flex items-center gap-2 pl-4 border-l border-gray-200">
              <div className="flex items-center gap-1 cursor-pointer">
                <img 
                  src="https://flagcdn.com/w20/br.png" 
                  alt="Brasil" 
                  className="w-5 h-auto"
                />
                <span className="text-[10px] text-gray-400">▼</span>
              </div>
              
              <button className="bg-[#F7C424] text-[#064A17] px-6 py-3 rounded-full font-bold text-sm hover:bg-[#e5b521] transition-all shadow-sm">
                Acesse sua Conta
              </button>
            </div>
          </div>

          <div className="lg:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-[#064A17]">
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
          className="lg:hidden bg-white border-b border-outline-variant/20 px-4 pt-2 pb-6 space-y-4"
        >
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                setActivePage(link.id);
                setIsOpen(false);
              }}
              className="block w-full text-left text-xs font-bold tracking-wider text-[#064A17] py-2"
            >
              {link.name}
            </button>
          ))}
          <button className="w-full bg-[#F7C424] text-[#064A17] px-6 py-3 rounded-full font-bold text-sm">
            Acesse sua Conta
          </button>
        </motion.div>
      )}
    </nav>
  );
};

const WhistleblowingChannel = () => {
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [wantsContact, setWantsContact] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/denuncia', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isAnonymous,
          wantsContact,
          name: isAnonymous ? 'Anônimo' : name,
          phone: isAnonymous ? 'Anônimo' : phone,
          message,
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao enviar denúncia');
      }

      setSubmitted(true);
    } catch (err) {
      setError('Ocorreu um erro ao enviar sua denúncia. Por favor, tente novamente.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <section className="py-40 px-4 text-center bg-white min-h-[calc(100vh-96px)] flex flex-col items-center justify-center">
        <div className="w-20 h-20 bg-[#064A17] rounded-full flex items-center justify-center text-white mb-8">
          <CheckCircle2 size={40} />
        </div>
        <h2 className="text-4xl font-bold text-[#064A17] mb-4">Denúncia Enviada com Sucesso</h2>
        <p className="text-gray-600 max-w-md mx-auto mb-8">
          Sua denúncia foi recebida e será analisada pelo nosso comitê de ética com total sigilo e profissionalismo.
        </p>
        <button 
          onClick={() => setSubmitted(false)}
          className="text-[#868C14] font-bold hover:underline"
        >
          Fazer outra denúncia
        </button>
      </section>
    );
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white min-h-[calc(100vh-96px)]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        <div className="space-y-8">
          <div className="space-y-2">
            <h1 className="text-5xl lg:text-6xl font-bold text-[#F7C424] leading-tight">
              Canal de
            </h1>
            <h2 className="text-5xl lg:text-6xl font-bold text-[#064A17] leading-tight">
              Denúncias
            </h2>
          </div>
          
          <p className="text-[#064A17] text-lg leading-relaxed max-w-xl">
            A ConnectFarm visa estar inserida no Cadastro Agroíntegro do Ministério da Agricultura e MapaBrasil. Portanto, nos comprometemos com a implementação de práticas e condutas de integridade, ética e transparência. Por isso, abrimos este canal para que qualquer pessoa nos relate e denuncie qualquer atividade relacionada a nós que ameace ferir esse comprometimento. Utilize o formulário seguro abaixo para fazer sua denúncia. Ela é muito importante para nós e pode ser feita de maneira anônima.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-2 space-y-6">
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className={cn(
                "w-5 h-5 border-2 rounded flex items-center justify-center transition-colors",
                isAnonymous ? "bg-[#064A17] border-[#064A17]" : "border-gray-300 group-hover:border-[#064A17]"
              )}>
                {isAnonymous && <CheckCircle2 size={14} className="text-white" />}
              </div>
              <input 
                type="checkbox" 
                className="hidden" 
                checked={isAnonymous} 
                onChange={() => setIsAnonymous(!isAnonymous)} 
              />
              <span className="text-sm text-gray-600">Desejo fazer a denúncia sem me identificar.</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer group">
              <div className={cn(
                "w-5 h-5 border-2 rounded flex items-center justify-center transition-colors",
                wantsContact ? "bg-[#064A17] border-[#064A17]" : "border-gray-300 group-hover:border-[#064A17]"
              )}>
                {wantsContact && <CheckCircle2 size={14} className="text-white" />}
              </div>
              <input 
                type="checkbox" 
                className="hidden" 
                checked={wantsContact} 
                onChange={() => setWantsContact(!wantsContact)} 
              />
              <span className="text-sm text-gray-600">Quero que entrem em contato comigo para falar sobre esta denúncia.</span>
            </label>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-500">Nome</label>
              <input 
                type="text" 
                placeholder="Digite seu nome aqui"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#064A17]/20 focus:border-[#064A17] transition-all"
                disabled={isAnonymous}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-500">Telefone</label>
              <input 
                type="tel" 
                placeholder="+55 51 3630-0682"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#064A17]/20 focus:border-[#064A17] transition-all"
                disabled={isAnonymous}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-500">Mensagem</label>
              <textarea 
                placeholder="Digite sua mensagem aqui"
                rows={6}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#064A17]/20 focus:border-[#064A17] transition-all resize-none"
                required
              />
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm flex items-center gap-2">
              <AlertTriangle size={16} />
              {error}
            </div>
          )}

          <button 
            type="submit"
            disabled={isSubmitting}
            className={cn(
              "bg-[#064A17] text-white px-10 py-3 rounded-full font-bold hover:bg-[#043310] transition-all shadow-md flex items-center gap-2",
              isSubmitting && "opacity-70 cursor-not-allowed"
            )}
          >
            {isSubmitting ? (
              <>
                <RefreshCw size={18} className="animate-spin" />
                Enviando...
              </>
            ) : "Enviar"}
          </button>
        </form>
      </div>
    </section>
  );
};

const Hero = () => {
  return (
    <section className="relative h-[calc(100vh-5rem)] flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2000&auto=format&fit=crop" 
          alt="Agricultural field at dawn"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 space-y-4 lg:space-y-6"
          >
            <div className="space-y-0">
              <h1 className="font-headline text-[1.9rem] sm:text-[2.5rem] md:text-[3.2rem] lg:text-[3.8rem] text-white leading-[1.0] tracking-tighter">
                <span className="text-[#F7C424]">A Terra</span> não <br />
                aceita desaforo <br />
                e o <span className="text-[#F7C424]">seu bolso</span> não aceita
              </h1>
              <h2 className="font-headline text-[1.9rem] sm:text-[2.5rem] md:text-[3.2rem] lg:text-[3.8rem] text-white leading-[1.0] tracking-tighter">
                erro.
              </h2>
            </div>
            
            <div className="max-w-xl space-y-6">
              <p className="text-white text-[22px] leading-[37px] font-body">
                Dado sem agronomia é só planilha, e agronomia sem dado é só opinião. A ConnectFARM entrega a inteligência que o campo exige: diagnósticos reais para quem não tem tempo a perder com "acho que vai dar bom".
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#868C14] text-white px-8 py-4 rounded-xl font-body font-bold text-lg hover:bg-[#6d7210] transition-all shadow-xl flex items-center justify-center gap-3"
                >
                  Quero um diagnóstico
                  <ArrowRight size={20} />
                </a>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:flex lg:col-span-5 justify-end"
          >
            <div className="bg-[#E2E4D1] p-8 rounded-[2rem] shadow-2xl w-full max-w-md space-y-8">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-2xl bg-[#064A17] flex items-center justify-center text-[#F7C424] shadow-inner">
                  <BarChart3 size={32} />
                </div>
                <div>
                  <p className="font-label text-xs uppercase tracking-[0.2em] text-[#064A17]/60 font-bold">DADOS REAIS DO CAMPO</p>
                  <p className="font-headline font-bold text-3xl text-[#064A17]">Talhão 04 – Norte</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between text-lg font-bold text-[#064A17]">
                    <span>Biomassa</span>
                    <span>RVI 0,78</span>
                  </div>
                  <div className="h-3 bg-[#064A17]/10 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: '78%' }}
                      transition={{ duration: 1.5, delay: 1 }}
                      className="h-full bg-[#868C14]" 
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-lg font-bold text-[#064A17]">
                    <span>Vigor Vegetativo</span>
                    <span>NDVI 0.82</span>
                  </div>
                  <div className="h-3 bg-[#064A17]/10 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: '82%' }}
                      transition={{ duration: 1.5, delay: 1.2 }}
                      className="h-full bg-[#F7C424]" 
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center gap-3 text-sm text-[#064A17]/70 font-bold">
                <div className="h-2.5 w-2.5 rounded-full bg-[#3C9EA0] animate-pulse" />
                Sincronizado via Satélite Radar (SAR)
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const ForWhomSection = () => {
  return (
    <section className="py-32 bg-surface-container-low px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <span className="font-label text-xs uppercase tracking-[0.4em] text-secondary font-bold">PARA QUEM É A CONNECTFARM</span>
            <h2 className="font-headline text-4xl md:text-6xl text-primary font-bold tracking-tight">
              Para o produtor que trata a fazenda como empresa.
            </h2>
            <div className="space-y-6 text-on-surface-variant text-lg leading-relaxed">
              <p>
                Você não planta por tradição. Você planta porque é um negócio — e você quer que ele seja rentável. Você acompanha custo, cobra resultado, e sabe que cada hectare precisa trabalhar por você.
              </p>
              <p>
                A ConnectFARM foi feita para esse produtor: aquele que está no escritório ou na fazenda, que pode ser engenheiro agrônomo, advogado, empresário ou gestor de família — mas que, no fim do dia, olha para os números e cobra resultado.
              </p>
              <p className="font-bold text-primary">
                Se você é esse produtor, a gente tem muito a conversar.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-primary/5 p-8 rounded-3xl border border-primary/10 space-y-4">
              <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center text-white">
                <Settings size={24} />
              </div>
              <h4 className="font-headline font-bold text-xl text-primary">Foco em Gestão</h4>
              <p className="text-sm text-on-surface-variant">Para quem olha a fazenda como uma unidade de negócio.</p>
            </div>
            <div className="bg-tertiary/5 p-8 rounded-3xl border border-tertiary/10 space-y-4 mt-8">
              <div className="h-12 w-12 rounded-xl bg-tertiary flex items-center justify-center text-white">
                <BarChart3 size={24} />
              </div>
              <h4 className="font-headline font-bold text-xl text-primary">Cultura de Resultado</h4>
              <p className="text-sm text-on-surface-variant">Decisões baseadas no que realmente traz retorno para o seu bolso.</p>
            </div>
            <div className="bg-secondary/5 p-8 rounded-3xl border border-secondary/10 space-y-4">
              <div className="h-12 w-12 rounded-xl bg-secondary flex items-center justify-center text-white">
                <Users size={24} />
              </div>
              <h4 className="font-headline font-bold text-xl text-primary">Sucessão Familiar</h4>
              <p className="text-sm text-on-surface-variant">Tecnologia para profissionalizar a gestão da família.</p>
            </div>
            <div className="bg-primary/5 p-8 rounded-3xl border border-primary/10 space-y-4 mt-8">
              <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center text-white">
                <Zap size={24} />
              </div>
              <h4 className="font-headline font-bold text-xl text-primary">Eficiência em Escala</h4>
              <p className="text-sm text-on-surface-variant">Gestão profissional para grandes áreas produtivas.</p>
            </div>
          </div>
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
              Você planta certo, faz tudo certo — e ainda assim sobra menos do que deveria.
            </h2>
            <div className="space-y-6 text-on-surface-variant text-lg leading-relaxed">
              <p>
                Existe um paradoxo comum no agro: quanto mais experiente o produtor, mais ele acredita que já sabe o que o seu solo precisa. E é exatamente aí que mora a perda.
              </p>
              <p>
                É como o nutricionista: a maioria das pessoas acha que sabe o que deve comer. E por isso, não vai ao especialista. Só que sem um diagnóstico real, você acaba tomando decisões baseadas no padrão da fazenda — não nos dados do seu solo.
              </p>
              <p className="font-bold text-primary">
                O resultado? Adubo no lugar errado, cultivar inadequado pro talhão, correção insuficiente. Tudo isso vira custo invisível que aparece só no final da safra.
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src="/amostras.png" 
                alt="Amostras de solo no campo - ConnectFarm" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-10 -left-10 bg-tertiary p-8 rounded-2xl shadow-xl text-white max-w-xs hidden md:block">
              <p className="text-xl font-headline font-bold mb-2">Economia Real</p>
              <p className="text-sm font-label uppercase tracking-wider opacity-80">Produtores ConnectFARM já economizaram até R$ 450,00 por hectare só ajustando a adubação.</p>
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
            <span className="font-label text-xs uppercase tracking-[0.4em] text-tertiary-fixed font-bold">O DIFERENCIAL</span>
            <h2 className="font-headline text-4xl md:text-6xl font-bold tracking-tight leading-tight">
              Em um mercado onde todo mundo quer te vender algo, a gente entrega resultado mensurável.
            </h2>
            <p className="text-white/80 text-xl leading-relaxed">
              Você já sabe: todo dia tem alguém ligando, mandando mensagem, tentando vender alguma coisa para a sua fazenda. A oferta de produtos e serviços no agro é enorme — e a maioria não entrega o que promete.
            </p>
            <div className="bg-white/10 p-8 rounded-2xl border border-white/20">
              <p className="text-2xl md:text-3xl font-headline font-bold text-tertiary-fixed italic">
                "A ConnectFARM não vende promessa. Vende diagnóstico, plano e acompanhamento. O resultado aparece no custo por hectare, na produtividade por talhão e no lucro líquido da safra."
              </p>
            </div>
          </div>
          <div className="space-y-12">
            <div className="p-10 bg-white/5 rounded-3xl border border-white/10 space-y-6">
              <p className="text-5xl md:text-7xl font-headline font-bold text-tertiary-fixed">R$ 450</p>
              <p className="text-xl font-label uppercase tracking-widest text-white/60">Economia máxima por hectare</p>
              <div className="pt-6 border-t border-white/10">
                <p className="text-2xl font-headline font-bold">Ajuste de adubação baseado em diagnóstico real.</p>
              </div>
            </div>
            <div className="flex items-center gap-6 p-6 bg-tertiary/20 rounded-2xl border border-tertiary/30">
              <div className="h-12 w-12 rounded-full bg-tertiary flex items-center justify-center shrink-0">
                <CheckCircle2 size={24} />
              </div>
              <p className="text-lg font-medium">Decisões baseadas em número, não em padrão genérico.</p>
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
      title: 'Mapeamento dos ambientes de produção',
      description: 'Dividimos sua propriedade em zonas de potencial — alta, média e baixa — para que você saiba onde investir mais e onde corrigir primeiro. Chega de tratar a fazenda inteira do mesmo jeito.',
      icon: <MapIcon size={24} />
    },
    {
      title: 'Análise completa do solo em duas profundidades',
      description: 'pH, matéria orgânica, fósforo, potássio, cálcio, magnésio, micronutrientes e muito mais. Você vê o que está limitando a produtividade em cada talhão.',
      icon: <Droplets size={24} />
    },
    {
      title: 'Mapa nutricional por talhão',
      description: 'Visual, objetivo e fácil de usar na hora de tomar decisão. Você e sua equipe entendem de primeira.',
      icon: <BarChart3 size={24} />
    },
    {
      title: 'Recomendação de correção do solo',
      description: 'Calcário, gesso, micronutrientes — indicamos o que precisa ser aplicado, com base nos dados reais, não no "padrão da região".',
      icon: <FileCheck size={24} />
    },
    {
      title: 'Plano de adubação com justificativa',
      description: 'Cada recomendação vem explicada. Você sabe o que está investindo e qual retorno esperar. Decisão baseada em número.',
      icon: <ClipboardList size={24} />
    },
    {
      title: 'Planos de cobertura e rotação de culturas',
      description: 'Para quem pensa na rentabilidade de longo prazo: orientamos o que plantar entre safras para manter e recuperar o solo produtivo.',
      icon: <RefreshCw size={24} />
    }
  ];

  return (
    <section className="py-32 bg-surface-container-low px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20 space-y-6">
          <span className="font-label text-xs uppercase tracking-[0.4em] text-secondary font-bold">O QUE O DIAGNÓSTICO INCLUI</span>
          <h2 className="font-headline text-4xl md:text-5xl text-primary font-bold tracking-tight">Um raio-x completo, talhão por talhão, da produtividade da sua fazenda.</h2>
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
      title: 'A gente vai até você',
      description: 'Um agrônomo ConnectFARM visita sua fazenda, entende seus objetivos e faz a coleta de solo nos seus talhões em duas profundidades (0–20 cm e 20–40 cm). A coleta é georreferenciada e segue um protocolo técnico rigoroso.',
      icon: <MapPin size={32} />
    },
    {
      id: 'Passo 2',
      title: 'Análise e diagnóstico completo',
      description: 'As amostras são processadas em laboratório e os resultados entram na nossa plataforma. Nossa tecnologia analisa mais de 72 variáveis — solo, clima, histórico, genética — e gera um diagnóstico detalhado de cada área da sua propriedade.',
      icon: <Search size={32} />
    },
    {
      id: 'Passo 3',
      title: 'Você recebe um plano claro',
      description: 'Nada de relatório complicado que ninguém lê. Você recebe um mapa visual da sua fazenda com recomendações objetivas: qual adubo, em qual quantidade, em qual área, e por quê. O racional está junto com a recomendação.',
      icon: <FileCheck size={32} />
    },
    {
      id: 'Passo 4',
      title: 'Acompanhamento durante toda a safra',
      description: 'Nossos agrônomos ficam com você do plantio à colheita. Monitoramento em tempo real, alertas de anomalias e suporte direto — para que as recomendações sejam aplicadas e os resultados, medidos.',
      icon: <Headset size={32} />
    }
  ];

  return (
    <section className="py-32 bg-surface px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20 space-y-6">
          <span className="font-label text-xs uppercase tracking-[0.4em] text-secondary font-bold">COMO FUNCIONA</span>
          <h2 className="font-headline text-4xl md:text-5xl text-primary font-bold tracking-tight">Coleta de Solo e Diagnóstico Agronômico</h2>
          <p className="text-on-surface-variant max-w-2xl mx-auto">Antes de qualquer recomendação, a gente vai até a sua propriedade. Coletamos, analisamos e entregamos um diagnóstico preciso — o que seu solo tem, o que falta, e o que precisa mudar em cada área. Sem palpite. Sem padrão genérico. Dados reais da sua terra.</p>
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
    'Mapa de fertilidade da fazenda por talhão',
    'Histórico completo de análises e recomendações',
    'Comparativo de desempenho entre áreas',
    'Índice de Gestão Agronômica (IGA) — um score exclusivo ConnectFARM',
    'Relatórios simplificados assistidos por inteligência artificial',
    'Arquivos de taxa variável prontos para o seu maquinário, com 1 clique'
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
                <p className="text-sm font-bold text-primary">O que você acessa:</p>
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
                    Compatível com as principais marcas de equipamentos do mercado.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-8 order-1 lg:order-2">
            <span className="font-label text-xs uppercase tracking-[0.4em] text-secondary font-bold">A PLATAFORMA CFARM</span>
            <h2 className="font-headline text-4xl md:text-6xl text-primary font-bold tracking-tight">
              Todos os dados da sua fazenda, organizados e acessíveis.
            </h2>
            <p className="text-on-surface-variant text-xl leading-relaxed">
              Depois do diagnóstico, tudo fica registrado na plataforma CFARM. Você e seu agrônomo acessam o histórico da propriedade, acompanham os indicadores e planejam a próxima safra com segurança — de qualquer lugar.
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
      title: 'Escolha assertiva de cultivares',
      description: 'Dados reais de cultivares testados na sua região, por data de plantio. Pare de testar na raça — escolha a semente certa com base em resultado comprovado. Produtores ConnectFARM ganharam +5 sacas/ha só com essa mudança.',
      icon: <Dna size={24} />
    },
    {
      title: 'Gestão fitossanitária inteligente',
      description: 'Defensivo certo, dose certa, momento certo. Sem desperdício, sem resistência, sem custo desnecessário.',
      icon: <ShieldCheck size={24} />
    },
    {
      title: 'Planejamento financeiro da safra',
      description: 'Estimativa de custo por talhão, com foco em reduzir desperdícios e maximizar o retorno do investimento. Para o produtor que quer saber, antes de plantar, se o número fecha.',
      icon: <DollarSign size={24} />
    },
    {
      title: 'Monitoramento em tempo real',
      description: 'Alertas sobre o desenvolvimento da lavoura via NDVI e dados pluviométricos. Você age antes do problema virar prejuízo.',
      icon: <Eye size={24} />
    },
    {
      title: 'Análise pós-safra',
      description: 'Ao final de cada ciclo, analisamos o desempenho talhão a talhão. O que funcionou, o que pode melhorar, e o que fazer diferente na próxima safra. Cada safra deixa a próxima mais inteligente.',
      icon: <RefreshCw size={24} />
    }
  ];

  return (
    <section className="py-32 bg-surface px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20 space-y-6">
          <span className="font-label text-xs uppercase tracking-[0.4em] text-secondary font-bold">OUTROS SERVIÇOS</span>
          <h2 className="font-headline text-4xl md:text-5xl text-primary font-bold tracking-tight">Para quem quer ir além do diagnóstico.</h2>
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
          <span className="font-label text-xs uppercase tracking-[0.4em] text-secondary font-bold">POR QUE A CONNECTFARM</span>
          <h2 className="font-headline text-4xl md:text-5xl text-primary font-bold tracking-tight">Números reais que comprovam o resultado.</h2>
          <p className="text-on-surface-variant max-w-2xl mx-auto">Sistema baseado em mais de 400 mil análises de solo e 10 anos de pesquisa em campo.</p>
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
              Uma equipe que entende de campo e de tecnologia.
            </h2>
            <p className="text-on-surface-variant text-xl leading-relaxed">
              A ConnectFARM tem agrônomos, técnicos, desenvolvedores e biólogos trabalhando juntos — porque a gente acredita que dado sem agronomia é planilha, e agronomia sem dado é opinião.
            </p>
            <p className="text-on-surface-variant text-lg">
              Estamos em mais de 8 estados brasileiros, com presença física em campo.
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
              <li className="flex items-center gap-2"><Phone size={16} className="text-tertiary-fixed" /> {WHATSAPP_DISPLAY}</li>
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
  const [activePage, setActivePage] = useState('home');

  return (
    <div className="min-h-screen selection:bg-tertiary-fixed selection:text-on-tertiary-fixed">
      <Navbar activePage={activePage} setActivePage={setActivePage} />
      <main>
        {activePage === 'home' ? (
          <>
            <Hero />
            <ForWhomSection />
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
                  Você sabe o quanto custa não ter um diagnóstico?
                </h2>
                <p className="text-on-surface-variant text-xl md:text-2xl leading-relaxed">
                  O primeiro passo é simples: fale com um agrônomo ConnectFARM. A gente mostra, com dados, onde está o potencial da sua fazenda — e o que fazer para chegar lá.
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
          </>
        ) : activePage === 'integridade' ? (
          <WhistleblowingChannel />
        ) : (
          <div className="py-40 text-center">
            <h2 className="text-3xl font-bold text-[#064A17]">Página em desenvolvimento</h2>
            <button 
              onClick={() => setActivePage('home')}
              className="mt-6 text-[#868C14] font-bold hover:underline"
            >
              Voltar para Home
            </button>
          </div>
        )}
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
