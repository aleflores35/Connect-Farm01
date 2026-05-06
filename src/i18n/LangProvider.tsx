import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Lang, LANGS } from './types';
import { pt } from './pt';
import { en } from './en';
import { es } from './es';

export const dictionaries: Record<Lang, typeof pt> = { pt, en, es };

type LangContextValue = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (path: string) => string;
};

const LangContext = createContext<LangContextValue | null>(null);

const STORAGE_KEY = 'cf-lang';

function detectInitialLang(): Lang {
  // 1) Query param (?lang=en)
  const params = new URLSearchParams(window.location.search);
  const fromQuery = params.get('lang');
  if (fromQuery && LANGS.includes(fromQuery as Lang)) return fromQuery as Lang;

  // 2) localStorage
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && LANGS.includes(stored as Lang)) return stored as Lang;

  // 3) Browser language
  const browser = navigator.language.toLowerCase().slice(0, 2);
  if (browser === 'en') return 'en';
  if (browser === 'es') return 'es';
  return 'pt';
}

// Resolve "hero.headline" em obj["hero"]["headline"]
function resolvePath(obj: any, path: string): string {
  const parts = path.split('.');
  let cur = obj;
  for (const p of parts) {
    if (cur == null) return path;
    cur = cur[p];
  }
  return typeof cur === 'string' ? cur : path;
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('pt');

  useEffect(() => {
    setLangState(detectInitialLang());
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem(STORAGE_KEY, l);
    const url = new URL(window.location.href);
    url.searchParams.set('lang', l);
    window.history.replaceState({}, '', url.toString());
  };

  const t = (path: string) => resolvePath(dictionaries[lang], path);

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be used within LangProvider');
  return ctx;
}

export function useT() {
  return useLang().t;
}

export function useDict() {
  return dictionaries[useLang().lang];
}
