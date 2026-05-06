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
  Image as ImageIcon,
  ChevronDown
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
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
import { LangProvider } from './i18n/LangProvider';
import { useT, useDict, useLang } from './i18n/LangProvider';
import { LANG_FLAGS, LANG_SHORT, LANG_LABELS, LANGS, readLocalized, type Lang, type LocalizedString } from './i18n/types';

const WHATSAPP_NUMBER = "555136300682";
const WHATSAPP_DISPLAY = "+55 51 3630-0682";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

interface BlogPost {
  id: string;
  title: LocalizedString | string;
  excerpt: LocalizedString | string;
  content: LocalizedString | string;
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
  const t = useT();
  return (
    <div className={cn("flex items-center", className)}>
      <img
        src="/logo.png"
        alt={t('nav.logoAlt')}
        className={cn(
          "h-10 md:h-12 w-auto object-contain",
          variant === 'negative' && "brightness-0 invert"
        )}
        referrerPolicy="no-referrer"
      />
    </div>
  );
};

// Language selector dropdown (desktop + mobile)
const LangSelector = ({ mobile = false }: { mobile?: boolean }) => {
  const { lang, setLang } = useLang();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center gap-1.5 text-xs font-bold text-[#064A17] hover:text-[#868C14] transition-colors",
          mobile && "py-2"
        )}
        aria-label="Select language"
      >
        <img src={LANG_FLAGS[lang]} alt={LANG_LABELS[lang]} className="w-5 h-auto rounded-sm" />
        <span>{LANG_SHORT[lang]}</span>
        <ChevronDown size={12} className={cn("transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className={cn(
          "absolute z-[80] bg-white border border-gray-100 rounded-xl shadow-lg py-1 min-w-[120px]",
          mobile ? "right-0 top-full mt-1" : "right-0 top-full mt-2"
        )}>
          {LANGS.map((l: Lang) => (
            <button
              key={l}
              onClick={() => { setLang(l); setOpen(false); }}
              className={cn(
                "w-full flex items-center gap-2 px-3 py-2 text-xs font-bold hover:bg-gray-50 transition-colors",
                lang === l ? "text-[#868C14]" : "text-[#064A17]"
              )}
            >
              <img src={LANG_FLAGS[l]} alt={LANG_LABELS[l]} className="w-5 h-auto rounded-sm" />
              {LANG_LABELS[l]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const Navbar = ({ activePage, setActivePage }: { activePage: string, setActivePage: (page: string) => void }) => {
  const t = useT();
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
      case 'auth/invalid-email': return t('auth.errors.invalidEmail');
      case 'auth/user-not-found': return t('auth.errors.userNotFound');
      case 'auth/wrong-password':
      case 'auth/invalid-credential': return t('auth.errors.wrongPassword');
      case 'auth/email-already-in-use': return t('auth.errors.emailInUse');
      case 'auth/weak-password': return t('auth.errors.weakPassword');
      case 'auth/too-many-requests': return t('auth.errors.tooManyRequests');
      case 'auth/network-request-failed': return t('auth.errors.networkFailed');
      default: return t('auth.errors.defaultError');
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
        setAuthInfo(t('auth.resetSuccess'));
      }
    } catch (error: any) {
      console.error("Auth error:", error);
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
    { name: t('nav.home'), id: 'home' },
    { name: t('nav.blog'), id: 'blog' },
    { name: t('nav.contato'), id: 'contato' },
    { name: t('nav.integridade'), id: 'integridade' },
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

            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
              <LangSelector />

              {user ? (
                <div className="flex items-center gap-6">
                  <button
                    onClick={() => setActivePage('admin')}
                    className="bg-tertiary/10 text-tertiary px-4 py-2 rounded-xl font-bold text-xs hover:bg-tertiary hover:text-white transition-all border border-tertiary/20 flex items-center gap-2"
                  >
                    <LayoutDashboard size={16} />
                    {t('nav.adminPanel')}
                  </button>
                  <div className="flex items-center gap-4 pl-4 border-l border-outline-variant/20">
                    <div className="flex flex-col items-end">
                      <span className="text-xs font-bold text-primary">{user.displayName}</span>
                      <button onClick={handleLogout} className="text-[10px] text-tertiary hover:underline">{t('nav.logout')}</button>
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
                  {t('nav.accessAccount')}
                </a>
              )}
            </div>
          </div>

          <div className="lg:hidden flex items-center gap-3">
            <LangSelector mobile />
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
            {t('nav.accessAccount')}
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
              aria-label={t('auth.closeButton')}
            >
              <X size={20} />
            </button>

            <h2 className="font-headline text-3xl font-bold text-primary mb-2">
              {authMode === 'signup' ? t('auth.modalTitleSignup') : authMode === 'reset' ? t('auth.modalTitleReset') : t('auth.modalTitleLogin')}
            </h2>
            <p className="text-on-surface-variant text-sm mb-6">
              {authMode === 'reset' ? t('auth.subtitleReset') : t('auth.subtitleDefault')}
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
                      {t('auth.googleLoading')}
                    </>
                  ) : (
                    <>
                      <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                        <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
                        <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.836.86-3.048.86-2.344 0-4.328-1.583-5.036-3.71H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
                        <path fill="#FBBC05" d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"/>
                        <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z"/>
                      </svg>
                      {t('auth.googleSignIn')}
                    </>
                  )}
                </button>

                <div className="flex items-center gap-3 my-4">
                  <div className="flex-1 h-px bg-outline-variant/30" />
                  <span className="text-xs text-on-surface-variant uppercase tracking-widest">{t('auth.orDivider')}</span>
                  <div className="flex-1 h-px bg-outline-variant/30" />
                </div>
              </>
            )}

            <form onSubmit={handleEmailAuth} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-primary uppercase tracking-wider">{t('auth.emailLabel')}</label>
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="mt-1 w-full bg-white border border-outline-variant rounded-xl px-4 py-3 focus:ring-2 focus:ring-tertiary outline-none"
                  placeholder={t('auth.emailPlaceholder')}
                  autoComplete="email"
                />
              </div>

              {authMode !== 'reset' && (
                <div>
                  <label className="text-xs font-bold text-primary uppercase tracking-wider">{t('auth.passwordLabel')}</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="mt-1 w-full bg-white border border-outline-variant rounded-xl px-4 py-3 focus:ring-2 focus:ring-tertiary outline-none"
                    placeholder={authMode === 'signup' ? t('auth.passwordPlaceholderSignup') : t('auth.passwordPlaceholderLogin')}
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
                {authMode === 'signup' ? t('auth.signupButton') : authMode === 'reset' ? t('auth.resetButton') : t('auth.loginButton')}
              </button>
            </form>

            <div className="mt-6 flex flex-col gap-2 text-sm text-center">
              {authMode === 'login' && (
                <>
                  <button onClick={() => { setAuthMode('signup'); setAuthError(null); setAuthInfo(null); }} className="text-tertiary font-bold hover:underline">
                    {t('auth.createAccount')}
                  </button>
                  <button onClick={() => { setAuthMode('reset'); setAuthError(null); setAuthInfo(null); }} className="text-on-surface-variant hover:underline">
                    {t('auth.forgotPassword')}
                  </button>
                </>
              )}
              {authMode === 'signup' && (
                <button onClick={() => { setAuthMode('login'); setAuthError(null); setAuthInfo(null); }} className="text-tertiary font-bold hover:underline">
                  {t('auth.alreadyHaveAccount')}
                </button>
              )}
              {authMode === 'reset' && (
                <button onClick={() => { setAuthMode('login'); setAuthError(null); setAuthInfo(null); }} className="text-tertiary font-bold hover:underline">
                  {t('auth.backToLogin')}
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
  const t = useT();
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
          name: isAnonymous ? t('whistleblowing.anonymousLabel') : name,
          phone: isAnonymous ? t('whistleblowing.anonymousLabel') : phone,
          message,
          website: honeypot,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error('Failed to submit report');
      }

      setSubmitted(true);
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        setError(t('whistleblowing.errorTimeout'));
      } else {
        setError(t('whistleblowing.errorGeneric'));
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
        <h2 className="text-4xl font-bold text-[#064A17] mb-4">{t('whistleblowing.successTitle')}</h2>
        <p className="text-gray-600 max-w-md mx-auto mb-8">
          {t('whistleblowing.successBody')}
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="text-[#868C14] font-bold hover:underline"
        >
          {t('whistleblowing.sendAnother')}
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
              {t('whistleblowing.headlinePart1')}
            </h1>
            <h2 className="font-headline text-5xl lg:text-6xl font-bold text-[#064A17] leading-tight">
              {t('whistleblowing.headlinePart2')}
            </h2>
          </div>

          <p className="font-body text-[#064A17] text-lg leading-relaxed max-w-xl">
            {t('whistleblowing.body')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-2 space-y-6">
          {/* Honeypot field — hidden from real users, attractive to bots. */}
          <div className="absolute left-[-9999px] top-0" aria-hidden="true">
            <label htmlFor="contact-website">{t('whistleblowing.nameLabel')} (deixe em branco)</label>
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
              <span className="text-sm text-gray-600">{t('whistleblowing.checkAnonymous')}</span>
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
              <span className="text-sm text-gray-600">{t('whistleblowing.checkWantsContact')}</span>
            </label>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="font-label text-sm font-medium text-gray-500">{t('whistleblowing.nameLabel')}</label>
              <input
                type="text"
                placeholder={t('whistleblowing.namePlaceholder')}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="font-body w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#064A17]/20 focus:border-[#064A17] transition-all"
                disabled={isAnonymous}
              />
            </div>

            <div className="space-y-2">
              <label className="font-label text-sm font-medium text-gray-500">{t('whistleblowing.phoneLabel')}</label>
              <input
                type="tel"
                placeholder={t('whistleblowing.phonePlaceholder')}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="font-body w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#064A17]/20 focus:border-[#064A17] transition-all"
                disabled={isAnonymous}
              />
            </div>

            <div className="space-y-2">
              <label className="font-label text-sm font-medium text-gray-500">{t('whistleblowing.messageLabel')}</label>
              <textarea
                placeholder={t('whistleblowing.messagePlaceholder')}
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
                {t('whistleblowing.sending')}
              </>
            ) : t('whistleblowing.submitButton')}
          </button>
        </form>
      </div>
    </section>
  );
};

const Hero = () => {
  const t = useT();
  return (
    <section className="relative h-[calc(100vh-5rem)] flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2000&auto=format&fit=crop"
          alt={t('hero.imageAlt')}
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
                <span className="text-[#F7C424]">{t('hero.headlinePart1')}</span>{t('hero.headlinePart2')} <br />
                {t('hero.headlinePart3')} <br />
                {t('hero.headlinePart4')}<span className="text-[#F7C424]">{t('hero.headlinePart5')}</span>{t('hero.headlinePart6')}
              </h1>
              <h2 className="font-headline text-[1.9rem] sm:text-[2.5rem] md:text-[3.2rem] lg:text-[3.8rem] text-white leading-[1.0] tracking-tighter">
                {t('hero.headlineSuffix')}
              </h2>
            </div>

            <div className="max-w-xl space-y-6">
              <p className="text-white text-[22px] leading-[37px] font-body">
                {t('hero.body')}
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#868C14] text-white px-8 py-4 rounded-xl font-body font-bold text-lg hover:bg-[#6d7210] transition-all shadow-xl flex items-center justify-center gap-3"
                >
                  {t('hero.cta')}
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
                  <p className="font-label text-xs uppercase tracking-[0.2em] text-[#064A17]/60 font-bold">{t('hero.cardLabel')}</p>
                  <p className="font-headline font-bold text-3xl text-[#064A17]">{t('hero.cardFieldName')}</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between text-lg font-bold text-[#064A17]">
                    <span>{t('hero.cardBiomassLabel')}</span>
                    <span>{t('hero.cardBiomassValue')}</span>
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
                    <span>{t('hero.cardVigorLabel')}</span>
                    <span>{t('hero.cardVigorValue')}</span>
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
                {t('hero.cardSync')}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const ForWhomSection = () => {
  const t = useT();
  const dict = useDict();
  const cardIcons = [
    <Settings size={24} />,
    <BarChart3 size={24} />,
    <Users size={24} />,
    <Zap size={24} />,
  ];
  const cardBg = [
    { bg: 'bg-primary/5', border: 'border-primary/10', iconBg: 'bg-primary', mt: '' },
    { bg: 'bg-tertiary/5', border: 'border-tertiary/10', iconBg: 'bg-tertiary', mt: 'mt-8' },
    { bg: 'bg-secondary/5', border: 'border-secondary/10', iconBg: 'bg-secondary', mt: '' },
    { bg: 'bg-primary/5', border: 'border-primary/10', iconBg: 'bg-primary', mt: 'mt-8' },
  ];
  return (
    <section className="py-32 bg-surface-container-low px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <span className="font-label text-xs uppercase tracking-[0.4em] text-secondary font-bold">{t('forWhom.sectionLabel')}</span>
            <h2 className="font-headline text-4xl md:text-6xl text-primary font-bold tracking-tight">
              {t('forWhom.title')}
            </h2>
            <div className="space-y-6 text-on-surface-variant text-lg leading-relaxed">
              <p>{t('forWhom.body1')}</p>
              <p>{t('forWhom.body2')}</p>
              <p className="font-bold text-primary">{t('forWhom.body3')}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {dict.forWhom.cards.map((card, i) => (
              <div key={i} className={cn(`${cardBg[i].bg} p-8 rounded-3xl border ${cardBg[i].border} space-y-4`, cardBg[i].mt)}>
                <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center text-white", cardBg[i].iconBg)}>
                  {cardIcons[i]}
                </div>
                <h4 className="font-headline font-bold text-xl text-primary">{card.title}</h4>
                <p className="text-sm text-on-surface-variant">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const ProblemSection = () => {
  const t = useT();
  return (
    <section className="py-32 bg-surface px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <span className="font-label text-xs uppercase tracking-[0.4em] text-secondary font-bold">{t('problem.sectionLabel')}</span>
            <h2 className="font-headline text-4xl md:text-6xl text-primary font-bold tracking-tight">
              {t('problem.title')}
            </h2>
            <div className="space-y-6 text-on-surface-variant text-lg leading-relaxed">
              <p>{t('problem.body1')}</p>
              <p>{t('problem.body2')}</p>
              <p className="font-bold text-primary">{t('problem.body3')}</p>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl">
              {/* TODO: replace with actual ConnectFARM soil-sampling photo (placeholder Unsplash) */}
              <img
                src="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=800&auto=format&fit=crop"
                alt={t('problem.imageAlt')}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-10 -left-10 bg-tertiary p-8 rounded-2xl shadow-xl text-white max-w-xs hidden md:block">
              <p className="text-xl font-headline font-bold mb-2">{t('problem.calloutTitle')}</p>
              <p className="text-sm font-label uppercase tracking-wider opacity-80">{t('problem.calloutBody')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const WhyItMattersSection = () => {
  const t = useT();
  return (
    <section className="py-32 bg-primary text-white px-4 sm:px-6 lg:px-8 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-white/5 -skew-x-12 translate-x-20" />
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <span className="font-label text-xs uppercase tracking-[0.4em] text-tertiary-fixed font-bold">{t('whyItMatters.sectionLabel')}</span>
            <h2 className="font-headline text-4xl md:text-6xl font-bold tracking-tight leading-tight">
              {t('whyItMatters.title')}
            </h2>
            <p className="text-white/80 text-xl leading-relaxed">
              {t('whyItMatters.body')}
            </p>
            <div className="bg-white/10 p-8 rounded-2xl border border-white/20">
              <p className="text-2xl md:text-3xl font-headline font-bold text-tertiary-fixed italic">
                {t('whyItMatters.quote')}
              </p>
            </div>
          </div>
          <div className="space-y-12">
            <div className="p-10 bg-white/5 rounded-3xl border border-white/10 space-y-6">
              <p className="text-5xl md:text-7xl font-headline font-bold text-tertiary-fixed">{t('whyItMatters.statValue')}</p>
              <p className="text-xl font-label uppercase tracking-widest text-white/60">{t('whyItMatters.statLabel')}</p>
              <div className="pt-6 border-t border-white/10">
                <p className="text-2xl font-headline font-bold">{t('whyItMatters.statDetail')}</p>
              </div>
            </div>
            <div className="flex items-center gap-6 p-6 bg-tertiary/20 rounded-2xl border border-tertiary/30">
              <div className="h-12 w-12 rounded-full bg-tertiary flex items-center justify-center shrink-0">
                <CheckCircle2 size={24} />
              </div>
              <p className="text-lg font-medium">{t('whyItMatters.checkItem')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const DiagnosisIncludesSection = () => {
  const dict = useDict();
  const t = useT();
  const icons = [
    <MapIcon size={24} />,
    <Droplets size={24} />,
    <BarChart3 size={24} />,
    <FileCheck size={24} />,
    <ClipboardList size={24} />,
    <RefreshCw size={24} />,
  ];

  return (
    <section className="py-32 bg-surface-container-low px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20 space-y-6">
          <span className="font-label text-xs uppercase tracking-[0.4em] text-secondary font-bold">{t('diagnosis.sectionLabel')}</span>
          <h2 className="font-headline text-4xl md:text-5xl text-primary font-bold tracking-tight">{t('diagnosis.title')}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {dict.diagnosis.items.map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -8 }}
              className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all border border-outline-variant/10 group flex flex-col"
            >
              <div className="h-12 w-12 bg-surface-container rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors mb-6 shrink-0">
                {icons[index]}
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
  const dict = useDict();
  const t = useT();
  const stepIcons = [
    <MapPin size={32} />,
    <Search size={32} />,
    <FileCheck size={32} />,
    <Headset size={32} />,
  ];
  const stepIds = ['01', '02', '03', '04'];

  return (
    <section className="py-32 bg-surface px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20 space-y-6">
          <span className="font-label text-xs uppercase tracking-[0.4em] text-secondary font-bold">{t('howItWorks.sectionLabel')}</span>
          <h2 className="font-headline text-4xl md:text-5xl text-primary font-bold tracking-tight">{t('howItWorks.title')}</h2>
          <p className="text-on-surface-variant max-w-2xl mx-auto">{t('howItWorks.intro')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative">
          <div className="hidden md:block absolute top-1/4 left-0 w-full h-0.5 bg-outline-variant/20 -z-10" />
          {dict.howItWorks.steps.map((step, i) => (
            <div key={i} className="text-center space-y-6">
              <div className="h-20 w-20 bg-white border-4 border-surface-container-high rounded-full flex items-center justify-center mx-auto text-primary shadow-lg relative">
                {stepIcons[i]}
                <span className="absolute -top-2 -right-2 bg-tertiary text-white h-8 w-8 rounded-full flex items-center justify-center font-headline font-bold text-sm">
                  {stepIds[i]}
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
  const t = useT();
  const dict = useDict();

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
                  <h4 className="font-headline font-bold text-2xl text-primary">{t('platform.cardTitle')}</h4>
                </div>
                <p className="text-sm font-bold text-primary">{t('platform.cardSubtitle')}</p>
                <ul className="space-y-4">
                  {dict.platform.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-on-surface-variant">
                      <CheckCircle2 className="text-tertiary shrink-0 mt-1" size={18} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="pt-6 border-t border-outline-variant/20">
                  <p className="text-sm font-medium text-primary">
                    {t('platform.compatibility')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8 order-1 lg:order-2">
            <span className="font-label text-xs uppercase tracking-[0.4em] text-secondary font-bold">{t('platform.sectionLabel')}</span>
            <h2 className="font-headline text-4xl md:text-6xl text-primary font-bold tracking-tight">
              {t('platform.title')}
            </h2>
            <p className="text-on-surface-variant text-xl leading-relaxed">
              {t('platform.body')}
            </p>
            <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-outline-variant/10 shadow-sm">
              <Brain className="text-tertiary" size={32} />
              <p className="text-sm font-medium text-on-surface-variant">{t('platform.aiNote')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const OtherServicesSection = () => {
  const t = useT();
  const dict = useDict();
  const serviceIcons = [
    <Dna size={24} />,
    <ShieldCheck size={24} />,
    <DollarSign size={24} />,
    <Eye size={24} />,
    <RefreshCw size={24} />,
  ];

  return (
    <section className="py-32 bg-surface px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20 space-y-6">
          <span className="font-label text-xs uppercase tracking-[0.4em] text-secondary font-bold">{t('otherServices.sectionLabel')}</span>
          <h2 className="font-headline text-4xl md:text-5xl text-primary font-bold tracking-tight">{t('otherServices.title')}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {dict.otherServices.items.map((service, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -8 }}
              className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all border border-outline-variant/10 group flex flex-col"
            >
              <div className="h-12 w-12 bg-surface-container rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors mb-6 shrink-0">
                {serviceIcons[index]}
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
  const t = useT();
  const dict = useDict();

  return (
    <section id="cases" className="py-32 bg-surface-container-low px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20 space-y-6">
          <span className="font-label text-xs uppercase tracking-[0.4em] text-secondary font-bold">{t('results.sectionLabel')}</span>
          <h2 className="font-headline text-4xl md:text-5xl text-primary font-bold tracking-tight">{t('results.title')}</h2>
          <p className="text-on-surface-variant max-w-2xl mx-auto">{t('results.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {dict.results.stats.map((stat, i) => (
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
  const t = useT();
  return (
    <section className="py-32 bg-surface px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <span className="font-label text-xs uppercase tracking-[0.4em] text-secondary font-bold">{t('about.sectionLabel')}</span>
            <h2 className="font-headline text-4xl md:text-6xl text-primary font-bold tracking-tight">
              {t('about.title')}
            </h2>
            <p className="text-on-surface-variant text-xl leading-relaxed">
              {t('about.body1')}
            </p>
            <p className="text-on-surface-variant text-lg">
              {t('about.body2')}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img src="/10.04.2026_17.29.26_REC.png" alt={t('about.imageAlt1')} loading="lazy" decoding="async" className="rounded-2xl h-64 w-full object-cover mt-12" referrerPolicy="no-referrer" />
            <img src="https://images.unsplash.com/photo-1586771107445-d3ca888129ff?q=80&w=600&auto=format&fit=crop" alt={t('about.imageAlt2')} loading="lazy" decoding="async" className="rounded-2xl h-64 w-full object-cover" referrerPolicy="no-referrer" />
          </div>
        </div>
      </div>
    </section>
  );
};

const BlogPage = ({ onPostClick }: { onPostClick: (post: BlogPost) => void }) => {
  const { t, lang } = useLang();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(t('blogPage.allCategory'));

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

  const allLabel = t('blogPage.allCategory');
  const categories = [allLabel, ...new Set(posts.map(p => p.category))];
  const filteredPosts = activeCategory === allLabel
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
        <p className="mt-4 text-on-surface-variant font-sans">{t('blogPage.loading')}</p>
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
                {t('blogPage.editorialLabel')}
              </div>
              <h1 className="text-6xl md:text-9xl font-headline font-bold text-primary leading-[0.85] tracking-tighter">
                {t('blogPage.blogTitle')} <br /> <span className="text-tertiary italic font-serif font-medium">{t('blogPage.blogTitleAccent')}</span> {t('blogPage.blogTitleSuffix')}
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
            <p className="text-on-surface-variant text-xl font-serif italic">{t('blogPage.noPosts')}</p>
          </div>
        ) : (
          <div className="space-y-32">
            {/* Featured Post - Recipe 2 Style */}
            {activeCategory === allLabel && featuredPost && (
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
                      alt={readLocalized(featuredPost.title, lang)}
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
                        {readLocalized(featuredPost.title, lang)}
                      </h2>
                      <p className="text-xl text-on-surface-variant leading-relaxed font-serif italic">
                        {readLocalized(featuredPost.excerpt, lang)}
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
                      alt={readLocalized(post.title, lang)}
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
                      <span>{calculateReadingTime(readLocalized(post.content, lang))} {t('blogPage.readingMin')}</span>
                    </div>
                    <h3 className="text-3xl font-headline font-bold text-primary leading-tight group-hover:text-tertiary transition-colors">
                      {readLocalized(post.title, lang)}
                    </h3>
                    <p className="text-on-surface-variant line-clamp-2 font-serif text-lg italic opacity-80">
                      {readLocalized(post.excerpt, lang)}
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
  const { t, lang } = useLang();
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
            {t('blogPreview.sectionLabel')}
            <span className="w-6 h-[1px] bg-tertiary" />
          </div>
          <h2 className="text-3xl md:text-5xl font-headline font-bold text-primary tracking-tighter leading-tight">
            {t('blogPreview.editorialLabel')} <span className="italic font-serif font-light text-tertiary">ConnectFARM</span>
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
                  alt={readLocalized(post.title, lang)}
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
                  <span>{calculateReadingTime(readLocalized(post.content, lang))} {t('blogPreview.readingMin')}</span>
                </div>
                <h3 className="text-lg font-headline font-semibold text-primary leading-tight group-hover:text-tertiary transition-colors line-clamp-1">
                  {readLocalized(post.title, lang)}
                </h3>
                <p className="text-on-surface-variant line-clamp-2 font-serif text-sm italic opacity-70 leading-relaxed">
                  {readLocalized(post.excerpt, lang)}
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
            <span className="border-b border-primary/20 group-hover:border-tertiary transition-colors pb-0.5">{t('blogPreview.seeAll')}</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};

const BlogPostPage = ({ post, onBack, onPostClick }: { post: BlogPost, onBack: () => void, onPostClick: (post: BlogPost) => void }) => {
  const { t, lang } = useLang();
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
    const text = `${t('blogPost.share')}: ${readLocalized(post.title, lang)} - ${url}`;
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
          alt={readLocalized(post.title, lang)}
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
              <span>{calculateReadingTime(readLocalized(post.content, lang))} {t('blogPost.readingMin')}</span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="text-5xl md:text-8xl font-headline font-bold text-white leading-[0.85] tracking-tighter"
            >
              {readLocalized(post.title, lang)}
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
                <p className="text-sm opacity-70 uppercase tracking-widest">{t('blogPost.expertLabel')}</p>
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
            <span className="text-[10px] font-bold tracking-widest uppercase vertical-text rotate-180">{t('blogPost.back')}</span>
          </button>

          <div className="flex flex-col items-center gap-4 text-primary/20">
            <span className="text-[10px] font-bold tracking-widest uppercase vertical-text rotate-180 mb-2">{t('blogPost.share')}</span>
            <button onClick={shareOnWhatsApp} className="hover:text-[#25D366] transition-colors"><WhatsAppIcon size={20} /></button>
            <button onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              alert(t('blogPost.copyLink'));
            }} className="hover:text-primary transition-colors"><Globe size={20} /></button>
          </div>
        </div>

        <div className="prose prose-2xl max-w-none text-primary/90 leading-[1.7] font-serif selection:bg-tertiary/20">
          <div className="mb-16 [&>p:first-of-type]:first-letter:text-8xl [&>p:first-of-type]:first-letter:font-light [&>p:first-of-type]:first-letter:text-tertiary [&>p:first-of-type]:first-letter:mr-3 [&>p:first-of-type]:first-letter:float-left [&>p:first-of-type]:first-letter:leading-[0.8]">
            <Markdown>{readLocalized(post.content, lang)}</Markdown>
          </div>
        </div>

        {/* Related Articles Section */}
        {relatedPosts.length > 0 && (
          <section className="mt-40 pt-20 border-t border-primary/5">
            <div className="flex items-center justify-between mb-16">
              <h3 className="text-4xl font-headline font-bold text-primary tracking-tight">{t('blogPost.continueReading')}</h3>
              <button
                onClick={onBack}
                className="text-tertiary font-bold flex items-center gap-2 hover:gap-4 transition-all"
              >
                {t('blogPost.seeAll')} <ArrowRight size={20} />
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
                    <img src={rPost.image || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=800&auto=format&fit=crop'} alt={readLocalized(rPost.title, lang)} loading="lazy" decoding="async" style={{ imageOrientation: 'from-image' }} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <h4 className="text-2xl font-headline font-bold text-primary group-hover:text-tertiary transition-colors leading-tight">
                    {readLocalized(rPost.title, lang)}
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
                <p className="text-on-surface-variant font-serif italic">{t('blogPost.authorRole')}</p>
              </div>
            </div>
            <button
              onClick={onBack}
              className="bg-primary text-white px-8 py-4 rounded-2xl font-bold hover:scale-105 transition-transform shadow-xl"
            >
              {t('blogPost.exploreMore')}
            </button>
          </div>
        </footer>
      </main>
    </div>
  );
};

const AdminPanel = () => {
  const t = useT();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: t('admin.categoryTechnology'),
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
      alert(t('admin.alertAITitle'));
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
        throw new Error(payload?.error || 'Invalid server response');
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
      console.error("AI generation error:", error);
      alert(t('admin.alertAIError'));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser || !db) {
      if (!db) alert(t('admin.alertDbError'));
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
      alert(t('admin.alertSaveError'));
    }
  };

  const handleEdit = (post: BlogPost) => {
    setNewPost({
      title: readLocalized(post.title, 'pt'),
      excerpt: readLocalized(post.excerpt, 'pt'),
      content: readLocalized(post.content, 'pt'),
      category: post.category,
      image: post.image,
      status: post.status
    });
    setEditingId(post.id);
    setIsAdding(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('admin.alertDeleteConfirm')) || !db) return;
    try {
      await deleteDoc(doc(db, 'posts', id));
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const resetForm = () => {
    setIsAdding(false);
    setEditingId(null);
    setNewPost({ title: '', excerpt: '', content: '', category: t('admin.categoryTechnology'), image: '', status: 'draft' });
  };

  return (
    <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-surface-container-lowest min-h-screen">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-primary rounded-2xl flex items-center justify-center text-white">
              <LayoutDashboard size={24} />
            </div>
            <h1 className="text-3xl font-headline font-bold text-primary">{t('admin.panelTitle')}</h1>
          </div>
          <button
            onClick={() => isAdding ? resetForm() : setIsAdding(true)}
            className="bg-tertiary text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-transform"
          >
            {isAdding ? <X size={20} /> : <Plus size={20} />}
            {isAdding ? t('admin.cancel') : t('admin.newArticle')}
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
                  <p className="text-sm font-medium text-primary">{t('admin.aiHelp')}</p>
                </div>
                <button
                  type="button"
                  onClick={handleGenerateAI}
                  disabled={isGenerating}
                  className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 disabled:opacity-50"
                >
                  {isGenerating ? <RefreshCw size={16} className="animate-spin" /> : <Zap size={16} />}
                  {isGenerating ? t('admin.generating') : t('admin.generateAI')}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-bold text-primary uppercase tracking-wider">{t('admin.titleLabel')}</label>
                  <input
                    required
                    value={newPost.title}
                    onChange={e => setNewPost({...newPost, title: e.target.value})}
                    className="w-full bg-white border border-outline-variant rounded-xl px-4 py-3 focus:ring-2 focus:ring-tertiary outline-none"
                    placeholder={t('admin.titlePlaceholder')}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-primary uppercase tracking-wider">{t('admin.statusLabel')}</label>
                  <select
                    value={newPost.status}
                    onChange={e => setNewPost({...newPost, status: e.target.value as 'draft' | 'published'})}
                    className="w-full bg-white border border-outline-variant rounded-xl px-4 py-3 focus:ring-2 focus:ring-tertiary outline-none"
                  >
                    <option value="draft">{t('admin.statusDraft')}</option>
                    <option value="published">{t('admin.statusPublished')}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-primary uppercase tracking-wider">{t('admin.categoryLabel')}</label>
                  <select
                    value={newPost.category}
                    onChange={e => setNewPost({...newPost, category: e.target.value})}
                    className="w-full bg-white border border-outline-variant rounded-xl px-4 py-3 focus:ring-2 focus:ring-tertiary outline-none"
                  >
                    <option>{t('admin.categoryTechnology')}</option>
                    <option>{t('admin.categoryManagement')}</option>
                    <option>{t('admin.categoryInnovation')}</option>
                    <option>{t('admin.categoryMarket')}</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-primary uppercase tracking-wider">{t('admin.imageUrlLabel')}</label>
                  <input
                    value={newPost.image}
                    onChange={e => setNewPost({...newPost, image: e.target.value})}
                    className="w-full bg-white border border-outline-variant rounded-xl px-4 py-3 focus:ring-2 focus:ring-tertiary outline-none"
                    placeholder={t('admin.imageUrlPlaceholder')}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-primary uppercase tracking-wider">{t('admin.excerptLabel')}</label>
                <textarea
                  required
                  value={newPost.excerpt}
                  onChange={e => setNewPost({...newPost, excerpt: e.target.value})}
                  className="w-full bg-white border border-outline-variant rounded-xl px-4 py-3 focus:ring-2 focus:ring-tertiary outline-none h-20"
                  placeholder={t('admin.excerptPlaceholder')}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-primary uppercase tracking-wider">{t('admin.contentLabel')}</label>
                <textarea
                  required
                  value={newPost.content}
                  onChange={e => setNewPost({...newPost, content: e.target.value})}
                  className="w-full bg-white border border-outline-variant rounded-xl px-4 py-3 focus:ring-2 focus:ring-tertiary outline-none h-64"
                  placeholder={t('admin.contentPlaceholder')}
                />
              </div>
              <button type="submit" className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-primary/90 transition-colors">
                {editingId ? t('admin.saveChanges') : t('admin.publishArticle')}
              </button>
            </form>
          </motion.div>
        )}

        <div className="space-y-4">
          <h2 className="text-xl font-bold text-primary mb-6">{t('admin.articlesHeading')}</h2>
          {posts.map(post => (
            <div key={post.id} className="bg-white p-6 rounded-2xl border border-outline-variant/50 flex items-center justify-between group hover:border-tertiary/30 transition-colors">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-xl overflow-hidden bg-surface-container relative">
                  <img src={post.image || ''} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover" />
                  {post.status === 'draft' && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="text-[8px] font-bold text-white uppercase tracking-tighter">{t('admin.draftBadge')}</span>
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-primary flex items-center gap-2">
                    {readLocalized(post.title, 'pt')}
                    {post.status === 'draft' && <span className="text-[10px] bg-surface-container-high px-2 py-0.5 rounded text-on-surface-variant">{t('admin.draftBadge')}</span>}
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
  const t = useT();
  const dict = useDict();
  return (
    <footer className="bg-primary text-surface py-20 px-4 sm:px-6 lg:px-8 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2 space-y-6">
            <Logo variant="negative" />
            <p className="text-surface/70 max-w-md text-lg leading-relaxed">
              {t('footer.tagline')}
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
            <h4 className="font-label text-xs uppercase tracking-widest font-bold text-tertiary-fixed">{t('footer.servicesHeading')}</h4>
            <ul className="space-y-4 text-surface/80">
              {dict.footer.services.map((svc, i) => (
                <li key={i}><a href="#contato" className="hover:text-tertiary-fixed transition-colors">{svc}</a></li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="font-label text-xs uppercase tracking-widest font-bold text-tertiary-fixed">{t('footer.contactHeading')}</h4>
            <ul className="space-y-4 text-surface/80">
              <li className="flex items-center gap-2"><Phone size={16} className="text-tertiary-fixed" /> {WHATSAPP_DISPLAY}</li>
              <li className="flex items-center gap-2"><Globe size={16} className="text-tertiary-fixed" /> {t('footer.websiteLabel')}</li>
              <li><a href="https://instagram.com/Connectfarm_" target="_blank" rel="noopener noreferrer" className="hover:text-tertiary-fixed transition-colors">{t('footer.instagramHandle')}</a></li>
              <li><a href="https://facebook.com/Connectfarmagr" target="_blank" rel="noopener noreferrer" className="hover:text-tertiary-fixed transition-colors">{t('footer.facebookHandle')}</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-surface/50 font-label">
          <p>{t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  );
};

// --- Main App (inner content, uses hooks) ---

function AppContent() {
  const [activePage, setActivePage] = useState('home');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const t = useT();

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
                  {t('contact.title')}
                </h2>
                <p className="text-on-surface-variant text-xl md:text-2xl leading-relaxed">
                  {t('contact.body')}
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center pt-6">
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-tertiary text-white px-10 py-5 rounded-2xl font-body font-bold text-xl hover:scale-105 transition-transform shadow-xl flex items-center justify-center gap-3"
                  >
                    {t('contact.ctaPrimary')}
                    <ArrowRight size={24} />
                  </a>
                  <a
                    href="mailto:contato@connectfarm.com.br"
                    className="glass-panel text-primary border border-primary/20 px-10 py-5 rounded-2xl font-body font-bold text-xl flex items-center justify-center gap-3 hover:bg-primary/5 transition-colors"
                  >
                    <Mail size={24} />
                    {t('contact.ctaEmail')}
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
            <p className="font-label text-xs uppercase tracking-[0.4em] text-tertiary font-bold mb-6">{t('notFound.label')}</p>
            <h2 className="font-headline text-5xl md:text-7xl font-bold text-primary mb-6 tracking-tight">
              {t('notFound.title')}
            </h2>
            <p className="text-on-surface-variant text-lg max-w-md mb-10">
              {t('notFound.body')}
            </p>
            <button
              onClick={() => setActivePage('home')}
              className="bg-primary text-white px-8 py-4 rounded-2xl font-bold hover:scale-105 transition-transform shadow-xl"
            >
              {t('notFound.backHome')}
            </button>
          </section>
        )}
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}

// --- Default export wraps everything in LangProvider ---

export default function App() {
  return (
    <LangProvider>
      <AppContent />
    </LangProvider>
  );
}
