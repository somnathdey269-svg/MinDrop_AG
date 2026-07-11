import { useEffect, useState } from "react";

export interface Greeting {
  id: string;
  word: string;       // native script / spelling shown big
  language: string;   // language name in English
  meaning: string;    // English meaning, usually "Hello"
}

export interface GreetingsConfig {
  intervalHours: number;
  greetings: Greeting[];
}

export const DEFAULT_GREETINGS: Greeting[] = [
  // Indian languages first — home turf
  { id: "hi", word: "Namaste", language: "Hindi", meaning: "Greetings" },
  { id: "bn", word: "Nomoshkar", language: "Bengali", meaning: "Greetings" },
  { id: "ta", word: "Vanakkam", language: "Tamil", meaning: "Greetings" },
  { id: "te", word: "Namaskaram", language: "Telugu", meaning: "Greetings" },
  { id: "mr", word: "Namaskar", language: "Marathi", meaning: "Greetings" },
  { id: "gu", word: "Kem cho", language: "Gujarati", meaning: "How are you" },
  { id: "pa", word: "Sat Sri Akal", language: "Punjabi", meaning: "Greetings" },
  { id: "kn", word: "Namaskara", language: "Kannada", meaning: "Greetings" },
  { id: "ml", word: "Namaskaram", language: "Malayalam", meaning: "Greetings" },
  { id: "ur", word: "Assalamu Alaikum", language: "Urdu", meaning: "Peace be upon you" },
  { id: "or", word: "Namaskar", language: "Odia", meaning: "Greetings" },
  { id: "as", word: "Nomoskar", language: "Assamese", meaning: "Greetings" },
  { id: "sa", word: "Namaste", language: "Sanskrit", meaning: "Greetings" },
  { id: "ks", word: "Aadab", language: "Kashmiri", meaning: "Respectful hello" },
  { id: "kok", word: "Dev Boro Dis Dium", language: "Konkani", meaning: "Good day" },
  // World languages
  { id: "en", word: "Hello", language: "English", meaning: "Hello" },
  { id: "es", word: "Hola", language: "Spanish", meaning: "Hello" },
  { id: "fr", word: "Bonjour", language: "French", meaning: "Good day" },
  { id: "de", word: "Hallo", language: "German", meaning: "Hello" },
  { id: "it", word: "Ciao", language: "Italian", meaning: "Hello" },
  { id: "pt", word: "Olá", language: "Portuguese", meaning: "Hello" },
  { id: "ru", word: "Privet", language: "Russian", meaning: "Hi" },
  { id: "zh", word: "Nǐ hǎo", language: "Mandarin", meaning: "Hello (你好)" },
  { id: "ja", word: "Konnichiwa", language: "Japanese", meaning: "Hello (こんにちは)" },
  { id: "ko", word: "Annyeong", language: "Korean", meaning: "Hi (안녕)" },
  { id: "ar", word: "Marhaba", language: "Arabic", meaning: "Hello (مرحبا)" },
  { id: "tr", word: "Merhaba", language: "Turkish", meaning: "Hello" },
  { id: "nl", word: "Hallo", language: "Dutch", meaning: "Hello" },
  { id: "sv", word: "Hej", language: "Swedish", meaning: "Hi" },
  { id: "el", word: "Yia sou", language: "Greek", meaning: "Hello (Γειά σου)" },
  { id: "he", word: "Shalom", language: "Hebrew", meaning: "Peace / Hello" },
  { id: "sw", word: "Jambo", language: "Swahili", meaning: "Hello" },
  { id: "th", word: "Sawatdee", language: "Thai", meaning: "Hello" },
  { id: "vi", word: "Xin chào", language: "Vietnamese", meaning: "Hello" },
  { id: "id", word: "Halo", language: "Indonesian", meaning: "Hello" },
  { id: "pl", word: "Cześć", language: "Polish", meaning: "Hi" },
];

const KEY = "memoryos.greetings.v2";
const DEFAULT_CONFIG: GreetingsConfig = { intervalHours: 3, greetings: DEFAULT_GREETINGS };

export function useGreetingsConfig() {
  const [config, setConfig] = useState<GreetingsConfig>(DEFAULT_CONFIG);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) setConfig({ ...DEFAULT_CONFIG, ...JSON.parse(raw) });
    } catch {}
    setHydrated(true);
  }, []);
  const save = (next: GreetingsConfig) => {
    setConfig(next);
    try { window.localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
  };
  const reset = () => {
    try { window.localStorage.removeItem(KEY); } catch {}
    setConfig(DEFAULT_CONFIG);
  };
  return { config, save, reset, hydrated };
}

/** Picks a greeting based on the time bucket so all users see the same rotation. */
export function useCurrentGreeting(): Greeting {
  const { config } = useGreetingsConfig();
  const list = config.greetings.length ? config.greetings : DEFAULT_GREETINGS;
  const intervalMs = Math.max(1, config.intervalHours) * 60 * 60 * 1000;
  const compute = () => list[Math.floor(Date.now() / intervalMs) % list.length];
  const [g, setG] = useState<Greeting>(compute);
  useEffect(() => {
    setG(compute());
    const t = setInterval(() => setG(compute()), Math.min(intervalMs, 60_000));
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.intervalHours, config.greetings.length]);
  return g;
}
