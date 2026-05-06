export type Lang = 'pt' | 'en' | 'es';

export const LANGS: Lang[] = ['pt', 'en', 'es'];

export const LANG_LABELS: Record<Lang, string> = {
  pt: 'Português',
  en: 'English',
  es: 'Español',
};

export const LANG_FLAGS: Record<Lang, string> = {
  pt: 'https://flagcdn.com/w20/br.png',
  en: 'https://flagcdn.com/w20/us.png',
  es: 'https://flagcdn.com/w20/es.png',
};

export const LANG_SHORT: Record<Lang, string> = {
  pt: 'PT',
  en: 'EN',
  es: 'ES',
};

// Strings localizadas usadas em conteúdo dinâmico (Firestore — blog posts).
// Para a INTERFACE estática, usamos o dicionário em pt.ts/en.ts/es.ts.
export type LocalizedString = {
  pt: string;
  en: string;
  es: string;
};

// Lê o valor de um campo LocalizedString respeitando o idioma ativo,
// caindo pra PT se a versão pedida estiver vazia (post legado ou tradução incompleta).
export function readLocalized(
  field: LocalizedString | string | undefined,
  lang: Lang
): string {
  if (!field) return '';
  if (typeof field === 'string') return field; // post legado
  return field[lang]?.trim() || field.pt || '';
}
