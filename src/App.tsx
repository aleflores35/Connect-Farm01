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
  ArrowLeft,
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
  Activity,
  Plus,
  Trash2,
  LogOut,
  LayoutDashboard,
  FileText,
  Image as ImageIcon
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Markdown from 'react-markdown';
import { cn } from '@/src/lib/utils';
import { isAdminEmail } from './lib/admins';
import { db, auth } from './firebase';
import { 
  collection, 
  query, 
  orderBy, 
  where,
  onSnapshot, 
  addDoc, 
  updateDoc,
  deleteDoc,
  getDocFromServer,
  doc
} from 'firebase/firestore';
import {
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  User as FirebaseUser
} from 'firebase/auth';

const WHATSAPP_NUMBER = "555136300682";
const WHATSAPP_DISPLAY = "+55 51 3630-0682";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  image: string;
  author: string;
  authorId: string;
  status: 'draft' | 'published';
}

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
  const [user, setUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'reset'>('login');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authInfo, setAuthInfo] = useState<string | null>(null);
  const [isAuthSubmitting, setIsAuthSubmitting] = useState(false);

  const openAuthModal = () => {
    setShowAuthModal(true);
    setAuthMode('login');
    setEmailInput('');
    setPasswordInput('');
    setAuthError(null);
    setAuthInfo(null);
  };

  const closeAuthModal = () => {
    setShowAuthModal(false);
  };

  // Acesso ao painel admin via query param: ?admin=1 abre modal de login.
  // Mantém o modal vivo sem expor CTA público (que agora vai pra global.connectfarm.com.br).
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === '1') {
      setShowAuthModal(true);
      setAuthMode('login');
    }
  }, []);

  const friendlyAuthError = (code: string): string => {
    switch (code) {
      case 'auth/invalid-email': return 'Email inválido.';
      case 'auth/user-not-found': return 'Conta não encontrada.';
      case 'auth/wrong-password':
      case 'auth/invalid-credential': return 'Email ou senha incorretos.';
      case 'auth/email-already-in-use': return 'Esse email já tem uma conta. Faça login.';
      case 'auth/weak-password': return 'A senha precisa de pelo menos 6 caracteres.';
      case 'auth/too-many-requests': return 'Muitas tentativas. Tente novamente em alguns minutos.';
      case 'auth/network-request-failed': return 'Sem conexão. Verifique sua internet.';
      default: return 'Não foi possível concluir. Tente novamente.';
    }
  };

  const handleGoogleLogin = async () => {
    if (isLoggingIn) return;
    setIsLoggingIn(true);
    setAuthError(null);

    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });

    try {
      await signInWithPopup(auth, provider);
      closeAuthModal();
    } catch (error: any) {
      if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') {
        // user cancelled — silent
      } else {
        console.error("Erro ao fazer login Google:", error);
        setAuthError(friendlyAuthError(error.code));
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isAuthSubmitting) return;
    setAuthError(null);
    setAuthInfo(null);
    setIsAuthSubmitting(true);

    try {
      if (authMode === 'signup') {
        await createUserWithEmailAndPassword(auth, emailInput, passwordInput);
        closeAuthModal();
      } else if (authMode === 'login') {
        await signInWithEmailAndPassword(auth, emailInput, passwordInput);
        closeAuthModal();
      } else {
        await sendPasswordResetEmail(auth, emailInput);
        setAuthInfo('Se essa conta existir, você vai receber um link no seu email.');
      }
    } catch (error: any) {
      console.error("Erro de autenticação:", error);
      setAuthError(friendlyAuthError(error.code));
    } finally {
      setIsAuthSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  const isAdmin = isAdminEmail(user?.email);

  const navLinks = [
    { name: 'HOME', id: 'home' },
    { name: 'BLOG', id: 'blog' },
    { name: 'CONTATO', id: 'contato' },
    { name: 'PROGRAMA DE INTEGRIDADE', id: 'integridade' },
  ];

  const handleNavClick = (id: string) => {
    if (id === 'contato') {
      if (activePage !== 'home') {
        setActivePage('home');
        // Wait for page to switch before scrolling
        setTimeout(() => {
          const element = document.getElementById('contato');
          element?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        const element = document.getElementById('contato');
        element?.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      setActivePage(id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-outline-variant/10">
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
                onClick={() => handleNavClick(link.id)}
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
              
              {user ? (
                <div className="flex items-center gap-6">
                  <button 
                    onClick={() => setActivePage('admin')}
                    className="bg-tertiary/10 text-tertiary px-4 py-2 rounded-xl font-bold text-xs hover:bg-tertiary hover:text-white transition-all border border-tertiary/20 flex items-center gap-2"
                  >
                    <LayoutDashboard size={16} />
                    PAINEL BLOG
                  </button>
                  <div className="flex items-center gap-4 pl-4 border-l border-outline-variant/20">
                    <div className="flex flex-col items-end">
                      <span className="text-xs font-bold text-primary">{user.displayName}</span>
                      <button onClick={handleLogout} className="text-[10px] text-tertiary hover:underline">Sair</button>
                    </div>
                    <img src={user.photoURL || ''} alt="Avatar" className="w-8 h-8 rounded-full border border-primary/10" />
                  </div>
                </div>
              ) : (
                <a
                  href="https://global.connectfarm.com.br/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#F7C424] text-[#064A17] px-6 py-3 rounded-full font-bold text-sm hover:bg-[#e5b521] transition-all shadow-sm flex items-center gap-2"
                >
                  Acesse sua Conta
                </a>
              )}
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
              onClick={() => handleNavClick(link.id)}
              className={cn(
                "block w-full text-left text-xs font-bold tracking-wider py-2 transition-colors",
                activePage === link.id ? "text-[#868C14]" : "text-[#064A17]"
              )}
            >
              {link.name}
            </button>
          ))}
          <a
            href="https://global.connectfarm.com.br/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsOpen(false)}
            className="block w-full text-center bg-[#F7C424] text-[#064A17] px-6 py-3 rounded-full font-bold text-sm"
          >
            Acesse sua Conta
          </a>
        </motion.div>
      )}

      {showAuthModal && createPortal(
        <div
          className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm flex items-center justify-center px-4"
          onClick={closeAuthModal}
        >
          <div
            className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeAuthModal}
              className="absolute top-4 right-4 text-on-surface-variant hover:text-primary transition-colors"
              aria-label="Fechar"
            >
              <X size={20} />
            </button>

            <h2 className="font-headline text-3xl font-bold text-primary mb-2">
              {authMode === 'signup' ? 'Criar conta' : authMode === 'reset' ? 'Recuperar senha' : 'Acesse sua conta'}
            </h2>
            <p className="text-on-surface-variant text-sm mb-6">
              {authMode === 'reset'
                ? 'Vamos enviar um link de recuperação para o seu email.'
                : 'Use sua conta Google ou entre com email e senha.'}
            </p>

            {authMode !== 'reset' && (
              <>
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={isLoggingIn}
                  className={cn(
                    "w-full border border-outline-variant rounded-xl py-3 px-4 font-bold text-sm flex items-center justify-center gap-3 hover:bg-surface-container-low transition-colors mb-4",
                    isLoggingIn && "opacity-70 cursor-not-allowed"
                  )}
                >
                  {isLoggingIn ? (
                    <>
                      <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                      Acessando...
                    </>
                  ) : (
                    <>
                      <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                        <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
                        <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.836.86-3.048.86-2.344 0-4.328-1.583-5.036-3.71H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
                        <path fill="#FBBC05" d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"/>
                        <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z"/>
                      </svg>
                      Continuar com Google
                    </>
                  )}
                </button>

                <div className="flex items-center gap-3 my-4">
                  <div className="flex-1 h-px bg-outline-variant/30" />
                  <span className="text-xs text-on-surface-variant uppercase tracking-widest">ou</span>
                  <div className="flex-1 h-px bg-outline-variant/30" />
                </div>
              </>
            )}

            <form onSubmit={handleEmailAuth} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-primary uppercase tracking-wider">Email</label>
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="mt-1 w-full bg-white border border-outline-variant rounded-xl px-4 py-3 focus:ring-2 focus:ring-tertiary outline-none"
                  placeholder="seu@email.com"
                  autoComplete="email"
                />
              </div>

              {authMode !== 'reset' && (
                <div>
                  <label className="text-xs font-bold text-primary uppercase tracking-wider">Senha</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="mt-1 w-full bg-white border border-outline-variant rounded-xl px-4 py-3 focus:ring-2 focus:ring-tertiary outline-none"
                    placeholder={authMode === 'signup' ? 'Mínimo 6 caracteres' : 'Sua senha'}
                    autoComplete={authMode === 'signup' ? 'new-password' : 'current-password'}
                  />
                </div>
              )}

              {authError && (
                <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                  {authError}
                </div>
              )}

              {authInfo && (
                <div className="p-3 bg-green-50 text-green-700 rounded-lg text-sm">
                  {authInfo}
                </div>
              )}

              <button
                type="submit"
                disabled={isAuthSubmitting}
                className={cn(
                  "w-full bg-primary text-white py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2",
                  isAuthSubmitting ? "opacity-70 cursor-not-allowed" : "hover:bg-primary/90"
                )}
              >
                {isAuthSubmitting && (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                )}
                {authMode === 'signup' ? 'Criar conta' : authMode === 'reset' ? 'Enviar link' : 'Entrar'}
              </button>
            </form>

            <div className="mt-6 flex flex-col gap-2 text-sm text-center">
              {authMode === 'login' && (
                <>
                  <button onClick={() => { setAuthMode('signup'); setAuthError(null); setAuthInfo(null); }} className="text-tertiary font-bold hover:underline">
                    Criar uma conta
                  </button>
                  <button onClick={() => { setAuthMode('reset'); setAuthError(null); setAuthInfo(null); }} className="text-on-surface-variant hover:underline">
                    Esqueci a senha
                  </button>
                </>
              )}
              {authMode === 'signup' && (
                <button onClick={() => { setAuthMode('login'); setAuthError(null); setAuthInfo(null); }} className="text-tertiary font-bold hover:underline">
                  Já tenho conta
                </button>
              )}
              {authMode === 'reset' && (
                <button onClick={() => { setAuthMode('login'); setAuthError(null); setAuthInfo(null); }} className="text-tertiary font-bold hover:underline">
                  Voltar para login
                </button>
              )}
            </div>
          </div>
        </div>,
        document.body
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
  const [honeypot, setHoneypot] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message) return;

    setIsSubmitting(true);
    setError(null);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

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
          website: honeypot,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error('Erro ao enviar denúncia');
      }

      setSubmitted(true);
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        setError('A conexão demorou demais. Verifique sua internet e tente novamente.');
      } else {
        setError('Ocorreu um erro ao enviar sua denúncia. Por favor, tente novamente.');
      }
      console.error(err);
    } finally {
      clearTimeout(timeoutId);
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
            <h1 className="font-headline text-5xl lg:text-6xl font-bold text-[#F7C424] leading-tight">
              Canal de
            </h1>
            <h2 className="font-headline text-5xl lg:text-6xl font-bold text-[#064A17] leading-tight">
              Denúncias
            </h2>
          </div>
          
          <p className="font-body text-[#064A17] text-lg leading-relaxed max-w-xl">
            A ConnectFARM visa estar inserida no Cadastro Agroíntegro do Ministério da Agricultura e MapaBrasil. Portanto, nos comprometemos com a implementação de práticas e condutas de integridade, ética e transparência. Por isso, abrimos este canal para que qualquer pessoa nos relate e denuncie qualquer atividade relacionada a nós que ameace ferir esse comprometimento. Utilize o formulário seguro abaixo para fazer sua denúncia. Ela é muito importante para nós e pode ser feita de maneira anônima.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-2 space-y-6">
          {/* Honeypot field — hidden from real users, attractive to bots. */}
          <div className="absolute left-[-9999px] top-0" aria-hidden="true">
            <label htmlFor="contact-website">Website (deixe em branco)</label>
            <input
              id="contact-website"
              type="text"
              name="website"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

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
              <label className="font-label text-sm font-medium text-gray-500">Nome</label>
              <input 
                type="text" 
                placeholder="Digite seu nome aqui"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="font-body w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#064A17]/20 focus:border-[#064A17] transition-all"
                disabled={isAnonymous}
              />
            </div>

            <div className="space-y-2">
              <label className="font-label text-sm font-medium text-gray-500">Telefone</label>
              <input 
                type="tel" 
                placeholder="+55 51 3630-0682"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="font-body w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#064A17]/20 focus:border-[#064A17] transition-all"
                disabled={isAnonymous}
              />
            </div>

            <div className="space-y-2">
              <label className="font-label text-sm font-medium text-gray-500">Mensagem</label>
              <textarea 
                placeholder="Digite sua mensagem aqui"
                rows={6}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="font-body w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#064A17]/20 focus:border-[#064A17] transition-all resize-none"
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
              {/* TODO: replace with actual ConnectFARM soil-sampling photo (placeholder Unsplash) */}
              <img
                src="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=800&auto=format&fit=crop"
                alt="Amostras de solo no campo - ConnectFARM"
                loading="lazy"
                decoding="async"
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
              <p className="text-xl font-label uppercase tracking-widest text-white/60">Economia real por hectare</p>
              <div className="pt-6 border-t border-white/10">
                <p className="text-2xl font-headline font-bold">Resultado obtido em campo através do ajuste preciso da adubação.</p>
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
      id: '01',
      title: 'A gente vai até você',
      description: 'Um agrônomo ConnectFARM visita sua fazenda, entende seus objetivos e faz a coleta de solo nos seus talhões em duas profundidades (0–20 cm e 20–40 cm). A coleta é georreferenciada e segue um protocolo técnico rigoroso.',
      icon: <MapPin size={32} />
    },
    {
      id: '02',
      title: 'Análise e diagnóstico completo',
      description: 'As amostras são processadas em laboratório e os resultados entram na nossa plataforma. Nossa tecnologia analisa mais de 72 variáveis — solo, clima, histórico, genética — e gera um diagnóstico detalhado de cada área da sua propriedade.',
      icon: <Search size={32} />
    },
    {
      id: '03',
      title: 'Você recebe um plano claro',
      description: 'Nada de relatório complicado que ninguém lê. Você recebe um mapa visual da sua fazenda com recomendações objetivas: qual adubo, em qual quantidade, em qual área, e por quê. O racional está junto com a recomendação.',
      icon: <FileCheck size={32} />
    },
    {
      id: '04',
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
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img src="/10.04.2026_17.29.26_REC.png" alt="Atendimento RTA ConnectFARM" loading="lazy" decoding="async" className="rounded-2xl h-64 w-full object-cover mt-12" referrerPolicy="no-referrer" />
            <img src="https://images.unsplash.com/photo-1586771107445-d3ca888129ff?q=80&w=600&auto=format&fit=crop" alt="Lab work" loading="lazy" decoding="async" className="rounded-2xl h-64 w-full object-cover" referrerPolicy="no-referrer" />
          </div>
        </div>
      </div>
    </section>
  );
};

const BlogPage = ({ onPostClick }: { onPostClick: (post: BlogPost) => void }) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('Todos');

  useEffect(() => {
    if (!db) {
      console.error("Firestore db instance is not initialized.");
      setLoading(false);
      return;
    }
    const q = query(
      collection(db, 'posts'), 
      where('status', '==', 'published'),
      orderBy('date', 'desc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as BlogPost[];
      setPosts(postsData);
      setLoading(false);
    }, (error) => {
      console.error("Erro ao carregar posts:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const categories = ['Todos', ...new Set(posts.map(p => p.category))];
  const filteredPosts = activeCategory === 'Todos' 
    ? posts 
    : posts.filter(p => p.category === activeCategory);

  const featuredPost = posts[0];
  const otherPosts = filteredPosts.filter(p => p.id !== featuredPost?.id);

  const calculateReadingTime = (text: string) => {
    const wordsPerMinute = 200;
    const words = text.split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  if (loading) {
    return (
      <div className="pt-40 pb-20 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-on-surface-variant font-sans">Carregando o universo ConnectFARM...</p>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Editorial Header */}
      <header className="pt-40 pb-20 px-4 sm:px-6 lg:px-8 border-b border-primary/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-6 max-w-3xl">
              <div className="font-label flex items-center gap-3 text-tertiary font-bold tracking-[0.2em] text-xs uppercase">
                <span className="w-8 h-[1px] bg-tertiary" />
                Editorial ConnectFARM
              </div>
              <h1 className="text-6xl md:text-9xl font-headline font-bold text-primary leading-[0.85] tracking-tighter">
                O Futuro do <br /> <span className="text-tertiary italic font-serif font-medium">Campo</span> Hoje.
              </h1>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "px-6 py-2 rounded-full text-sm font-bold transition-all border",
                    activeCategory === cat 
                      ? "bg-primary text-white border-primary" 
                      : "bg-transparent text-primary border-primary/10 hover:border-primary/30"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-on-surface-variant text-xl font-serif italic">Nenhum artigo publicado ainda.</p>
          </div>
        ) : (
          <div className="space-y-32">
            {/* Featured Post - Recipe 2 Style */}
            {activeCategory === 'Todos' && featuredPost && (
              <section 
                className="group cursor-pointer relative"
                onClick={() => onPostClick(featuredPost)}
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                  <div className="lg:col-span-7 overflow-hidden rounded-[2rem] aspect-[16/10]">
                    <motion.img
                      initial={{ scale: 1.1 }}
                      whileInView={{ scale: 1 }}
                      transition={{ duration: 1.5 }}
                      src={featuredPost.image || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1200&auto=format&fit=crop'}
                      alt={featuredPost.title}
                      loading="lazy"
                      decoding="async"
                      style={{ imageOrientation: 'from-image' }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="lg:col-span-5 space-y-8">
                    <div className="space-y-4">
                      <span className="font-label text-tertiary font-bold tracking-widest text-xs uppercase">{featuredPost.category}</span>
                      <h2 className="text-4xl md:text-6xl font-headline font-bold text-primary leading-tight group-hover:text-tertiary transition-colors">
                        {featuredPost.title}
                      </h2>
                      <p className="text-xl text-on-surface-variant leading-relaxed font-serif italic">
                        {featuredPost.excerpt}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-primary/5 flex items-center justify-center text-primary font-bold border border-primary/10">
                        {featuredPost.author.charAt(0)}
                      </div>
                      <div>
                        <p className="font-body font-bold text-primary">{featuredPost.author}</p>
                        <p className="font-label text-xs text-on-surface-variant uppercase tracking-widest">{featuredPost.date}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Grid Menu - Recipe 12 Style */}
            <motion.section 
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24"
            >
              {otherPosts.map((post, idx) => (
                <motion.article 
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0 }
                  }}
                  key={post.id}
                  className="group cursor-pointer space-y-8"
                  onClick={() => onPostClick(post)}
                >
                  <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden">
                    <img
                      src={post.image || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=800&auto=format&fit=crop'}
                      alt={post.title}
                      loading="lazy"
                      decoding="async"
                      style={{ imageOrientation: 'from-image' }}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-1 rounded-full text-[10px] font-bold tracking-widest text-primary uppercase border border-white/20">
                      {post.category}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-on-surface-variant/50 uppercase">
                      <span>0{idx + 1}</span>
                      <span className="w-4 h-[1px] bg-on-surface-variant/20" />
                      <span>{post.date}</span>
                      <span className="w-4 h-[1px] bg-on-surface-variant/20" />
                      <span>{calculateReadingTime(post.content)} min de leitura</span>
                    </div>
                    <h3 className="text-3xl font-headline font-bold text-primary leading-tight group-hover:text-tertiary transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-on-surface-variant line-clamp-2 font-serif text-lg italic opacity-80">
                      {post.excerpt}
                    </p>
                  </div>
                </motion.article>
              ))}
            </motion.section>
          </div>
        )}
      </main>
    </div>
  );
};

const BlogPreview = ({ onSeeAll, onPostClick }: { onSeeAll: () => void, onPostClick: (post: BlogPost) => void }) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    if (!db) {
      console.error("Firestore db instance is not initialized.");
      return;
    }
    const q = query(
      collection(db, 'posts'), 
      where('status', '==', 'published'),
      orderBy('date', 'desc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.slice(0, 3).map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as BlogPost[];
      setPosts(postsData);
    });

    return () => unsubscribe();
  }, []);

  const calculateReadingTime = (text: string) => {
    const wordsPerMinute = 200;
    const words = text.split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  if (posts.length === 0) return null;

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-surface-container-lowest border-y border-outline-variant/5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 space-y-3">
          <div className="font-label flex items-center justify-center gap-3 text-tertiary font-bold tracking-[0.2em] text-[10px] uppercase">
            <span className="w-6 h-[1px] bg-tertiary" />
            Conhecimento Aplicado
            <span className="w-6 h-[1px] bg-tertiary" />
          </div>
          <h2 className="text-3xl md:text-5xl font-headline font-bold text-primary tracking-tighter leading-tight">
            Editorial <span className="italic font-serif font-light text-tertiary">ConnectFARM</span>
          </h2>
        </div>

        <motion.div 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {posts.map((post, idx) => (
            <motion.article 
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 }
              }}
              key={post.id}
              className="group cursor-pointer space-y-4"
              onClick={() => onPostClick(post)}
            >
              <div className="relative aspect-video rounded-xl overflow-hidden shadow-sm group-hover:shadow-md transition-all duration-500">
                <img
                  src={post.image || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=800&auto=format&fit=crop'}
                  alt={post.title}
                  loading="lazy"
                  decoding="async"
                  style={{ imageOrientation: 'from-image' }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-bold tracking-widest text-primary uppercase border border-white/20">
                  {post.category}
                </div>
              </div>
              <div className="space-y-2 px-1">
                <div className="font-label flex items-center gap-2 text-[9px] font-bold tracking-widest text-on-surface-variant/50 uppercase">
                  <span>{post.date}</span>
                  <span className="w-3 h-[1px] bg-on-surface-variant/20" />
                  <span>{calculateReadingTime(post.content)} min</span>
                </div>
                <h3 className="text-lg font-headline font-semibold text-primary leading-tight group-hover:text-tertiary transition-colors line-clamp-1">
                  {post.title}
                </h3>
                <p className="text-on-surface-variant line-clamp-2 font-serif text-sm italic opacity-70 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>
            </motion.article>
          ))}
        </motion.div>

        <div className="mt-10 text-center">
          <button 
            onClick={onSeeAll}
            className="group inline-flex items-center gap-2 text-primary font-bold text-sm hover:text-tertiary transition-colors"
          >
            <span className="border-b border-primary/20 group-hover:border-tertiary transition-colors pb-0.5">Acessar editorial completo</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};

const BlogPostPage = ({ post, onBack, onPostClick }: { post: BlogPost, onBack: () => void, onPostClick: (post: BlogPost) => void }) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      setScrollProgress((currentScroll / totalScroll) * 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!db) return;
    const q = query(
      collection(db, 'posts'),
      where('status', '==', 'published'),
      where('category', '==', post.category),
      orderBy('date', 'desc')
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const posts = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as BlogPost))
        .filter(p => p.id !== post.id)
        .slice(0, 2);
      setRelatedPosts(posts);
    });

    return () => unsubscribe();
  }, [post.id, post.category]);

  const calculateReadingTime = (text: string) => {
    const wordsPerMinute = 200;
    const words = text.split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  const shareOnWhatsApp = () => {
    const url = window.location.href;
    const text = `Confira este artigo da ConnectFARM: ${post.title} - ${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="bg-[#fdfdfb] min-h-screen">
      {/* Reading Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 h-1.5 bg-tertiary z-[60] origin-left"
        style={{ scaleX: scrollProgress / 100 }}
      />

      {/* Immersive Header - Recipe 7 Style */}
      <header className="relative h-[80vh] w-full overflow-hidden">
        <motion.img
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2 }}
          src={post.image || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1600&auto=format&fit=crop'}
          alt={post.title}
          className="w-full h-full object-cover"
          style={{ imageOrientation: 'from-image' }}
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#fdfdfb] via-primary/40 to-transparent" />
        
        <div className="absolute bottom-0 left-0 w-full p-4 sm:p-6 lg:p-20">
          <div className="max-w-4xl mx-auto space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="font-label flex items-center gap-4 text-white/80 font-bold tracking-[0.3em] text-xs uppercase"
            >
              <span className="bg-tertiary px-3 py-1 rounded text-white">{post.category}</span>
              <span>{post.date}</span>
              <span className="w-1 h-1 rounded-full bg-white/40" />
              <span>{calculateReadingTime(post.content)} min de leitura</span>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="text-5xl md:text-8xl font-headline font-bold text-white leading-[0.85] tracking-tighter"
            >
              {post.title}
            </motion.h1>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="flex items-center gap-6 pt-8"
            >
              <div className="h-16 w-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white text-2xl font-bold">
                {post.author.charAt(0)}
              </div>
              <div className="text-white">
                <p className="text-xl font-bold">{post.author}</p>
                <p className="text-sm opacity-70 uppercase tracking-widest">Especialista ConnectFARM</p>
              </div>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Content Area - Recipe 6 Style */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative">
        <div className="absolute -left-32 top-24 hidden xl:flex flex-col items-center gap-8">
          <button 
            onClick={onBack}
            className="flex flex-col items-center gap-4 text-primary/30 hover:text-tertiary transition-colors group"
          >
            <div className="h-12 w-12 rounded-full border border-current flex items-center justify-center group-hover:scale-110 transition-transform">
              <ArrowLeft size={20} />
            </div>
            <span className="text-[10px] font-bold tracking-widest uppercase vertical-text rotate-180">Voltar</span>
          </button>

          <div className="flex flex-col items-center gap-4 text-primary/20">
            <span className="text-[10px] font-bold tracking-widest uppercase vertical-text rotate-180 mb-2">Compartilhar</span>
            <button onClick={shareOnWhatsApp} className="hover:text-[#25D366] transition-colors"><WhatsAppIcon size={20} /></button>
            <button onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              alert('Link copiado!');
            }} className="hover:text-primary transition-colors"><Globe size={20} /></button>
          </div>
        </div>

        <div className="prose prose-2xl max-w-none text-primary/90 leading-[1.7] font-serif selection:bg-tertiary/20">
          <div className="mb-16 [&>p:first-of-type]:first-letter:text-8xl [&>p:first-of-type]:first-letter:font-light [&>p:first-of-type]:first-letter:text-tertiary [&>p:first-of-type]:first-letter:mr-3 [&>p:first-of-type]:first-letter:float-left [&>p:first-of-type]:first-letter:leading-[0.8]">
            <Markdown>{post.content}</Markdown>
          </div>
        </div>

        {/* Related Articles Section */}
        {relatedPosts.length > 0 && (
          <section className="mt-40 pt-20 border-t border-primary/5">
            <div className="flex items-center justify-between mb-16">
              <h3 className="text-4xl font-headline font-bold text-primary tracking-tight">Continue Lendo</h3>
              <button 
                onClick={onBack}
                className="text-tertiary font-bold flex items-center gap-2 hover:gap-4 transition-all"
              >
                Ver todos <ArrowRight size={20} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {relatedPosts.map(rPost => (
                <article
                  key={rPost.id}
                  className="group cursor-pointer space-y-6"
                  onClick={() => onPostClick(rPost)}
                >
                  <div className="aspect-video rounded-3xl overflow-hidden">
                    <img src={rPost.image || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=800&auto=format&fit=crop'} alt={rPost.title} loading="lazy" decoding="async" style={{ imageOrientation: 'from-image' }} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <h4 className="text-2xl font-headline font-bold text-primary group-hover:text-tertiary transition-colors leading-tight">
                    {rPost.title}
                  </h4>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Footer of Article */}
        <footer className="mt-32 pt-16 border-t border-primary/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="h-20 w-20 rounded-full bg-primary/5 border border-primary/10 flex items-center justify-center text-primary text-3xl font-bold">
                {post.author.charAt(0)}
              </div>
              <div className="space-y-1">
                <h4 className="text-2xl font-headline font-bold text-primary">{post.author}</h4>
                <p className="text-on-surface-variant font-serif italic">Agrônomo e Pesquisador na ConnectFARM, focado em transformar dados em produtividade sustentável.</p>
              </div>
            </div>
            <button 
              onClick={onBack}
              className="bg-primary text-white px-8 py-4 rounded-2xl font-bold hover:scale-105 transition-transform shadow-xl"
            >
              Explorar mais artigos
            </button>
          </div>
        </footer>
      </main>
    </div>
  );
};

const AdminPanel = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'Tecnologia',
    image: '',
    status: 'draft' as 'draft' | 'published'
  });

  useEffect(() => {
    if (!db) {
      console.error("Firestore db instance is not initialized.");
      return;
    }
    const q = query(collection(db, 'posts'), orderBy('date', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as BlogPost[];
      setPosts(postsData);
    }, (error) => {
      console.error("Error fetching posts:", error);
    });
    return () => unsubscribe();
  }, []);

  const handleGenerateAI = async () => {
    if (!newPost.title) {
      alert("Por favor, digite um título ou tema para a IA trabalhar.");
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: newPost.title }),
      });

      const payload = await response.json();

      if (!response.ok || !payload?.data?.title) {
        throw new Error(payload?.error || 'Resposta inválida do servidor');
      }

      const data = payload.data;
      setNewPost({
        ...newPost,
        title: data.title,
        excerpt: data.excerpt,
        content: data.content,
        category: data.category,
      });
    } catch (error) {
      console.error("Erro na geração IA:", error);
      alert("Erro ao gerar conteúdo com IA. Verifique se o servidor está configurado.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser || !db) {
      if (!db) alert("Erro: Banco de dados não inicializado.");
      return;
    }

    try {
      if (editingId) {
        await updateDoc(doc(db, 'posts', editingId), {
          ...newPost,
          author: auth.currentUser.displayName || 'Admin',
          authorId: auth.currentUser.uid
        });
      } else {
        await addDoc(collection(db, 'posts'), {
          ...newPost,
          date: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }),
          author: auth.currentUser.displayName || 'Admin',
          authorId: auth.currentUser.uid
        });
      }
      resetForm();
    } catch (error) {
      console.error("Erro ao salvar post:", error);
      alert("Erro ao salvar. Verifique suas permissões.");
    }
  };

  const handleEdit = (post: BlogPost) => {
    setNewPost({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      image: post.image,
      status: post.status
    });
    setEditingId(post.id);
    setIsAdding(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este artigo?") || !db) return;
    try {
      await deleteDoc(doc(db, 'posts', id));
    } catch (error) {
      console.error("Erro ao excluir:", error);
    }
  };

  const resetForm = () => {
    setIsAdding(false);
    setEditingId(null);
    setNewPost({ title: '', excerpt: '', content: '', category: 'Tecnologia', image: '', status: 'draft' });
  };

  return (
    <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-surface-container-lowest min-h-screen">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-primary rounded-2xl flex items-center justify-center text-white">
              <LayoutDashboard size={24} />
            </div>
            <h1 className="text-3xl font-headline font-bold text-primary">Painel do Blog</h1>
          </div>
          <button 
            onClick={() => isAdding ? resetForm() : setIsAdding(true)}
            className="bg-tertiary text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-transform"
          >
            {isAdding ? <X size={20} /> : <Plus size={20} />}
            {isAdding ? 'Cancelar' : 'Novo Artigo'}
          </button>
        </div>

        {isAdding && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-8 rounded-3xl mb-12 border border-primary/10"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex items-center justify-between gap-4 p-4 bg-primary/5 rounded-2xl border border-primary/10">
                <div className="flex items-center gap-3">
                  <Brain className="text-tertiary" size={24} />
                  <p className="text-sm font-medium text-primary">Deseja ajuda da IA para escrever?</p>
                </div>
                <button 
                  type="button"
                  onClick={handleGenerateAI}
                  disabled={isGenerating}
                  className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 disabled:opacity-50"
                >
                  {isGenerating ? <RefreshCw size={16} className="animate-spin" /> : <Zap size={16} />}
                  Gerar com IA
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-bold text-primary uppercase tracking-wider">Título / Tema</label>
                  <input 
                    required
                    value={newPost.title}
                    onChange={e => setNewPost({...newPost, title: e.target.value})}
                    className="w-full bg-white border border-outline-variant rounded-xl px-4 py-3 focus:ring-2 focus:ring-tertiary outline-none"
                    placeholder="Ex: O impacto da adubação de precisão..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-primary uppercase tracking-wider">Status</label>
                  <select 
                    value={newPost.status}
                    onChange={e => setNewPost({...newPost, status: e.target.value as 'draft' | 'published'})}
                    className="w-full bg-white border border-outline-variant rounded-xl px-4 py-3 focus:ring-2 focus:ring-tertiary outline-none"
                  >
                    <option value="draft">Rascunho</option>
                    <option value="published">Publicado</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-primary uppercase tracking-wider">Categoria</label>
                  <select 
                    value={newPost.category}
                    onChange={e => setNewPost({...newPost, category: e.target.value})}
                    className="w-full bg-white border border-outline-variant rounded-xl px-4 py-3 focus:ring-2 focus:ring-tertiary outline-none"
                  >
                    <option>Tecnologia</option>
                    <option>Gestão</option>
                    <option>Inovação</option>
                    <option>Mercado</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-primary uppercase tracking-wider">URL da Imagem</label>
                  <input 
                    value={newPost.image}
                    onChange={e => setNewPost({...newPost, image: e.target.value})}
                    className="w-full bg-white border border-outline-variant rounded-xl px-4 py-3 focus:ring-2 focus:ring-tertiary outline-none"
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-primary uppercase tracking-wider">Resumo (Excerpt)</label>
                <textarea 
                  required
                  value={newPost.excerpt}
                  onChange={e => setNewPost({...newPost, excerpt: e.target.value})}
                  className="w-full bg-white border border-outline-variant rounded-xl px-4 py-3 focus:ring-2 focus:ring-tertiary outline-none h-20"
                  placeholder="Uma breve descrição para a vitrine..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-primary uppercase tracking-wider">Conteúdo Completo</label>
                <textarea 
                  required
                  value={newPost.content}
                  onChange={e => setNewPost({...newPost, content: e.target.value})}
                  className="w-full bg-white border border-outline-variant rounded-xl px-4 py-3 focus:ring-2 focus:ring-tertiary outline-none h-64"
                  placeholder="Escreva seu artigo aqui..."
                />
              </div>
              <button type="submit" className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-primary/90 transition-colors">
                {editingId ? 'Salvar Alterações' : 'Publicar Artigo'}
              </button>
            </form>
          </motion.div>
        )}

        <div className="space-y-4">
          <h2 className="text-xl font-bold text-primary mb-6">Artigos</h2>
          {posts.map(post => (
            <div key={post.id} className="bg-white p-6 rounded-2xl border border-outline-variant/50 flex items-center justify-between group hover:border-tertiary/30 transition-colors">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-xl overflow-hidden bg-surface-container relative">
                  <img src={post.image || ''} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover" />
                  {post.status === 'draft' && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="text-[8px] font-bold text-white uppercase tracking-tighter">Rascunho</span>
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-primary flex items-center gap-2">
                    {post.title}
                    {post.status === 'draft' && <span className="text-[10px] bg-surface-container-high px-2 py-0.5 rounded text-on-surface-variant">Rascunho</span>}
                  </h3>
                  <p className="text-xs text-on-surface-variant">{post.date} • {post.category}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleEdit(post)} className="p-2 text-on-surface-variant hover:text-primary"><FileText size={20} /></button>
                <button onClick={() => handleDelete(post.id)} className="p-2 text-on-surface-variant hover:text-error"><Trash2 size={20} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
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
              <a href="https://connectfarm.com.br" target="_blank" rel="noopener noreferrer" className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
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
              <li><a href="#contato" className="hover:text-tertiary-fixed transition-colors">Análise de Solo</a></li>
              <li><a href="#contato" className="hover:text-tertiary-fixed transition-colors">Monitoramento Satelital</a></li>
              <li><a href="#contato" className="hover:text-tertiary-fixed transition-colors">Planejamento de Safra</a></li>
              <li><a href="#contato" className="hover:text-tertiary-fixed transition-colors">Consultoria Agronômica</a></li>
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
          <p>© 2026 ConnectFARM. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

// --- Main App ---

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  const handlePostClick = (post: BlogPost) => {
    setSelectedPost(post);
    setActivePage('post');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
            <BlogPreview 
              onSeeAll={() => setActivePage('blog')} 
              onPostClick={handlePostClick}
            />
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
                    href="mailto:contato@connectfarm.com.br"
                    className="glass-panel text-primary border border-primary/20 px-10 py-5 rounded-2xl font-body font-bold text-xl flex items-center justify-center gap-3 hover:bg-primary/5 transition-colors"
                  >
                    <Mail size={24} />
                    Prefiro por email
                  </a>
                </div>
              </div>
            </section>
          </>
        ) : activePage === 'blog' ? (
          <BlogPage onPostClick={handlePostClick} />
        ) : activePage === 'post' && selectedPost ? (
          <BlogPostPage post={selectedPost} onBack={() => setActivePage('blog')} onPostClick={handlePostClick} />
        ) : activePage === 'admin' ? (
          <AdminPanel />
        ) : activePage === 'integridade' ? (
          <WhistleblowingChannel />
        ) : (
          <section className="py-40 px-4 text-center min-h-[calc(100vh-96px)] flex flex-col items-center justify-center">
            <p className="font-label text-xs uppercase tracking-[0.4em] text-tertiary font-bold mb-6">404</p>
            <h2 className="font-headline text-5xl md:text-7xl font-bold text-primary mb-6 tracking-tight">
              Página não encontrada
            </h2>
            <p className="text-on-surface-variant text-lg max-w-md mb-10">
              O endereço que você procura não existe ou foi movido. Volte pra home e a gente segue de lá.
            </p>
            <button
              onClick={() => setActivePage('home')}
              className="bg-primary text-white px-8 py-4 rounded-2xl font-bold hover:scale-105 transition-transform shadow-xl"
            >
              Voltar para a Home
            </button>
          </section>
        )}
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
